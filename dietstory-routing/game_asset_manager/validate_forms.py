import re
from django import forms
from django.core.validators import validate_email, validate_slug, BaseValidator

VERSION_FORMAT = "^[vV]?([0-9]*)[.]([0-9]*)$"

class VersionIdValidator(BaseValidator):
    def check_version_format(version):
        return re.search(VERSION_FORMAT, version) != None

    compare = lambda self, a, b: not VersionIdValidator.check_version_format(a)
    message = "Version must follow the form: ({})".format(VERSION_FORMAT)

class CharFieldArrayValidator(BaseValidator):
    def __init__(self, max_entries, max_length, delimiter=','):
        super().__init__(True)
        self.max_entries = max_entries
        self.max_length = max_length
        self.delimiter = delimiter

    def check_char_fields(self, char_field_list):
        char_fields = char_field_list.split(self.delimiter)
        if len(char_fields) > self.max_entries:
            return False

        for char_field in char_fields:
            if len(char_field) > self.max_length:
                return False

        return True

    compare = lambda self, a, b: not self.check_char_fields(a)
    message = "CharFieldArray must be of the form: {0}{1}{0}{1}...".format('<CHAR_FIELD>', '<DELIMETER>')



class GameMetadataForm(forms.Form):
    versionid = forms.CharField(max_length=16, required=False, validators=[VersionIdValidator(True)])

    def get_version_values(self):
        if self.cleaned_data.get('versionid'):
            search = re.search(VERSION_FORMAT, self.cleaned_data.get('versionid'))
            if search:
                major = search.group(1)
                minor = search.group(2)
                return major, minor

        return None, None

class RequestGameAssetForm(GameMetadataForm):
    filenames = forms.CharField(validators=[
        CharFieldArrayValidator(max_entries=64, max_length=128, delimiter=',')], 
        max_length=8192)

    def clean(self):
        cleaned_data = super().clean()
        filenames_string = cleaned_data.get('filenames')
        cleaned_data['filenames'] = filenames_string.split(',')

