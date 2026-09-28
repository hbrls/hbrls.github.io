param(
    [Parameter(Position=0)]
    [ValidatePattern('^(stable|latest|\d+\.\d+\.\d+(-[^\s]+)?)$')]
    [string]$Target = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

# When stdout is a TTY we want a progress bar; when it's piped/redirected
# (CI logs, `| Tee-Object`, etc.) we keep things quiet so logs stay
# grep-friendly. Mirrors the `INTERACTIVE` flag in install-claude-code.sh.
$Interactive = [bool]([Console]::IsOutputRedirected -eq $false)

# Check for 32-bit Windows
if (-not [Environment]::Is64BitProcess) {
    Write-Error "Claude Code does not support 32-bit Windows. Please use a 64-bit version of Windows."
    exit 1
}

$DOWNLOAD_BASE_URL = "https://downloads.claude.ai/claude-code-releases"
$DOWNLOAD_DIR = "$env:USERPROFILE\.claude\downloads"

# Use native ARM64 binary on ARM64 Windows, x64 otherwise
if ($env:PROCESSOR_ARCHITECTURE -eq "ARM64") {
    $platform = "win32-arm64"
} else {
    $platform = "win32-x64"
}
New-Item -ItemType Directory -Force -Path $DOWNLOAD_DIR | Out-Null

# Pinned version, manually retrieved from https://downloads.claude.ai/claude-code-releases/latest on 2026-09-23.
# This script is hard-wired to that exact release; updates require editing this line.
$version = "2.1.280"
Write-Output "[INFO]  Pinned version:     $version"

# Target platform: derived from `$env:PROCESSOR_ARCHITECTURE` (see top of script).
# The expected `platform` value (e.g. win32-x64) is built by the platform detection block above.

# Hard-coded manifest values for version 2.1.280, taken from
#   GET https://downloads.claude.ai/claude-code-releases/2.1.280/manifest.json
# on 2026-09-23. Each entry maps a platform key to its SHA256 checksum and
# the binary size in bytes. Update `$version` above *and* this block when
# bumping releases.
#
# Format: PLATFORM_KEY|SHA256_HEX|BYTES
$CLAUDE_MANIFEST_ENTRIES = @(
    "win32-arm64|f49980314f4c0418079979723ffd6c0d00d57e60b26fd95c53e53155ed913bdf|225107104",
    "win32-x64|0e4195524b73eb77efbdf3e2b36de5322a29f0ca575dfd2d9b4f946b1d425469|237100192"
)

# Look up the active platform's checksum and size in the hard-coded table.
$checksum = ""
$size = ""
foreach ($entry in $CLAUDE_MANIFEST_ENTRIES) {
    if ([string]::IsNullOrWhiteSpace($entry)) { continue }
    if ($entry.StartsWith("#")) { continue }
    $parts = $entry -split '\|'
    if ($parts.Count -ne 3) { continue }
    $m_platform, $m_checksum, $m_size = $parts
    if ($m_platform -eq $platform) {
        $checksum = $m_checksum.ToLower()
        $size = [int64]$m_size
        break
    }
}

if ([string]::IsNullOrEmpty($checksum) -or ($checksum -notmatch '^[a-f0-9]{64}$')) {
    Write-Warning "No hard-coded manifest entry for platform '$platform' (version $version)."
    Write-Warning "Edit this script's `$CLAUDE_MANIFEST_ENTRIES block to add an entry, then re-run."
    exit 1
}
Write-Output "[INFO]  Pinned checksum:    $checksum"
Write-Output "[INFO]  Pinned size:        $size"
Write-Output "[INFO]  Pinned binary URL:  $DOWNLOAD_BASE_URL/$version/$platform/claude.exe"

# --- Proxy (hard-coded) -------------------------------------------------
# The download path (Invoke-WebRequest) is fine on direct connection in
# most setups, but `claude.exe install` is a Node.js binary whose `fetch()`
# does NOT consult WinHTTP system settings — it reads standard proxy
# env vars only. We hard-code the proxy here and propagate it to the
# child process via HTTPS_PROXY / HTTP_PROXY so the inner installer
# reaches the download endpoint through the proxy.
#
# To change the proxy, edit $ProxyUrl below and re-run.
#
# NOTE: Node.js / undici's `ProxyAgent` only natively understands
# `http://` / `https://` proxy URLs. SOCKS5 (`socks5://`, `socks5h://`)
# may be ignored by the child fetch. If the install still fails with
# ECONNREFUSED, switch your local proxy tool's listener to also expose
# an HTTP port (e.g. `http://127.0.0.1:7890`) and update $ProxyUrl to
# that URL.
$ProxyUrl = 'socks5://127.0.0.1:10808'

# Mask user:password in URLs so they don't leak into logs.
$ProxyUrlMasked = ($ProxyUrl -replace '(://[^:@/]+:)[^:@/]+(@)', '$1***$2')
Write-Output "[INFO]  Proxy (hard-coded): $ProxyUrlMasked"

function Set-ChildProxyEnv {
    # Fill HTTPS_PROXY / HTTP_PROXY in this process so the child `claude.exe`
    # inherits them. Save prior values via $Restore so the caller can undo.
    param([hashtable]$Restore)
    foreach ($k in @('HTTPS_PROXY','HTTP_PROXY')) {
        $Restore[$k] = [Environment]::GetEnvironmentVariable($k, 'Process')
        [Environment]::SetEnvironmentVariable($k, $ProxyUrl, 'Process')
    }
}

function Restore-ChildProxyEnv {
    param([hashtable]$Restore)
    foreach ($k in @('HTTPS_PROXY','HTTP_PROXY')) {
        if ($Restore.ContainsKey($k)) {
            [Environment]::SetEnvironmentVariable($k, $Restore[$k], 'Process')
        }
    }
}

# Download the binary directly from the URL recorded in the manifest. No
# zstd path: that's an optional optimization we deliberately skip because
# the upstream .zst manifest endpoint is not guaranteed to be reachable.
$binaryPath = "$DOWNLOAD_DIR\claude-$version-$platform.exe"

# Filename-based short-circuit: if a file with the expected name is already
# on disk, skip the download entirely (no size/SHA256 check, no resume).
# Verification of an existing-but-unexpected file is the operator's job;
# this script does not delete and re-download on mismatch.
if (Test-Path $binaryPath) {
    Write-Output "[INFO]  Found existing binary at $binaryPath -- skipping download."
}
else {
    try {
        Write-Output "[INFO]  GET $DOWNLOAD_BASE_URL/$version/$platform/claude.exe"
        Write-Output "[INFO]          -> $binaryPath"
        Invoke-WebRequest -Uri "$DOWNLOAD_BASE_URL/$version/$platform/claude.exe" -OutFile $binaryPath -ErrorAction Stop
        Write-Output "[OK  ]  DONE $DOWNLOAD_BASE_URL/$version/$platform/claude.exe"
    }
    catch {
        Write-Error "Failed to download binary: $_"
        if (Test-Path $binaryPath) {
            Remove-Item -Force $binaryPath
        }
        exit 1
    }

    # Confirm the on-disk size matches what the manifest says, then verify SHA256.
    $actualSize = (Get-Item $binaryPath).Length
    if ($actualSize -ne $size) {
        Write-Warning "Binary size mismatch: downloaded $actualSize bytes, manifest says $size"
        Remove-Item -Force $binaryPath
        exit 1
    }

    $actualChecksum = (Get-FileHash -Path $binaryPath -Algorithm SHA256).Hash.ToLower()
    if ($actualChecksum -ne $checksum) {
        Write-Error "Checksum verification failed"
        Remove-Item -Force $binaryPath
        exit 1
    }
}

# Run claude install to set up launcher and shell integration
Write-Output "Setting up Claude Code..."
$proxyRestore = @{}
Set-ChildProxyEnv $proxyRestore
try {
    if ($Target) {
        & $binaryPath install $Target
    }
    else {
        & $binaryPath install
    }
    # Native exit codes don't trigger $ErrorActionPreference - capture explicitly
    $installExitCode = $LASTEXITCODE
}
finally {
    Restore-ChildProxyEnv $proxyRestore
    try {
        # Clean up downloaded file
        # Wait a moment for any file handles to be released
        Start-Sleep -Seconds 1
        Remove-Item -Force $binaryPath
    }
    catch {
        Write-Warning "Could not remove temporary file: $binaryPath"
    }
}

if ($installExitCode -ne 0) {
    Write-Error "Installation failed (exit code $installExitCode)"
    exit $installExitCode
}

Write-Output ""
Write-Output "$([char]0x2705) Installation complete!"
Write-Output ""
