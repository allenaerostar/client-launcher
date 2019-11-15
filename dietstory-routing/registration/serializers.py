from rest_framework import serializers
from .models import Accounts


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accounts
        fields = ('name', 'email', 'is_active', 'is_superuser')
