#!/bin/bash
. venv/bin/activate

export SSH_AUTH_SOCK=$( ls /tmp/*/Listeners )

present=${PWD##*/}
path=$(pwd -P)
root="${path/$present/}"

# grab the latest data and update
rsync -r khaliqgant:/home/kjg/finances/data/ $root/data -v

# delete the old index, start fresh
curl -XDELETE localhost:9200/finances
python index.py --init
# give it some time to index
sleep 2
python query.py
