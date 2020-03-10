import logging
import requests

from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from rest_framework import views, permissions, status
from .models import Accounts, Characters
from .validate_forms import *
from .email import send_verification_email, send_reset_password_email
from .verification import account_activation_token
from .serializers import AccountSerializer
from .password_utils import RandomPasswordGenerator

logger = logging.getLogger('default-logger')

if settings.DEBUG:
    logger = logging.getLogger('dev-logger')

MAPLE_API_URL = "{0}:{1}".format(settings.DIETSTORY_API_HOST, str(settings.DIETSTORY_API_PORT))

# Next Error: RV-15

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
        return JsonResponse(
            {'message': "Welcome to signup page. Please enter username, email, password, and birthday."}, 
            status=status.HTTP_200_OK)

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
                    account.nxcredit = 20000
                    account.save()

                    try:
                        token = account_activation_token.make_token(account)
                        logger.debug("Verification Token: {}".format(token))
                        send_verification_email(account.email, token)
                    except IOError:
                        logger.warn("[RV-1] Failed to send email to: {}".format(account.email))
                    
                    logger.info("Successfully created account with username: {}".format(username))
                    return JsonResponse(
                        {'message': "Successful creation."}, 
                        status=status.HTTP_201_CREATED)

                except IOError:
                    logger.error("[RV-2] Could not create account with username: {}".format(username))
                    return JsonResponse(
                        {'message': "Account creation was not successful."}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                logger.warn("[RV-3] Account: {} already exists.".format(username))
                return JsonResponse(
                    {'message': "That account already exists."}, 
                    status=status.HTTP_400_BAD_REQUEST)
        else:
            logger.info("Inputs have invalid format.")
            return JsonResponse(
                {'message': "Inputs have invalid format."}, 
                status=status.HTTP_400_BAD_REQUEST)


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
            return JsonResponse(
                {'message': "Inputs have invalid format."}, 
                status=status.HTTP_400_BAD_REQUEST)

        email = params.cleaned_data.get('email')
        verify_token = params.cleaned_data.get('verify_token')

        try:
            user = Accounts.objects.get(email=email)
        except (TypeError, ValueError, OverflowError, Accounts.DoesNotExist):
            logger.warn("[RV-4] Email: {} does not exist.".format(email))
            user = None

        if user and account_activation_token.check_token(user, verify_token):
            try:
                user.verified = 1
                user.save()
                logger.info("Account: {} has been verified.".format(user.name))
                return JsonResponse(
                    {'message': "Your account has been verified."}, 
                    status=status.HTTP_200_OK)
            except IOError:
                logger.error("[RV-5] Account: {} was not successfully verified.".format(user.name))
                return JsonResponse(
                    {'message': "Account verification was not successful."}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return JsonResponse(
                {'message': "Verification code is invalid."}, 
                status=status.HTTP_400_BAD_REQUEST)


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
                    token = account_activation_token.make_token(user)
                    logger.debug("Verification Token: {}".format(token))
                    send_verification_email(email, token)
                    logger.info("Sent verification email to: {}".format(email))
                    return JsonResponse(
                        {'message': "Verification code has been resent to the valid email address."},
                        status=status.HTTP_200_OK)
                except IOError:
                    logger.error("[RV-6] Failed to send verification code to: {}".format(email))
                    return JsonResponse(
                        {'message': "Failed to send confirmation email."}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            logger.warn("[RV-7] Email: {} does not exist.".format(email))
            return JsonResponse({'message': "No Email has been sent."}, status=status.HTTP_400_BAD_REQUEST)

        else:
            logger.warn("[RV-14] Inputs have invalid format.")
            return JsonResponse({'message': "Inputs have invalid format."}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        """
        summary: Get Login description
        description: Renders csrf token to request user.
        tags:
            - LoginView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Please login using your credentials.
        """
        return JsonResponse({'message': "Please login using your credentials."}, status=200)

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
            try:
                exists = Accounts.objects.get(name=username, password=password)
            except Accounts.DoesNotExist:
                exists = None
            account = authenticate(username=username, password=password)
            if account is not None:
                login(request, account)
                request.session['username'] = username
                logger.info("Success fully logged in to account: {}".format(username))
                return JsonResponse(AccountSerializer(account).data, status=status.HTTP_200_OK)
            elif exists is not None:
                logger.info("User with account name: {} exists, but was not verfied. Redirecting to account verification page.".format(username))
                return JsonResponse(AccountSerializer(exists).data, status=status.HTTP_200_OK)
            else:
                logger.warn("[RV-8] Failed to login to account with username: {}".format(username))
                return JsonResponse({'message': "Failed to login."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            logger.info("Inputs have invalid format.")
            return JsonResponse({'message': "Inputs have invalid format."}, status=status.HTTP_400_BAD_REQUEST)


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
        logger.info("Successfully logged out.")
        return JsonResponse({'message': "Successfully logged out."}, status=status.HTTP_200_OK)


class ResetPasswordView(views.APIView):

    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Reset Password description
        description: Reset password for the account with the given email.
        parameters:
            - name: email
              schema:
                  type: string
                  format: email
              description: >
                  An email of the form user@domain.com
              required: true
        tags:
            - ResetPasswordView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Reset password has been sent to the email.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Invalid input parameters.
            404:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: No account is associated with the email provided.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to save account, or send reset password to email.
        """
        params = EmailForm(request.data)

        if params.is_valid():
            email = params.cleaned_data.get('email')
            try:
                account = Accounts.objects.get(email=email)
            except Accounts.DoesNotExist:
                account = None
            if account is not None:
                try:
                    reset_password = RandomPasswordGenerator.generate()
                    account.password = reset_password
                    account.save()
                    try:
                        send_reset_password_email(email, reset_password)
                        logger.info("Reset password has been sent to the email: {}".format(email))
                        return JsonResponse({'message': "Reset password has been sent to the email."}, status=status.HTTP_200_OK)
                    except IOError:
                        logger.warn("[RV-13] Failed to send email to {} with reset password.".format(email))
                        return JsonResponse({'message': "Failed to send email with reset password."},
                                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                except IOError:
                    logger.warn("[RV-11] Failed to save account: {} with the new reset password.".format(account.name))
                    return JsonResponse({'message': "Failed to save account with the new reset password."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.warn("[RV-12] No account is associated with the email provided: {}.".format(email))
            return JsonResponse({'message': "No account is associated with the email provided."}, status=status.HTTP_404_NOT_FOUND)
        logger.info("Invalid input parameters")
        return JsonResponse({'message': "Invalid input parameters"}, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(views.APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Change Password description
        description: Change password for the account.
        parameters:
            - name: old_password
              schema:
                  type: string
              description: >
                  The old account password.
              required: true
            - name: new_password1
              schema:
                  type: string
              description: >
                  The new account password.
              required: true
            - name: new_password2
              schema:
                  type: string
              description: >
                  Verification of the new account password.
              required: true
        tags:
            - ChangePasswordView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Successfully updated the account with the new password.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Invalid input parameters.
            404:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: No account with the provided credentials.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Failed to save account with the new password.
        """
        params = PasswordChangeForm(request.data)

        if params.is_valid():
            try:
                account = Accounts.objects.get(name=request.user.name,password=params.cleaned_data.get('old_password'))
            except Accounts.DoesNotExist:
                account = None

            if account is not None:
                try:
                    account.password = params.cleaned_data.get('new_password1')
                    account.save()
                    logger.info("Successfully updated the account: {} with the new password.".format(account.name))
                    update_session_auth_hash(request, account)
                    return JsonResponse({'message': "Successfully updated the account with the new password."}, status=status.HTTP_200_OK)
                except IOError:
                    logger.warn("Failed to save account: {} with the new password.".format(account.name))
                    return JsonResponse({'message': "Failed to save account with the new password."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.warn("[RV-9] No account with the provided credentials.")
            return JsonResponse({'message': "No account with the provided credentials."}, status=status.HTTP_404_NOT_FOUND)
        
        logger.warn("[RV-10] Invalid input parameters")
        return JsonResponse({'message': "Invalid input parameters"}, status=status.HTTP_400_BAD_REQUEST)
    
    class DisconnectFromServerView(views.APIView):

        permission_classes = (permissions.IsAuthenticated,)

class DisconnectView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    """
    summary: Disconnect character
    description: Disconnect character based on their characters name
                 and what world they are in.
    parameters:
        - name: character_name
            schema:
                type: string
            description: >
                The name of the character to dc.
            required: true
        - name: world
            schema:
                type: string
            description: >
                The world the character belongs in.
            required: true
    tags:
        - DisconnectView
    responses:
        200:
            content:
                application/json:
                    schema:
                        type: object
                        properties:
                                message:
                                    type: string
                                    description: Successful disconnect.
        404:
            content:
                application/json:
                    schema:
                        type: object
                        properties:
                                message:
                                    type: string
                                    description: A character with that name does not exist in
                                                 your account.
        400:
            content:
                application/json:
                    schema:
                        type: object
                        properties:
                                message:
                                    type: string
                                    description: There was an error disconnecting
                                                 that character.
    """
    def post(self, request, *args, **kwargs):
        logger.info("Got a request to DC a character.")
        
        params = DisconnectForm(request.data)
        if params.is_valid():
            username = request.session['username']
            character_name = params.cleaned_data['character_name']
            
            # Send a request to MapleAPI to DC the character.
            try:
                account = Accounts.objects.get(name=username)
                character = Characters.objects.get(accountid=account.id, name=character_name)
                params = {"char_id": character.id, "world_id": 0} # Where 0 = Scania.
                res = requests.post(url=MAPLE_API_URL + "/dc", params=params)

                if res.ok:
                    info_msg = "Successfully disconnected character: {}".format(character_name)
                    logger.info(info_msg)
                    return JsonResponse({'message': info_msg},
                        status=status.HTTP_200_OK)
                else:
                    # Maple API could not DC the character.
                    warning_msg = "Could not disconnect character: {}".format(character_name)
                    logger.warn(warning_msg)
                    return JsonResponse({'message': warning_msg},
                        status=res.status_code)
            except requests.ConnectionError as e:
                logger.warn("Could not connect to the Maple API. " + str(e))
                return JsonResponse({'message:': "Error connecting the Maple API. Could not disconnect: {}".format(character_name)},
                                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            except Characters.DoesNotExist as e:
                warning_msg = "Character with name: {} does not exist.".format(character_name)
                logger.warn(warning_msg)
                return JsonResponse({'message:': warning_msg}, status=status.HTTP_404_NOT_FOUND)

            # If we didn't return then the character doesn't exist.
            warning_msg = "Could not disconnect character: {}. That character does not exist in your account".format(character_name)
            logger.warn(warning_msg)
            return JsonResponse({'message': warning_msg}, status=status.HTTP_404_NOT_FOUND)
        
        warning_msg = "Problem disconnecting character: {}. Character name is invalid.".format(request.data['character_name'])
        logger.warn(warning_msg)
        return JsonResponse({'message': warning_msg}, status=status.HTTP_400_BAD_REQUEST)
