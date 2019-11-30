CoreOS
==

    $ sudo hostnamectl set-hostname {hostname}
    $ cat /etc/coreos/update.conf
    $ cat /etc/os-release

    $ echo 'ssh-rsa AAAAB3Nza.......  key@host' | update-ssh-keys -a {name}
    
    $ sudo systemctl start docker.service
    $ sudo systemctl enable docker.service

    # https://github.com/coreos/coreos-vagrant/issues/36
    $ sudo systemctl restart ntpd
    
    # /etc/systemd/system/backup_postgres.service
    [Unit]
    Description=Backup of Postgres

    [Service]
    ExecStart=/usr/bin/docker exec postgres /var/backups/scripts/dump_db.sh

    [Install]
    WantedBy=local.target

    # /etc/systemd/system/backup_postgres.timer
    [Unit]
    Description=Runs Postgres backup every 1 hour

    [Timer]
    OnCalendar=*-*-* *:00:00
    Persistent=true

    [Install]
    WantedBy=local.target
    
    $ sudo systemctl enable backup_postgres.service
    $ sudo systemctl enable backup_postgres.timer
    $ sudo systemctl start backup_postgres.timer
    $ journalctl -f -u backup_postgres.service
    
    $ sudo systemctl reset-failed

Docker Compose
==

[Installing Docker Compose in CoreOS](http://www.ericluwj.com/2015/10/20/installing-docker-compose-in-coreos.html)

```
$ sudo mkdir -p /opt/bin
$ sudo chown -R core:core /opt/bin
$ curl -L https://github.com/docker/compose/releases/download/1.9.0/docker-compose-`uname -s`-`uname -m` > /opt/bin/docker-compose
$ chmod +x /opt/bin/docker-compose
```

[Enabling Swap on CoreOS](https://www.matthowlett.com/notes/2015/08/01/coreos-swap.html)

[Customizing docker](https://coreos.com/os/docs/latest/customizing-docker.html)

中国特色的 CoreOS 升级
==

1. 创建一个配置文件 /etc/systemd/system/update-engine.service.d/proxy.conf，内容为：

        [Service]
        Environment=ALL_PROXY=http://your.proxy.address:port

2. 手动升级

        $ sudo systemctl restart update-engine
        $ update_engine_client -update
        $ journalctl -f -u update-engine

阿里云 Bug
==

1. https://github.com/coreos/bugs/issues/2340

    ```bash
    $ vim /run/systemd/system/docker.service  # 注释掉 #Environment=DOCKER_SELINUX=--selinux-enabled=true
    $ systemctl daemon-reload  # 然后reload一下配置文件
    $ systemctl restart docker  # 重启docker 即可
    ```

Debian
==

[The Complete Guide to “useradd” Command in Linux](http://www.tecmint.com/add-users-in-linux/)

```bash
# locale-gen en_US.UTF-8 && locale-gen zh_CN.UTF-8 && update-locale LANG=en_US.UTF-8
# apt install git build-essential cron htop logrotate lsb-release man sgml-base software-properties-common ssl-cert unzip xml-core libxml2 zsh
# useradd core
# mkdir -p /home/core
# chown -R core:core /home/core
# adduser core sudo
# passwd core
# chsh -s /usr/bin/zsh core
$ lsb_release -a
$ ssh-keygen -t rsa -C "core@hostname.lisitede.com"
```

[Oh-My-Zsh](https://github.com/robbyrussell/oh-my-zsh)

```bash
$ vim ~/.oh-my-zsh/themes/robbyrussell.withhost.zsh-theme

local ret_status="%(?:%{$fg_bold[green]%}➜ :%{$fg_bold[red]%}➜ )"
PROMPT='%{$fg_bold[green]%}%n@%M ${ret_status} %{$fg[cyan]%}%c%{$reset_color%} $(git_prompt_info)'

ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[blue]%}git:(%{$fg[red]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%} "
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[blue]%}) %{$fg[yellow]%}✗"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[blue]%})"
```

[Get Docker CE for Debian](https://docs.docker.com/install/linux/docker-ce/debian/)

```bash
$ sudo apt-get install apt-transport-https ca-certificates curl gnupg2 software-properties-common
$ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
$ sudo usermod -aG docker core
```

[Install Docker Compose](https://docs.docker.com/compose/install/)

```bash
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```
[youtube-dl](https://github.com/ytdl-org/youtube-dl)

```bash
$ sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
$ sudo chmod a+rx /usr/local/bin/youtube-dl
```

MySQL
==

[Installing MySQL 5.7 on Debian 9](https://www.globo.tech/learning-center/install-mysql-5-7-debian-9/)

[Reset a MySQL root password](https://support.rackspace.com/how-to/mysql-resetting-a-lost-mysql-root-password/)

```bash
$ sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```

```mysql
> CREATE DATABASE {database} CHARACTER SET utf8 COLLATE utf8_general_ci;
>
> CREATE USER '{username}'@'%' IDENTIFIED BY '{password}';
> GRANT ALL PRIVILEGES ON {database}.* TO '{username}'@'%';
> FLUSH PRIVILEGES;
```
