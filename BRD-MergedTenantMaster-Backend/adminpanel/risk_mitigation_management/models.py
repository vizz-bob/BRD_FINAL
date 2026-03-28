from django.db import models


# 1. Risk Management
class RiskManagement(models.Model):
    risk_category = models.CharField(max_length=100)
    risk_parameter = models.CharField(max_length=255)
    risk_severity = models.CharField(max_length=20)
    risk_trigger_event = models.TextField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.risk_parameter


# 2. Risk Mitigation Management
class RiskMitigation(models.Model):
    mitigation_type = models.CharField(max_length=100)
    mitigation_action = models.TextField()
    associated_risk = models.ForeignKey(
        RiskManagement, on_delete=models.CASCADE
    )
    effectiveness_score = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# 3. Deviation Management
class DeviationManagement(models.Model):
    deviation_type = models.CharField(max_length=100)
    justification = models.TextField()
    approving_authority = models.CharField(max_length=100)
    impact_level = models.CharField(max_length=20)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# 4. Risk Containment Unit (RCU)
class RiskContainmentUnit(models.Model):
    rcu_trigger = models.CharField(max_length=255)
    investigation_status = models.CharField(max_length=50)
    risk_type = models.CharField(max_length=50)
    action_taken = models.TextField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# 5. Fraud Management
class FraudManagement(models.Model):
    fraud_category = models.CharField(max_length=100)
    modus_operandi = models.TextField()
    fraud_status = models.CharField(max_length=50)
    reporting_authority = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# 6. Portfolio Limits
class PortfolioLimit(models.Model):
    product_limit = models.DecimalField(max_digits=15, decimal_places=2)
    geo_limit = models.DecimalField(max_digits=15, decimal_places=2)
    borrower_segment_limit = models.DecimalField(max_digits=15, decimal_places=2)
    threshold_alerts = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# 7. Default Limits
class DefaultLimit(models.Model):
    acceptable_npa_percentage = models.PositiveIntegerField()
    default_threshold_days = models.PositiveIntegerField()
    default_trigger = models.CharField(max_length=100)
    default_impact_score = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)


# 8. Others
class RiskOther(models.Model):
    parameter_name = models.CharField(max_length=100)
    parameter_value = models.CharField(max_length=255)
    validity_from = models.DateField()
    validity_to = models.DateField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
