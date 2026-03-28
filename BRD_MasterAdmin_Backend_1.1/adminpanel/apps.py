from django.apps import AppConfig

class AdminpanelConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "adminpanel"

    def ready(self):
        from adminpanel.access_control import models
        from adminpanel.approval_master import models
        from adminpanel.eligibility_score_management import models
        from adminpanel.risk_mitigation_management import models
        from adminpanel.subscription_management import models
        from adminpanel.bank_funds_management import models
        from adminpanel.agent_management import models
        from adminpanel.profile_management import models
        from adminpanel.audit_logs import models
        from adminpanel.coupon_management import models

        #(
        import adminpanel.product_revenue.product_management.models
        import adminpanel.product_revenue.product_mix_management.models
        import adminpanel.product_revenue.fees_management.models
        import adminpanel.product_revenue.charges_management.models
        import adminpanel.product_revenue.interest_management.models
        import adminpanel.product_revenue.repayment_management.models
        import adminpanel.product_revenue.penalties_management.models
        import adminpanel.product_revenue.moratorium_management.models
         #)