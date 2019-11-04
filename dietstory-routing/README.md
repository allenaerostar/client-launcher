# Django Model of Existing DietStory Schema  

## Differences    
Django model IntegerFields do not have length or width control of the value. Model used minimum and maximum values to restrict to same domain as in MySql.  
DateField and DateTimeField do not support "0000-00-00" and "0000-00-00 00:00:00", also known as the zero date. Django does not handle null fields, so custom classes inherited from DateField and DateTimeField are written to convert null cases to the zero date that can be inserted into MySQL.  


## Modules Required    
Python 3.0+
Django 2.2.6
rest_framework
MySqlClient

## Setup    
Install Python 3.0 according to your operating system steps.
pip install Django==2.2.6
pip install djangorestframework
pip install mysqlclient

## Database Migrations    
cd client-launcher/dietstory-routing  
python manage.py makemigrations  
python manage.py migrate  

## Start the Django Server    
cd client-launcher/dietstory-routing  
python manage.py runserver [host:port]  
If no host and port is given, the default of 127.0.0.1:8000 is used. 

## Using Docker
Build the docker image specified under `docker/` with the following command:
```
docker build -t dietstory-django ./docker/
```

Run the docker image by mounting the project and exposing port 8000:
```
docker run -v $(pwd):/mnt -p 8000:8000 dietstory-django
```
> Note: Ensure that you have setup a MySQL database for the Django server to connect to. Modify `settings.py` to ensure correct configurations.



