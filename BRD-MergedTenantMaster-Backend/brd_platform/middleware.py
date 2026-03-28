from django.utils.deprecation import MiddlewareMixin
try:
    from .tenant_context import set_tenant
except ImportError:
    set_tenant = None
    


class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
       
        if set_tenant:
            set_tenant(None) 
        
    def process_response(self, request, response):
        if set_tenant:
            set_tenant(None)
        return response