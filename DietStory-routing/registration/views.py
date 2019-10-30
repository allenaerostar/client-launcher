from django.shortcuts import render
from rest_framework import viewsets

from .serializers import AccountSerializer
from .models import Accounts

# Create your views here.
def signup(request, username, email, password, year, month, day):
    if request.method == "GET":
        return username
    elif request.method == "POST":
        return

class AccountsViewSet(viewsets.ModelViewSet):
    queryset = Accounts.objects.all().order_by('name')
    serializer_class = AccountSerializer
