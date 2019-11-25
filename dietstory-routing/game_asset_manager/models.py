from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from registration.models import Accounts

class GameFiles(models.Model):
	version_id_major = models.IntegerField(validators=[MinValueValidator(0)])
	version_id_minor = models.IntegerField(validators=[MinValueValidator(0)])
	file_name = models.CharField(max_length=128)
	s3_path = models.CharField(max_length=128)
	hash_value = models.CharField(max_length=128)
	submitted_by = models.ForeignKey(Accounts, on_delete=models.SET_NULL, null=True)

	class Meta:
		managed = True
		db_table = 'game_files'
		unique_together=(('version_id_major', 'version_id_minor', 'file_name'))
