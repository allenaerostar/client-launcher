"""
This tool calls the Github API retrieve a list of pull requests and iterates through them
looking for the PATCHNOTES: keyword.
"""
import argparse
import requests
import json

from datetime import datetime
from datetime import timedelta

parser = argparse.ArgumentParser(description='Retrieves patchnotes from Github pullrequests.')
parser.add_argument('--state', default='closed')
parser.add_argument('--startdate', default='')
parser.add_argument('--enddate', default='')

args = parser.parse_args()

start_date = args.startdate if len(args.startdate) != 0 else  datetime.today() - timedelta(days=7)
end_date = args.enddate if len(args.enddate) != 0 else datetime.today()

CLIENT_LAUNCHER_GITHUB_URL = "https://api.github.com/repos/allenaerostar/client-launcher/pulls"
DIESTORY_SERVER_GITHUB_URL =  "https://api.github.com/repos/BenjixD/MapleSolaxiaV2/pulls"

PARAMS = {"state" : args.state}

def retrieve_patchnotes():
    r = requests.get(url = CLIENT_LAUNCHER_GITHUB_URL, params = PARAMS)

    data = r.json()

    for pull_request in data:
        print("_________________________")
        # We take the first 10 characters so the date format is in %YYYY-%MM-%DD.
        closed_date = datetime.strptime(pull_request["closed_at"][:10], "%Y-%m-%d")
        idx = pull_request["body"].find("PATCHNOTES:")
        idx = 1
        if (idx != -1 and start_date <= closed_date and closed_date <= end_date):
            print(pull_request["body"][idx:])
            
        print("__________________________")

if __name__ == "__main__":
    retrieve_patchnotes()
