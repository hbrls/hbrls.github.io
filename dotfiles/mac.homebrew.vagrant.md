brew/cask
==

```bash
$ xcode-select --install
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" # https://ohmyz.sh
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" # http://brew.sh
$ echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
$ brew tap homebrew/cask-fonts

$ brew install --cask iterm2
$ brew install coreutils
$ brew install gnu-sed
$ brew install wget
$ brew install ccat
$ brew install trash

$ brew install git
$ brew install tig
# $ git config --global user.name hbrls
# $ git config --global user.email shuaizhexu@gmail.com
# $ git config --global core.editor "vim"
# $ git config --global color.ui true
# $ git config --global core.ignorecase false
# $ git config --global push.default simple
# $ git config --global pull.rebase true

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

$ brew install node@16
$ brew install python@3.11
# $ brew install go
# $ brew cask install java
# $ brew install maven
# $ brew install tomcat

$ brew outdated
$ brew cleanup
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
8. [Gitnuro](https://gitnuro.jetpackduba.com/)
9. [迅雷](https://www.xunlei.com/)

.bashrc
==

```bash
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"
export ARCHFLAGS="-arch x86_64"

export HOMEBREW_NO_ANALYTICS=1
export HOMEBREW_NO_AUTO_UPDATE=1

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

.zshrc
==

```bash
unsetopt share_history
source ~/.bashrc
```

.npmrc
==

```bash
registry=https://registry.npmmirror.com/
save-exact=true
package-lock=false
sass_binary_site="https://registry.npmmirror.com/binary.html?path=node-sass/"
sharp_dist_base_url="https://registry.npmmirror.com/binary.html?path=sharp/"
# phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
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
