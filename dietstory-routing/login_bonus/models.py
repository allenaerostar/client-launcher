from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from registration.models import Accounts

MAX_NUM_REWARDS = 20

class LoginBonus(models.Model):
    account_id = models.OneToOneField(Accounts, on_delete=models.CASCADE, unique=True)
    reward_num = models.IntegerField(default=1, validators=[MinValueValidator(0)])
    latest_reward_time = models.DateTimeField()
    reward_month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])

    class Meta:
        managed = True
        db_table = 'login_bonus'


class LoginBonusRewards(models.Model):
    reward_num = models.AutoField(primary_key=True, validators=[MinValueValidator(0)])
    item_id = models.IntegerField(validators=[MinValueValidator(0)])
    item_name = models.TextField(null=True)
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    class Meta:
        managed = True
        db_table = 'login_bonus_rewards'
