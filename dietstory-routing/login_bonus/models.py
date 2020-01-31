from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from registration.models import Accounts
from django.utils import timezone

MAX_NUM_REWARDS = 20


class LoginBonus(models.Model):
    account = models.OneToOneField(Accounts, on_delete=models.CASCADE, unique=True)
    reward_num = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(MAX_NUM_REWARDS)])
    latest_reward_time = models.DateTimeField()
    reward_month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])

    class Meta:
        managed = True
        db_table = 'login_bonus'


class LoginBonusRewards(models.Model):
    reward_num = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(MAX_NUM_REWARDS)])
    reward_month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    reward_year = models.IntegerField(validators=[MinValueValidator(int(timezone.localtime().year))])
    item_id = models.IntegerField(validators=[MinValueValidator(0)])
    item_name = models.TextField(null=True)
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    time_to_expire = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    class Meta:
        managed = True
        db_table = 'login_bonus_rewards'
