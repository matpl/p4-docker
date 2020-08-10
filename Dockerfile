FROM ambakshi/perforce-server
COPY src /depot/main
COPY wawa.sh /
CMD ["/wawa.sh"]