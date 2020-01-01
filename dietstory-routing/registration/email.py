from django.core.mail import EmailMessage
from django.conf import settings

def send_verification_email(target_email, verification_code):

    email = EmailMessage(
        subject='Verify your dietstory account.',
        body='Please enter the verification code: {} to verify your account.\n'.format(verification_code),
        from_email=settings.EMAIL_HOST_USER,
        to=[target_email],
    )

    try:
        email.send()
    except IOError:
        raise IOError("Failed to send confirmation email.")

def send_reset_password_email(target_email, reset_password):

    email = EmailMessage(
        subject='Your Dietstory password has been reset!',
        body='Please login with your newly reset password: {} .\n'.format(reset_password),
        from_email=settings.EMAIL_HOST_USER,
        to=[target_email],
    )

    try:
        email.send()
    except IOError:
        raise IOError("Failed to send reset password email.")





