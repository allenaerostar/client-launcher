from rest_framework import serializers
from .models import Accounts

class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Accounts
        fields = ('name', 'email', 'password', 'birthday')