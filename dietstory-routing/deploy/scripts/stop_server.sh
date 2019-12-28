#!/bin/bash

SERVER_NAME=dietstory-django-server

if [ "$(docker ps -q -f name=${SERVER_NAME})" ]; then
    if [ "$(docker ps -aq -f status=running -f name=${SERVER_NAME})" ]; then
        # stop existing server
        docker stop ${SERVER_NAME}
    fi

    # Remove container
    docker rm ${SERVER_NAME}
fi