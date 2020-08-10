FROM ambakshi/perforce-server
COPY src /depot/main
COPY wawa.sh permissions.txt /
CMD ["/wawa.sh"]