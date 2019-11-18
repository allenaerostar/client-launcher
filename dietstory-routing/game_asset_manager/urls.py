from django.urls import include, path
from . import views


urlpatterns = [
    path('download', views.DownloadView.as_view()),
]