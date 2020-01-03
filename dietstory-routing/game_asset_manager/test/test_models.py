from django.test import TestCase
import game_asset_manager.models as models
from django.utils import timezone 

# Create your tests here.
class GameVersions(TestCase):
	def setUp(self):
		models.GameVersions.objects.create(major_ver=1, minor_ver=0, live_by=timezone.localtime(), is_live=1)

	# Test Game Version Creation
	def test_gameversions_creation(self):
		version = models.GameVersion.objects.get(major_ver=1, minor_ver=0)
		self.assertTrue(isinstance(version, models.GameVersion))
		self.assertTrue(version.major_ver == 1)
		self.assertTrue(version.minor_ver == 0)


class GameFiles(TestCase):
	def setUp(self):
		models.GameVersions.objects.create(major_ver=1, minor_ver=0, live_by=timezone.localtime(), is_live=1)
		models.GameFiles.objects.create(file_name='Test.wz', s3_path='test/v1.0/Test.wz', hash_value='abcdef', submitted_by_id=None, version_ref_id=1)

	# Test Game Files
	def test_gamefiles_creation(self):
		version = models.GameVersion.objects.get(major_ver=1, minor_ver=0)
		files = models.GameFiles.objects.filter(version_ref_id=version.id)
		
		self.assertTrue(len(files) == 1)
		self.assertTrue(files[0].file_name == 'Test.wz')


