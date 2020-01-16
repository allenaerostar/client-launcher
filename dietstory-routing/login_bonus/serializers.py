from rest_framework import serializers
from .models import LoginBonusRewards

class LoginBonusRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginBonusRewards
        fields = ('reward_num', 'item_id', 'item_name', 'quantity')