# Elasticsearch Analysis
ES aggregations on personal financial data

## Background
* This was inspired by [elasticsearch-gmail](https://github.com/oliver006/elasticsearch-gmail)
and a good bit of code structure and logic was taken from there
* The [Tornado library](https://github.com/tornadoweb/tornado/) is used pretty heavily
to parse command line arguments and for making and constructing HTTP requests
* At first glance it might seem like overkill to to use elasticsearch to run some simple
mathematical analysis on my personal financial data, and I agree. However,
my plan is to use this ES set up for more than just financial data later and use it
for other data coming from different APIS (fitbit, lastfm, foursquare etc) and
just extend this setup for those APIS

## Usage
* To get started you need to spin up an ES Vagrant box.
* Then from this directory start up a virtual environment by running
```
virtualenv venv
. venv/bin/activate
```
* Then install the dependencies via pip which are recorded in the requirements.txt file
```
pip install -r requirements.txt
```
* Now create an index and also upload data by running
```
python index.py --init
```
* If the schema has already been uploaded you can just run
```
python index.py
```
and that will just upload the data files located in the "data" directory

## Querying
* Now that data is sitting in ES, to run analysis [Elasticsearch DSL](http://elasticsearch-dsl.readthedocs.org/en/latest/)
which is a "high-level library" sitting on top of [Python Elasticsearch Client](https://elasticsearch-py.readthedocs.org/en/master/)

## Process
* A cron job is set up to run at 7 every 15th of the month:
```
0 19 15 * * cd~/Sites/finance-app/elasticsearh && ./worker > ../logs/cron.log 2&1
```
* This spins up the elasticsearch server, calls the python script and runs the
aggregations which get output to a file, then uploaded to the server. All this
is orchestrated via a C program `worker.c`. After that is complete the elastcsearch
server is shut down
