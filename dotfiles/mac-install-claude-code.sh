#!/bin/bash

set -e

# Parse command line arguments
TARGET="$1"  # Optional target parameter

# Validate target if provided
if [[ -n "$TARGET" ]] && [[ ! "$TARGET" =~ ^(stable|latest|[0-9]+\.[0-9]+\.[0-9]+(-[^[:space:]]+)?)$ ]]; then
    echo "Usage: $0 [stable|latest|VERSION]" >&2
    exit 1
fi

# Refuse to run under sudo from a regular user's shell. This installer puts
# everything under $HOME, which under sudo typically resolves to root's home:
# the binary lands in /root/.local/bin (or is left root-owned in the user's
# home, depending on the distro's sudo configuration), and the 'claude'
# command is then not found in the user's own shell. Plain root with no sudo
# (containers, CI, root-only systems) is unaffected by this check.
if [ "$(id -u)" -eq 0 ] && [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ] && [ -z "${CLAUDE_INSTALL_ALLOW_SUDO:-}" ]; then
    echo "Error: do not run this installer with sudo." >&2
    echo "" >&2
    echo "Claude Code installs into your home directory and does not need root access." >&2
    echo "With sudo, the installation would go into root's home directory instead of" >&2
    echo "yours, and the 'claude' command would not work from your own shell." >&2
    echo "" >&2
    echo "Please re-run the same command without sudo, e.g.:" >&2
    # pinned-dep-allow: display-only guidance text in an error message, not an executed install; install.sh is Anthropic's own installer
    echo "    curl -fsSL https://claude.ai/install.sh | bash" >&2
    echo "" >&2
    echo "To intentionally install Claude Code for the root user, re-run with" >&2
    echo "CLAUDE_INSTALL_ALLOW_SUDO=1 set in the installer's environment, e.g.:" >&2
    # pinned-dep-allow: display-only guidance text in an error message, not an executed install; install.sh is Anthropic's own installer
    echo "    curl -fsSL https://claude.ai/install.sh | sudo CLAUDE_INSTALL_ALLOW_SUDO=1 bash" >&2
    exit 1
fi

DOWNLOAD_BASE_URL="https://downloads.claude.ai/claude-code-releases"
DOWNLOAD_DIR="$HOME/.claude/downloads"

# --- Proxy diagnostics --------------------------------------------------
# Surface whatever proxy env vars are set, so it's obvious (in logs) that
# the network is going through a proxy. curl/wget read both upper- and
# lower-case names; we normalize and print a single line per variable.
log_info()  { printf '\033[36m[INFO]\033[0m  %s\n' "$*"; }
log_ok()    { printf '\033[32m[OK  ]\033[0m  %s\n' "$*"; }
log_warn()  { printf '\033[33m[WARN]\033[0m  %s\n' "$*"; }

print_proxy_summary() {
    # Read variables from the calling environment directly (no `local`
    # masking) so the values the *child* curl/wget will see are what we
    # report. Use a temp heredoc to keep the lookup shell-portable.
    proxy_summary=$(env | grep -Ei '^(https?_proxy|all_proxy|no_proxy)=' || true)
    if [ -n "$proxy_summary" ]; then
        log_info "Proxy detected — outgoing requests will go through:"
        while IFS= read -r line; do
            # Mask user:password in URLs so they don't leak into logs.
            sanitized=$(printf '%s' "$line" | sed -E 's#(://[^:@]+:)[^:@]+(@)#\1***\2#')
            printf '\033[36m[INFO]\033[0m         %s\n' "$sanitized"
        done <<< "$proxy_summary"
    else
        log_warn "No proxy env vars set (HTTP_PROXY / HTTPS_PROXY / ALL_PROXY / NO_PROXY). Direct connection."
    fi
}

# Check for required dependencies
DOWNLOADER=""
if command -v curl >/dev/null 2>&1; then
    DOWNLOADER="curl"
elif command -v wget >/dev/null 2>&1; then
    DOWNLOADER="wget"
else
    echo "Either curl or wget is required but neither is installed" >&2
    exit 1
fi

# Check if jq is available (optional)
HAS_JQ=false
if command -v jq >/dev/null 2>&1; then
    HAS_JQ=true
fi

HAS_ZSTD=false
if command -v zstd >/dev/null 2>&1; then
    HAS_ZSTD=true
fi

print_proxy_summary
log_info "Downloader: $DOWNLOADER | jq: $HAS_JQ | zstd: $HAS_ZSTD"

# When stdout is a TTY we want a progress bar; when it's piped/redirected
# (CI logs, `| tee`, etc.) we keep things quiet so logs stay grep-friendly.
INTERACTIVE=false
if [ -t 1 ]; then INTERACTIVE=true; fi
export INTERACTIVE

