from .models import LoginBonus, LoginBonusRewards, MAX_NUM_REWARDS
from django.utils import timezone
from django.db import transaction


def update_login_bonus(account_id):
    try:
        login_bonus_for_account = LoginBonus.objects.get(account_id=account_id)
    except LoginBonus.DoesNotExist:
        login_bonus_for_account = None

    current_date = timezone.localtime()
    current_month = current_date.month

    if login_bonus_for_account is not None:
        if login_bonus_for_account.reward_month != current_month:
            try:
                login_bonus_for_account.reward_month = current_month
                login_bonus_for_account.reward_num = 0
                login_bonus_for_account.save()
            except IOError as e:
                print("Resetting monthly bonus failed")
                raise e
        if login_bonus_for_account.latest_reward_time < current_date.replace(hour=0, minute=0, second=0) and login_bonus_for_account.reward_num < MAX_NUM_REWARDS:
            try:
                with transaction.atomic():
                    login_bonus_reward_item = get_login_reward_item(login_bonus_for_account.reward_num)

                    if login_bonus_reward_item:
                        # current_date.strftime('%d-%m-%Y')
                        # api call requires receiver account ID, sender name, mesos, timestamp(dd-mm-yyyy), item id, item quantity, item stats(optional)
                        # do api call to game server to get duey to send reward of reward_num + 1
                        # upon successful update update reward_num and latest_reward_time
                        login_bonus_for_account.reward_num += 1
                        login_bonus_for_account.latest_reward_time = current_date
                        login_bonus_for_account.save()
            except IOError as e:
                print("Saving login bonus failed")
                raise e
    else:
        try:
            with transaction.atomic():
                login_bonus_reward_item = get_login_reward_item(1)
                
                if login_bonus_reward_item:
                    # current_date.strftime('%d-%m-%Y')
                    # api call requires receiver account ID, sender name, mesos, timestamp(dd-mm-yyyy), item id, item quantity, item stats(optional)
                    # do api call to game server to get duey to send reward_num 1
                    # upon successful update add new entry to logins_bonus
                    login_bonus_for_account = LoginBonus(account_id=account_id, latest_reward_time=current_date, reward_month=current_month)
                    login_bonus_for_account.save()
        except IOError as e:
            print("Failed to create login bonus entry associated with the account id")
            raise e


def get_login_reward_item(reward_num):
    try:
        login_bonus_reward = LoginBonusRewards.objects.get(reward_num=reward_num)
    except (IOError, LoginBonusRewards.DoesNotExist) as e:
        login_bonus_reward = None
        print("Failed to retrieve the item id associated with the reward num")

    return login_bonus_reward
