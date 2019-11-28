FROM openjdk:11-jdk-slim

RUN apt-get update --fix-missing && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get -y autoremove && apt-get -y clean && \
    mkdir /home/visjo

COPY docker/visjo-ini.sh /home/

RUN cd /home/ && \
    chmod +x /home/visjo-ini.sh

CMD ["home/visjo-ini.sh"]
