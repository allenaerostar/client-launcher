"""
This tool calls the Github API retrieve a list of pull requests and iterates through them
looking for the PATCHNOTES: keyword.
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
                    help='Date that pull requests should be greater than or equal to.')
parser.add_argument('--enddate', default='',
                    help='Date that pull requests should be less than or equal to.')
parser.add_argument('--keyword', default='PATCHNOTES:',
                    help='Keyword to parse pull requests for.')

args = parser.parse_args()

if len(args.startdate) != 0:
    try:
        START_DATE = datetime.strptime(args.startdate, "%Y-%m-%d")
    except TypeError:
        logger.error("Invalid date: {}. Please enter date in the format 'YYYY-MM-DD', "
                     "using 1 week before as the start date instead.".
                     format(args.startdate))
        START_DATE = datetime.today() - timedelta(days=7)
else:
    START_DATE = datetime.today() - timedelta(days=7)

if len(args.enddate) != 0:
    try:
        END_DATE =  datetime.strptime(args.enddate, "%Y-%m-%d")
    except TypeError:
        logger.error("Invalid date: {}. Please enter date in the format 'YYYY-MM-DD', "
                     "using todays date as the end date instaed.".
                     format(args.enddate))
        END_DATE = datetime.today()
else:
    END_DATE = datetime.today()
        
KEYWORD = args.keyword

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
        if (idx != -1 and START_DATE <= closed_date and closed_date <= END_DATE):
            print(pull_request["body"][idx:])
            
        print("__________________________")

if __name__ == "__main__":
    retrieve_patchnotes()
