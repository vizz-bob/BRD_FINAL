from rest_framework.permissions import BasePermission


class IsLoanImprovementMaker(BasePermission):
    """
    Can create loan improvement requests
    """
    def has_permission(self, request, view):
        return request.user.has_perm("loan_improvement.add_loanimprovementrequest")


class IsLoanImprovementApprover(BasePermission):
    """
    Can approve / reject loan improvement requests
    """
    def has_permission(self, request, view):
        return request.user.has_perm("loan_improvement.change_loanimprovementrequest")


class IsLoanImprovementViewer(BasePermission):
    """
    Read-only access
    """
    def has_permission(self, request, view):
        return request.user.has_perm("loan_improvement.view_loanimprovementrequest")
