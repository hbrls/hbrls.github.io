CoreOS
==

    $ sudo hostnamectl set-hostname {hostname}

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

[Installing Docker Compose in CoreOS](http://www.ericluwj.com/2015/10/20/installing-docker-compose-in-coreos.html)

[Enabling Swap on CoreOS](https://www.matthowlett.com/notes/2015/08/01/coreos-swap.html)

中国特色的 CoreOS 升级
==

1. 创建一个配置文件 /etc/systemd/system/update-engine.service.d/proxy.conf，内容为：

        [Service]
        Environment=ALL_PROXY=http://your.proxy.address:port

2. 手动升级

        $ sudo systemctl restart update-engine
        $ update_engine_client -update
        $ journalctl -f -u update-engine

Docker
=====
    
    $ sudo sh -c "echo deb https://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list"
    $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
    $ sudo apt-get install lxc-docker
    $ sudo usermod -aG docker $USER  # 允许当前用户使用，否则要加 sudo
    
    $ sudo vim /etc/default/docker
    DOCKER_OPTS="--host tcp://0.0.0.0:2376 --host unix:///var/run/docker.sock -d"
    
    $ docker login
    
    $ docker stats container_name
