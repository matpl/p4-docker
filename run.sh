#!/bin/bash

p4dctl start p4depot
sleep 2
exec /usr/bin/tail --pid=$(cat /var/run/p4d.p4depot.pid) -F "/depot/logs/log"