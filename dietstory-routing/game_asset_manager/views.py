from django.http import HttpResponse, JsonResponse
from rest_framework import views, permissions, status
from .s3boto3 import S3Boto3Factory
from.validate_forms import GameMetadataForm, RequestGameAssetForm, SubmitGameVersionForm, SubmitGameFileForm
from .models import GameFiles, GameVersions
from .serializers import GameVersionSerializer
from .md5_hash import LocalFileHash
from django.db import IntegrityError
from game_version_updater.updater import version_update_scheduler
from game_version_updater.updateGameVersion import update_game_version, add_game_version
from django.utils import timezone


# Create your views here.
class DownloadView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        """
        summary: Download Game File Assets
        description: Provides users with a temporary s3 download link for a specified version controlled asset file
        tags: 
            - DownloadView

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
        params = RequestGameAssetForm(request.GET)
        # Check for valid parameters
        if not params.is_valid():
            return JsonResponse(
                {'message': 'Inputs have invalid format.'},
                status=status.HTTP_400_BAD_REQUEST)

        # Get correct file version
        if params.cleaned_data.get('versionid'):
            if request.user.is_authenticated and request.user.is_superuser:
                major, minor = params.get_version_values()
                try:
                    game_version = GameVersions.objects.get(major_ver=major, minor_ver=minor)
                except GameVersions.DoesNotExist:
                    game_version = None
            else:
                return JsonResponse(
                    {'message': 'Unauthorized.'},
                    status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                game_version = GameVersions.objects.get(is_live=True)
            except GameVersions.DoesNotExist:
                game_version = None

        # Get file data
        file_names = params.cleaned_data.get('filenames')
        if game_version:
            try:
                game_files = GameFiles.objects.filter(version_ref=game_version.id, file_name__in=file_names)
            except (TypeError, ValueError, OverflowError, GameFiles.DoesNotExist):
                game_files = None
        else:
            return JsonResponse(
                {'message': 'No version of the game exists.'},
                status=status.HTTP_404_NOT_FOUND)

        # Obtain S3 URL
        if game_files:
            res = {}
            s3_client = S3Boto3Factory.get_s3_client()
            for file in game_files:
                res[file.file_name] = {
                        'download_link': s3_client.create_presigned_url(key=file.s3_path, http_method='get_object', expires=3600),
                        'http_head_link': s3_client.create_presigned_url(key=file.s3_path, http_method='head_object', expires=300),
                        'hash': file.hash_value
                    }

            return JsonResponse(
                res,
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
            return (permissions.IsAdminUser,)

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
        parameters:
            - name: versionid
              schema:
                  type: string
              description: >
                  versionid is in the form of ^[vV]?([0-9]*)[.]([0-9]*)$.
            - name: live_by
              schema:
                  type: string
                  format: date-time
              description: >
                  live_by is in the form of YYYY-MM-DD hh:mm:ss.
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

            304:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Game version already exists so no changes applied.

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

        if not game_version_form.is_valid():
            return JsonResponse(
                {'message': 'Invalid input parameters'},
                status=status.HTTP_400_BAD_REQUEST)

        major_ver, minor_ver = game_version_form.get_version_values();
        live_by = game_version_form.cleaned_data.get('live_by')

        # Check if Game Version Already Exists
        try:
            exists = GameVersions.objects.get(major_ver=major_ver, minor_ver=minor_ver)
        except GameVersions.DoesNotExist:
            exists = None
        if exists:
            return JsonResponse(
                {'message': 'Version already exists'},
                status=status.HTTP_304_NOT_MODIFIED)

        # Add new Game Version
        try:
            if live_by and live_by <= timezone.localtime():
                return JsonResponse(
                    {'message': 'Invalid live by time requested'},
                    status=status.HTTP_400_BAD_REQUEST)

            elif live_by:
                version_update_scheduler.add_job(update_game_version, 'date', run_date=live_by, args=[major_ver, minor_ver])

            add_game_version(major_ver, minor_ver, live_by)

            return JsonResponse(
                {'message': 'Game version {}.{} has been submitted successfully.'.format(major_ver, minor_ver)},
                status=status.HTTP_200_OK)

        except (IntegrityError, IOError):
            return JsonResponse(
                {'message': "Game version submission was not successful."},
                status=status.HTTP_400_BAD_REQUEST)


class ReturnHashesView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        """
        summary: Get Hashes of Required Downloadable Files
        description: Returns a json of corresponding hashes to all assets for a specific game version.
        tags:
            - ReturnHashesView

        parameters:
            - name: versionid
              schema:
                  type: string
              description: >
                  Specified version of asset file. If not specified, provide live version. If specified, must require admin authentication.
              required: true

        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: object
                                    description: A list of (file_name, hash) pairs
            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Invalid input parameters.
            401:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Unauthorized request if not authenticated, or superuser if requesting specific version                       
            404:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Invalid Version Id provided
        """

        params = GameMetadataForm(request.data)

        # Check for valid parameters
        if not params.is_valid():
            return JsonResponse(
                {'message': 'Inputs have invalid format.'},
                status=status.HTTP_400_BAD_REQUEST)

        # Get correct file version
        if params.cleaned_data.get('versionid'):
            if request.user.is_authenticated and request.user.is_superuser:
                major, minor = params.get_version_values()
                try:
                    game_version = GameVersions.objects.get(major_ver=major, minor_ver=minor)
                except GameVersions.DoesNotExist:
                    game_version = None

            else:
                return JsonResponse(
                    {'message': 'Unauthorized.'},
                    status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                game_version = GameVersions.objects.get(is_live=True)
            except GameVersions.DoesNotExist:
                game_version = None

        if game_version:
            game_files = GameFiles.objects.filter(version_ref_id=game_version.id)
            res = [ [file.file_name, file.hash_value] for file in game_files ]
            return JsonResponse({
                    'hash_values': res
                },
                status=status.HTTP_200_OK)

        else:
            return JsonResponse(
                {'message': 'No version of the game exists.'},
                status=status.HTTP_404_NOT_FOUND)


class UploadView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):
        """
        summary: Post Game File for download tied to a Version Id
        description: Provided game file for a specified version release, saved to S3
        tags:
            - UploadView

        parameters:
            - name: file_hash
              schema:
                  type: string
              description: >
                  Hash value of the file. Also used as a checksum for correctness.
              required: true
            
            - name: file_name
              schema:
                  type: string
              description: >
                  File name and full path to file.
              required: true

            - name: file
              schema:
                  type: file
              description: >
                  File content to be saved.
              required: true

            - name: versionid
              schema:
                  type: string
              description: >
                  Specified version of asset file.
              required: true

        responses:
            200:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Game file has been submitted successfully.

            400:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Invalid formatted request, checksum did not pass, game version does not exist

            503:
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
                                    description: Service currently unavailable.
        """

        params = SubmitGameFileForm(request.POST, request.FILES)

        # Check for valid Parameters
        if not params.is_valid():
            return JsonResponse(
                {'message': 'Inputs have invalid format.'},
                status=status.HTTP_400_BAD_REQUEST)

        # Handle Uploaded File
        file = params.cleaned_data.get('file')
        file_hash = params.cleaned_data.get('file_hash')
        file_name = params.cleaned_data.get('file_name')
        temp_path = '/tmp/{0}'.format(file.name)
        major_ver, minor_ver = params.get_version_values();

        with open(temp_path, 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)

        # Check Hash Correctness
        computed_hash = LocalFileHash.md5_hash(temp_path)
        if  computed_hash != file_hash:
            return JsonResponse(
                {'message': 'File hashes do not match. Perhaps upload was corrupted? Expected: {0}, Computed: {1}'.format(file_hash, computed_hash)},
                status=status.HTTP_400_BAD_REQUEST)

        # Check if Game Version Exists
        try:
            exists = GameVersions.objects.get(major_ver=major_ver, minor_ver=minor_ver)
        except GameVersions.DoesNotExist:
            return JsonResponse({'message': 'Provided game version does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        # Upload file to S3
        s3_client = S3Boto3Factory.get_s3_client()
        s3_path = s3_client.upload_file(file_location=temp_path, key='v{0}.{1}/{2}'.format(major_ver, minor_ver, file_name))

        if not s3_path:
            return JsonResponse({'message': 'Upload was unsuccessful.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Add File to Database (override if exists)
        try:
            file_entry = GameFiles.objects.get(file_name=file_name, version_ref_id=exists.id)
            file_entry.s3_path = s3_path
            file_entry.hash_value = file_hash
            file_entry.submitted_by_id = request.user.id
            file_entry.save()
        except GameFiles.DoesNotExist:
            file_entry = GameFiles(file_name=file_name, s3_path=s3_path, hash_value=file_hash, submitted_by_id=request.user.id, version_ref_id=exists.id)
            file_entry.save()

        return JsonResponse({
                    'message': 'File {0} was uploaded successfully for version {1}.{2}'.format(file_name, major_ver, minor_ver)
                },
                status=status.HTTP_200_OK)






