重现 mysql has gone away 问题
==

    $ mysql> SET @@GLOBAL.wait_timeout=30;
    $ mysql> SHOW GLOBAL VARIABLES LIKE "wait_timeout";

MySQL命令
==

1. mysqldump 需要的 Privileges

        GRANT SELECT, LOCK TABLES ON `mysql`.* TO 'dump'@'%';
        GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON `the_db_to_dump`.* TO 'dump'@'%';
    
2. 删除 unique constraint

        ALTER TABLE `user` DROP KEY `nickname`;

3. 修改密码

        UPDATE mysql.user SET Password=PASSWORD('foobar') WHERE User='bar' AND Host='localhost'; FLUSH PRIVILEGES;

5. 删除用户

        DROP USER 'username'@'localhost';
