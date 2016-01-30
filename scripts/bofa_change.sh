#!/bin/sh

# 1 = 'data"'

grep -rl 'bofa"' data | xargs sed -i.bak 's/bofa\"/bofa_travel\"/g'
rm data/*.bak


