FROM openresty/openresty:1.13.6.1-alpine-fat

RUN apk --update --no-cache add nettle && \
    /usr/local/openresty/luajit/bin/luarocks install lua-resty-http && \
    /usr/local/openresty/luajit/bin/luarocks install lua-resty-nettle
