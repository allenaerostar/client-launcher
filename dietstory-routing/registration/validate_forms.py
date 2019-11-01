from django import forms
from django.core.validators import validate_email, validate_slug
from datetime import date


class SignupForm(forms.Form):

    username = forms.CharField(max_length=13)
    email = forms.EmailField()
    password1 = forms.CharField(max_length=128)
    password2 = forms.CharField(max_length=128)
    birthday = forms.DateField(input_formats=['%Y-%m-%d'])

    def validate(self, username, email, password1, password2, birthday):
        validate_slug(username)
        validate_email(email)
        validate_slug(password1)
        validate_slug(password2)

    def check_valid_age(self, birthday):
        today = date.today()
        print(type(today))
        print(type(birthday))
        if today.year - birthday.year - ((today.month, today.day)) < (birthday.month, birthday.day):
            raise forms.ValidationError(
                "Invalid age."
            )

    def check_equal_passwords(self, password1, password2):
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    "Passwords do not match."
                )

    def clean(self):
        cleaned_data = super().clean()
        birthday = cleaned_data.get('birthday')
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')

        self.check_valid_age(birthday)
        self.check_equal_passwords(password1, password2)






def validate(username, email, password, birthday):


    validate_slug(username)
    print("OK")
    validate_slug(password)
    print("NICE")
    validate_email(email)
    print("Good job!")
    return


if __name__ == "__main__":
    validate("god-123", "456@456.com", "password","10-10-10")
