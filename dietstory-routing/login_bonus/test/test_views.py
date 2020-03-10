from django.test import TestCase
from django.utils import timezone
import registration
import login_bonus
import json


class RewardsViewTest(TestCase):
    GET_LOGIN_BONUS_REWARDS_URL = '/login-bonus/rewards'
    current_month = timezone.localtime().month
    currrent_year = timezone.localtime().year
    def setUp(self):
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=1, reward_month=RewardsViewTest.current_month, reward_year=RewardsViewTest.currrent_year, item_id=5, item_flag=1, item_name="Onyx Apple", quantity=5,
                                        time_to_expire=7200000)
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=2, reward_month=RewardsViewTest.current_month, reward_year=RewardsViewTest.currrent_year, item_id=6, item_flag=0, item_name="Cheese Cookie", quantity=5,
                                            time_to_expire=7200000)

    def test_get_login_bonus_rewards_list(self):
        response = self.client.get(RewardsViewTest.GET_LOGIN_BONUS_REWARDS_URL)

        expected = [
            {
            'reward_num': 1,
            'reward_month': RewardsViewTest.current_month,
            'reward_year': RewardsViewTest.currrent_year,
            'item_id': 5,
            'item_flag': 1,
            'item_name': "Onyx Apple",
            'quantity': 5,
            'time_to_expire': 7200000
            },
            {
                'reward_num': 2,
                'reward_month': RewardsViewTest.current_month,
                'reward_year': RewardsViewTest.currrent_year,
                'item_id': 6,
                'item_flag': 0,
                'item_name': "Cheese Cookie",
                'quantity': 5,
                'time_to_expire': 7200000
            },
        ]
        self.assertTrue(response.status_code == 200)
        self.assertEqual(json.loads(response.content), expected)


class RewardViewTest(TestCase):
    GET_LOGIN_BONUS_REWARD_URL = '/login-bonus/rewards/{}'
    current_month = timezone.localtime().month
    current_year = timezone.localtime().year
    reward_num = 1

    def setUp(self):
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=RewardViewTest.reward_num, reward_month=RewardViewTest.current_month, reward_year=RewardViewTest.current_year, item_id=5, item_name="Onyx Apple", quantity=5,
                                        time_to_expire=7200000)

    def test_get_login_bonus_reward_for_existing_reward_number(self):
        response = self.client.get(RewardViewTest.GET_LOGIN_BONUS_REWARD_URL.format(RewardViewTest.reward_num))

        expected = {'reward_num': RewardViewTest.reward_num,
                    'reward_month': RewardViewTest.current_month,
                    'reward_year': RewardViewTest.current_year,
                    'item_id': 5,
                    'item_flag': 0,
                    'item_name': "Onyx Apple",
                    'quantity': 5,
                    'time_to_expire': 7200000}
        self.assertEqual(json.loads(response.content), expected)

    def test_get_login_bonus_reward_for_non_existing_reward_number(self):
        response = self.client.get(RewardViewTest.GET_LOGIN_BONUS_REWARD_URL.format(2))

        expected = {}

        self.assertEqual(json.loads(response.content), expected)


class PlayerRewardViewTest(TestCase):
    GET_MY_LOGIN_BONUS_REWARD_URL = '/login-bonus/rewards/myreward'

    USERNAME = 'username'
    PASSWORD = 'password'

    current_date = timezone.localtime()
    current_month = timezone.localtime().month
    current_year = timezone.localtime().year

    def setUp(self):
        # Create Account
        registration.models.Accounts.objects.create(name=PlayerRewardViewTest.USERNAME, password=PlayerRewardViewTest.PASSWORD, email='email@domain.com',birthday='1990-01-01', tempban=timezone.localtime(), verified = 1, adminlevel=2)

        # Add Rewards
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=1, reward_month=PlayerRewardViewTest.current_month, reward_year=PlayerRewardViewTest.current_year, item_id=5, item_name="Onyx Apple", quantity=5,
                                time_to_expire=7200000)
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=2, reward_month=PlayerRewardViewTest.current_month, reward_year=PlayerRewardViewTest.current_year, item_id=6, item_name="Chaos Scroll", quantity=5,
                                time_to_expire=7200000)

    def test_get_reward_from_empty_reward_entry(self):
        self.client.login(username=PlayerRewardViewTest.USERNAME, password=PlayerRewardViewTest.PASSWORD)
        response = self.client.get(PlayerRewardViewTest.GET_MY_LOGIN_BONUS_REWARD_URL)

        expected = {}

        self.assertEqual(json.loads(response.content), expected)

    def test_get_reward_from_not_yet_obtained_rewards(self):
        user = login_bonus.models.LoginBonus.objects.create(
            account=registration.models.Accounts.objects.get(name=PlayerRewardViewTest.USERNAME), 
            reward_num=1, 
            latest_reward_time=PlayerRewardViewTest.current_date, 
            reward_month=PlayerRewardViewTest.current_month)

        self.client.login(username=PlayerRewardViewTest.USERNAME, password=PlayerRewardViewTest.PASSWORD)
        response = self.client.get(PlayerRewardViewTest.GET_MY_LOGIN_BONUS_REWARD_URL)

        expected = {}

        user.delete()
        self.assertEqual(json.loads(response.content), expected)

    def test_get_reward_from_previous_obtained_rewards(self):
        user = login_bonus.models.LoginBonus.objects.create(
            account=registration.models.Accounts.objects.get(name=PlayerRewardViewTest.USERNAME), 
            reward_num=2, 
            latest_reward_time=PlayerRewardViewTest.current_date, 
            reward_month=PlayerRewardViewTest.current_month)

        self.client.login(username=PlayerRewardViewTest.USERNAME, password=PlayerRewardViewTest.PASSWORD)
        response = self.client.get(PlayerRewardViewTest.GET_MY_LOGIN_BONUS_REWARD_URL)

        expected = {'reward_num': 1,
                    'reward_month': PlayerRewardViewTest.current_month,
                    'reward_year': PlayerRewardViewTest.current_year,
                    'item_id': 5,
                    'item_flag': 0,
                    'item_name': "Onyx Apple",
                    'quantity': 5,
                    'time_to_expire': 7200000}

        user.delete()
        self.assertEqual(json.loads(response.content), expected)

    def test_get_reward_from_invalid_obtained_rewards(self):
        user = login_bonus.models.LoginBonus.objects.create(
            account=registration.models.Accounts.objects.get(name=PlayerRewardViewTest.USERNAME), 
            reward_num=4, 
            latest_reward_time=PlayerRewardViewTest.current_date, 
            reward_month=PlayerRewardViewTest.current_month)

        self.client.login(username=PlayerRewardViewTest.USERNAME, password=PlayerRewardViewTest.PASSWORD)
        response = self.client.get(PlayerRewardViewTest.GET_MY_LOGIN_BONUS_REWARD_URL)

        expected = {}

        user.delete()
        self.assertEqual(json.loads(response.content), expected)






