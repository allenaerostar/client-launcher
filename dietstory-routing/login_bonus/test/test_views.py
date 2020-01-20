from django.test import TestCase
from django.utils import timezone
import login_bonus
import json


class RewardsViewTest(TestCase):
    GET_LOGIN_BONUS_REWARDS_URL = '/login-bonus/rewards/'

    def setUp(self):
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=21, item_id=5, item_name="Onyx Apple", quantity=5,
                                        time_to_expire=7200000)
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=22, item_id=6, item_name="Cheese Cookie", quantity=5,
                                            time_to_expire=7200000)

    def test_get_login_bonus_rewards_list(self):
        response = self.client.get(RewardsViewTest.GET_LOGIN_BONUS_REWARDS_URL)

        expected = [
            {
            'reward_num': 21,
            'item_id': 5,
            'item_name': "Onyx Apple",
            'quantity': 5,
            'time_to_expire': 7200000
            },
            {
                'reward_num': 22,
                'item_id': 6,
                'item_name': "Cheese Cookie",
                'quantity': 5,
                'time_to_expire': 7200000
            },
        ]
        self.assertTrue(response.status_code == 200)
        self.assertTrue(json.loads(response.content), expected)


class RewardViewTest(TestCase):
    GET_LOGIN_BONUS_REWARD_URL = '/login-bonus/rewards/number/'

    def setUp(self):
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=21, item_id=5, item_name="Onyx Apple", quantity=5,
                                        time_to_expire=7200000)

    def test_get_login_bonus_reward_for_existing_reward_number(self):
        params = {'reward_number': 1}
        response = self.client.get(RewardViewTest.GET_LOGIN_BONUS_REWARD_URL, params)

        expected = {'reward_num': 21,
                    'item_id': 5,
                    'item_name': "Onyx Apple",
                    'quantity': 5,
                    'time_to_expire': 7200000}
        self.assertTrue(json.loads(response.content), expected)

    def test_get_login_bonus_reward_for_non_existing_reward_number(self):
        params = {'reward_number': 2}
        response = self.client.get(RewardViewTest.GET_LOGIN_BONUS_REWARD_URL, params)

        expected = {}

        self.assertTrue(json.loads(response.content), expected)




