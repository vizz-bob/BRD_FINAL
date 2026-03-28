"""
Utility functions for creating audit logs automatically
"""
from django.utils import timezone
from users.models import AuditLog

def create_audit_log(user, action_type, module, description, ip_address=None, tenant=None):
    """
    Helper function to create audit logs consistently across the application
    """
    if not tenant and hasattr(user, 'tenant'):
        tenant = user.tenant
    
    return AuditLog.objects.create(
        user=user,
        tenant=tenant,
        action_type=action_type,
        module=module,
        description=description,
        ip_address=ip_address,
        timestamp=timezone.now()
    )

def log_login(user, ip_address=None):
    """Log successful login"""
    return create_audit_log(
        user=user,
        action_type='LOGIN',
        module='AUTHENTICATION',
        description='User logged in successfully',
        ip_address=ip_address
    )

def log_failed_login(email, ip_address=None):
    """Log failed login attempt"""
    # For failed logins, we might not have a user object
    return AuditLog.objects.create(
        user=None,  # No user for failed attempts
        tenant=None,
        action_type='LOGIN',
        module='SECURITY',
        description=f'Failed login attempt for email: {email}',
        ip_address=ip_address,
        timestamp=timezone.now()
    )

def log_crud_action(user, action_type, module, object_description, ip_address=None):
    """Log CREATE, UPDATE, DELETE operations"""
    action_descriptions = {
        'CREATE': f'Created new {object_description}',
        'UPDATE': f'Updated {object_description}',
        'DELETE': f'Deleted {object_description}'
    }
    
    return create_audit_log(
        user=user,
        action_type=action_type,
        module=module,
        description=action_descriptions.get(action_type, f'{action_type} {object_description}'),
        ip_address=ip_address
    )

def log_security_event(user, description, ip_address=None):
    """Log security-related events"""
    return create_audit_log(
        user=user,
        action_type='UPDATE',
        module='SECURITY',
        description=description,
        ip_address=ip_address
    )

# Example usage in views:
"""
from .audit_utils import log_login, log_crud_action, log_security_event

# In login view:
log_login(user, request.META.get('REMOTE_ADDR'))

# In create view:
log_crud_action(
    user=request.user,
    action_type='CREATE',
    module='COLLECTIONS',
    object_description='delinquency record',
    ip_address=request.META.get('REMOTE_ADDR')
)

# In 2FA setup:
log_security_event(
    user=request.user,
    description='User enabled 2FA authentication',
    ip_address=request.META.get('REMOTE_ADDR')
)
"""
