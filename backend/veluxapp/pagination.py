# veluxapp/pagination.py
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 4 # Número de elementos por página por defecto
    page_size_query_param = 'page_size' # Permite al cliente especificar el tamaño de página (ej. ?page_size=20)
    max_page_size = 100 # Tamaño máximo de página que un cliente puede solicitar