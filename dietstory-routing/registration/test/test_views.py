from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.utils import timezone 
import registration.models as models
import registration.verification as verification
from login_bonus.models import LoginBonus, LoginBonusRewards
from json import loads



class SignupViewTest(TestCase):
    SIGNUP_VIEW_URL = '/accounts/signup/'

    # Test bad submission
    def test_empty_form(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test valid submission
    def test_regular_form(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL, 
            {
                'username': 'testuser',
                'password1': 'password',
                'password2': 'password',
                'email': 'test@test.com',
                'birthday': '1990-01-01',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # Test Non Matching Passwords
    def test_non_matching_passwords(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL,
            {
                'username': 'testuser',
                'password1': 'password1',
                'password2': 'password2',
                'email': 'test@test.com',
                'birthday': '1990-01-01',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test Invalid Input Fields
    def test_invalid_input_fields(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL,
            {
                'username': 'testuser',
                'password1': 'password',
                'password2': 'password',
                'email': 'testtest.com',
                'birthday': '01-01-1995',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test Dangerous Inputs
    def test_dangerous_input(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL,
            {
                'username': 'testuser',
                'password1': 'DROP TABLE ACCOUNTS;',
                'password2': 'DROP TABLE ACCOUNTS;',
                'email': 'test@test.com',
                'birthday': '1995-02-02',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_shorter_than_min_length_for_username(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL,
            {
                'username': 'tes',
                'password1': 'password',
                'password2': 'password',
                'email': 'test@test.com',
                'birthday': '1990-01-01',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_shorter_than_min_length_for_password(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL,
            {
                'username': 'testuser',
                'password1': 'pas',
                'password2': 'pas',
                'email': 'test@test.com',
                'birthday': '1990-01-01',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_both_username_and_password_shorter_than_min_length(self):
        response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL,
            {
                'username': 'tes',
                'password1': 'pas',
                'password2': 'pas',
                'email': 'test@test.com',
                'birthday': '1990-01-01',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class VerifyViewTest(TestCase):
    VERIFY_VIEW_URL = '/accounts/verification/'

    def test_empty_form(self):
        response = self.client.post(VerifyViewTest.VERIFY_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_email_format(self):
        response = self.client.post(VerifyViewTest.VERIFY_VIEW_URL,
            {
                'email': '123123',
                'verify_token': '1231231232'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_regular_form_for_unverified_account(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime())
        account = models.Accounts.objects.get(name='username')
        token = verification.account_activation_token.make_token(account)
        response = self.client.post(VerifyViewTest.VERIFY_VIEW_URL,
            {
                'email': 'pokemon@domain.com',
                'verify_token': str(token)
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_regular_form_for_nonexistent_account(self):
        response = self.client.post(VerifyViewTest.VERIFY_VIEW_URL,
            {
                'email': 'pokemon@hotmail.com',
                'verify_token': '1232131233123123'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_token(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime())
        account = models.Accounts.objects.get(name='username')
        response = self.client.post(VerifyViewTest.VERIFY_VIEW_URL,
            {
                'email': 'pokemon@domain.com',
                'verify_token': '12312321321321321'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SendVerificationViewTest(TestCase):
    SEND_VERIFY_VIEW_URL = '/accounts/resend-verification-code/'

    def test_empty_form(self):
        response = self.client.post(SendVerificationViewTest.SEND_VERIFY_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_regular_form_for_existing_email(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime())
        response = self.client.post(SendVerificationViewTest.SEND_VERIFY_VIEW_URL,
            {
                'email': 'pokemon@domain.com'
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_regular_form_for_nonexisting_email(self):
        response = self.client.post(SendVerificationViewTest.SEND_VERIFY_VIEW_URL,
            {
                'email': 'pokemon@domain.com'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_email_format(self):
        response = self.client.post(SendVerificationViewTest.SEND_VERIFY_VIEW_URL,
            {
                'email': 'pokemondomain.com'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(TestCase):
    LOGIN_VIEW_URL = '/accounts/login/'

    def test_empty_form(self):
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_parameters(self):
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL, {
        'test': 'test', 'domain': 'domain'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_incorrect_username(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'username1',
                'password': 'password'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_incorrect_password(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'username',
                'password': 'password1'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('username', self.client.session)

    def test_correct_credentials(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'username',
                'password': 'password'
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(loads(response.content)["is_active"], True)
        self.assertEquals(self.client.session['username'], 'username')

    def test_correct_credentials_for_unverified_user(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 0)
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'username',
                'password': 'password'
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(loads(response.content)["is_active"], False)

    def test_get_login(self):
        response = self.client.get(LoginViewTest.LOGIN_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_with_shorter_than_min_length_for_username(self):
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'tes',
                'password': 'password'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_shorter_than_min_length_for_password(self):
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'testuser',
                'password': 'pas'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_both_username_and_password_shorter_than_min_length(self):
        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
            {
                'username': 'tes',
                'password': 'pas'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_username_saved_in_session(self):
        models.Accounts.objects.create(name='test_username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)

        response = self.client.post(LoginViewTest.LOGIN_VIEW_URL,
        {
            'username': 'test_username',
            'password': 'password'
        })
        session = self.client.session
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(session['username'], 'test_username')


class LogoutViewTest(TestCase):
    LOGOUT_VIEW_URL = '/accounts/logout/'

    def test_logout(self):
        response = self.client.post(LogoutViewTest.LOGOUT_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_session_data_deleted_on_logout(self):
        session = self.client.session
        session['username'] = 'test_username'
        session.save()
        
        response = self.client.post(LogoutViewTest.LOGOUT_VIEW_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn('username', response.client.session)


class ResetPasswordViewTest(TestCase):
    RESET_PASSWORD_VIEW_URL = '/accounts/password/reset/'

    def test_reset_password_for_existing_account(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime())
        response = self.client.post(ResetPasswordViewTest.RESET_PASSWORD_VIEW_URL,
            {
                'email': 'pokemon@domain.com'
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password_for_non_existing_account(self):
        response = self.client.post(ResetPasswordViewTest.RESET_PASSWORD_VIEW_URL,
            {
                'email': 'pokemon@domain.com'
            })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_reset_password_for_invalid_email_input(self):
        response = self.client.post(ResetPasswordViewTest.RESET_PASSWORD_VIEW_URL,
            {
                'email': 'aasdsadsaasdas'
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ChangePasswordViewTest(TestCase):
    CHANGE_PASSWORD_VIEW_URL = '/accounts/password/change/'
    username = 'username'
    password = 'password'
    incorrect_password = '123123'

    def test_change_password_with_incorrect_authentication(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        self.client.login(username=self.username, password=self.incorrect_password)
        response = self.client.post(ChangePasswordViewTest.CHANGE_PASSWORD_VIEW_URL,
            {
                'old_password': "cat123",
                'new_password1': "DROP TABLE accounts;",
                'new_password2': "DROP TABLE accounts;"
            })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_change_password_with_invalid_input(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(ChangePasswordViewTest.CHANGE_PASSWORD_VIEW_URL,
            {
                'old_password': "cat123",
                'new_password1': "DROP TABLE accounts;",
                'new_password2': "DROP TABLE accounts;"
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_with_incorrect_old_password(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(ChangePasswordViewTest.CHANGE_PASSWORD_VIEW_URL,
            {
                'old_password': "cat123",
                'new_password1': "password123",
                'new_password2': "password123"
            })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_change_password_with_non_matching_new_passwords(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        self.client.login(username=self.username, password=self.password)
        response = self.client.post(ChangePasswordViewTest.CHANGE_PASSWORD_VIEW_URL,
            {
                'old_password': "password",
                'new_password1': "password1234",
                'new_password2': "password123"
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_with_matching_new_passwords(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        self.client.login(username='username',password='password')
        account = models.Accounts.objects.get(name='username')
        self.assertEqual(account.password, 'password')
        response = self.client.post(ChangePasswordViewTest.CHANGE_PASSWORD_VIEW_URL,
            {
                'old_password': "password",
                'new_password1': "password123",
                'new_password2': "password123"
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(models.Accounts.objects.get(name=self.username).password,
                                                    'password123')

    def test_change_password_on_success_updates_session(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        self.client.login(username='username',password='password')
        account = models.Accounts.objects.get(name='username')
        self.assertEqual(account.password, 'password')
        self.assertEqual(self.client.session['_auth_user_hash'],
                         account.get_session_auth_hash())
        response = self.client.post(ChangePasswordViewTest.CHANGE_PASSWORD_VIEW_URL,
            {
                'old_password': "password",
                'new_password1': "password123",
                'new_password2': "password123"
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.session['_auth_user_hash'],
                         models.Accounts.objects.get(name='username').get_session_auth_hash())

class DisconnectViewTest(TestCase):
    DISCONNECT_VIEW_URL = '/accounts/disconnect-character/'
    def test_disconnect_character_does_not_exist(self):
        models.Accounts.objects.create(name='username',
                                       password='password',
                                       email='pokemon@domain.com',
                                       birthday='1990-01-01',
                                       tempban=timezone.localtime(),
                                       verified = 1)
        session = self.client.session
        session['username'] = 'username'
        session.save()
        response = self.client.post(DisconnectViewTest.DISCONNECT_VIEW_URL,
            {
                'character_name': 'testchar'
            })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_disconnect_character_name_too_short(self):
        response = self.client.post(DisconnectViewTest.DISCONNECT_VIEW_URL,
            {
                'character_name': 'abc',
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_disconnect_character_name_toolong(self):
        response = self.client.post(DisconnectViewTest.DISCONNECT_VIEW_URL,
            {
                'character_name': 'long_character__name',
            })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        












