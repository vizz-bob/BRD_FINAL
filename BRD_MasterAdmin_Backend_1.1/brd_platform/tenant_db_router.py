class TenantDbRouter:
    """
    Router that directs models to tenant-specific DB if model has attribute `tenant` or is in tenants app.
    You must configure DATABASES with tenant databases and set connection mapping.
    """
    def db_for_read(self, model, **hints):
        tenant = hints.get('tenant')  # hints passed by code
        if tenant:
            return tenant.db_alias  # you must set this on tenant object during onboarding
        return 'default'

    def db_for_write(self, model, **hints):
        tenant = hints.get('tenant')
        if tenant:
            return tenant.db_alias
        return 'default'

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # default: apply migrations to default only
        if db == 'default':
            return True
        return False
