from django.urls import include, path
from . import views


urlpatterns = [
    path('signup', views.SignupView.as_view()),
    path('verify', views.VerifyView.as_view()),
]