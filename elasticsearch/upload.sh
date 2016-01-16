#!/bin/bash
present=${PWD##*/}
path=$(pwd -P)
root="${path/$present/}"

sshpass -f $root"auth/.pass" rsync -avz $root"data/analysis" khaliqgant:/home/kjg/finances/data/ -v
