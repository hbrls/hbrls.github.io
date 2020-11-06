FROM apache/airflow:1.10.11-python3.7

USER 0

RUN apt-get update && apt-get install -y --no-install-recommends supervisor && \
    apt-get autoremove -yqq --purge && apt-get clean  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/supervisor && chown -R 50000:50000 /var/log/supervisor

ENV PYTHONPATH="/home/airflow/.local/lib/python3.7/site-packages"

# USER 50000

ENTRYPOINT []
CMD ["/usr/bin/supervisord", "--nodaemon"]

