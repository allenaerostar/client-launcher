"""
This tool calls the Github API retrieve a list of pull requests and iterates through
them looking for the "PATCHNOTES:" keyword.
"""
import argparse
import logging
import requests
import json

from datetime import datetime
from datetime import timedelta

logger = logging.getLogger(__name__)

parser = argparse.ArgumentParser(description='Retrieves patchnotes from Github pull requests.')
parser.add_argument('--state', default='closed',
                    help='State that pull requsts should be in eg. (open, closed etc).')
parser.add_argument('--startdate', default='',
                    help='Earliest date for pull requests that the script '
                    'should scrape patchnotes from in the format "MM-DD-YY", eg. "01-15-20.')
parser.add_argument('--enddate', default='',
                    help='Latest date for pull requests that the script '
                    'should scrape patchnotes from in the format "MM-DD-YY", eg. "01-15-20.')
parser.add_argument('--keyword', default='PATCHNOTES:',
                    help='Keyword to parse pull requests for.')

args = parser.parse_args()

if len(args.startdate) != 0:
    try:
        START_DATE = datetime.strptime(args.startdate, '%m-%d-%y')
    except:
        raise ValueError("Unable to parse given start date. Please enter the date "
              "using the format '%m-%d-%y' eg. 01-02-20.")
else:
    START_DATE = datetime.today() - timedelta(days=7)

if len(args.enddate) !=0:
    try:
        END_DATE = datetime.strptime(args.enddate, '%m-%d-%y')
    except:
        raise ValueError("Unable to parse given end date. Please enter the date "
              "using the format '%m-%d-%y' eg. 01-02-20.")
else:
    END_DATE = datetime.today()

if (START_DATE > END_DATE):
    raise ValueError("Start date must be before the end date.")
        
KEYWORD = args.keyword

CLIENT_LAUNCHER_GITHUB_URL = "https://api.github.com/repos/allenaerostar/client-launcher/pulls"
DIESTORY_SERVER_GITHUB_URL =  "https://api.github.com/repos/BenjixD/MapleSolaxiaV2/pulls"

PARAMS = {"state" : args.state}

def retrieve_patchnotes(github_url):
    r = requests.get(url = github_url, params = PARAMS)

    data = r.json()

    for pull_request in data:
        # We take the first 10 characters so the date format is in %YYYY-%MM-%DD.
        closed_date = datetime.strptime(pull_request["closed_at"][:10], "%Y-%m-%d")
        idx = pull_request["body"].find(KEYWORD)
        if (idx != -1 and START_DATE <= closed_date and closed_date <= END_DATE):
            print("_________________________")
            print(pull_request["body"][idx:])

if __name__ == "__main__":
    print("Retrieving patchnotes between {} and {}".format(START_DATE, END_DATE))
    print("Looking for keyword: {}".format(KEYWORD))

    print("Retrieving patchnotes for the client launcher...")
    retrieve_patchnotes(CLIENT_LAUNCHER_GITHUB_URL)

    print("Retrieving patchnotes for the Dietstory server...")
    retrieve_patchnotes(DIESTORY_SERVER_GITHUB_URL)
