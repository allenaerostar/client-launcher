from django.http import HttpResponse, JsonResponse
from rest_framework import views, permissions, status
from .s3boto3 import S3Boto3Factory
from.validate_forms import GameMetadataForm, RequestGameAssetForm
from .models import GameFiles, GameVersions
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
                        'download_link': s3_client.get_object_presigned_url(key=file.s3_path, expires=300),
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



class ReturnHashesView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        """
        summary: Provides Hashes of required game files
        description: Returns a json of corresponding hashes to all assets for a specific game version
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
            game_files = GameFiles.objects.filter(version_ref=game_version.id)
            res = [ [file.s3_path, file.hash_value] for file in game_files ]
            return JsonResponse({
                    'hash_values': res
                },
                status=status.HTTP_200_OK)

        else:
            return JsonResponse(
                {'message': 'No version of the game exists.'},
                status=status.HTTP_404_NOT_FOUND)





