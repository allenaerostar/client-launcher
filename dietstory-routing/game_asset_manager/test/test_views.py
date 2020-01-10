import registration
import game_asset_manager
import json
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.utils import timezone 
import registration.verification as verification

class FutureVersionViewTest(TestCase):
	POST_GAME_VERSIONS_URL='/game-files/version'
	GET_FUTURE_VERSION_URL='/game-files/future-versions'

	USERNAME = 'username'
	PASSWORD = 'password'

	def setUp(self):
		registration.models.Accounts.objects.create(name=FutureVersionViewTest.USERNAME, password=FutureVersionViewTest.PASSWORD, email='email@domain.com',birthday='1990-01-01', tempban=timezone.localtime(), verified = 1, adminlevel=2)

		# Live version is v2.0
		game_asset_manager.models.GameVersions.objects.create(major_ver=0, minor_ver=1, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=0, minor_ver=2, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=1, minor_ver=0, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=1, minor_ver=1, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=1, minor_ver=2, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=2, minor_ver=0, is_live=1)
		game_asset_manager.models.GameVersions.objects.create(major_ver=2, minor_ver=1, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=2, minor_ver=2, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=3, minor_ver=0, is_live=0)
		game_asset_manager.models.GameVersions.objects.create(major_ver=3, minor_ver=1, is_live=0)

	def test_get_all_future_versions(self):
		self.client.login(username=FutureVersionViewTest.USERNAME, password=FutureVersionViewTest.PASSWORD)
		response = self.client.get(FutureVersionViewTest.GET_FUTURE_VERSION_URL,
			{
				'versionid':'v1.0'
			})

		expected = {
			"future_versions": [
				{"major_ver": 2, "minor_ver": 0}, 
				{"major_ver": 2, "minor_ver": 1}, 
				{"major_ver": 2, "minor_ver": 2},
				{"major_ver": 3, "minor_ver": 0}, 
				{"major_ver": 3, "minor_ver": 1}, 
				{"major_ver": 1, "minor_ver": 1}, 
				{"major_ver": 1, "minor_ver": 2}
			]}

		self.assertTrue(json.loads(response.content.decode('utf8')) == expected)

	def test_get_future_versions_from_live(self):
		self.client.login(username=FutureVersionViewTest.USERNAME, password=FutureVersionViewTest.PASSWORD)
		response = self.client.get(FutureVersionViewTest.GET_FUTURE_VERSION_URL)

		expected = {
			"future_versions": [
				{"major_ver": 3, "minor_ver": 0}, 
				{"major_ver": 3, "minor_ver": 1}, 
				{"major_ver": 2, "minor_ver": 1}, 
				{"major_ver": 2, "minor_ver": 2}
			]}

		self.assertTrue(json.loads(response.content.decode('utf8')) == expected)		

