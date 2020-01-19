from django.http import JsonResponse
from rest_framework import views, permissions, status
from .models import LoginBonusRewards, MAX_NUM_REWARDS
from .serializers import LoginBonusRewardSerializer
from .validate_forms import RewardForm


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
            login_bonus_rewards = LoginBonusRewards.objects.all()
            return JsonResponse([LoginBonusRewardSerializer(login_bonus_reward).data for login_bonus_reward in login_bonus_rewards],
                                status=status.HTTP_200_OK, safe=False)
        except IOError as e:
            return JsonResponse({'message': "Failed to fetch login rewards"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RewardView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        """
        summary: Get Reward description
        description: Returns the reward associated with reward number
        parameters:
            - name: reward_number
              schema:
                  type: number
              description: >
                  Reward Number.
              required: true
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
        params = RewardForm(request.GET)
        if not params.is_valid():
            return JsonResponse({'message': "Reward number must be between 1 and {}".format(MAX_NUM_REWARDS)},
                                status=status.HTTP_400_BAD_REQUEST)
        reward_num = params.cleaned_data.get('reward_number')
        try:
            login_bonus_reward = LoginBonusRewards.objects.get(reward_num=reward_num)
            return JsonResponse(LoginBonusRewardSerializer(login_bonus_reward).data, status=status.HTTP_200_OK)
        except IOError as e:
            return JsonResponse({'message': "Failed to fetch login rewards {}".format(reward_num)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

