命令
--

    =#create role user_1;  # 默认没有 Login 权限
    =#create user user_2;
    =#alter user user_1 with login;

    创建表 
    create table ([字段名1] [类型1] <references 关联表名(关联的字段名)>;,
                  [字段名2] [类型2],......<,primary key (字段名m,字段名n,...)>;); 

    \encoding [字元编码名称]  # 显示或设定用户端字元编码
    \password [USERNAME]

    =#\CREATE USER  WITH SUPERUSER CREATEDB PASSWORD '$PASSWORD';

```
=# CREATE USER {username} WITH PASSWORD '{password}';
=# ALTER USER {username} WITH PASSWORD '{new-password}';
    
=# GRANT CONNECT ON DATABASE {database} TO {username};
=# \c {database}  # 切换数据库
=# ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "{username}";
=# GRANT USAGE ON SCHEMA public to "{username}"; 
=# GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO "{username}";
=# GRANT SELECT ON ALL TABLES IN SCHEMA public TO "{username}";
=# REASSIGN OWNED BY {username} TO postgres;
=# DROP OWNED BY {username};
=# DROP ROLE {username};

=# GRANT ALL PRIVILEGES ON TABLE {tablename} TO "{username}";
=# GRANT ALL PRIVILEGES ON SEQUENCE {sequencename} TO "{username}";
```

    ＃ 备份数据库
    CREATE DATABASE {backup} WITH OWNER={owner} TEMPLATE={original};

1. [8+1 ways to take backup in postgresql](http://www.brownfort.com/2014/10/backup-restore-postgresql/)
