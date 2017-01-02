---
layout: post
category: webapp
tags: [docker]
title: Docker试上手
---

制作一个名为`hbrls/pyapp`的基础`image`，没有安全信息，可以上传到 [Official Hub](https://registry.hub.docker.com/) 和别人分享。它有版本号，可以更改，更改即说明*设计*发生了变化。

    $ sudo docker build -t hbrls/pyapp:0.2 .

最初的时候使用了`ENTRYPOINT`，用得很纠结。只有当你非常确定自己需要的只是一个*binary*的时候才可以用`ENTRYPOINT`，比如`goagent`，比如`tutum:mysql`；但凡有可能做改动的，还是用`CMD`更自由。


对于一个具体的项目`probe.42smart.com`，基于`hbrls/pyapp`，输入项目配置等，在`VPS`上生成一个名为`probe.42smart.com:latest`的`image`，实际负责拉代码及上线。

    (VPS)$ sudo docker pull hbrls/pyapp:0.2
    (VPS)$ sudo docker build -t probe.42smart.com:latest .  # 由于没有namespace，是不可能传到Hub上去的

<!--more-->

在数据库方面研究了一下`ambassador`，感觉是为集群和迁移准备的，目前我的目的只是虚拟化，暂时用不到，所以选了 [tutum/mysql:5.5](https://github.com/tutumcloud/tutum-docker-mysql)。直接用，不自行配置了。

    (VPS)$ sudo rm -rf /var/lib/mysql  # 清空旧数据，使用tutum提供的admin帐号
    (VPS)$ sudo docker run -it --rm \
                           --name mysql_probe \
                           -v /var/lib/mysql:/var/lib/mysql \
                           -e MYSQL_PASS=@dm1n \
                           tutum/mysql:5.5 /bin/bash  # 直接用原CMD的话退不出来
    root@container:/# ./run.sh &  # 放到后台去运行，始终保持对命令行的控制
    root@container:/# exit
    
用Host上的mysql-client连上去处理数据结构和用户，用完之后强关，下次要用再开：

    (VPS)$ sudo docker run -d \
                           --name mysql_admin \
                           -v /var/lib/mysql:/var/lib/mysql \
                           tutum/mysql:5.5
    (VPS)$ sudo docker inspect mysql_admin
    (VPS)$ mysql -h <mysql_admin_ip> -uadmin -p@dm1n
    mysql > CREATE DATABASE probe;
          > GRANT ALL PRIVILEGES ON probe.* TO 'probe'@'%' IDENTIFIED BY 'probe';
    (VPS)$ sudo docker rm -f mysql_admin

启动一个真的提供给app用的`container`。

    (VPS)$ sudo docker run -d \
                           --name mysql_probe \
                           -v /var/lib/mysql:/var/lib/mysql \
                           tutum/mysql:5.5

跑起来看看效果，一切正常

    (VPS)$ sudo docker run -it --rm \
                           -v /var/log/uwsgi/probe.42smart.com:/var/www/log \
                           -v /tmp/uwsgi:/tmp/uwsgi \
                           -v /var/www/probe.42smart.com:/var/www/share \
                           --link mysql_probe:mysql \
                           -e APP_BRANCH=alpha \
                           -e APP_MYSQL_USER=probe \
                           -e APP_MYSQL_PASS=probe \
                           probe.42smart.com:latest /bin/bash
    (container)# /var/www/run.sh

正式部署

    (VPS)$ sudo docker run -d \
                           --name probe_alpha \
                           -v /var/log/uwsgi/probe.42smart.com:/var/www/log \
                           -v /tmp/uwsgi:/tmp/uwsgi \
                           --name probe_alpha_1 \
                           probe.42smart.com:latest

用上Fabric等管理工具之后，命令就更简单清晰了：

    (VPS)$ fab probe.build
    (VPS)$ fab probe.deploy:alpha
    
###遗留问题：

1. `container`集群化，随便copy到哪里都能立刻用
2. `image`和`container`是1对多关系，当`image`发生变动的时候，相应的`container`全部要重做

###参考文献：

1. [Docker —— 从入门到实践](http://yeasy.gitbooks.io/docker_practice/)
