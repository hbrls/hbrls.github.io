[The Complete Guide to “useradd” Command in Linux](http://www.tecmint.com/add-users-in-linux/)

####Basics

    # apt-get install sudo
    # vi /etc/sudoers
    // Just under the line that looks like the following:
    root ALL=(ALL) ALL
    // Add the following (replacing user with your actual username):
    albert ALL=(ALL) ALL

    $ lsb_release -a  # 查看当前系统版本

    $ sudo apt-get install ntp
    $ sudo dpkg-reconfigure tzdata  # 改时区
    
    $ sudo apt-get install locate
    $ sudo updatedb
    
    // 修改默认ssh端口号
    # vim /etc/ssh/sshd_config
    # /etc/init.d/ssh restart
    
    $ sudo aptitude install debian-keyring debian-archive-keyring
    
    $ sudo apt-get install htop byobu

####TP-Link TL-WN725N无线网卡

    # http://blog.csdn.net/rainysia/article/details/17484537
    # 下载这个驱动 http://download.csdn.net/detail/rainysia/6754869
    $ apt-get install dkms
    $ 安装deb包
    $ cd /lib/modules/`uname -r`/updates/dkms  # 发现多了一个8188eu.ko
    $ sudo depmod -a
    $ sudo insmod 8188eu.ko
    $ ifconfig -a                              # 发现有了wlan0

####Crontab

    $ sudo vim /etc/cron.allow  # 白名单，一个用户一行，root永远可以
    $ sudo vim /etc/cron.deny   # 黑名单；白名单存在的情况下只有白名单起作用
    
    $ sudo vim /etc/rsyslog.conf
    # uncomment the line
    # cron.*                          /var/log/cron.log
    $ sudo /etc/init.d/rsyslog restart

    $ crontab -u albert -l  # 列表
    $ crontab -u albert -e  # 编辑
    $ crontab -u albert -r  # 删除
    
####Theme

    $ sudo add-apt-repository ppa:webupd8team/themes
    $ sudo add-apt-repository ppa:tiheum/equinox
    $ sudo apt-get install zukitwo-theme-all faience-theme faience-icon-theme
    Window Theme: Zukitwo-Dark
    GTK+ Theme  : Faience
    Icon Theme  : Faience
    
    # /usr/share/fonts/truetype
    $ wget http://downloads.sourceforge.net/project/sourcecodepro.adobe/SourceCodePro_FontsOnly-1.017.zip
    $ fc-cache -fv

####中文

    $ sudo dpkg-reconfigure locales  # 安装中文支持，默认设为en_us.utf-8
    $ locale -a  # 查看

####Firefox

    $ sudo apt-get remove iceweasel
    # add to source.list
    # deb http://packages.linuxmint.com debian import
    $ gpg --keyserver pgpkeys.mit.edu --recv-key  3EE67F3D0FF405B2
    $ gpg -a --export 3EE67F3D0FF405B2 | sudo apt-key add -
    $ sudo apt-get install firefox firefox-l10n-en-us
    // http://www.linuxmint.com/searchengines.php

####node/npm

    # add to source.list
    # deb http://ftp.us.debian.org/debian wheezy-backports main
    $ sudo apt-get install nodejs-legacy
    $ sudo curl https://npmjs.org/install.sh | sh 

####清理

    // Remove a lot and keep Gnome
    // http://unix.stackexchange.com/a/14329
    // http://tanguy.ortolo.eu/blog/article8/uninstall-meta-package
    $ sudo aptitude unmarkauto '?reverse-depends(gnome) | ?reverse-recommends(gnome)'
    $ sudo aptitude unmarkauto '?reverse-depends(gnome-core) | ?reverse-recommends(gnome-core)'
    $ sudo aptitude unmarkauto '?reverse-depends(gnome-desktop-environment) | ?reverse-recommends(gnome-desktop-environment)'
    # 仍然会要求卸载 gnome gnome-core gnome-desktop-environment，不要惊慌，已经没有依赖了
    
    $ sudo apt-get remove gnome-games-data # 可以删掉所有游戏

####双系统启动顺序

    $ sudo vim /etc/default/grub
    GRUB_DEFAULT=0
    $ sudo update-grub

####查看硬件型号

    $ lspci

####静态IP

    $ sudo vim /etc/network/interfaces
    然后添加下面这几行：
    #The primary network interface
    auto eth0
    iface eth0 inet static
    address 192.168.1.20
    netmask 255.255.255.0
    gateway 192.168.1.1

####修改hostname

    $ sudo vim /etc/hostname
    Saruman
    $ sudo vim /etc/hosts
    127.0.0.1    localhost
    127.0.1.1    Saruman
    ...ipv6...

####SFTP

    $ sudo mkdir /home/sftp/uploads
    $ sudo groupadd sftp
    $ sudo useradd -M -d /home/sftp/uploads -G sftp uploads
    $ sudo passwd uploads
    $ sudo chown uploads:sftp -R /home/sftp/uploads
    $ sudo vim /etc/ssh/sshd_config
    PasswordAuthentication yes
    
    #注释原来的Subsystem设置
    Subsystem   sftp    /usr/libexec/openssh/sftp-server
    #启用internal-sftp
    Subsystem       sftp    internal-sftp
    #限制uploads用户的根目录
    Match User www
        ChrootDirectory /home/sftp
        ForceCommand    internal-sftp
    
    $ sudo chown root:root -R /home/sftp
    $ sudo chmod 755 -R /home/sftp
    $ sudo chown uploads:sftp -R /home/sftp/uploads
    $ sudo chmod 775 -R /home/sftp/uploads
