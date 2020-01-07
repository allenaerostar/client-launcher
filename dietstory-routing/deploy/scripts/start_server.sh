#!/bin/bash

SERVER_NAME=dietstory-django-server

source ~/.bashrc

# Run Server
sudo  docker run -d \
	-p 8000:8000 \
	--name=${SERVER_NAME} \
	benjixd/dietstory-django-server