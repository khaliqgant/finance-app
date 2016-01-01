import tornado
from tornado.httpclient import HTTPClient, HTTPRequest
import tornado.options
import json
import logging
from os import listdir
from os.path import isfile, join


http_client = HTTPClient()

DEFAULT_BATCH_SIZE = 500
DEFAULT_ES_URL = "http://localhost:9200"
DEFAULT_INDEX_NAME = "finances"


""" Create basic schema mapping to put onto ES """
def create_index():

    with open('schema.json', 'r') as s:
        body = json.dumps(json.load(s))
    url = "%s/%s" % (tornado.options.options.es_url, tornado.options.options.index_name)
    try:
        request = HTTPRequest(url, method="PUT", body=body, request_timeout=240)
        response = http_client.fetch(request)
        logging.info('Create index done   %s' % response.body)
    except (RuntimeError, TypeError, NameError):
        pass

if __name__ == '__main__':
    tornado.options.define("es_url", type=str, default=DEFAULT_ES_URL,
                           help="URL of your Elasticsearch node")

    tornado.options.define("index_name", type=str, default=DEFAULT_INDEX_NAME,
                           help="Name of the index to store your messages")

    tornado.options.define("num_of_shards", type=int, default=2,
                           help="Number of shards for ES index")

    # create_index()
    upload_data()

