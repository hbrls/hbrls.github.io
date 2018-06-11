####Apache, PHP, MySQL

    $ sudo apt-get install apache2
    $ sudo apt-get install libapache2-mod-php5
    $ sudo apt-get install php5
    $ sudo vim /etc/apache2/mods-available/dir.conf  # 调整index.php的优先级
    $ sudo apt-get install php5-gd php5-ldap php5-mcrypt  # 库
    $ sudo php5enmod mcrypt
    $ sudo /etc/init.d/apache2 restart  # 重启后可以使用phpinfo()查看
    $ sudo apt-get install libapache2-mod-auth-mysql
    $ sudo apt-get install php5-mysql
    $ sudo apt-get install libmysqlclient-dev php5-mysqlnd

####重现 mysql has gone away 问题

    $ mysql> SET @@GLOBAL.wait_timeout=30;
    $ mysql> SHOW GLOBAL VARIABLES LIKE "wait_timeout";

####phpMyAdmin

    $ wget http://sourceforge.net/projects/phpmyadmin/files/phpMyAdmin/<VERSION>/<FILE>.tar.bz2
    $ tar -jxvf <FILE>.tar.bz2
    
    $ sudo apt-get install phpmyadmin
    $ ln -s /usr/share/phpmyadmin /var/www/pma

####MySQL命令

1. 创建 utf-8 数据库

        CREATE DATABASE <database_name> CHARACTER SET utf8 COLLATE utf8_general_ci;

1. mysqldump 需要的 Privileges

        GRANT SELECT, LOCK TABLES ON `mysql`.* TO 'dump'@'%';
        GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON `the_db_to_dump`.* TO 'dump'@'%';
    
2. 删除 unique constraint

        ALTER TABLE `user` DROP KEY `nickname`;

3. 修改密码

        UPDATE mysql.user SET Password=PASSWORD('foobar') WHERE User='bar' AND Host='localhost'; FLUSH PRIVILEGES;

5. 删除用户

        DROP USER 'username'@'localhost';
    
####调整apache监听的端口

    $ sudo vim /etc/apache2/sites-available/default
    <VirtualHost *:8080>
        ServerAdmin shuaizhexu@gmail.com
        ServerName  apache.42smart.com
        ...
    $ sudo vim /etc/apache2/ports.conf
    NameVirtualHost *:8080
    Listen 8080

####Apache "Could not reliably determine the server’s fully qualified domain name"

    $ sudo vim /etc/apache2/conf.d/fqdn.conf
    ServerName localhost

####禁止查看目录

    $ sudo vim /etc/apache2/sites-available/default
    <Directory /var/www/downloads>
       Options -Indexes
    </Directory>

####报错不显示版本号

    $ sudo vim /etc/apache2/conf.d/security
    ServerTokens Prod
