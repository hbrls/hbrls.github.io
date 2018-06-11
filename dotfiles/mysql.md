Mysql
==

[Installing MySQL 5.7 on Debian 9](https://www.globo.tech/learning-center/install-mysql-5-7-debian-9/)

[Reset a MySQL root password](https://support.rackspace.com/how-to/mysql-resetting-a-lost-mysql-root-password/)

```bash
$ sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```

```mysql
> CREATE USER '{username}'@'%' IDENTIFIED BY '{password}';
> GRANT ALL PRIVILEGES ON {database}.* TO '{username}'@'%';
> FLUSH PRIVILEGES;
```
