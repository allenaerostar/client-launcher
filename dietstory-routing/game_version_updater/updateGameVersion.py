from game_asset_manager.models import GameVersions
from django.utils import timezone


def add_all_jobs(job_scheduler):

    try:
        print("Starting initialization of jobs.")

        game_versions = GameVersions.objects.filter(live_by__gt=timezone.now(), is_live=False)

        for game_version in game_versions:
            job_scheduler.add_job(update_game_version, 'date', run_date=game_version.live_by,
                              args=[game_version.major_ver, game_version.minor_ver])

        print("Ending initialization of jobs.")
    except Exception as e:
        print("Fail to reinitialize all required jobs.")


def update_game_version(major_ver, minor_ver):

    try:
        print("Updating game version started.")

        prev_game_version = GameVersions.objects.get(is_live=1)
        prev_game_version.is_live = 0
        prev_game_version.save()

        current_game_version = GameVersions.objects.get(major_ver=major_ver, minor_ver=minor_ver)
        current_game_version.is_live = 1
        current_game_version.save()

        print("Updating game version finished.")
    except Exception as e:
        print(e)
