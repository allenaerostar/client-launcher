from django.http import HttpResponse
from rest_framework import views, permissions, status
from .s3boto3 import S3Boto3Factory

# Create your views here.
class DownloadView(views.APIView):
	permission_classes = (permissions.AllowAny,)

	def get(self, request, *args, **kwargs):
		"""
		summary: Test download public file
		description: Test download public file
		"""
		s3_client = S3Boto3Factory.get_s3_client()
		res = s3_client.get_object_presigned_url(key='public/test.txt', expires=300)
		return HttpResponse(res, status=status.HTTP_200_OK)
