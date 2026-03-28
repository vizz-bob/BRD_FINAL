# from rest_framework.viewsets import ModelViewSet
# from .models import (
#     AccessRule,
#     WorkflowRule,
#     ValidationRule,
#     AssignmentRule,
#     SecurityRule,
# )
# from .serializers import (
#     AccessRuleSerializer,
#     WorkflowRuleSerializer,
#     ValidationRuleSerializer,
#     AssignmentRuleSerializer,
#     SecurityRuleSerializer,
# )

# # rules/views.py
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import TenantRuleConfig
# from .serializers import TenantRuleConfigSerializer

# class TenantRulesView(APIView):

#     def get(self, request, tenant_id):
#         try:
#             rule = TenantRuleConfig.objects.get(tenant_id=tenant_id)
#             return Response(TenantRuleConfigSerializer(rule).data)
#         except TenantRuleConfig.DoesNotExist:
#             return Response({}, status=204)

#     def post(self, request, tenant_id):
#         rule, _ = TenantRuleConfig.objects.get_or_create(
#             tenant_id=tenant_id,
#             defaults={"config": request.data.get("config", {})}
#         )

#         rule.config = request.data.get("config", {})
#         rule.save()

#         return Response(
#             TenantRuleConfigSerializer(rule).data,
#             status=status.HTTP_200_OK
#         )


# class AccessRuleViewSet(ModelViewSet):
#     queryset = AccessRule.objects.all()
#     serializer_class = AccessRuleSerializer


# class WorkflowRuleViewSet(ModelViewSet):
#     queryset = WorkflowRule.objects.all()
#     serializer_class = WorkflowRuleSerializer


# class ValidationRuleViewSet(ModelViewSet):
#     queryset = ValidationRule.objects.all()
#     serializer_class = ValidationRuleSerializer


# class AssignmentRuleViewSet(ModelViewSet):
#     queryset = AssignmentRule.objects.all()
#     serializer_class = AssignmentRuleSerializer


# class SecurityRuleViewSet(ModelViewSet):
#     queryset = SecurityRule.objects.all()
#     serializer_class = SecurityRuleSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import TenantRule, Tenant
from .serializers import TenantRuleSerializer


class TenantRulesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_id=None):
        # -----------------------------
        # GLOBAL RULES (NO TENANT)
        # -----------------------------
        if not tenant_id:
            rule = TenantRule.objects.filter(tenant__isnull=True).first()
            if rule:
                return Response(
                    TenantRuleSerializer(rule).data,
                    status=status.HTTP_200_OK
                )
            return Response({}, status=status.HTTP_200_OK)

        # -----------------------------
        # TENANT RULES
        # -----------------------------
        rule = TenantRule.objects.filter(tenant_id=tenant_id).first()
        if not rule:
            return Response({}, status=status.HTTP_200_OK)

        return Response(
            TenantRuleSerializer(rule).data,
            status=status.HTTP_200_OK
        )

    def post(self, request, tenant_id=None):
        config = request.data.get("config")
        if not config:
            return Response(
                {"detail": "Config is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------
        # GLOBAL RULES SAVE
        # -----------------------------
        if not tenant_id:
            rule, _ = TenantRule.objects.update_or_create(
                tenant__isnull=True,
                defaults={"tenant": None, "config": config}
            )
            return Response(
                TenantRuleSerializer(rule).data,
                status=status.HTTP_200_OK
            )

        # -----------------------------
        # TENANT RULES SAVE
        # -----------------------------
        tenant = Tenant.objects.filter(id=tenant_id).first()
        if not tenant:
            return Response(
                {"detail": "Invalid tenant"},
                status=status.HTTP_400_BAD_REQUEST
            )

        rule, _ = TenantRule.objects.update_or_create(
            tenant=tenant,
            defaults={"config": config}
        )

        return Response(
            TenantRuleSerializer(rule).data,
            status=status.HTTP_200_OK
        )
