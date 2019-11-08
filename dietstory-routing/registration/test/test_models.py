from django.test import TestCase
import registration.models as models
from django.utils import timezone 

# Create your tests here.
class AccountsModelTest(TestCase):
	def setUp(self):
		models.Accounts.objects.create(name='username', password='password', email='email@domain.com', birthday='1990-01-01', tempban='0001-01-01 00:00:01')

	# Test Account
	def test_account_creation(self):
		account = models.Accounts.objects.get(name='username')
		self.assertTrue(isinstance(account, models.Accounts))
		self.assertTrue(account.email == 'email@domain.com')

