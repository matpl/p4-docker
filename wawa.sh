#!/usr/bin/with-contenv bash

set -e

bash /usr/local/bin/setup-perforce.sh

sleep 2

p4 client > /dev/null 2>&1
p4 configure set security=0
p4 user -f guest > /dev/null 2>&1
echo "$(cat permissions.txt)" | p4 group -i

find /depot -type f -print | p4 -x - add

p4 submit -d "first commit"

p4 integrate //depot/main/... //depot/beta/...
p4 submit -d "branch to beta"

sleep 2

exec /usr/bin/tail --pid=$(cat /var/run/p4d.$NAME.pid) -F "$DATAVOLUME/$NAME/logs/log"