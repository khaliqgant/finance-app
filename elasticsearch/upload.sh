#!/bin/bash

# expose the ssh agent env variable
export SSH_AUTH_SOCK=$( ls /tmp/*/Listeners )

present=${PWD##*/}
path=$(pwd -P)
root="${path/$present/}"

rsync -avz -e ssh $root"data/analysis" khaliqgant:/home/kjg/finances/data/ -v
echo $(date "+%X %m-%d") es index and backup successful >> ../logs/es.log
