from django.urls import include, path
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from .swagger_schema import SwaggerSchemaGenerator

urlpatterns = [
	path('openapi', get_schema_view(
        title="Dietstory API",
        description="API Documentation for Dietstory service.",
        generator_class=SwaggerSchemaGenerator,
        public=True
    ), name='openapi-schema'),
    path('swagger-ui/', TemplateView.as_view(
        template_name='swagger-ui.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='swagger-ui'),
]