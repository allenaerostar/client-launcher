from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from registration.models import Accounts

class GameVersions(models.Model):
	major_ver = models.IntegerField(validators=[MinValueValidator(0)])
	minor_ver = models.IntegerField(validators=[MinValueValidator(0)])
	live_by = models.DateTimeField()
	is_live = models.SmallIntegerField(default=0, null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(250)])

	class Meta:
		managed = True
		db_table = 'game_versions'
		constraints = [
			models.UniqueConstraint(fields= ['major_ver', 'minor_ver'], name='version')
		]

class GameFiles(models.Model):
	version_ref = models.ForeignKey(GameVersions, on_delete=models.CASCADE, null=True)
	file_name = models.CharField(max_length=128)
	s3_path = models.CharField(max_length=128)
	hash_value = models.CharField(max_length=128)
	submitted_by = models.ForeignKey(Accounts, on_delete=models.SET_NULL, null=True)

	class Meta:
		managed = True
		db_table = 'game_files'
		constraints = [
			models.UniqueConstraint(fields=['version_ref, file_name'], name='file_version')
		]



