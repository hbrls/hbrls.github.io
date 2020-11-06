FROM node:12.16-alpine

RUN apk add --update py-gevent supervisor && rm -rf /var/cache/apk/* && \
    sed -i 's/^\(\[supervisord\]\)$/\1\nnodaemon=true/' /etc/supervisord.conf && \
    mkdir -p /var/log/supervisor && \
    mkdir -p /var/app

COPY index.js /var/app/index.js
COPY package.json /var/app/package.json
COPY app.ini /etc/supervisor.d/app.ini

RUN cd /var/app && npm install --no-optional --no-package-lock

WORKDIR /var/app
EXPOSE 57386

ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
