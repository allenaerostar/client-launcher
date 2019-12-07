import re
from django import forms
from django.core.validators import validate_email, validate_slug, BaseValidator, MinValueValidator, MaxValueValidator

VERSION_FORMAT = "^[vV]?([0-9]*)[.]([0-9]*)$"

class VersionIdValidator(BaseValidator):
	def check_version_format(version):
		return re.search(VERSION_FORMAT, version) != None

	compare = lambda self, a, b: not VersionIdValidator.check_version_format(a)
	message = "Version must follow the form: ({})".format(VERSION_FORMAT)


class RequestGameAssetForm(forms.Form):
	filename = forms.CharField(max_length=128)
	versionid = forms.CharField(max_length=16, required=False, validators=[VersionIdValidator(True)])

	def get_version_values(self):
		if self.cleaned_data.get('versionid'):
			search = re.search(VERSION_FORMAT, self.cleaned_data.get('versionid'))
			if search:
				major = search.group(1)
				minor = search.group(2)
				return major, minor

		return None, None


class SubmitGameVersionForm(forms.Form):
	major_ver = forms.IntegerField(validators=[MinValueValidator(0)])
	minor_ver = forms.IntegerField(validators=[MinValueValidator(0)])
	live_by = forms.DateTimeField()







