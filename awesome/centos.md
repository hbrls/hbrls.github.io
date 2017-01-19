如用minimal装的，则需要自己启动网络

[6] 网路设置

    [root@sample ~]#vi /etc/sysconfig/network
    NETWORKING 是否利用网络
    GATEWAY 默认网关
    IPGATEWAYDEV 默认网关的接口名
    HOSTNAME 主机名
    DOMAIN 域名

    [root@sample ~]#vi /etc/sysconfig/network-scripts/ifcfg-eth0
    DEVICE=eth0
    BOOTPROTO=static
    BROADCAST=192.168.1.255
    HWADDR=00:0C:2x:6x:0x:xx
    IPADDR=192.168.1.205
    NETMASK=255.255.255.0
    NETWORK=192.168.1.1
    ONBOOT=yes
    TYPE=Ethernet

替换默认源为163源

    #cd /etc/yum.repos.d/
    #wget http://mirrors.163.com/.help/CentOS5-Base-163.repo
    #mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
    yum makecache


升级自带的Python2.4到2.6

    #wget http://www.python.org/ftp/python/2.6.5/Python-2.6.5.tar.bz2
    #tar jxvf  Python2.6.5.tar.bz2
    #cd Python2.6.5
    #./configure
    #make && make install
    python2.6安装后路径默认是在/usr/local/lib/python2.6

    mv /usr/bin/python  /usr/bin/python.bak
    ln -s //usr/local/bin/python2.6 /usr/bin/python

解决系统python软链接指向python2.6版本后，yum不能正常工作方法

    $vi /usr/bin/yum
    将文本编辑显示的#/usr/bin/python修改为#/usr/bin/python2.4，保存修改即可


[2] 建立一般用户

    [root@sample ~]# useradd centospub
    [root@sample ~]# passwd centospub
    Changing password for user centospub.
    New UNIX password:
    Retype new UNIX password:
    passwd: all authentication tokens updated successfully.

[3] 删除一般用户

    [root@sample ~]# userdel -r centospub

[5] 建立管理员组内一般用户
在一般情况下，一般用户通过执行“su -”命令、输入正确的root密码，可以登录为root用户来对系统进行管理员级别的配置。但是，为了更进一步加强系统的安全性，有必要建立一个管理员的 组，只允许这个组的用户来执行“su -”命令登录为root用户，而让其他组的用户即使执行“su -”、输入了正确的root密码，也无法登录为root用户。在UNIX下，这个组的名称通常为“wheel”。

    [root@sample ~]# usermod -G wheel centospub
    [root@sample ~]# vi /etc/pam.d/su 　← 打开这个配置文件
    #auth required /lib/security/$ISA/pam_wheel.so use_uid 　 ← 找到此行，去掉行首的“#” （大约在第6行的位置）
    [root@sample ~]# echo "SU_WHEEL_ONLY yes" >> /etc/login.defs　← 添加语句到行末

以上操作完成后，可以再建立一个新用户，然后用这个新建的用户测试会发现，没有加入到wheel组的用户，执行“su -”命令，即使输入了正确的root密码，也无法登录为root用户。

[7] 更新

    [root@sample ~]#yum -y update
    [root@sample ~]#yum -y install wget gcc gcc-c++
    [root@sample ~]#yum -y install autoconf libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel
    [root@sample ~]#yum -y install libxml2 libxml2-devel zlib zlib-devel glibc glibc-devel glib2 glib2-devel
    [root@sample ~]#yum -y install bzip2 bzip2-devel ncurses ncurses-devel curl curl-devel e2fsprogs e2fsprogs-devel
    [root@sample ~]#yum -y install krb5 krb5-devel libidn libidn-devel openssl openssl-devel openldap openldap-devel
    [root@sample ~]#yum -y install nss_ldap openldap-clients openldap-servers
    [root@sample ~]#yum -y install php mysql mysql-server mysql-devel php-mysql php-cgi php-mbstring php-gd php-fastcgi

开放80端口

查看防火墙信息

    # /etc/init.d/iptables status

开启指定端口

    # /sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT

保存修改

    # /etc/rc.d/init.d/iptables save

重启防火墙

    # /etc/init.d/iptables restart

更改Apache监听端口

    # getenforce
    Enforcing
    如果出现（Enforcing ）关闭方法：#setenforce 0
    更改httpd.conf，Listen 8704，重启/etc/init.d/httpd restart

配置Apache

    NameVirtualHost 12.34.56.78:80
    <VirtualHost ip.address.of.host.some_domain.com>
        ServerAdmin webmaster@host.some_domain.com
        DocumentRoot /www/docs/host.some_domain.com
        ServerName host.some_domain.com
        ErrorLog logs/host.some_domain.com-error_log
        CustomLog logs/host.some_domain.com-access_log common
    </VirtualHost>

安装nginx

    server {
        listen dev.watervilleinc.com:80;
        server_name dev.watervilleinc.com;
        location / {
            proxy_pass http://127.0.0.1:8704;
            proxy_set_header Host $host;
        }
    }

* 实际效果是 http://dev.watervilleinc.com 被指向了 /var/www/html

启动nginx

    # /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

mysql默认没有密码

    # mysqladmin -u root password abc123


    #yum install kernel-devel
    #yum install kernel-PAE-devel

###SUN VirtualBox 的命令行启动/关闭方法简介

我们可以使用VBxManager 命令行管理工具来查看当前的虚拟基设置和状态

    [root@IPServer ~]# VBoxManage list vms
    "Virtual2008" {6f5f61ea-7597-4623-bcc7-440978d27b3c}

使用 VRDP 方式通过命令行启动虚拟机：

    [root@IPServer ~]# VBoxManage startvm “Virtual2008” -type vrdp
    VirtualBox Command Line Management Interface Version 2.1.4Waiting for VM "Virtual2008" to power on...
    VM "Virtual2008" has been successfully started.

要确认虚拟机是否在运行，可以使用命令VBoxManage list runningvm来查看。

    [root@IPServer ~]# VBoxManage list runningvms
    "Virtual2008" {6f5f61ea-7597-4623-bcc7-440978d27b3c}

从命令行关闭虚拟机: 通过VBoxManage 命令行工具的VBoxManage controlvm  <uuid>|<name>子命令可以改变虚拟机的运行状态，
其中常用的几个选项是：pause resume reset poweroff savestate acpipowerbutton acpisleepbutton

    [root@IPServer ~]# VBoxManage controlvm Virtual2008 poweroff
    0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100%
