安装
====

1. 参考Dockerfile

2. 初次安装默认生成

        Linux 系统用户: postgres  # 没有密码
        数据库:         postgres
        数据库用户:     postgres  # 数据库的 superuser，用 postgres 系统用户登录时不需要密码

数据库配置文件
==============

    $ sudo vim /etc/postgresql/9.1/main/postgresql.conf
    
    listen_addresses = '*'  # 监听任意地址
    password_encryption = on  ＃ 启用密码验证

    $ sudo vim /etc/postgresql/9.1/main/pg_hba.conf
    在末尾添加
    # to allow your client visiting postgresql server
    host    all    all    0.0.0.0 0.0.0.0    md5

命令
====

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
    
    =#\CREATE USER $USER WITH SUPERUSER CREATEDB PASSWORD '$PASSWORD';
    
    ＃ 备份数据库
    CREATE DATABASE {backup} WITH OWNER={owner} TEMPLATE={original};

1. [8+1 ways to take backup in postgresql](http://www.brownfort.com/2014/10/backup-restore-postgresql/)
