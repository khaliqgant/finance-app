#!/bin/sh

files=$(find data -type f -name "[0-9][0-9][0-9][0-9]_[0-9][0-9].json" -depth 1)
for file in $files
do
    echo $file
done
