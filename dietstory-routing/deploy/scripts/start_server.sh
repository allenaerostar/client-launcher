#!/bin/bash

source ~/.bashrc

# Runs the server by overriding base docker compose 
# configurations with production configs.
sudo docker-compose -f \
	../../docker-compose.yml -f \
	../../docker-compose.prod.yml up
