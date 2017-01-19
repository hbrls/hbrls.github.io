*for 14.04 Trusty*

Basics
==
    
    $ sudo apt-get install linux-headers-generic

    $ sudo apt-get install git
    $ sudo apt-get install aptitude
    $ sudo apt-get install vim    
    $ sudo apt-get install p7zip
    $ sudo apt-get install mit-scheme
    $ sudo apt-get install openssh-server
    $ sudo apt-get install lynx
    $ sudo apt-get install filezilla
    $ sudo apt-get install meld
    $ sudo apt-get install synaptic
    $ sudo apt-get install ttf-wqy-zenhei ttf-wqy-microhei

    $ sudo apt-get install r-base
    
    $ sudo pip install Glances
    
    $ sudo apt-get install zsh
    $ sudo wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O - | sh

Docker
==

1. [Installation on Ubuntu](https://docs.docker.com/installation/ubuntulinux/)

####JAVA7

    $ sudo add-apt-repository ppa:webupd8team/java
    $ sudo apt-get update
    $ sudo apt-get install oracle-jdk7-installer
    $ sudo vim /etc/environment
    # Append to the end of the file:
    JAVA_HOME=/usr/lib/jvm/java-7-oracle

####fcitx

    $ killall ibus-daemon
    $ sudo apt-get purge ibus ibus-gtk ibus-gtk3 ibus-pinyin* ibus-sunpinyin ibus-table python-ibus
    $ rm -rf ~/.config/ibus

    $ sudo add-apt-repository ppa:fcitx-team/stable    # oneiric
    $ sudo add-apt-repository ppa:fcitx-team/nightly   # precise
    $ sudo apt-get install fcitx-pinyin fcitx-googlepinyin
    
    # 如果你采用 KDM、GDM、LightDM 等显示管理器，请在~/.xprofile (没有则新建一个)中加入如下3行
    export GTK_IM_MODULE=fcitx
    export QT_IM_MODULE=fcitx
    export XMODIFIERS="@im=fcitx"

Ubuntu as the VirtualBox Guest
==
    
    $ sudo mkdir /mnt/share
    $ sudo mount -t vboxsf uploads /mnt/share  # 其中"uploads"是之前创建的共享文件夹的名字
    $ sudo umount -f /mnt/shared               # 卸载

删除 Unity
==

    $ sudo apt-get install gnome-panel

    $ sudo apt-get -y --auto-remove purge unity
    $ sudo apt-get -y --auto-remove purge unity-common
    $ sudo apt-get -y --auto-remove purge unity-lens*
    $ sudo apt-get -y --auto-remove purge unity-services
    $ sudo apt-get -y --auto-remove purge unity-asset-pool
    $ sudo apt-get remove webbrowser-app

    注意:不能用sudo apt-get --auto-remove purge unity*,看软件包列表里,有不少跟UNITY无关的也列出了。
    而且 unity-greeter必须保留。如果删了,自己蹲墙边哭一会儿再想办法。
    
    # 大升级会自动删掉gnome-shell，需要apt-get install gnome-shell xorg，在 universe 里
    # sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 8E5D2411637A5E2A

清理系列
==

    $ sudo apt-get remove --purge tomboy \
      && sudo apt-get remove --purge empathy \
      && sudo apt-get remove --purge evolution \
      && sudo apt-get remove --purge thunderbird* \
      && sudo apt-get remove --purge gwibber* \
      && sudo apt-get remove --purge simple-scan \
      && sudo apt-get remove --purge shotwell \
      && sudo apt-get remove --purge brasero \
      && sudo apt-get remove --purge brasero-cdrkit \
      && sudo apt-get remove --purge brasero-common \
      && sudo apt-get remove --purge cheese \
      && sudo apt-get remove --purge rhythmbox \
      && sudo apt-get remove --purge totem \
      && sudo apt-get remove --purge vinagre
    
    $ sudo apt-get remove --purge gnome-games \
      && sudo apt-get remove --purge gnome-mahjongg \
      && sudo apt-get remove --purge aisleriot \
      && sudo apt-get remove --purge gnome-sudoku \
      && sudo apt-get remove --purge gbrainy \
      && sudo apt-get remove --purge gnomine \
      && sudo apt-get remove --purge gnome-contacts \
      && sudo apt-get remove --purge ubuntuone-client
    
    $ sudo apt-get remove --purge language-pack-de \
      && sudo apt-get remove --purge language-pack-es \
      && sudo apt-get remove --purge language-pack-pt \
      && sudo apt-get remove --purge language-pack-de-base \
      && sudo apt-get remove --purge language-pack-es-base \
      && sudo apt-get remove --purge language-pack-pt-base \
      && sudo apt-get remove --purge language-pack-de-gnome-base \
      && sudo apt-get remove --purge language-pack-es-gnome-base \
      && sudo apt-get remove --purge language-pack-pt-gnome-base
    
    $ sudo apt-get autoremove ttf-thai-tlwg
    
    $ sudo apt-get remove gnome-chess \
      && sudo apt-get remove gnome-mines \
      && sudo apt-get remove gnome-klotski \
      && sudo apt-get remove gnome-tetravex \
      && sudo apt-get remove four-in-a-row \
      && sudo apt-get remove gnome-nibbles \
      && sudo apt-get remove gnome-robots \
      && sudo apt-get remove swell-foop \
      && sudo apt-get remove lightsoff \
      && sudo apt-get remove quadrapassel \
      && sudo apt-get remove five-or-more \
      && sudo apt-get remove tali \
      && sudo apt-get remove iagno
    
    $ sudo apt-get remove gimp \
      && sudo apt-get remove inkscape \
      && sudo apt-get remove imagemagick \
      && sudo apt-get remove gnome-orca \
      && sudo apt-get remove gnome-games-data \
      && sudo apt-get remove vino \
      && sudo apt-get remove empathy-common \
      && sudo apt-get remove rhythmbox-data \
      && sudo apt-get remove librhythmbox-core6 \
      && sudo apt-get remove totem-common \
      && sudo apt-get remove empathy-common \
      && sudo apt-get remove gir1.2-totem-1.0 \
      && sudo apt-get remove gir1.2-totem-plparser-1.0 \
      && sudo apt-get remove python-ubuntuone-client \
      && sudo apt-get remove python-ubuntuone-storageprotocol \
      && sudo apt-get remove ubuntuone-installer \
      && sudo apt-get remove iceweasel \
      && sudo apt-get remove hamster-applet

Supervisor
==

    $ sudo apt-get install supervisor  # 不要用 pip 装，源里自带的做过定制，可以随机启动
    默认配置文件在 /etc/supervisor/supervisord.conf, /etc/supervisor/conf.d

    [program:bbs]
    command=/usr/local/bin/uwsgi -y /var/deploy/bbs.42smart.com/uwsgiconfig.yaml
    user=www-data
    autostart=true     # 跟随supervisord一起启动
    autorestart=true   # 挂掉后自动重启
    startsecs=3
    stdout_logfile=/var/log/supervisord/bbs.42smart.com.log
    redirect_stderr=true
    stderr_logfile=/var/log/supervisord/bbs.42smart.com.error.log
    stopsignal=QUIT

    $ sudo supervisord
    $ sudo supervisorctl status
    $ sudo supervisorctl reload      # 所有program重启
    $ sudo supervisorctl update      # 仅有改动的program重启
    $ sudo supervisorctl start bbs
    $ sudo supervisorctl stop bbs
    $ sudo supervisorctl restart bbs
    $ sudo supervisorctl tail bbs
