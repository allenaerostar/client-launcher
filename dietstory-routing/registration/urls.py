from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'Accounts', views.AccountsViewSet)
urlpatterns = [
    path('', include(router.urls))
    #path('accounts/create/<str: username>/<str: email>/<str: password>/<int: year>/<int: month>/<int: day>',
         #views.signup, name='signup')
]