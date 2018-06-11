FROM java:openjdk-7-jre
MAINTAINER Justin Plock <justin@plock.net>

RUN mkdir -p /opt/snowizard /var/log/snowizard
# RUN wget -q -O /opt/snowizard/snowizard.jar http://repo.maven.apache.org/maven2/com/ge/snowizard/snowizard-application/1.7.0/snowizard-application-1.7.0.jar
COPY snowizard-application-1.7.0.jar /opt/snowizard/snowizard.jar

# ADD ./snowizard-application/snowizard.upstart /etc/init/snowizard.conf
# ADD ./snowizard-application/snowizard.yml /etc/snowizard.yml
# ADD ./snowizard-application/snowizard.jvm.conf /etc/snowizard.jvm.conf
COPY ./snowizard.conf /etc/init/snowizard.conf
COPY ./snowizard.yml /etc/snowizard.yml
COPY ./snowizard.jvm.conf /etc/snowizard.jvm.conf

ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

# Snowizard port
EXPOSE 8080
# Administration port
EXPOSE 8180

WORKDIR /opt/snowizard

ENTRYPOINT ["java", "-d64", "-server", "-jar", "snowizard.jar"]
CMD ["server", "/etc/snowizard.yml"]
