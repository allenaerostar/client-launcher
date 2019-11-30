from django.http import HttpResponse, JsonResponse
from rest_framework import views, permissions, status
from .s3boto3 import S3Boto3Factory
from .models import GameFiles, GameVersions
from.validate_forms import RequestGameAssetForm
from .serializers import GameVersionSerializer

# Create your views here.
class DownloadView(views.APIView):
	permission_classes = (permissions.AllowAny,)

	def get(self, request, *args, **kwargs):
		"""
        summary: Download Game File Assets
        description: Provides users with a temporary s3 download link for a specified version controlled asset file
        parameters:
            - name: filename
              schema:
                  type: string
              description: >
                  Name of asset file requested.
              required: true
            - name: versionid
              schema:
                  type: string
              description: >
                  Specified version of asset file. If not specified, provide live version. If specified, must require admin authentication.
              required: false
        tags:
            - DownloadView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                download_link:
                                    type: string
                                    description: URL link to temporary download file.
        """
		params = RequestGameAssetForm(request.data)

		# Check for valid parameters
		if not params.is_valid():
			return JsonResponse(
				{'message': 'Inputs have invalid format.'}, 
				status=status.HTTP_400_BAD_REQUEST)

		# TODO: Add Authentication
		if params.cleaned_data.get('versionid'):
			return JsonResponse(
				{'message': 'Unauthorized.'}, 
				status=status.HTTP_401_UNAUTHORIZED)
		else:
			major, minor = 1, 0 # TODO: Lookup Live version

		filename = params.cleaned_data.get('filename')
		try:
			gamefile = GameFiles.objects.get(version_id_major=major, version_id_minor=minor, file_name=filename)
		except (TypeError, ValueError, OverflowError, GameFiles.DoesNotExist):
			gamefile = None

		if gamefile:
			s3_client = S3Boto3Factory.get_s3_client()
			res = s3_client.get_object_presigned_url(key=gamefile.s3_path, expires=300)
			return JsonResponse(
				{'download_link': res},
				status=status.HTTP_200_OK)
		else:
			return JsonResponse(
				{'message': 'File not found.'},
				status=status.HTTP_404_NOT_FOUND)


class GameVersionView(views.APIView):
	def has_permissions(self, request, view):

		if self.request.method == "GET":
			return (permissions.AllowAny,)

		elif self.request.method == "POST":
			return (permissions.IsAdminUser(),)

	def get(self, request, *args, **kwargs):

		try:
			game_version = GameVersions.objects.get(is_live=True)
		except GameVersions.DoesNotExist:
			game_version = None

		if game_version:
			return JsonResponse(
				{'game_version': GameVersionSerializer(game_version).data},
				status=status.HTTP_200_OK)
		else:
			return JsonResponse(
				{'message': 'No version of the game exists.'},
				status=status.HTTP_404_NOT_FOUND)


