import json
from os import listdir
from os.path import isfile, join

""" Filter out the junk files and return a list of the data files """
def grab_files():
    path = "../data"

    data_files = [f for f in listdir(path) if isfile(join(path, f))]
    files = []
    for data in data_files:
        if (data[0].isdigit()):
            files.append(data)

    return files

""" Grab the first file and return the credit_card structure as a dict """
def cc_structure():
    key_name = "to_pay"
    path = "../data"

    files = grab_files()
    # just grab the first file to get the structure
    data = files[0]
    data_file = path + "/" + data
    with open(data_file, 'r') as f:
        data = json.load(f)
        structure = data[key_name]["credit_cards"]

    return structure




