import os
from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator, BaseValidator
from .models import MAX_NUM_REWARDS


class RewardForm(forms.Form):
    reward_number = forms.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(MAX_NUM_REWARDS)])


class FileExtensionValidator(BaseValidator):
    def __init__(self, allowed_extensions):
        super().__init__(True)
        self.extensions = allowed_extensions

    def check_file_extension(self, file):
        ext = os.path.splitext(file.name)[1]
        if not ext.lower() in self.extensions:
            return False
        else:
            return True

    compare = lambda self, a, b: not self.check_file_extension(a)
    message = "File Extension is invalid"


class UploadRewardsForm(forms.Form):
    file = forms.FileField(validators=[
        FileExtensionValidator(allowed_extensions=['.csv']),
        ])
