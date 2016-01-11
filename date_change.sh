#!/bin/sh

files=$(find data -type f -name "[0-9][0-9]_[0-9][0-9][0-9][0-9].json" -depth 1)
under="_"
for file in $files
do
    parsed="${file#data/*}"
    month="${parsed%%_*}"
    year_only=${parsed%%.json*}
    year="${year_only#*_}"
    mv $file data/$year$under$month.json
done

#elasticsearch --config=/usr/local/opt/elasticsearch/config/elasticsearch.yml
