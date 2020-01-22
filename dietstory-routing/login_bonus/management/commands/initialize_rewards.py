import csv
from django.db import transaction
import os
from login_bonus.models import LoginBonusRewards
from django.core.management.base import BaseCommand

filename = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data/login_rewards.csv')


class Command(BaseCommand):
    args = ''
    help = 'Populates Login Bonus Rewards.'

    def _populate_login_rewards(self):
        with transaction.atomic():
            with open(filename, newline='') as csv_file:
                login_bonus_reader = csv.reader(csv_file, delimiter=',')
                for line in login_bonus_reader:
                    login_bonus_reward = LoginBonusRewards(reward_num=line[0], item_id=line[1], item_name=line[2],
                                                           quantity=line[3], time_to_expire=line[4])
                    try:
                        login_bonus_reward.save()
                    except:
                        print("Failed to populate login rewards")

    def handle(self, *args, **options):
        self._populate_login_rewards()



