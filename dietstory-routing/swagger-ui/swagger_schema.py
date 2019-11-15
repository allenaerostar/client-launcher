from rest_framework.schemas.openapi import SchemaGenerator
from urllib.parse import urljoin
import yaml

class SwaggerSchemaGenerator(SchemaGenerator):
    # Override get_paths functionality
    def get_paths(self, request=None):
        result = {}

        paths, view_endpoints = self._get_paths_and_endpoints(request)

        # Only generate the path prefix for paths that will be included
        if not paths:
            return None

        for path, method, view in view_endpoints:
            if not self.has_view_permissions(path, method, view):
                continue
            operation = view.schema.get_operation(path, method)
            # Normalise path for any provided mount url.
            if path.startswith('/'):
                path = path[1:]
            path = urljoin(self.url or '/', path)
            result.setdefault(path, {})
            doc_operation = self.__extract_yaml__(view, method)
            if doc_operation:
                operation.update(doc_operation)
            result[path][method.lower()] = operation
        return result

    def __extract_yaml__(self, view, method):
        yaml_doc = None
        if view and method:
            # Get corresponding function
            view_func = getattr(view, method.lower())
            if view_func:
                try:
                    yaml_doc = yaml.safe_load(view_func.__doc__)
                except:
                    yaml_doc = None    

        return yaml_doc