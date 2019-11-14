from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import six


class VerificationToken(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return six.text_type(user.email) + six.text_type(timestamp) + six.text_type(user.verified)


account_activation_token = VerificationToken()


