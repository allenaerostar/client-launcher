from django import forms
from datetime import date
from django.core.validators import validate_email, validate_slug, BaseValidator


def calculate_age(birthday):
    today = date.today()
    return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))


class MinAgeValidator(BaseValidator):
    compare = lambda self, a, b: calculate_age(a) < b
    message = "Age must be at least %(limit_value)d."


class SignupForm(forms.Form):

    username = forms.CharField(max_length=13)
    email = forms.EmailField()
    password1 = forms.CharField(max_length=128)
    password2 = forms.CharField(max_length=128)
    birthday = forms.DateField(input_formats=['%Y-%m-%d'], validators=[MinAgeValidator(0)])

    def validate(self, username, email, password1, password2):
        validate_slug(username)
        validate_email(email)
        validate_slug(password1)
        validate_slug(password2)

    def check_equal_passwords(self, password1, password2):
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    "Passwords do not match."
                )

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        self.check_equal_passwords(password1, password2)
