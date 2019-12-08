from django.http import HttpResponse, JsonResponse
from rest_framework import views, permissions, status
from .s3boto3 import S3Boto3Factory
from .models import GameFiles, GameVersions
from .validate_forms import RequestGameAssetForm, SubmitGameVersionForm
from .serializers import GameVersionSerializer
from django.db import IntegrityError
from game_version_updater.updater import version_update_scheduler
from game_version_updater.updateGameVersion import update_game_version

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
		"""
        summary: Get Game Version
        description: Provides user with current live game version
        tags:
            - GameVersionView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                major_ver:
                                    type: number
                                    description: Major version of game version.
                                minor_ver:
                                    type: number
                                    description: Minor version of game version.
                                live_by:
                                    type: string
                                    description: Timestamp of when game goes live.
                                    format: date-time
                                is_live:
                                    type: number
                                    description: If the version is live, or not.
            404:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: No version of the game exists.
        """
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

	def post(self, request, *args, **kwargs):
		"""
        summary: Post Game Version
        description: Submit game version with live by time.
        tags:
            - GameVersionView
        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Game version has been submitted successfully.
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Invalid input parameters.
            500:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Game version submission was not successful.
        """
		game_version_form = SubmitGameVersionForm(request.data)

		if game_version_form.is_valid():

			try:
				major_ver = game_version_form.cleaned_data.get('major_ver')
				minor_ver = game_version_form.cleaned_data.get('minor_ver')
				live_by = game_version_form.cleaned_data.get('live_by')

				game_version = GameVersions(major_ver=major_ver, minor_ver=minor_ver, live_by=live_by)
				game_version.save()

				#add this job to the job scheduler
				version_update_scheduler.add_job(update_game_version, 'date', run_date=game_version.live_by, args=[game_version.major_ver, game_version.minor_ver])

				return JsonResponse(
					{'message': 'Game version {} has been submitted successfully.'.format(game_version)},
					status=status.HTTP_200_OK)

			except (IntegrityError, IOError):
				return JsonResponse(
					{'message': "Game version submission was not successful."},
					status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		return JsonResponse(
			{'message': 'Invalid input parameters'},
			status=status.HTTP_400_BAD_REQUEST)





