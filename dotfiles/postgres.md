Debian 8
--

```bash
# apt-get install libpq5 postgresql-9.4 postgresql-client-9.4 postgresql-client-common postgresql-common
>>> config /etc/postgresql/9.4/main
>>> data   /var/lib/postgresql/9.4/main

$ sudo systemctl restart postgresql.service
$ sudo service postgresql status
```

初次安装会默认生成
--

```
Linux 系统用户: postgres  # 没有密码
数据库:         postgres
数据库用户:     postgres  # 数据库的 superuser，用 postgres 系统用户登录时不需要密码
postgres=# ALTER USER postgres PASSWORD 'newPassword'; # 修改密码从而允许客户端链接
```

配置文件
--

```bash
$ sudo vim /etc/postgresql/9.4/main/postgresql.conf
>>> listen_addresses = '*'  # 监听任意地址
>>> password_encryption = on  ＃ 启用密码验证

$ sudo vim /etc/postgresql/9.4/main/pg_hba.conf # 在末尾添加
>>> # to allow your client visiting postgresql server
>>> host    all    all    0.0.0.0 0.0.0.0    md5
```

命令
--

    $ psql -U username -d dbname
    
    =#create role user_1;  # 默认没有 Login 权限
    =#create user user_2;
    =#alter user user_1 with login;

    =#\l                        # 列表所有数据库，不管你当前在哪个数据库
    =#\du                       # 列表所有用户
    =#select * from pg_roles;   # 列表所有角色，不管你当前在哪
    
    postgres=#\c dbname    # 切换数据库
    dbname=#
    
    =#select current_database();
    =#select current_user;
    =#\conninfo                     # 当前链接信息

    =#\dt         # 列举表
    =#\d tblname  # 查看表结构
    =#\di         # 查看索引 

    创建表 
    create table ([字段名1] [类型1] <references 关联表名(关联的字段名)>;,
                  [字段名2] [类型2],......<,primary key (字段名m,字段名n,...)>;); 

    \encoding [字元编码名称]  # 显示或设定用户端字元编码
    \password [USERNAME]
    \q                        # 退出 psql

    =#\CREATE USER  WITH SUPERUSER CREATEDB PASSWORD '$PASSWORD';

```
=# CREATE USER {username} WITH PASSWORD '{password}';
=# ALTER USER {username} WITH PASSWORD '{new-password}';
    
=# GRANT CONNECT ON DATABASE {database} TO {username};
=# \c {database}  # 切换数据库
=# ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO {username};
=# GRANT USAGE ON SCHEMA public to {username}; 
=# GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO {username};
=# GRANT SELECT ON ALL TABLES IN SCHEMA public TO {username};
=# REASSIGN OWNED BY {username} TO postgres;
=# DROP OWNED BY {username};
=# DROP ROLE {username};
```

    ＃ 备份数据库
    CREATE DATABASE {backup} WITH OWNER={owner} TEMPLATE={original};

1. [8+1 ways to take backup in postgresql](http://www.brownfort.com/2014/10/backup-restore-postgresql/)
