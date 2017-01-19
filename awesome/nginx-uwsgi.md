安装 Nginx
==========

    # 添加源
    deb http://nginx.org/packages/debian/ wheezy nginx
    deb-src http://nginx.org/packages/debian/ wheezy nginx
    $ sudo apt-get install nginx

####安装uWSGI

    $ sudo pip install uwsgi

    # 使用 Apache 默认的 www-data:www-data
    $ sudo chown -R www-data:www-data /var/deploy
    $ sudo chown -R www-data:www-data /var/log/uwsgi
    $ sudo /usr/sbin/usermod -a -G www-data admin   # FIXME: 仅为了管理方便

####/etc/nginx/nginx.conf

    user  www-data;  # 和网站有关的目录都设给www-data了，默认的nginx可能没权限

    http {
        server_tokens  off;  # 关闭发生错误时显示版本号
        
        gzip_min_length    1k;
        gzip_buffers       16 64k;
        gzip_http_version  1.1;
        gzip_comp_level    5;
        gzip_types         text/plain text/css application/json application/javascript application/x-javascript text/javascript text/xml application/xml application/rss+xml application/atom+xml application/rdf+xml;  # 使用压缩好的图片
        gzip_vary on;
    }

####/etc/nginx/conf.d/apache.conf

    server {
        listen       80;
        server_name  apache.42smart.com;
    
        #charset koi8-r;
        #access_log  /var/log/nginx/log/host.access.log  main;
    
        location / {
            proxy_set_header X-Real-IP  $remote_addr;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host $host;
            proxy_pass http://127.0.0.1:8080;
        }
    
        #error_page  404              /404.html;
    
        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    
        # deny access to .htaccess file
        location ~ /\.ht {
            deny  all;
        }
    }

####/etc/nginx/conf.d/bbs.42smart.com.conf

    server {
        listen       80;
        server_name  bbs.42smart.com;
    
        #charset koi8-r;
        access_log  /var/log/nginx/bbs.42smart.com/access.log  main;
        
        set $maintenance on;
        if ($maintenance = on) {
            return 503;
        }
        error_page 503 @maintenance;
        location @maintenance {
            root /var/www/maintenance;
            rewrite ^(.*\.png)$ /$1 break;
            rewrite ^(.*)$ /maintenance.html break;
        }

        location /static {
            alias  /var/deploy/bbs.42smart.com/appl/static;
        }
    
        location /favicon.ico {
            alias  /var/deploy/bbs.42smart.com/appl/static/favicon.ico;
        }
    
        location /robots.txt {
            alias  /var/deploy/bbs.42smart.com/appl/static/robots.txt;
        }

        location / {
            uwsgi_pass unix:///tmp/uwsgi/bbs.42smart.com.sock;
            include uwsgi_params;
        }
    
        #error_page  404              /404.html;
    
        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }

####用yaml方式配置uwsgi

    uwsgi:
        pythonpath : /var/deploy/bbs.42smart.com/
        module : wsgi
        callable : flaskbb
        socket : /tmp/uwsgi/bbs.42smart.com.sock
        venv: /var/deploy/bbs.42smart.com/ENV
        processes : 1
        master : 1
        # uid: www-data
        # gid: www-data
        chmod-socket : 666
        # daemonize : /var/log/uwsgi/bbs.42smart.com.log
        logto: /var/log/uwsgi/bbs.42smart.com.log
        log-maxsize: 1000000
        pidfile : /var/deploy/pid/bbs.42smart.com.pid
        touch-reload : /var/deploy/bbs.42smart.com/touchreload.txt
        if-not-dir: /tmp/uwsgi/
        hook-asap: mkdir:/tmp/uwsgi
        end-if:

    # 启动
    $ uwsgi -y /var/deploy/bbs.42smart.com/uwsgiconfig.yaml
    # 关闭
    $ uwsgi --stop /var/deploy/pid/bbs.42smart.com.pid

####Nginx 日志

    log_format    <format_name>    <format>
    access_log    <path>           <format_name>
    
    # $remote_addr        客户端的请求的地址（如果有反向代理，用$http_x_forwarded_for） 
    # $remote_user        客户端用户名称
    # $time_local         访问时间与时区
    # $request            请求的url与http协议
    # $status             请求状态，成功是200
    # $body_bytes_sent    发送给客户端文件主体内容大小
    # $http_referer       从哪个页面链接访问过来的
    # $http_user_agent    客户端浏览器的相关信息
    
####日志

    uwsgi        logto       /var/log/uwsgi/bbs.42smart.com.log             # python logging
    supervisord  stdout      /var/log/supervisor/bbs.42smart.com.log
                 stderr      /var/log/supervisor/bbs.42smart.com.error.log
    nginx        access_log  /var/log/nginx/bbs.42smart.com/access.log;
                 error_log   /var/log/nginx/error.log warn;                 # /etc/nginx/nginx.conf

####Nginx 性能调优

    1. 1 worker per cpu core
    2. keepalive_timeout 是默认开启的，75s
    3. 性能瓶颈一般有3个地方，CPU，Memory，IO，对于Nginx只可能出现在IO
    4. ? open_file_cache, client_body_buffer_size, proxy_buffer

####Nginx 支持 https

    $ openssl genrsa -des3 -out server.key 2048
    $ openssl req -new -key server.key -out server.csr
    $ cp server.key server.key.org
    $ openssl rsa -in server.key.org -out server.key
    $ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
    
    server {
        listen   443 ssl;
        ssl                   on;
        ssl_certificate       /etc/nginx/s/server.crt;
        ssl_certificate_key   /etc/nginx/s/server.key;
    }
