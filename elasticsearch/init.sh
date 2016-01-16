#!/bin/bash
. venv/bin/activate

present=${PWD##*/}
path=$(pwd -P)
root="${path/$present/}"

# grab the latest data and update
sshpass -f $root"auth/.pass" rsync -r khaliqgant:/home/kjg/finances/data $root -v

# delete the old index, start fresh
curl -XDELETE localhost:9200/finances
python index.py --init
# give it some time to index
sleep 2
python query.py
