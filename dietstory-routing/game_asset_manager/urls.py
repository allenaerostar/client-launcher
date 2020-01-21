from django.urls import include, path
from . import views


urlpatterns = [
    path('download', views.DownloadView.as_view()),
    path('upload', views.UploadView.as_view()),
    path('version', views.GameVersionView.as_view()),
    path('future-versions', views.FutureVersionView.as_view()),
    path('hashes', views.ReturnHashesView.as_view()),
]