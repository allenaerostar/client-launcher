from django.urls import include, path
from rest_framework import routers
from . import views

#router = routers.SimpleRouter(trailing_slash=False)
#router.register(r'Accounts', views.AccountsViewSet)
urlpatterns = [
    #path('', include(router.urls))
    path('', views.SignupView.as_view()),
]