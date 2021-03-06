#!/bin/bash

SERVER_NAME=dietstory-django-server
SERVER_PATH=/apps/dietstory-django
SERVER_NETWORK=dietstory-service

source ~/.bashrc

# Run Server
sudo docker run -d \
	-v ${SERVER_PATH}:/mnt \
	-p 8000:8000 \
	--net ${SERVER_NETWORK} \
	--name=${SERVER_NAME} \
	benjixd/dietstory-django-server