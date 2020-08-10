FROM ubuntu
RUN apt-get update && apt-get install -y gnupg2 && apt-get install wget -y
RUN wget -q http://package.perforce.com/perforce.pubkey -O- | apt-key add -
RUN echo "deb http://package.perforce.com/apt/ubuntu precise release" > /etc/apt/sources.list.d/perforce.sources.list
RUN cat /etc/apt/sources.list.d/perforce.sources.list
RUN apt-get update
RUN apt-get install helix-p4d -y
RUN /opt/perforce/sbin/configure-helix-p4d.sh p4depot -n -p 1666 -r /depot -u p4admin -P "gamecenter2020" --case 0
COPY src /depot/main
COPY wawa.sh permissions.txt run.sh /
RUN /wawa.sh
CMD /run.sh