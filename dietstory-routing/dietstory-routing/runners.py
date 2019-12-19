"""
Django custom TestRunners
"""

from django.test.runner import DiscoverRunner

class UnManagedModelTestRunner(DiscoverRunner):

    def __init__(self, **kwargs):
        from django.apps import apps
        super(UnManagedModelTestRunner, self).__init__(**kwargs)
        # Find all unmanaged models
        self.unmanaged_models = [m for m in apps.get_models() if not m._meta.managed]

    def setup_test_environment(self, *args, **kwargs):
        # Set all unmanaged models to managed
        for m in self.unmanaged_models:
            m._meta.managed = True
        # run super() setup
        super(UnManagedModelTestRunner, self).setup_test_environment(*args, **kwargs)
 
    def teardown_test_environment(self, *args, **kwargs):
        # Teardown super()
        super(UnManagedModelTestRunner, self).teardown_test_environment(*args, **kwargs)
        # reset unmanaged models
        for m in self.unmanaged_models:
            m._meta.managed = False