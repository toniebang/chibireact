# your_project_name/middleware.py
import logging

logger = logging.getLogger(__name__)

class RequestDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'POST' and request.path.startswith('/admin/veluxapp/productos/add/'):
            logger.info("!!! MIDDLEWARE_DEBUG: POST request intercepted by middleware.")
            logger.info(f"!!! MIDDLEWARE_DEBUG: Request path: {request.path}")
            logger.info(f"!!! MIDDLEWARE_DEBUG: Request Content-Type: {request.META.get('CONTENT_TYPE')}")
            logger.info(f"!!! MIDDLEWARE_DEBUG: Request Content-Length: {request.META.get('CONTENT_LENGTH')}")
            logger.info(f"!!! MIDDLEWARE_DEBUG: Request FILES from middleware: {request.FILES}")
            logger.info(f"!!! MIDDLEWARE_DEBUG: Request POST data from middleware: {request.POST}")

        response = self.get_response(request)
        return response