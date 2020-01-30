from django.test import TestCase
from django.utils import timezone
import login_bonus
import json


class RewardsViewTest(TestCase):
    GET_LOGIN_BONUS_REWARDS_URL = '/login-bonus/rewards'
    current_month = timezone.localtime().month
    def setUp(self):
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=1, reward_month=RewardsViewTest.current_month, item_id=5, item_name="Onyx Apple", quantity=5,
                                        time_to_expire=7200000)
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=2, reward_month=RewardsViewTest.current_month, item_id=6, item_name="Cheese Cookie", quantity=5,
                                            time_to_expire=7200000)

    def test_get_login_bonus_rewards_list(self):
        response = self.client.get(RewardsViewTest.GET_LOGIN_BONUS_REWARDS_URL)

        expected = [
            {
            'reward_num': 1,
            'reward_month': RewardsViewTest.current_month,
            'item_id': 5,
            'item_name': "Onyx Apple",
            'quantity': 5,
            'time_to_expire': 7200000
            },
            {
                'reward_num': 2,
                'reward_month': RewardsViewTest.current_month,
                'item_id': 6,
                'item_name': "Cheese Cookie",
                'quantity': 5,
                'time_to_expire': 7200000
            },
        ]
        self.assertTrue(response.status_code == 200)
        self.assertEqual(json.loads(response.content), expected)


class RewardViewTest(TestCase):
    GET_LOGIN_BONUS_REWARD_URL = '/login-bonus/rewards/'
    current_month = timezone.localtime().month
    reward_num = 1

    def setUp(self):
        login_bonus.models.LoginBonusRewards.objects.create(reward_num=RewardViewTest.reward_num, reward_month=RewardViewTest.current_month, item_id=5, item_name="Onyx Apple", quantity=5,
                                        time_to_expire=7200000)

    def test_get_login_bonus_reward_for_existing_reward_number(self):
        response = self.client.get(RewardViewTest.GET_LOGIN_BONUS_REWARD_URL + str(RewardViewTest.reward_num))

        expected = {'reward_num': RewardViewTest.reward_num,
                    'reward_month': RewardViewTest.current_month,
                    'item_id': 5,
                    'item_name': "Onyx Apple",
                    'quantity': 5,
                    'time_to_expire': 7200000}
        self.assertEqual(json.loads(response.content), expected)

    def test_get_login_bonus_reward_for_non_existing_reward_number(self):
        response = self.client.get(RewardViewTest.GET_LOGIN_BONUS_REWARD_URL + str(2))

        expected = {}

        self.assertEqual(json.loads(response.content), expected)





