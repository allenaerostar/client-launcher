import boto3
from botocore.client import Config
from django.conf import settings

class S3Boto3Factory:
	def get_s3_client(bucket=None):
		if settings.AWS_CONFIG:
			config = settings.AWS_CONFIG
			AWS_ACCESS_KEY_ID = config['AWS_ACCESS_KEY_ID']
			AWS_SECRET_ACCESS_KEY = config['AWS_SECRET_ACCESS_KEY']
			AWS_STORAGE_BUCKET_NAME = config['AWS_STORAGE_BUCKET_NAME']
			AWS_DEFAULT_REGION = config['AWS_DEFAULT_REGION']
			AWS_STORAGE_BUCKET_NAME = bucket if bucket else config['AWS_STORAGE_BUCKET_NAME']

			s3_client = boto3.client(
				's3',
				aws_access_key_id=AWS_ACCESS_KEY_ID,
				aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
				region_name=AWS_DEFAULT_REGION,
				config=Config(signature_version='s3v4'))

			return S3Client(s3_client=s3_client, bucket=AWS_STORAGE_BUCKET_NAME)

		else:
			return S3Client(s3_client=boto3.client('s3'), bucket=bucket, stubbed=True) # stub boto3 client method

class S3Client:
	def __init__(self, s3_client, bucket, stubbed=False):
		self.__s3_client = s3_client
		self.__bucket = bucket
		self.__stubbed = stubbed

	def get_object_presigned_url(self, key, expires=300):
		try:
			res = self.__s3_client.generate_presigned_url(
				'get_object', 
				Params={
					'Bucket': self.__bucket,
					'Key': key },
				ExpiresIn=expires)
		except e:
			print(e)
			res = None

		return res;


