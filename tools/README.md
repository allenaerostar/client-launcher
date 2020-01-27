This tool calls the Github API retrieve a list of pull requests and iterates through them looking for the “PATCHNOTES:” keyword using the current time - 7 days to the current time as the time frame to look between.

Run pip install -r requirements.txt to install all required dependencies.

This tool supports querying for different pull request states eg (open, closed etc), different start dates, end dates that pull requests should fall in between, and different keywords to parse pull request descriptions for.

Querying for all open pull requests from Jan 2, 2020 to Jan 3, 2020.
python retrieve_patchnotes.py --state open --startdate 01-02-20 --enddate --01-03-20

Query for pull requests from the current time - 7 days to the current time with the keyword “EXAMPLE:”.
python retrieve_patchnotes.py --keyword EXAMPLE: