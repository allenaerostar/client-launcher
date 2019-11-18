from django.db import models
from .s3_storage import PublicAssetStorage, AuthorizedAssetStorage

# Create your models here.
class PublicAssets(models.Model):
	file = models.FileField(storage=PublicAssetStorage())
	uploaded_at = models.DateTimeField(auto_now_add=True)

class WizetFileAssets(models.Model):
	file = models.FileField(storage=AuthorizedAssetStorage())
	uploaded_at = models.DateTimeField(auto_now_add=True)	
