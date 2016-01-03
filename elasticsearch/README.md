# Elasticsearch Analysis
ES aggregations on personal financial data

## Background
* This was inspired by [elasticsearch-gmail](https://github.com/oliver006/elasticsearch-gmail)
and a good bit of code structure and logic was taken from there
* The [Tornado library](https://github.com/tornadoweb/tornado/) is used pretty heavily
to parse command line arguments and for making and constructing HTTP requests

## Usage
* To get started you need to spin up an ES Vagrant box.
* Then from this directory start up a virtual environment by running
```
virtualenv venv
. venv/bin/activate
```
* Then install the dependencies via pip
```
pip install tornado
pip install chardet
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
