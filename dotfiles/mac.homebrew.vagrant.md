[清华大学开源软件镜像站](https://mirror.tuna.tsinghua.edu.cn/)

Oh My Zsh
==

```bash
REMOTE=https://mirrors.tuna.tsinghua.edu.cn/git/ohmyzsh.git sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" # https://ohmyz.sh
```

Homebrew
==

```bash
# ~/.zprofile
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"

$ xcode-select --install
$ xcodebuild -license
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # http://brew.sh
```

brew/cask
==

```bash
$ brew install --cask iterm2
$ brew install coreutils
$ brew install gnu-sed
$ brew install wget
$ brew install ccat
$ brew install trash

$ brew install git
$ brew install tig

$ brew install font-source-code-pro
$ brew install --cask squirrel
$ brew install --cask keka
$ brew install --cask jd-gui
$ brew install --cask mpv
$ brew install --cask ppduck
# $ brew install --cask marta
# $ brew cask install xquartz
# $ brew cask install cmd-eikana
# $ brew cask install jadengeller-helium
# $ brew cask install karabiner
# $ brew cask install seil
# $ brew cask install nally

$ brew install node@18
    $ corepack enable
$ brew install python@3.11
$ brew install openjdk@11
# $ brew install go
# $ brew install maven
# $ brew install tomcat

$ brew outdated
$ brew cleanup
```

Git
==

1. [Generating a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
2. [Generating a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
3. [GnuPG Howto](https://help.ubuntu.com/community/GnuPrivacyGuardHowto)

```bash
$ git config --global user.name hbrls
$ git config --global user.email shuaizhexu@gmail.com
$ git config --global core.editor "vim"
$ git config --global color.ui true
$ git config --global core.ignorecase false
$ git config --global push.default simple
$ git config --global pull.rebase true
$ git config --global rerere.enabled true

$ gpg --list-secret-keys --keyid-format=long
$ gpg --keyserver hkps://keyserver.ubuntu.com --send-keys A543C7C8BC9BA904
$ gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys A543C7C8BC9BA904
$ brew install pinentry-mac

# ~/.gnupg/gpg-agent.conf
pinentry-program /opt/homebrew/bin/pinentry-mac
```

install
==

1. Edge, Chrome, Chrome Canary
2. [Tunnelblick](https://tunnelblick.net/)
3. [Visual Studio Code](https://code.visualstudio.com/)
4. [Sublime Text](https://www.sublimetext.com/)
5. [IntelliJ Toolbox](https://www.jetbrains.com/toolbox-app/)
6. [TablePlus](https://tableplus.com/)
7. [Insomnia](https://insomnia.rest/)
8. [Mockoon](https://mockoon.com/)
9. [Gitnuro](https://gitnuro.jetpackduba.com/)
10. [迅雷](https://www.xunlei.com/)
11. [Itsycal](https://www.mowglii.com/itsycal/)
12. [V2rayU](https://github.com/yanue/V2rayU/releases/tag/v3.9.0)

.zshrc
==

```bash
unsetopt share_history
source ~/.bashrc
```

.bashrc
==

```bash
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export ARCHFLAGS="-arch x86_64"

export HOMEBREW_NO_ANALYTICS=1
export HOMEBREW_NO_AUTO_UPDATE=1

export GPG_TTY=$(tty)

export PATH=/usr/local/bin:/usr/local/sbin:$PATH
export PATH="/opt/homebrew/opt/node@16/bin:$PATH"
export PATH="/opt/homebrew/opt/python@3.11/libexec/bin:$PATH"

export LDFLAGS="-L/opt/homebrew/opt/node@16/lib"
export CPPFLAGS="-I/opt/homebrew/opt/node@16/include"

# coreutils
export PATH=$(brew --prefix coreutils)/libexec/gnubin:$PATH
alias ls='gls -lhF --show-control-chars --color=auto'
# https://github.com/seebi/dircolors-solarized/blob/master/dircolors.256dark
eval `gdircolors -b $HOME/.dircolors.256dark`
# export PATH="/usr/local/opt/gnu-getopt/bin:$PATH"

# npm
# export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
# export ELECTRON_MIRROR="http://cdn.lisitede.com/npm/mirrors/electron/"
export ADBLOCK=true
export DISABLE_OPENCOLLECTIVE=true

# virtualenvwrapper
# export VIRTUALENVWRAPPER_PYTHON=/usr/local/opt/python/libexec/bin/python
# export WORKON_HOME=~/venv
# source /usr/local/bin/virtualenvwrapper.sh
#[ -f /etc/bash_completion.d/virtualenvwrapper ] && source /etc/bash_completion.d/virtualenvwrapper
# export PIP_VIRTUALENV_BASE=$WORKON_HOME
# export PIP_RESPECT_VIRTUALENV=true

# Go
# export PATH=$PATH:/usr/local/opt/go/libexec/bin

# Android
# export ANT_HOME=/usr/local/opt/ant
# export MAVEN_HOME=/usr/local/opt/maven
# export GRADLE_HOME=/usr/local/opt/gradle
# export ANDROID_HOME=/usr/local/opt/android-sdk
# export ANDROID_NDK_HOME=/usr/local/opt/android-ndk

export PATH=$ANT_HOME/bin:$PATH
export PATH=$MAVEN_HOME/bin:$PATH
export PATH=$GRADLE_HOME/bin:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/build-tools/19.1.0:$PATH

# Add GHC 7.8.3 to the PATH, via http://ghcformacosx.github.io/
export GHC_DOT_APP="/Applications/ghc-7.8.3.app"
if [ -d "$GHC_DOT_APP" ]; then
    export PATH="${HOME}/.cabal/bin:${GHC_DOT_APP}/Contents/bin:${PATH}"
fi

# flutter
export PATH=/Users/xushuaizhe/sdk/flutter/bin:$PATH

. "$HOME/.cargo/env"

alias cat="ccat"
alias code="/Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code"
alias dc="docker-compose"
```

.vimrc
==

```bash
syntax enable
set number

highlight LineNr ctermfg=DarkGrey

set fileencodings=utf-8
set termencoding=utf-8
set encoding=utf-8
"set encoding=prc

set fileformats=unix
```

.npmrc
==

```bash
registry=https://registry.npmmirror.com/
save-exact=true
package-lock=false
sass_binary_site="https://registry.npmmirror.com/binary.html?path=node-sass/"
sass_binary_site="https://registry.npmmirror.com/binary.html?path=node-sass/"
electron_mirror="https://npmmirror.com/mirrors/electron/"
sharp_binary_host = https://npmmirror.com/mirrors/sharp
sharp_libvips_binary_host = https://npmmirror.com/mirrors/sharp-libvips
sharp_dist_base_url="https://registry.npmmirror.com/binary.html?path=sharp/"
```

.pip/pip.conf
==

```bash
; http://www.pypi-mirrors.org/
[global]
index-url=http://mirrors.aliyun.com/pypi/simple
[install]
trusted-host=mirrors.aliyun.com
```

VSCode - settings.json
==

```json
{
    "workbench.startupEditor": "newUntitledFile",
    "workbench.editor.untitled.hint": "hidden",
    "javascript.updateImportsOnFileMove.enabled": "never",
    "typescript.updateImportsOnFileMove.enabled": "never",
    "svelte.ask-to-enable-ts-plugin": false,
    "editor.tabSize": 2,
    "editor.rulers": [ 80 ],
    "files.insertFinalNewline": true,
    "files.trimTrailingWhitespace": true
}
```

1. [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
2. [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
3. [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
4. [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
5. [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

JetBrains
==

1. [Grep Console](https://plugins.jetbrains.com/plugin/7125-grep-console)

Android Studio
==

1. https://developer.android.com/studio

```bash
$ brew install gradle@7
```

Vagrant
==

1. 找一个 `base box`，http://www.vagrantbox.es/

        $ vagrant box add {name} {url}
        # 实际上有墙，所以 box 先自行下载到本地
        $ vagrant box add {name} {local_path}

        $ vagrant box list

2. 建一个文件夹，接下来的所有操作都在这个文件夹里

        $ cd ~/Documents/Vagrant && mkdir {workspace}

        $ vagrant init {box_name}  # 初始化，会生成 Vagrantfile

        $ vagrant up       # 启动虚拟机
        $ vagrant halt     # 关闭虚拟机
        $ vagrant reload   # 重启虚拟机
        $ vagrant ssh      # SSH 至虚拟机
        $ vagrant status   # 查看虚拟机运行状态
        $ vagrant destroy  # 销毁当前虚拟机

3. 虚机的 `/vagrant` 即是主机的 `~/Documents/Vagrant/{workspace}`

4. 一个 ubuntu 12.04 带 docker 的基础镜像

        $ sudo apt-get install linux-image-generic-lts-trusty linux-headers-generic-lts-trusty
        $ dpkg --list | grep linux-image
        $ sudo apt-get purge linux-image-3.8.0-29-generic linux-image-generic-lts-raring
        $ sudo update-grub2
        $ sudo reboot
        // 插入 VBoxAdditions
        $ sudo mount -t iso9660 /dev/sr0 /media/cdrom
        $ wget -qO- https://get.docker.com/ | sh

5. [RESIZE A VAGRANT VMDK DRIVE](http://blog.lenss.nl/2012/09/resize-a-vagrant-vmdk-drive/)

6. 将自己的工作环境打包，`$ vagrant package --output {name}`

7. `Vagrantfile` 常用配置项：

        # 映射端口
        config.vm.network "forwarded_port", guest: 80, host: 12080

        # DHCP自动分配IP
        config.vm.network "public_network"
        # 私有网络，并指定IP
        config.vm.network "private_network", ip: "10.0.1.100"

        # 挂载宿主机文件夹
        config.vm.synced_folder "~/bitbucket/dockerfile", "/dockerfile"

8. 装一个 gui 模式的 box

        $ sudo apt-get install gnome-shell
        $ sudo apt-get install gdm
        $ sudo apt-get install gnome-terminal
        $ sudo apt-get install ttf-wqy-microhei

        config.vm.provider "virtualbox" do |vb|
            vb.gui = true
            vb.memory = 2048
            vb.cpus = 2
            vb.customize ["modifyvm", :id, "--vram", "32"]
        end

dnsmasq
==

1. [Using Dnsmasq for local development on OS X](http://passingcuriosity.com/2013/dnsmasq-dev-osx/)
