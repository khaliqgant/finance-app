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

DATAS=(
    'cash'
    'closing_dates'
    'due_dates'
    'links'
    'notes'
)

for data in "${DATAS[@]}"
do
    files=$(find data/$data -type f -name "[0-9][0-9]_[0-9][0-9][0-9][0-9].json" -depth 1)
    for file in $files
    do
        parsed="${file#data/$data/*}"
        month="${parsed%%_*}"
        year_only=${parsed%%.json*}
        year="${year_only#*_}"
        mv $file data/$data/$year$under$month.json
    done
done

for i in 1 2 3 4 5
do
    grep -rl "[0-9][0-9]_[0-9][0-9][0-9][0-9]" data | xargs sed -i.bak 's/^\(.*\)\([a-z_]*\/\)\([0-9][0-9]\)\(\_\)\([0-9]*\)\(\.[a-z]*\)\(.*\)/\1\2\5\4\3\6\7/g'
    rm data/*.bak
done

#cron in mac
#https://discussions.apple.com/thread/5750011?tstart=0
# http://stackoverflow.com/questions/19460102/sed-switch-the-order-of-first-and-last-word
