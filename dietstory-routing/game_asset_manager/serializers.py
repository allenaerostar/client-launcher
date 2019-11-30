from rest_framework import serializers
from .models import GameVersions

class GameVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameVersions
        fields = ('major_ver', 'minor_ver')