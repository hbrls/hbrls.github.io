brew/cask
==

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  # http://brew.sh/
$ brew tap homebrew/cask-fonts
# $ brew tap homebrew/versions
# $ brew tap homebrew/x11

$ brew install --cask iterm2
$ brew install coreutils
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
$ brew install --cask rightzoom
$ brew install --cask marta

$ brew install --cask visual-studio-code

$ brew install --cask sublime-text
# https://packagecontrol.io/installation
{
  "font_face": "Source Code Pro Light",
  "font_size": 14,
  "rulers": [80],
  "tab_size": 2,
  "theme": "Default.sublime-theme",
  "translate_tabs_to_spaces": true,
  "trim_trailing_white_space_on_save": true
}

$ brew install --cask insomnia
$ brew install --cask insomnia-designer
$ brew install --cask mpv
$ brew install --cask tunnelblick

#$ brew cask install xquartz
#$ brew cask install cmd-eikana
#$ brew cask install jadengeller-helium
#$ brew cask install karabiner
#$ brew cask install seil

$ brew install node@12
$ brew install python
$ brew install python3
$ brew install go
$ brew cask install java
$ brew install mysql
$ brew install postgres
$ brew install maven
$ brew install tomcat

#$ brew cask install nally

$ brew outdated
$ brew cleanup
```

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

.dir_colors
==

```bash
# Configuration file for dircolors, a utility to help you set the
# LS_COLORS environment variable used by GNU ls with the --color option.

# The keywords COLOR, OPTIONS, and EIGHTBIT (honored by the
# slackware version of dircolors) are recognized but ignored.

# Below, there should be one TERM entry for each termtype that is colorizable
TERM linux
TERM linux-c
TERM mach-color
TERM console
TERM con132x25
TERM con132x30
TERM con132x43
TERM con132x60
TERM con80x25
TERM con80x28
TERM con80x30
TERM con80x43
TERM con80x50
TERM con80x60
TERM xterm
TERM xterm-color
TERM xterm-debian
TERM rxvt
TERM screen
TERM screen-w
TERM vt100

# Below are the color init strings for the basic file types. A color init
# string consists of one or more of the following numeric codes:
# Attribute codes:
# 00=none 01=bold 04=underscore 05=blink 07=reverse 08=concealed
# Text color codes:
# 30=black 31=red 32=green 33=yellow 34=blue 35=magenta 36=cyan 37=white
# Background color codes:
# 40=black 41=red 42=green 43=yellow 44=blue 45=magenta 46=cyan 47=white
NORMAL 00   # global default, although everything should be something.
FILE 00     # normal file
DIR 01;36   # directory
LINK 01;37  # symbolic link.  (If you set this to 'target' instead of a
            # numerical value, the color is as for the file pointed to.)
FIFO 40;33  # pipe
SOCK 01;35  # socket
DOOR 01;35  # door
BLK 40;33;01    # block device driver
CHR 40;33;01    # character device driver
ORPHAN 40;31;01 # symlink to nonexistent file

# This is for files with execute permission:
EXEC 01;35

# List any file extensions like '.gz' or '.tar' that you would like ls
# to colorize below. Put the extension, a space, and the color init string.
# (and any comments you want to add after a '#')

# If you use DOS-style suffixes, you may want to uncomment the following:
#.cmd 01;32 # executables (bright green)
#.exe 01;32
#.com 01;32
#.btm 01;32
#.bat 01;32

.tar 01;31 # archives or compressed (bright red)
.tgz 01;31
.arj 01;31
.taz 01;31
.lzh 01;31
.zip 01;31
.z   01;31
.Z   01;31
.gz  01;31
.bz2 01;31
.deb 01;31
.rpm 01;31
.jar 01;31
.dmg 01;31

# image formats
.jpg 01;35
.png 01;35
.gif 01;35
.bmp 01;35
.ppm 01;35
.tga 01;35
.xbm 01;35
.xpm 01;35
.tif 01;35
.png 01;35
.mpg 01;35
.avi 01;35
.fli 01;35
.gl 01;35
.dl 01;35

# source code files
.pl 00;33
.PL 00;33
.pm 00;33
.tt 00;33
.yml 00;33
.sql 00;33
.html 00;33
.css 00;33
.js 00;33
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
registry=https://registry.npm.taobao.org
save-exact=true
package-lock=false
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
sharp_dist_base_url=https://npm.taobao.org/mirrors/sharp-libvips/
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
