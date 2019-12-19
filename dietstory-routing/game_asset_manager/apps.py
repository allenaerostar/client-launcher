from django.apps import AppConfig


class GameAssetManagerConfig(AppConfig):
    name = 'game_asset_manager'

    def ready(self):
        from game_version_updater import updater
        updater.start()
