#!/bin/bash

SERVER_PATH=/apps/dietstory-django

# Download configurations from S3
if [ "$APPLICATION_NAME" == "dietstory-django-app-dev" ]; then
	aws s3 cp s3://dietstory-api-server-assets/dev/config/dietstory_secret_config.json ${SERVER_PATH}/dietstory-routing/dietstory_secret_config.json
elif [ "$APPLICATION_NAME" == "dietstory-django-app-prod" ]; then
	aws s3 cp s3://dietstory-api-server-assets/prod/config/dietstory_secret_config.json ${SERVER_PATH}/dietstory-routing/dietstory_secret_config.json
fi 