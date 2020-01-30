from django.http import JsonResponse
from django.utils import timezone
from rest_framework import views, permissions, status
from .models import LoginBonusRewards, MAX_NUM_REWARDS
from .serializers import LoginBonusRewardSerializer
from .validate_forms import RewardForm
from django.db import transaction
import csv


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
            login_bonus_rewards = LoginBonusRewards.objects.filter(reward_month=timezone.localtime().month)
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
            login_bonus_reward = LoginBonusRewards.objects.filter(reward_num=reward_num, reward_month=timezone.localtime().month)
            if not login_bonus_reward:
                return JsonResponse({}, status=status.HTTP_200_OK)
            return JsonResponse(LoginBonusRewardSerializer(login_bonus_reward[0]).data, status=status.HTTP_200_OK)

        except IOError as e:
            return JsonResponse({'message': "Failed to fetch login rewards {}".format(reward_num)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):
        file = request.get('file')

        with transaction.atomic():
            login_bonus_reader = csv.reader(file, delimiter=',')
            for line in login_bonus_reader:
                login_bonus_reward = LoginBonusRewards(reward_num=line[0], reward_month=line[1], item_id=line[2], item_name=line[3],
                                                           quantity=line[4], time_to_expire=line[5])
                try:
                    login_bonus_reward.save()
                except IOError as e:
                    print("Failed to populate login rewards")
                    return JsonResponse({'message': "Failed to populate login rewards"},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return JsonResponse(status=status.HTTP_200_OK)




