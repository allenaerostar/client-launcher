from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import views
from rest_framework import permissions
from .models import Accounts
from .validate_forms import SignupForm


# Create your views here.
class SignupView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return HttpResponse("Welcome to signup page. Please enter username, email, password, and birthday.", status=200)

    # @method_decorator(sensitive_post_parameters('password'))
    def post(self, request, *args, **kwargs):

        params = SignupForm(request.data)
        print((params))
        if params.is_valid():
            username = params.cleaned_data.get('username')
            accounts = Accounts.objects.filter(name=username)
            if not accounts:
                password = params.cleaned_data.get('password1')
                email = params.cleaned_data.get('email')
                birthday = params.cleaned_data.get('birthday')
                account = Accounts(name=username, password=password, email=email, birthday=birthday)
                account.save()
                return HttpResponse("Successful creation.", status=201)
            else:
                return HttpResponse("That account name already exists.", status=204)
        else:
            return HttpResponse("Inputs have invalid format.", status=400)
