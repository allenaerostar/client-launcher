from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from rest_framework import views, permissions
from .models import PublicAssets, WizetFileAssets
from .s3_storage import PublicAssetStorage, AuthorizedAssetStorage

from django import forms
class FileForm(forms.Form):
	file = forms.FileField()

# Create your views here.
class DownloadView(views.APIView):
	permission_classes = (permissions.AllowAny,)

	def get(self, request, *args, **kwargs):
		"""
		summary: Test download public file
		description: Test download public file
		"""
		entry = PublicAssets.objects.filter(file='test.txt')
		print(entry)
		return HttpResponse("File found and exists.", status=200)


	def post(self, request, *args, **kwargs):
		params = FileForm(request)

		if params.is_valid():
			f = params.cleaned_data.get('file')
			print(f)

		return HttpResponse("Got it.", status=200)
