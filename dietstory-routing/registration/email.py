from django.core.mail import EmailMessage
from django.http import HttpResponse


def send_verification_email(target_email, verification_code):
    email = EmailMessage(
        subject='Verify your dietstory account.',
        body='Please enter the verification code: {} to verify your account.\n'.format(verification_code),
        from_email='dietstory-devs@outlook.com',
        to=[target_email],
    )

    try:
        email.send()
    except IOError:
        raise IOError("Failed to send confirmation email.")


