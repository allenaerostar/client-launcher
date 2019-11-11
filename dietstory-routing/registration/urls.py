from django.urls import include, path
from . import views


urlpatterns = [
    path('signup/', views.SignupView.as_view()),
    path('verification/', views.VerifyView.as_view()),
    path('resend-verification-code/', views.SendVerificationView.as_view()),
    #path('', include('django.contrib.auth.urls'))
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
]