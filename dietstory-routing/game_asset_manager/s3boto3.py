import boto3
from botocore.client import Config
from django.conf import settings
from botocore.stub import Stubber

class S3Boto3Factory:
	def get_s3_client(stubbed_response={}):
		if hasattr(settings, 'AWS_CONFIG'):
			config = settings.AWS_CONFIG

			# Create s3 client
			s3_client = boto3.client(
				's3',
				aws_access_key_id=config['AWS_ACCESS_KEY_ID'],
				aws_secret_access_key=config['AWS_SECRET_ACCESS_KEY'],
				region_name=config['AWS_DEFAULT_REGION'],
				config=Config(signature_version='s3v4'))

			return S3Client(s3_client=s3_client, 
				bucket=config['AWS_STORAGE_BUCKET_NAME'], 
				root_folder=config['AWS_STORAGE_ROOT_FOLDER'])

		else:
			# stub boto3 client method
			return S3Client(s3_client=boto3.client('s3'), 
				bucket=None,
				root_folder=None,
				stubbed=True, 
				stubbed_response=stubbed_response)

class S3Client:
	def __init__(self, s3_client, bucket, root_folder, stubbed=False, stubbed_response={}):
		self.stubbed = stubbed
		self.__s3_client = s3_client
		self.__bucket = bucket
		self.__root_folder = root_folder

		if stubbed:
			self.__stubber = Stubber(self.__s3_client)
			# Wrap or override methods in stubs
			response = stubbed_response['generate_presigned_url'] if 'generate_presigned_url' in stubbed_response else None
			self.create_presigned_url = self.stub_create_presigned_url(self.create_presigned_url, response)
			response = stubbed_response['upload_file'] if 'upload_file' in stubbed_response else None
			self.upload_file = self.stub_upload_file(self.upload_file, response)
			# Activate stubber
			self.__stubber.activate()

	# Get object URL
	def create_presigned_url(self, key, http_method, expires=300):
		try:
			res = self.__s3_client.generate_presigned_url(
				http_method,
				Params={
					'Bucket': self.__bucket,
					'Key': '{0}'.format(key) },
				ExpiresIn=expires)
		except Exception as e:
			print(e) # TODO: Logging
			res = None

		return res;

	# Get object URL stub decorator
	def stub_create_presigned_url(self, function, response):
		# Override function
		def override(*args, **kwargs):
			return response
		return override

	# Upload Object
	def upload_file(self, file_location, key):
		full_key = '{0}/{1}'.format(self.__root_folder, key)
		try:
			self.__s3_client.upload_file(file_location, self.__bucket, full_key)
			res = full_key
		except Exception as e:
			print(e)
			res = None
		return res;

	# Upload Object stub decorator
	def stub_upload_file(self, function, response):
		# Override function
		def override(*args, **kwargs):
			return response
		return override
