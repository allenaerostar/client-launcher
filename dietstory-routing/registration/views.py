from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import views
from rest_framework import permissions
from .models import Accounts
from .validate_forms import *
from .email import send_verification_email
from .verification import account_activation_token


# This view allows user to signup for an dietstory account.
class SignupView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        """
        summary: Get Signup description
        description: Informs required parameters for POST request
        tags:
            - SignupView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: string
        """
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

                    try:
                        send_verification_email(account.email, account_activation_token.make_token(account))
                    except IOError:
                        print("Failed to send email.")
                    return HttpResponse("Successful creation.", status=201)

                except IOError:
                    return HttpResponse("Account creation was not successful.", status=500)

            else:
                return HttpResponse("That account already exists.", status=204)
        else:
            return HttpResponse("Inputs have invalid format.", status=400)


# This view verifies token give by user to verify their dietstory account.
class VerifyView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        params = VerifyForm(request.data)

        if not params.is_valid():
            return HttpResponse("Inputs have invalid format.", status=400)

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
                return HttpResponse("Your account has been verified.", status=200)
            except IOError:
                return HttpResponse("Account verification was not successful.", status=500)
        else:
            return HttpResponse("Verification code is invalid.", status=400)


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
                try:
                    send_verification_email(email, account_activation_token.make_token(user))
                    return HttpResponse("Verification code has been resent to the valid email address.", status=200)
                except IOError:
                    return HttpResponse("Failed to send confirmation email.", status=500)

            return HttpResponse("No Email has been sent.", status=400)

        else:
            return HttpResponse("Inputs have invalid format.", status=400)







