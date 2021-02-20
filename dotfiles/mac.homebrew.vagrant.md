brew/cask
==

    $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  # http://brew.sh/
    # $ brew tap homebrew/versions
    # $ brew tap homebrew/x11
    # $ brew tap homebrew/cask-fonts

    $ brew install --cask iterm2
    $ brew install coreutils
    $ brew install wget
    $ brew install ccat
    $ brew install trash
    $ brew install git
    $ brew install tig
    $ brew install --cask squirrel
    $ brew install --cask keka
    $ brew install --cask jd-gui

    $ brew cask install xquartz
    $ brew cask install cmd-eikana
    $ brew cask install rightzoom
    $ brew cask install font-source-code-pro
    $ brew cask install jadengeller-helium
    $ brew cask install karabiner
    $ brew cask install seil
    
    $ brew install python
    $ brew install python3
    $ brew install node@6
    $ brew install go
    $ brew cask install java
    $ brew install mysql
    $ brew install postgres
    $ brew install maven
    $ brew install tomcat

    $ brew install mpv
    $ brew cask install sublime-text
    $ brew cask install foxmail
    $ brew cask install virtualbox
    $ brew cask install vagrant
    $ brew cask install atom
    $ brew cask install nally
    
    $ brew outdated
    $ brew cleanup

.bashrc
==

```bash
export LC_ALL="en_US.UTF-8"
export LANG="en_US.UTF-8"

export PATH=/usr/local/bin:/usr/local/sbin:$PATH
#export PATH="/usr/local/opt/node@8/bin:$PATH"
#export PATH="/usr/local/opt/node@10/bin:$PATH"
export PATH="/usr/local/opt/node@12/bin:$PATH"
export PATH="/usr/local/opt/python/libexec/bin:$PATH"

# coreutils
PATH=$(brew --prefix coreutils)/libexec/gnubin:$PATH
alias ls='gls -lhF --show-control-chars --color=auto'
eval `gdircolors -b $HOME/.dir_colors`

# virtualenvwrapper
export VIRTUALENVWRAPPER_PYTHON=/usr/local/opt/python/libexec/bin/python
export WORKON_HOME=~/venv
source /usr/local/bin/virtualenvwrapper.sh
#[ -f /etc/bash_completion.d/virtualenvwrapper ] && source /etc/bash_completion.d/virtualenvwrapper
#export PIP_VIRTUALENV_BASE=$WORKON_HOME
#export PIP_RESPECT_VIRTUALENV=true

# Go
export PATH=$PATH:/usr/local/opt/go/libexec/bin

# Android
export ANT_HOME=/usr/local/opt/ant
export MAVEN_HOME=/usr/local/opt/maven
export GRADLE_HOME=/usr/local/opt/gradle
export ANDROID_HOME=/usr/local/opt/android-sdk
export ANDROID_NDK_HOME=/usr/local/opt/android-ndk

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

# homebrew
export HOMEBREW_NO_AUTO_UPDATE=1

# npm
# export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
export ELECTRON_MIRROR="http://cdn.lisitede.com/npm/mirrors/electron/"
export ADBLOCK=true
export DISABLE_OPENCOLLECTIVE=true

# flutter
export PATH=/Users/xushuaizhe/sdk/flutter/bin:$PATH

alias cat='ccat'
alias gp='gulp'
alias wp='webpack'
alias wpba='./node_modules/.bin/webpack-bundle-analyzer'
alias code='/Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code'
alias dc='docker-compose'
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
