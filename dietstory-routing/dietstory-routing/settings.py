"""
Django settings for dietstory-routing project.

Generated by 'django-admin startproject' using Django 2.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import json
import sys

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load secret config file
SECRET_CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dietstory_secret_config.json')
with open(SECRET_CONFIG_FILE, 'r') as f:
    secret_config = json.load(f)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = secret_config['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = secret_config['DEBUG']

ALLOWED_HOSTS = secret_config['ALLOWED_HOSTS']


# Application definition

INSTALLED_APPS = [
    'registration.apps.RegistrationConfig',
    'swagger-ui',
    'game_asset_manager.apps.GameAssetManagerConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'dietstory-routing.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'default-logger': {
            'handlers': ['console'],
            'level': secret_config['LOG_LEVEL_DEFAULT'],
        },
        'dev-logger': {
            'handlers': ['console'],
            'level': secret_config['LOG_LEVEL_DEV']
        }
    },
}

WSGI_APPLICATION = 'dietstory-routing.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = secret_config['DATABASES']
# Swap for test db if running in test
if 'test' in sys.argv:
    DATABASES = secret_config['TEST_DATABASES']


AUTH_USER_MODEL = 'registration.Accounts'

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Toronto'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# AWS Settings
if not 'test' in sys.argv and 'AWS_CONFIG' in secret_config:
    AWS_CONFIG = secret_config['AWS_CONFIG']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'
LOGIN_REDIRECT_URL = '/accounts/signup'

# Email account for django to send emails
EMAIL_BACKEND = secret_config['EMAIL_BACKEND']
EMAIL_HOST = secret_config['EMAIL_HOST']
EMAIL_PORT = int(secret_config['EMAIL_PORT'])
EMAIL_HOST_USER = secret_config['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = secret_config['EMAIL_HOST_PASSWORD']
EMAIL_USE_TLS = bool(secret_config['EMAIL_USE_TLS'])

DIETSTORY_API_HOST = 'http://' + secret_config['DIETSTORY_API_HOST']
DIETSTORY_API_PORT = secret_config['DIETSTORY_API_PORT']

# Set Django's test runner to the custom class UnManagedModelTestRunner
TEST_RUNNER = 'dietstory-routing.runners.UnManagedModelTestRunner'

