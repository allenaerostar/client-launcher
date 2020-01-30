from django.test import TestCase
import login_bonus.models as models
import registration.models as registration
from django.utils import timezone


# Create your tests here.
class LoginBonus(TestCase):
    def setUp(self):
        account = registration.Accounts.objects.create(name="username", password="password", email="email@domain.com", birthday='1990-01-01', tempban=timezone.localtime(), verified=1,
                                                    adminlevel=2)

        models.LoginBonus.objects.create(account=account, reward_num=1, latest_reward_time=timezone.localtime(), reward_month=5)

    def test_loginbonus_creation(self):
        login_bonus = models.LoginBonus.objects.get(account=1)
        self.assertTrue(login_bonus.reward_num == 1)
        self.assertTrue(login_bonus.reward_month == 5)


class LoginBonusRewards(TestCase):
    def setUp(self):
        models.LoginBonusRewards.objects.create(reward_num=15, reward_month=5, item_id=5, item_name="Onyx Apple", quantity=5, time_to_expire=7200000)

    def test_loginbonusrewards_creation(self):
        login_bonus_reward = models.LoginBonusRewards.objects.get(reward_num=15, reward_month=5)
        self.assertTrue(isinstance(login_bonus_reward, models.LoginBonusRewards))
        self.assertTrue(login_bonus_reward.reward_num == 15)
        self.assertTrue(login_bonus_reward.reward_month == 5)
        self.assertTrue(login_bonus_reward.item_id == 5)
        self.assertTrue(login_bonus_reward.item_name == "Onyx Apple")
        self.assertTrue(login_bonus_reward.quantity == 5)
        self.assertTrue(login_bonus_reward.time_to_expire == 7200000)

