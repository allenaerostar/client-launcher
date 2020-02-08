from .models import LoginBonus, LoginBonusRewards, MAX_NUM_REWARDS
from django.utils import timezone
from django.db import transaction
import requests



def update_login_bonus(account_id):
    try:
        login_bonus_for_account = LoginBonus.objects.get(account_id=account_id)
    except LoginBonus.DoesNotExist:
        login_bonus_for_account = None

    current_date = timezone.localtime()
    current_month = current_date.month
    current_year = current_date.year

    if login_bonus_for_account is not None:
        if login_bonus_for_account.reward_month != current_month:
            try:
                login_bonus_for_account.reward_month = current_month
                login_bonus_for_account.reward_num = 0
                login_bonus_for_account.save()
            except IOError as e:
                print("Resetting monthly bonus failed")
                raise e
        if login_bonus_for_account.latest_reward_time < current_date.replace(hour=0, minute=0, second=0) and login_bonus_for_account.reward_num <= MAX_NUM_REWARDS:
            try:
                with transaction.atomic():
                    login_bonus_reward_item = get_login_reward_item(login_bonus_for_account.reward_num, current_month, current_year)
                    if login_bonus_reward_item:
                        data = {'account_id': account_id, 'item_id': login_bonus_reward_item.item_id, 'quantity':login_bonus_reward_item.quantity,'mesos':0, 'sender':"Dietstory", 'time_limit':login_bonus_reward_item.time_to_expire}
                        url = "172.18.0.2:8485/hello"
                        #response = requests.get(url)
                        #response = requests.post("compassionate_haslett:8485/duey", data=data)
                        #if response.status_code == requests.codes.ok:
                        #    login_bonus_for_account.reward_num += 1
                        #    login_bonus_for_account.latest_reward_time = current_date
                        #    login_bonus_for_account.save()
                        #else:
                            #response.raise_for_status()
            except IOError as e:
                print("Sending login bonus failed")
                raise e
    else:
        try:
            with transaction.atomic():
                login_bonus_reward_item = get_login_reward_item(1, current_month, current_year)

                if login_bonus_reward_item:
                    data = {'account_id': account_id, 'item_id': login_bonus_reward_item.item_id,
                                'quantity': login_bonus_reward_item.quantity, 'mesos': 0, 'sender': "Dietstory",
                                'time_limit': login_bonus_reward_item.time_to_expire}
                    url = "172.18.0.2:8485/hello"
                    #response = requests.get(url)
                    #response = requests.post("compassionate_haslett:8485/duey", data=data)
                    #if response.status_code == requests.codes.ok:
                    #    login_bonus_for_account = LoginBonus(account_id=account_id, latest_reward_time=current_date, reward_month=current_month)
                    #    login_bonus_for_account.save()
                    #else:
                    #    response.raise_for_status()

        except IOError as e:
            print("Failed to create login bonus entry associated with the account id")
            raise e


def get_login_reward_item(reward_num, reward_month, reward_year):
    try:
        login_bonus_reward = LoginBonusRewards.objects.get(reward_num=reward_num, reward_month=reward_month, reward_year=reward_year)
    except (IOError, LoginBonusRewards.DoesNotExist) as e:
        login_bonus_reward = None
        print("Failed to retrieve the item id associated with the reward num")

    return login_bonus_reward