# Download function that works with both curl and wget
download_file() {
    local url="$1"
    local output="$2"

    log_info "GET $url"
    if [ -n "$output" ]; then
        log_info "        -> $output"
    fi

    if [ "$DOWNLOADER" = "curl" ]; then
        if [ -n "$output" ]; then
            if [ "$INTERACTIVE" = true ]; then
                # -# shows curl's classic progress bar; -s would silence it.
                curl -fSL --connect-timeout 15 --max-time 0 -# -o "$output" "$url"
            else
                curl -fsSL --connect-timeout 15 --max-time 0 -o "$output" "$url"
            fi
        else
            if [ "$INTERACTIVE" = true ]; then
                curl -fSL --connect-timeout 15 --max-time 0 -# "$url"
            else
                curl -fsSL --connect-timeout 15 --max-time 0 "$url"
            fi
        fi
    elif [ "$DOWNLOADER" = "wget" ]; then
        if [ "$INTERACTIVE" = true ]; then
            # --progress=bar:force forces the bar even when stderr isn't a TTY;
            # combined with `-nv` it stays a single clean progress line per URL.
            if [ -n "$output" ]; then
                wget --connect-timeout=15 --progress=bar:force:noscroll -nv -O "$output" "$url"
            else
                wget --connect-timeout=15 --progress=bar:force:noscroll -nv -O - "$url"
            fi
        else
            if [ -n "$output" ]; then
                wget --connect-timeout=15 -q -O "$output" "$url"
            else
                wget --connect-timeout=15 -q -O - "$url"
            fi
        fi
    else
        return 1
    fi

    log_ok "DONE $url"
}

# Simple JSON parser for extracting checksum when jq is not available
get_checksum_from_manifest() {
    local json="$1"
    local platform="$2"
    
    # Normalize JSON to single line and extract checksum
    json=$(echo "$json" | tr -d '\n\r\t' | sed 's/ \+/ /g')
    
    # Extract checksum for platform using bash regex. [^{}] keeps the match
    # inside the platform's own object (manifest.zst.json nests a darwin bundle).
    if [[ $json =~ \"$platform\"[[:space:]]*:[[:space:]]*[{][^{}]*\"checksum\"[[:space:]]*:[[:space:]]*\"([a-f0-9]{64})\" ]]; then
        echo "${BASH_REMATCH[1]}"
        return 0
    fi
    
    return 1
}

get_size_from_manifest() {
    local json="$1"
    local platform="$2"
    json=$(echo "$json" | tr -d '\n\r\t' | sed 's/ \+/ /g')
    if [[ $json =~ \"$platform\"[[:space:]]*:[[:space:]]*[{][^{}]*\"size\"[[:space:]]*:[[:space:]]*([0-9]+) ]]; then
        echo "${BASH_REMATCH[1]}"
        return 0
    fi
    return 1
}

# Detect platform
case "$(uname -s)" in
    Darwin) os="darwin" ;;
    Linux) os="linux" ;;
    MINGW*|MSYS*|CYGWIN*) echo "Windows is not supported by this script. See https://code.claude.com/docs for installation options." >&2; exit 1 ;;
    *) echo "Unsupported operating system: $(uname -s). See https://code.claude.com/docs for supported platforms." >&2; exit 1 ;;
esac

case "$(uname -m)" in
    x86_64|amd64) arch="x64" ;;
    arm64|aarch64) arch="arm64" ;;
    *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

# Detect Rosetta 2 on macOS: if the shell is running as x64 under Rosetta on an ARM Mac,
# download the native arm64 binary instead of the x64 one
if [ "$os" = "darwin" ] && [ "$arch" = "x64" ]; then
    if [ "$(sysctl -n sysctl.proc_translated 2>/dev/null)" = "1" ]; then
        arch="arm64"
    fi
fi

# Check for musl on Linux and adjust platform accordingly
if [ "$os" = "linux" ]; then
    if [ -f /lib/libc.musl-x86_64.so.1 ] || [ -f /lib/libc.musl-aarch64.so.1 ] || ldd /bin/ls 2>&1 | grep -q musl; then
        platform="linux-${arch}-musl"
    else
        platform="linux-${arch}"
    fi
else
    platform="${os}-${arch}"
fi
mkdir -p "$DOWNLOAD_DIR"

# Pinned version, manually retrieved from https://downloads.claude.ai/claude-code-releases/latest on 2026-09-23.
# This script is hard-wired to that exact release; updates require editing this line.
version="2.1.280"
log_info "Pinned version:     $version"

# Target platform: derived from `uname -s` / `uname -m` (see top of script).
# The expected `platform` value (e.g. darwin-arm64) is built by the platform
# detection block above.

