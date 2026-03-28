from django.utils.deprecation import MiddlewareMixin
from tenants.models import Tenant

class TenantMiddleware(MiddlewareMixin):
    """
    Resolve tenant and attach to request. Strategy:
    1) If request.user has tenant -> use that
    2) Else check header X-Tenant-ID
    3) Else None
    """
    def process_request(self, request):
        request.tenant = None
        user = getattr(request, 'user', None)
        if getattr(user, 'is_authenticated', False):
            t = getattr(user, 'tenant', None)
            if t:
                request.tenant = t
                return
        tenant_id = request.headers.get('X-Tenant-Id') or request.META.get('HTTP_X_TENANT_ID')
        if tenant_id:
            try:
                request.tenant = Tenant.objects.get(tenant_id=tenant_id)
            except Tenant.DoesNotExist:
                request.tenant = None
