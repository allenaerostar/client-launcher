from django.test import TestCase
from django.urls import reverse

class SignupViewTest(TestCase):
	SIGNUP_VIEW_URL = '/signup/'

	# Test bad submission
	def test_empty_form(self):
		response = self.client.post(SignupViewTest.SIGNUP_VIEW_URL)
		self.assertEqual(response.status_code, 400)

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
		self.assertEqual(response.status_code, 201)