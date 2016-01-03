import logging
import json
import os

from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from elasticsearch_dsl.connections import connections
connections.create_connection(hosts=['localhost:9200'], timeout=20)

from helpers import files


""" Run ES aggregations on finance data """
""" Docs: http://elasticsearch-dsl.readthedocs.org/en/latest/search_dsl.html """
def run_aggregations():
    client = Elasticsearch()
    s = Search(using=client, index="finances")

    structure = files.cc_structure()

    # store averages in a dict
    averages = {}
    for card_type, arr in structure.iteritems():
        averages[card_type] = {}
        for card, amount in arr.iteritems():
            s.aggs.bucket('cc_average', 'nested', path=card_type)\
                .metric('average', 'avg', field=card_type + "." + card)
            response = s.execute()
            if response.success():
                average = response.aggregations.cc_average.average.value
                averages[card_type][card] = "%.2f" % average
            else:
                print('aggregations failed %s', response.to_dict())

    # write this json to a file now
    path = "../data/analysis/"
    if not os.path.exists(path):
        os.makedirs(path)
    averages_file = path + "averages.json"
    with open(averages_file, 'w') as output_file:
        json.dump(averages, output_file)
        print "aggregations written to ", averages_file


if __name__ == '__main__':
    run_aggregations()
