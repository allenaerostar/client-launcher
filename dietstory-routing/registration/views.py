from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import views
from rest_framework import permissions
from .models import Accounts
from .validate_forms import SignupForm
from .email import send_email

# Create your views here.
class SignupView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return HttpResponse("Welcome to signup page. Please enter username, email, password, and birthday.", status=200)

    # @method_decorator(sensitive_post_parameters('password'))
    def post(self, request, *args, **kwargs):

        params = SignupForm(request.data)

        if params.is_valid():
            username = params.cleaned_data.get('username')
            email = params.cleaned_data.get('email')
            accounts_filtered_by_username = Accounts.objects.filter(name=username)
            accounts_filtered_by_email = Accounts.objects.filter(email=email)

            if not accounts_filtered_by_username and not accounts_filtered_by_email:
                try:
                    password = params.cleaned_data.get('password1')
                    birthday = params.cleaned_data.get('birthday')
                    account = Accounts(name=username, password=password, email=email, birthday=birthday)
                    account.save()

                    send_email(account.email, 100)
                    return HttpResponse("Successful creation.", status=201)

                except IOError:
                    return HttpResponse("Account creation was not successful.", status=500)

            else:
                return HttpResponse("That account already exists.", status=204)
        else:
            return HttpResponse("Inputs have invalid format.", status=400)
