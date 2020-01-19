from django.urls import path
from . import views
from .initialize_rewards import populate_login_rewards

populate_login_rewards()

urlpatterns = [
    path('rewards/', views.RewardsView.as_view()),
    path('rewards/number/', views.RewardView.as_view())
]
