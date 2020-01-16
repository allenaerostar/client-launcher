from django.urls import path
from . import views


urlpatterns = [
    path('rewards/', views.RewardsView.as_view()),
    path('rewards/num', views.RewardView.as_view())
]