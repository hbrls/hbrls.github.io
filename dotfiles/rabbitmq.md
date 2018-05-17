Debian 8
==

[https://www.rabbitmq.com/install-debian.html](https://www.rabbitmq.com/install-debian.html)

Erlang
==

[https://packages.erlang-solutions.com/erlang/](https://packages.erlang-solutions.com/erlang/)

锁一下 erlang 的版本

```
# /etc/apt/preferences.d/erlang
Package: erlang*
Pin: version 1:20.1-1
Pin-Priority: 1000

Package: esl-erlang
Pin: version 1:20.1.7
Pin-Priority: 1000
```

```bash
$ echo "deb https://packages.erlang-solutions.com/debian jessie contrib" > /etc/apt/sources.list.d/erlang.list
$ wget https://packages.erlang-solutions.com/debian/erlang_solutions.asc
$ sudo apt-key add erlang_solutions.asc
$ sudo apt-get install erlang
```

Rabbitmq
==

```bash
$ echo "deb https://dl.bintray.com/rabbitmq/debian jessie main" | sudo tee /etc/apt/sources.list.d/bintray.rabbitmq.list
$ wget -O- https://dl.bintray.com/rabbitmq/Keys/rabbitmq-release-signing-key.asc | sudo apt-key add -
$ sudo apt-get install rabbitmq-server
$ sudo service rabbitmq-server start
$ sudo service rabbitmq-server restart
```

Rabbitmq Management
==

```bash
$ sudo rabbitmq-plugins enable rabbitmq_management
$ sudo rabbitmqctl add_user admin {password}
$ sudo rabbitmqctl set_user_tags admin administrator
```
