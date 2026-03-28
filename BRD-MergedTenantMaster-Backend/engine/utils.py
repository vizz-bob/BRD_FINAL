from .models import TenantRule
from django.core.exceptions import ValidationError

def get_tenant_rules(tenant):
    """
    Fetch rules for a specific tenant or global rules if tenant is None.
    """
    rule = TenantRule.objects.filter(tenant=tenant).first()
    if not rule:
        # fallback to global rules
        rule = TenantRule.objects.filter(tenant__isnull=True).first()
    
    return rule.config if rule else {}

def validate_loan_rules(loan_application):
    """
    Applies 'validation' rules from the engine to a loan application.
    """
    config = get_tenant_rules(loan_application.tenant)
    val_rules = config.get("validation", {})
    
    amount = loan_application.amount
    
    # Check Min Amount
    min_amt = val_rules.get("minAmount")
    if min_amt is not None and amount < min_amt:
        raise ValidationError(f"Loan amount {amount} is below the minimum allowed: {min_amt}")
        
    # Check Max Amount
    max_amt = val_rules.get("maxAmount")
    if max_amt is not None and amount > max_amt:
        raise ValidationError(f"Loan amount {amount} exceeds the maximum allowed: {max_amt}")
        
    return True

def check_workflow_transition(loan_application, user, new_status):
    """
    Checks 'workflow' rules for status transitions.
    """
    config = get_tenant_rules(loan_application.tenant)
    wf_rules = config.get("workflow", {})
    
    # Example: If requireChecker is true, ONLY allow APPROVE status if user is a Manager/Admin
    if wf_rules.get("requireChecker") and new_status == "APPROVED":
        if not user.is_staff and user.role not in ["ADMIN", "MANAGER", "MASTER_ADMIN"]:
             raise ValidationError("A checker (Manager/Admin) is required to approve this loan.")
             
    return True
