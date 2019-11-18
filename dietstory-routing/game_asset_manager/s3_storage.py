from storages.backends.s3boto3 import S3Boto3Storage

class PublicAssetStorage(S3Boto3Storage):
	location = 'public'
	file_overwrite = True

class AuthorizedAssetStorage(S3Boto3Storage):
	location = 'private'
	file_overwrite = False