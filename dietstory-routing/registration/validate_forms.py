from django import forms
from datetime import date
from django.core.validators import validate_email, validate_slug, BaseValidator


class MinAgeValidator(BaseValidator):

    def calculate_age(birthday):
        today = date.today()
        return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))

    compare = lambda self, a, b: MinAgeValidator.calculate_age(a) < b
    message = "Age must be at least %(limit_value)d."


class SignupForm(forms.Form):

    username = forms.CharField(max_length=13, validators=[validate_slug])
    email = forms.EmailField(max_length=45, validators=[validate_email])
    password1 = forms.CharField(max_length=128, validators=[validate_slug])
    password2 = forms.CharField(max_length=128, validators=[validate_slug])
    birthday = forms.DateField(input_formats=['%Y-%m-%d'], validators=[MinAgeValidator(0)])

    def check_equal_passwords(password1, password2):
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    "Passwords do not match."
                )

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        SignupForm.check_equal_passwords(password1, password2)


class VerifyForm(forms.Form):
    email = forms.EmailField(max_length=45, validators=[validate_email])
    verify_token = forms.CharField(validators=[validate_slug])


class EmailForm(forms.Form):
    email = forms.EmailField(max_length=45, validators=[validate_email])


class LoginForm(forms.Form):
    username = forms.CharField(max_length=13, validators=[validate_slug])
    password = forms.CharField(max_length=128, validators=[validate_slug])

