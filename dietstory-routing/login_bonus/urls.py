from django.urls import path
from . import views


urlpatterns = [
    path('rewards', views.RewardsView.as_view()),
    path('rewards/<int:reward_number>', views.RewardView.as_view()),
    path('upload', views.UploadLoginBonusRewardsView.as_view()),
    path('rewards/collect', views.CollectReward.as_view())
]
