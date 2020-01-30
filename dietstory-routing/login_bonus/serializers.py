from rest_framework import serializers
from .models import LoginBonusRewards, LoginBonus


class LoginBonusRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginBonusRewards
        fields = ('reward_num', 'reward_month', 'item_id', 'item_name', 'quantity', 'time_to_expire')


class LoginBonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginBonus
        fields = ('reward_num', 'reward_month', 'latest_reward_time')