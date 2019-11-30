from django.urls import include, path
from . import views


urlpatterns = [
    path('download', views.DownloadView.as_view()),
    path('version', views.GameVersionView.as_view()),
    path('hashes', views.ReturnHashesView.as_view()),
]