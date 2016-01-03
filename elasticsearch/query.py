import logging
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
    for card_type, arr in structure.iteritems():
        for card, amount in arr.iteritems():
            s.aggs.bucket('cc_average', 'nested', path=card_type)\
                .metric('average', 'avg', field=card_type + "." + card)
            # print(s.to_dict())
            response = s.execute()
            if response.success():
                aggs = response.aggregations
                print(response.aggregations)
            else:
                logging.info('aggregations failed %s', response.to_dict())


if __name__ == '__main__':
    run_aggregations()
