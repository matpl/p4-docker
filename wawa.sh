#!/bin/bash

p4dctl start p4depot
p4 client > /dev/null 2>&1
p4 configure set security=0
p4 user -f guest > /dev/null 2>&1
echo "$(cat /permissions.txt)" | p4 group -i

find /depot/main -type f -print | p4 -x - add

p4 submit -d "first commit"

p4 integrate //depot/main/... //depot/beta/...
p4 submit -d "branch to beta"