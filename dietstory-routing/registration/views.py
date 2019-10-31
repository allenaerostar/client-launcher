from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import viewsets
from rest_framework import views
from rest_framework import permissions

from .serializers import AccountSerializer
from .models import Accounts

# Create your views here.
class SignupView(views.APIView):

    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return HttpResponse("Welcome to signup page. Please enter username, email, password, and birthday.")

    #@method_decorator(sensitive_post_parameters('password'))
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        accounts = Accounts.objects.filter(name=username)
        if not accounts:
            password = request.data.get('password')
            email = request.data.get('email')
            birthday = request.data.get('birthday')
            account = Accounts(name=username, password=password, email=email, birthday=birthday)
            account.save()
            return HttpResponse("Successful save.")
        else:
            return HttpResponse("That account name already exists.")


# class AccountsViewSet(viewsets.ModelViewSet):
#     queryset = Accounts.objects.all().order_by('name')
#     serializer_class = AccountSerializer
