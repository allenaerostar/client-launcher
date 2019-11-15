from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework import views
from rest_framework import permissions
from .models import Accounts
from .validate_forms import *
from .email import send_verification_email
from .verification import account_activation_token
from .serializers import AccountSerializer


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
        return JsonResponse({'message': "Welcome to signup page. Please enter username, email, password, and birthday."}, status=200)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Signup description
        description: Registers a user account using an username, email, password, and birthday.
        parameters:
            - name: email
              schema:
                  type: string
                  format: email
              description: >
                  An email of the form user@domain.com
              required: true
            - name: username
              schema:
                  type: string
              description: >
                  Username consisting of only alphabet characters, numbers, underscores, and hyphens.
              required: true
            - name: password1
              schema:
                  type: string
              description: >
                  Password consisting of only alphabet characters, numbers, underscores, and hyphens.
              required: true
            - name: password2
              schema:
                  type: string
              description: >
                  Confirm password1 by retyping password1.
              required: true
            - name: birthday
              schema:
                  type: string
                  format: date
              description: >
                  Birthday in the form of YYYY-MM-DD.
              required: true
        tags:
            - SignupView
        responses:
            201:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Successful creation.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: That account already exists.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Inputs have invalid format.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Account creation was not successful.
        """

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

                    return JsonResponse({'message': "Successful creation."}, status=201)

                except IOError:
                    return JsonResponse({'message': "Account creation was not successful."}, status=500)

            else:
                return JsonResponse({'message': "That account already exists."}, status=400)
        else:
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)


# This view verifies token give by user to verify their dietstory account.
class VerifyView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Verification description
        description: Verifies a user account using an email, and verification code.
        parameters:
            - name: email
              schema:
                  type: string
                  format: email
              description: >
                  An email of the form user@domain.com
              required: true
            - name: verify_token
              schema:
                  type: string
              description: >
                  A verification token sent by dietstory-devs email.
              required: true
        tags:
            - VerifyView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Your account has been verified.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Inputs have invalid format.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Verification code is invalid.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Account verification was not successful.
        """

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
        """
        summary: Post Send Verification description
        description: Resend verification code to email associated with account.
        parameters:
            - name: email
              schema:
                  type: string
                  format: email
              description: >
                  An email of the form user@domain.com
              required: true

        tags:
            - SendVerificationView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Verification code has been resent to the valid email address.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: No Email has been sent.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Inputs have invalid format.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to send confirmation email.
        """

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
                    return JsonResponse({'message': "Verification code has been resent to the valid email address."},
                                        status=200)
                except IOError:
                    return JsonResponse({'message': "Failed to send confirmation email."}, status=500)

            return JsonResponse({'message': "No Email has been sent."}, status=400)

        else:
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)


class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Login description
        description: Login account with username and password.
        parameters:
            - in: header
              name: X-CSRFToken
              schema:
                  type: string
              required: true
            - name: username
              schema:
                  type: string
              description: >
                  Username of the account.
              required: true
            - name: password
              schema:
                  type: string
              description: >
                  Password of the account
              required: true

        tags:
            - LoginView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                name:
                                    type: string
                                    description: Username of the account.
                                email:
                                    type: string
                                    description: Email of the account.
                                is_active:
                                    type: boolean
                                    description: Verification status of the account.
                                is_superuser:
                                    type: boolean
                                    description: If this user is admin, or not.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to login.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Inputs have invalid format.

        """

        params = LoginForm(request.data)
        if params.is_valid():
            username, password = params.cleaned_data.get('username'), params.cleaned_data.get('password')
            account = authenticate(username=username, password=password)
            if account is not None:
                login(request, account)
                return JsonResponse(AccountSerializer(account).data, status=200)
            else:
                return JsonResponse({'message': "Failed to login."}, status=400)
        else:
            return JsonResponse({'message': "Inputs have invalid format."}, status=400)


class LogoutView(views.APIView):

    permissions_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Logout description
        description: Logout account that is logged in.
        parameters:
            - in: header
              name: X-CSRFToken
              schema:
                  type: string
              required: true
        tags:
            - LogoutView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Successfully logged out.
        """
        logout(request)
        return JsonResponse({'message': "Successfully logged out."}, status=200)

