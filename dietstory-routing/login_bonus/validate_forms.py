from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import MAX_NUM_REWARDS


class RewardForm(forms.Form):
    reward_number = forms.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(MAX_NUM_REWARDS)])