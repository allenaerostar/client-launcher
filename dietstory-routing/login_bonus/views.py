import csv
import io
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta
from rest_framework import views, permissions, status
from .models import LoginBonusRewards, MAX_NUM_REWARDS
from .serializers import LoginBonusRewardSerializer
from .validate_forms import RewardForm, UploadRewardsForm
from django.db import transaction
from login_bonus.updater import update_login_bonus
from registration.models import Accounts



class RewardsView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        """
        summary: Get Rewards description
        description: Returns a list of login bonus rewards
        tags:
            - RewardsView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: array
                            items:
                                type: object
                                properties:
                                    reward_num:
                                        type: number
                                        description: Reward number.
                                    item_id:
                                        type: number
                                        description: Item id.
                                    item_name:
                                        type: string
                                        description: Item name.
                                    quantity:
                                        type: number
                                        description: Quantity of item to be given out.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to fetch login bonus rewards.
        """
        try:
            login_bonus_rewards = LoginBonusRewards.objects.filter(reward_month=timezone.localtime().month, reward_year=timezone.localtime().year)
            return JsonResponse([LoginBonusRewardSerializer(login_bonus_reward).data for login_bonus_reward in login_bonus_rewards],
                                status=status.HTTP_200_OK, safe=False)
        except IOError as e:
            return JsonResponse({'message': "Failed to fetch login rewards"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RewardView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, reward_number):
        """
        summary: Get Reward description
        description: Returns the reward associated with reward number in url.
        tags:
            - RewardView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                reward_num:
                                    type: number
                                    description: Reward number.
                                item_id:
                                    type: number
                                    description: Item id.
                                item_name:
                                    type: string
                                    description: Item name.
                                quantity:
                                    type: number
                                    description: Quantity of item to be given out.
            400:
                content:
                    application/json:
                        schema:
                            type: string
                            properties:
                                message:
                                    type: string
                                    description: Reward number is not in correct range.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to fetch login bonus reward associated to reward number.
        """
        initial = {'reward_number': reward_number}
        params = RewardForm(initial)

        if not params.is_valid():
            return JsonResponse({'message': "Reward number must be between 1 and {}".format(MAX_NUM_REWARDS)},
                                status=status.HTTP_400_BAD_REQUEST)
        reward_num = params.cleaned_data.get('reward_number')
        try:
            login_bonus_reward = LoginBonusRewards.objects.filter(reward_num=reward_num, reward_month=timezone.localtime().month, reward_year=timezone.localtime().year)
            if not login_bonus_reward:
                return JsonResponse({}, status=status.HTTP_200_OK)
            return JsonResponse(LoginBonusRewardSerializer(login_bonus_reward[0]).data, status=status.HTTP_200_OK)

        except IOError as e:
            return JsonResponse({'message': "Failed to fetch login rewards {}".format(reward_num)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadLoginBonusRewardsView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request):
        """
        summary: Upload Login Bonus Rewards
        description: Populate login bonus rewards through a csv.
        tags:
            - UploadLoginBonusRewardsView
        parameters:
            - name: file
              schema:
                  type: file
              description: >
                  Login Bonus Rewards CSV with 7 fields separated by commas per row.
              required: true
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Populated login rewards successfully!

            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: File is not a csv file
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to populate login rewards
        """

        params = UploadRewardsForm(request.POST, request.FILES)

        if not params.is_valid():
            return JsonResponse({'message': "File is not a csv file"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            csv_file = params.cleaned_data.get('file').read().decode('utf-8')
            io_string = io.StringIO(csv_file)
            login_bonus_reader = csv.reader(io_string, delimiter=',')
            for line in login_bonus_reader:
                try:
                    login_bonus_reward = LoginBonusRewards.objects.get(reward_num=line[0], reward_month=line[1], reward_year=line[2])
                    login_bonus_reward.item_id = line[3]
                    login_bonus_reward.item_name = line[4]
                    login_bonus_reward.quantity = line[5]
                    login_bonus_reward.time_to_expire = line[6]
                except (IOError, LoginBonusRewards.DoesNotExist):
                    login_bonus_reward = LoginBonusRewards(reward_num=line[0], reward_month=line[1], reward_year=line[2], item_id=line[3], item_name=line[4],
                                                           quantity=line[5], time_to_expire=line[6])
                try:
                    login_bonus_reward.save()
                except IOError as e:
                    print("Failed to populate login rewards")
                    return JsonResponse({'message': "Failed to populate login rewards"},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return JsonResponse({'message': "Populated login rewards successfully!"},status=status.HTTP_200_OK)


class CollectReward(views.APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        """
        summary: Collect Login Bonus Rewards
        description: Collect and update login bonus reward for user.
        tags:
            - CollectReward
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                next_reward_time:
                                    type: string
                                    description: Time to next login reward!

            404:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Cannot collect login bonus reward for non-existent account
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to collect login reward for the user
        """
        try:
            account = Accounts.objects.get(name=request.user.name, password=request.user.password)
            try:
                update_login_bonus(account.pk)
                current_date = timezone.localtime()
                return JsonResponse({"next_reward_time": str(current_date.replace(day=current_date.day + 1,hour=0, minute=0, second=0) - current_date)},
                                    status=status.HTTP_200_OK)
            except IOError as e:
                return JsonResponse({'message': "Failed to collect login reward for the user"},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Accounts.DoesNotExist:
            return JsonResponse({'message': "Cannot collect login bonus reward for non-existent account"},
                                status=status.HTTP_404_NOT_FOUND)






