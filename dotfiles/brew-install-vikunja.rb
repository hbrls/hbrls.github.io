# frozen_string_literal: true

# Homebrew formula for Vikunja
# 官网: https://vikunja.io
# 文档: https://vikunja.io/docs/
# 源码: https://github.com/go-vikunja/vikunja
#
# 安装方式（Homebrew ≥6 强制 formula 必须在 tap 内，故使用本地 tap）：
#   本 tap 名 local/backstage，用于存放多个自定义 formula；每个 formula 仅
#   维护本仓库这一份，tap 内以软链指向，改一处后 reinstall 即生效。
#
#   # 1) 创建本地 tap（仅需一次，纯本地目录，不联网）
#   brew tap-new local/backstage
#
#   # 2) 把本 formula 软链进 tap 的 Formula 目录
#   ln -s "$(pwd)/dotfiles/brew-install-vikunja.rb" "$(brew --repository)/Library/Taps/local/homebrew-backstage/Formula/brew-install-vikunja.rb"
#
#   # 3) 安装（从本地 tap；formula 名 brew-install-vikunja，二进制命令仍为 vikunja）
#   brew install local/backstage/brew-install-vikunja
#
#   # 调试重装（改完本文件后）
#   brew reinstall local/backstage/brew-install-vikunja
#
#   # 卸载 + 删 tap
#   brew uninstall local/backstage/brew-install-vikunja
#   brew untap local/backstage
#
# 安装路径（遵循 Homebrew 规范，Apple Silicon prefix = /opt/homebrew）：
#
#   程序本体（二进制）
#     bin.install -> #{prefix}/bin/vikunja
#       = /opt/homebrew/Cellar/vikunja/2.5.0/bin/vikunja  (keg 内，版本化，升级时旧 keg 整个删除)
#     Homebrew 自动 symlink -> /opt/homebrew/bin/vikunja  (进 PATH)
#
#   配置文件
#     #{etc}/vikunja/config.yml
#       = /opt/homebrew/etc/vikunja/config.yml  (全局持久，跨版本保留)
#     来源：install 时自动生成（.sample 仅下载供参考）
#
#   数据根目录（对应 Vikunja 的 service.rootpath）
#     #{var}/vikunja
#       = /opt/homebrew/var/vikunja  (全局持久，跨版本保留)
#     其下统一存放：数据库(sqlite) / 文件存储(files) / 日志(logs) / 插件(plugins)
#     原则：持久数据不放 keg（#{prefix} 版本化，升级会删旧 keg）

class BrewInstallVikunja < Formula
  desc "Self-hosted to-do / task manager (API server)"
  homepage "https://vikunja.io"
  # 下载官方在 dl.vikunja.io 发布的预编译 macOS 二进制安装，无需从源码编译。
  # zip 内附带 LICENSE / config.yml.sample / 二进制 sha256 校验文件
  version "2.5.0"
  url "https://dl.vikunja.io/vikunja/v#{version}/vikunja-v#{version}-darwin-10.15-arm64-full.zip"
  sha256 "9c77cb6afddc3191696696f624830620361bf12a0016dd41c4028a7428651d91"

  # 配置文件示例（声明式下载；落地见下方 install 块）
  # 注意：resource 块内 self 为 Resource，#{version} 取的是 Resource 的 version（nil），
  #       故先用局部变量捕获 formula 的 version，再在块内插值该变量（闭包可见）
  config_version = version
  resource "config" do
    url "https://dl.vikunja.io/vikunja/v#{config_version}/config.yml.sample"
    sha256 "1fa134802c242a2c5819ee331ef194b3fabc19f736ff0fb34bff8d6a89aebd73"
  end

  license "AGPL-3.0-or-later"
  head "https://github.com/go-vikunja/vikunja.git", branch: "main"

  # 仅支持 Apple Silicon (arm64) Mac；Intel Mac 安装会被 Homebrew 直接拦截报错
  depends_on arch: :arm64

  def install
    # 此处将可执行文件重命名为 vikunja 安装到 bin
    executable = Dir["vikunja-v*-darwin-*"].reject { |f| f.end_with?(".sha256") }.first
    bin.install executable => "vikunja"

    # 配置示例：从 resource "config" 落地到 #{etc}/vikunja/config.yml.sample（供参考）
    (etc/"vikunja").mkpath
    (etc/"vikunja").install resource("config")

    # 生成正式 config.yml（仅当用户还没有时，不覆盖已有配置）
    # 最小配置：监听 0.0.0.0:23456、数据落 #{var}/vikunja
    unless (etc/"vikunja/config.yml").exist?
      (etc/"vikunja/config.yml").write <<~EOS
        service:
          interface: "0.0.0.0:23456"
          publicurl: "http://127.0.0.1:23456"
          rootpath: "#{var}/vikunja"
        database:
          type: "sqlite"
          path: "#{var}/vikunja/vikunja.db"
        log:
          path: "#{var}/vikunja/logs"
      EOS
    end

    # 数据目录（rootpath/database.path/log.path 均指向此处，Vikunja 不会自动创建）
    (var/"vikunja").mkpath
  end

  def caveats
    <<~EOS
      Vikunja 已安装。

      程序本体:  #{bin}/vikunja
      配置文件:  #{etc}/vikunja/config.yml
      数据目录:  #{var}/vikunja

      作为 brew service 启动:
        brew services start local/backstage/brew-install-vikunja
      停止 / 重启:
        brew services stop  local/backstage/brew-install-vikunja
        brew services restart local/backstage/brew-install-vikunja

      手动前台启动（调试，需指定 config 所在目录）:
        VIKUNJA_SERVICE_ROOTPATH=#{etc}/vikunja vikunja

      查看版本:
        vikunja version
    EOS
  end

  # brew service：声明式描述，Homebrew 据此生成 launchd plist（LaunchAgent，
  # 登录自启 + keep_alive 崩溃重启），无需手写 plist 或直接调 launchctl。
  service do
    run [opt_bin/"vikunja"]
    keep_alive true
    environment_variables VIKUNJA_SERVICE_ROOTPATH: etc/"vikunja"
  end

  test do
    # Vikunja 用 `version` 子命令输出版本，而非 --version
    assert_match "v#{version}", shell_output("#{bin}/vikunja version")
  end
end
