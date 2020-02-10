from django.urls import include, path
from . import views


urlpatterns = [
    path('signup/', views.SignupView.as_view()),
    path('verification/', views.VerifyView.as_view()),
    path('resend-verification-code/', views.SendVerificationView.as_view()),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('password/reset/', views.ResetPasswordView.as_view()),
    path('password/change/', views.ChangePasswordView.as_view()),
    path('disconnect-character/', views.DisconnectView.as_view())
]