# Hard-coded manifest values for version 2.1.280, taken from
#   GET https://downloads.claude.ai/claude-code-releases/2.1.280/manifest.json
# on 2026-09-23. Each entry maps a platform key to its SHA256 checksum and
# the binary size in bytes. Update `version` above *and* this block when
# bumping releases.
#
# Format: PLATFORM_KEY|SHA256_HEX|BYTES
CLAUDE_MANIFEST_ENTRIES="
darwin-arm64|387a5c5dcdbb815085edf0baf79591f9d8894efe922bceaf3d75b1b08055229d|217254576
darwin-x64|c1d32d87630482250633208ab77855429b24010ae3086a7ff7539b57b93168d4|225565024
linux-x64|1e08503dbdf3c2cb0d706d32f3408277388d1c76ef108673e8fe42c1b322925b|233709640
linux-arm64|92f2b4fd05d0bdcf7b9a0d4e0ecef4a1e4b368b290cd8fd07cff9a50013f45a2|233103352
"

# Look up the active platform's checksum and size in the hard-coded table.
checksum=""
size=""
while IFS='|' read -r m_platform m_checksum m_size; do
    # Skip blanks/comments.
    [ -z "$m_platform" ] && continue
    [[ "$m_platform" == \#* ]] && continue
    if [ "$m_platform" = "$platform" ]; then
        checksum="$m_checksum"
        size="$m_size"
        break
    fi
done <<< "$CLAUDE_MANIFEST_ENTRIES"

if [ -z "$checksum" ] || [[ ! "$checksum" =~ ^[a-f0-9]{64}$ ]]; then
    log_warn "No hard-coded manifest entry for platform '$platform' (version $version)."
    log_warn "Edit this script's CLAUDE_MANIFEST_ENTRIES block to add an entry, then re-run."
    exit 1
fi
log_info "Pinned checksum:    $checksum"
log_info "Pinned size:        $size"
log_info "Pinned binary URL:  $DOWNLOAD_BASE_URL/$version/$platform/claude"

checksum_matches() {
    local actual
    if [ "$os" = "darwin" ]; then
        actual=$(shasum -a 256 "$1" | cut -d' ' -f1)
    else
        actual=$(sha256sum "$1" | cut -d' ' -f1)
    fi
    [ "$actual" = "$2" ]
}

# Download the binary directly from the URL recorded in the manifest. No
# zstd path: that's an optional optimization we deliberately skip because
# the upstream .zst manifest endpoint is not guaranteed to be reachable.
binary_path="$DOWNLOAD_DIR/claude-$version-$platform"
# Filename-based short-circuit: if a file with the expected name is already
# on disk, skip the download entirely (no size/SHA256 check, no resume).
# Verification of an existing-but-unexpected file is the operator's job;
# this script does not delete and re-download on mismatch.
if [ -f "$binary_path" ]; then
    log_info "Found existing binary at $binary_path — skipping download."
else
    if ! download_file "$DOWNLOAD_BASE_URL/$version/$platform/claude" "$binary_path"; then
        echo "Download failed" >&2
        rm -f "$binary_path"
        exit 1
    fi

    # Confirm the on-disk size matches what the manifest says, then verify SHA256.
    actual_size=$(wc -c < "$binary_path" | tr -d ' ')
    if [ "$actual_size" != "$size" ]; then
        log_warn "Binary size mismatch: downloaded $actual_size bytes, manifest says $size"
        rm -f "$binary_path"
        exit 1
    fi

    if ! checksum_matches "$binary_path" "$checksum"; then
        echo "Checksum verification failed" >&2
        rm -f "$binary_path"
        exit 1
    fi

    chmod +x "$binary_path"
fi

# Run claude install to set up launcher and shell integration
echo "Setting up Claude Code..."
install_code=0
"$binary_path" install ${TARGET:+"$TARGET"} || install_code=$?

# Clean up downloaded file
rm -f "$binary_path"

if [ "$install_code" -ne 0 ]; then
    # A signal death mid-install kills the binary's TUI with no chance to
    # restore the terminal, leaving the user's shell in raw mode (typed
    # characters stop echoing). Restore it before printing anything.
    if [ "$install_code" -ge 128 ] && [ -t 0 ]; then
        stty sane 2>/dev/null || true
    fi
    # Red when stderr is a terminal, so the explanation stands out from the
    # surrounding install output; plain when piped or captured
    red="" reset=""
    if [ -t 2 ]; then
        red=$'\033[31m'
        reset=$'\033[0m'
    fi
    # Signal deaths (exit code 128+N) print nothing of their own — bash shows
    # only e.g. "Killed". 137 = SIGKILL, which on Linux is almost always the
    # kernel OOM killer on small hosts; macOS has no equivalent OOM kill, so
    # the out-of-memory explanation is Linux-only.
    if [ "$install_code" -eq 137 ] && [ "$os" = "linux" ]; then
        echo "${red}Installation was killed before it could finish (exit code 137). This usually means the system ran out of memory.${reset}" >&2
        echo "${red}Claude Code needs roughly 512MB of free memory to install. Free up memory, then run this script again.${reset}" >&2
    elif [ "$install_code" -ge 128 ]; then
        echo "${red}Installation was killed before it could finish (exit code $install_code).${reset}" >&2
    fi
    exit "$install_code"
fi

echo ""
echo "✅ Installation complete!"
echo ""
