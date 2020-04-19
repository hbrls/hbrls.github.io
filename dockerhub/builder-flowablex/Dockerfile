FROM maven:3.6.1-jdk-8-slim

RUN mkdir -p /var/app-builder
COPY pom.xml /var/app-builder/pom.xml

RUN cd /var/app-builder && mvn dependency:resolve
