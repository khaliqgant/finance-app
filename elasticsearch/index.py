import tornado
from tornado.httpclient import HTTPClient, HTTPRequest
import tornado.options
import json
import logging
from os import listdir
from os.path import isfile, join

from helpers import files


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
        logging.info('Create index done %s' % response.body)
    except (RuntimeError, TypeError, NameError):
        pass

""" Iterate through to pay data to upload to es """
def upload_data():
    key_name = "to_pay"
    path = "../data"

    data_files = files.grab_files()
    for data in data_files:
        # set the path of the data file
        data_file = path + "/" + data
        with open(data_file, 'r') as f:
            dat = json.load(f)
            to_pay = dat[key_name]["credit_cards"]
            compiled = {}
            for card_type, arr in to_pay.iteritems():
                # set dict for the type of card
                compiled[card_type] = {}
                for card, amount in arr.iteritems():
                    # parse out the amount as a float
                    compiled[card_type][card] = float(amount)
        # turn back into json string
        body = json.dumps(compiled)
        url = tornado.options.options.es_url + "/" + tornado.options.options.index_name + "/" + key_name + "/" + data
        request = HTTPRequest(url, method="PUT", body=body, request_timeout=240)
        response = http_client.fetch(request)
        result = json.loads(response.body)
        if "errors" in result:
            print("upload failed for " + data)
            print(result["errors"])
        else:
            logging.info('Uploaded data file %s' % data)


""" Test method to visualize the cc structure """
def test_files():
    data_files = files.cc_structure()
    print(data_files)


if __name__ == '__main__':
    tornado.options.define("es_url", type=str, default=DEFAULT_ES_URL,
                           help="URL of your Elasticsearch node")

    tornado.options.define("index_name", type=str, default=DEFAULT_INDEX_NAME,
                           help="Name of the index to store your messages")

    tornado.options.define("num_of_shards", type=int, default=2,
                           help="Number of shards for ES index")

    tornado.options.define("init", type=bool, default=False,
                           help="Upload schema data to es")

    tornado.options.parse_command_line()

    if (tornado.options.options.init):
        create_index()
    upload_data()
