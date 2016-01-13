import json
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from elasticsearch_dsl.connections import connections
connections.create_connection(hosts=['localhost:9200'], timeout=20)

from helpers import files

""" Run ES aggregations on finance data """
def run_aggregations():
# http://elasticsearch-dsl.readthedocs.org/en/latest/search_dsl.html
    client = Elasticsearch()
    s = Search(using=client, index="finances")

    structure = files.cc_structure()

    average_agg(s, structure)
    stats_agg(s, structure)


def make_file(data, file_name):
    # write this json to a file now
    path = "../data/analysis/"
    write_file = path + file_name
    with open(write_file, 'w') as output_file:
        json.dump(data, output_file)
        print "aggregations written to ", file_name


def average_agg(s, structure):
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
    make_file(averages, "averages.json")


def stats_agg(s, structure):
    stats = {}
    for card_type, arr in structure.iteritems():
        stats[card_type] = {}
        for card, amount in arr.iteritems():
            stats[card_type][card] = {}
            s.aggs.bucket('cc_stats', 'nested', path=card_type)\
                .metric('stats', 'stats', field=card_type + "." + card)
            response = s.execute()
            if response.success():
                # round off the stats value
                for key, value in response.aggregations.cc_stats.stats.to_dict().iteritems():
                    stats[card_type][card][key] = "%.2f" % value
            else:
                print('aggregations failed %s', response.to_dict())
    make_file(stats, "stats.json")


if __name__ == '__main__':
    run_aggregations()
