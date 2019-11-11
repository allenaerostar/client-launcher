from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import views
from rest_framework import permissions
from .models import Accounts
from .validate_forms import *
from .email import send_email
from .verification import account_activation_token
from .serializers import AccountSerializer


# This view allows user to signup for an dietstory account.
class SignupView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': "Welcome to signup page. Please enter username, email, password, and birthday."}, status=200)

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
                    account = Accounts.objects.create_user(username=username, password=password, email=email, birthday=birthday)
                    send_email(account.email, account_activation_token.make_token(account))
                    return JsonResponse({'message': "Successful creation."}, status=201)

                except IOError:
                    return JsonResponse({'message': "Account creation was not successful."}, status=500)

            else:
                return JsonResponse({'message': "That account already exists."}, status=204)
        else:
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)


# This view verifies token give by user to verify their dietstory account.
class VerifyView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        params = VerifyForm(request.data)

        if not params.is_valid():
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)

        email = params.cleaned_data.get('email')
        verify_token = params.cleaned_data.get('verify_token')

        try:
            user = Accounts.objects.get(email=email)
        except (TypeError, ValueError, OverflowError, Accounts.DoesNotExist):
            user = None

        if user and account_activation_token.check_token(user, verify_token):
            try:
                user.verified = 1
                user.save()

                return JsonResponse({'message': "Your account has been verified."}, status=200)
            except IOError:
                return JsonResponse({'message': "Account verification was not successful."}, status=500)
        else:
            return JsonResponse({'message': "Verification code is invalid."}, status=400)


class SendVerificationView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):

        params = EmailForm(request.data)

        if params.is_valid():
            email = params.cleaned_data.get('email')
            try:
                user = Accounts.objects.get(email=email, verified=0)
            except (TypeError, ValueError, OverflowError, Accounts.DoesNotExist):
                user = None

            if user:
                send_email(email, account_activation_token.make_token(user))
                return JsonResponse({'message': "Verification code has been resent to the valid email address."}, status=200)

            return JsonResponse({'message': "No Email has been sent."}, status=400)

        else:
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)


class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return render(request, 'registration/login.html')

    def post(self, request, *args, **kwargs):

        params = LoginForm(request.data)
        if params.is_valid():
            username,password = params.cleaned_data.get('username'), params.cleaned_data.get('password')
            account = authenticate(username=username, password=password)
            if account is not None:
                login(request, account)
                return JsonResponse(AccountSerializer(account).data, status=201)
            else:
                return JsonResponse({'message': "Failed to login."}, status=401)
        else:
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)


class LogoutView(views.APIView):

    def post(self, request, *args, **kwargs):
        permissions_classes = (permissions.AllowAny,)
        logout(request)
        return JsonResponse({'message': "Successfully logged out."}, status=200)










