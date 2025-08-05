# veluxapp/permissions.py
from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Permite el acceso de lectura a cualquier usuario y
    el acceso de escritura solo a los superusuarios.
    """
    def has_permission(self, request, view):
        # El acceso de lectura está permitido para cualquier solicitud
        if request.method in permissions.SAFE_METHODS:
            return True

        # El acceso de escritura solo está permitido para superusuarios
        return request.user and request.user.is_superuser