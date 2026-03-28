from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.backends import ModelBackend

from .models import (
    Tenant, Branch, FinancialYear, ReportingPeriod, Holiday,
    Category, TenantRuleConfig, InterestConfig, ChargeConfig,
    RepaymentConfig, RiskRule, ScoreCard, TenantLoanProduct
)

User = get_user_model()


class BranchSerializer(serializers.ModelSerializer):
    tenant = serializers.SlugRelatedField(
        queryset=Tenant.objects.all(),
        slug_field="tenant_id"
    )

    class Meta:
        model = Branch
        fields = "__all__"


# -------------------- Tenant Serializer --------------------
class TenantSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(many=True, read_only=True)

    class Meta:
        model = Tenant
        fields = (
            "tenant_id", "name", "slug", "tenant_type",
            "email", "phone", "address", "city", "state",
            "pincode", "is_active", "created_at", "branches"
        )
        read_only_fields = ("tenant_id", "slug", "created_at")



# -------------------- Tenant Signup Serializer --------------------
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class TenantSignupSerializer(serializers.Serializer):
    contact_person = serializers.CharField(max_length=100)
    mobile_no = serializers.CharField(max_length=15)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    name = serializers.CharField(max_length=100)
    cin = serializers.CharField(required=False, allow_blank=True)
    pan = serializers.CharField(required=False, allow_blank=True)
    gstin = serializers.CharField(required=False, allow_blank=True)
    users_count = serializers.IntegerField(required=False)

    address = serializers.CharField()
    city = serializers.CharField()
    state = serializers.CharField()
    country = serializers.CharField()
    pincode = serializers.CharField()

    # subscription_type = serializers.CharField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered")
        return value




# ---------------------- CALENDAR SERIALIZERS ----------------------
# class FinancialYearSerializer(serializers.ModelSerializer):
#     tenant = serializers.PrimaryKeyRelatedField(read_only=True)

#     class Meta:
#         model = FinancialYear
#         fields = "__all__"

# calendar_config/serializers.py
from rest_framework import serializers
from .models import FinancialYear
from datetime import date

class FinancialYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialYear
        fields = "__all__"

    def validate(self, data):
        start = data.get("start")
        end = data.get("end")
        is_active = data.get("is_active", False)

        # Indian FY validation
        if start.month != 4 or start.day != 1:
            raise serializers.ValidationError("Financial Year must start on April 1st")

        if end.month != 3 or end.day != 31:
            raise serializers.ValidationError("Financial Year must end on March 31st")

        if start >= end:
            raise serializers.ValidationError("Start date must be before end date")

        # Only one active FY
        if is_active:
            qs = FinancialYear.objects.filter(is_active=True)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError("Only one Financial Year can be active at a time")

        return data



class ReportingPeriodSerializer(serializers.ModelSerializer):
    tenant = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ReportingPeriod
        fields = "__all__"


class HolidaySerializer(serializers.ModelSerializer):
    tenant = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Holiday
        fields = "__all__"



# -----------------------------------------------------------
# NEW CATEGORY SERIALIZER
# -----------------------------------------------------------
class CategorySerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_key_display', read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "tenant",
            "category_key",
            "category_display",
            "title",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ['tenant']
# -----------------------------------------------------------
# TENANT RULE CONFIG SERIALIZER
# -----------------------------------------------------------
class TenantRuleConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantRuleConfig
        fields = "__all__"
        extra_kwargs = {
            "tenant": {"read_only": True}
        }
# -------------------- Tenant Create (Master Admin Only) --------------------
class TenantCreateByMasterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    tenant_type = serializers.ChoiceField(
        choices=[('BANK','Bank'),('NBFC','NBFC'),('P2P','P2P'),('FINTECH','FinTech')]
    )
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    pincode = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(default=True)

    # ---------- VALIDATIONS ----------
    def validate_email(self, value):
        if Tenant.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Tenant with this email already exists")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value

    def validate_name(self, value):
        if Tenant.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Tenant with this name already exists")
        return value

    def validate_phone(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone must contain only digits")
        if value and len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits")
        return value

    # ---------- CREATE ----------
    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        if not (user.is_superuser or getattr(user, "role", "") == "MASTER_ADMIN"):
            raise serializers.ValidationError("Permission denied")

        tenant = Tenant.objects.create(**validated_data)
        raw_password = User.objects.make_random_password(length=10)

        User.objects.create_user(
            email=tenant.email,
            password=raw_password,
            tenant=tenant,
            role="TENANT_ADMIN",
            is_active=True
        )

        return {
            "message": "Tenant created successfully",
            "tenant_id": str(tenant.tenant_id),
            "email": tenant.email,
            "password": raw_password
        }


# =========================================================
# NEW: MASTERS & CONFIGURATION SERIALIZERS
# =========================================================

class InterestConfigSerializer(serializers.ModelSerializer):
    class Meta: 
        model = InterestConfig
        fields = '__all__'
        read_only_fields = ['tenant']

class ChargeConfigSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ChargeConfig
        fields = '__all__'
        read_only_fields = ['tenant']

class RepaymentConfigSerializer(serializers.ModelSerializer):
    class Meta: 
        model = RepaymentConfig
        fields = '__all__'
        read_only_fields = ['tenant']

class RiskRuleSerializer(serializers.ModelSerializer):
    class Meta: 
        model = RiskRule
        fields = '__all__'
        read_only_fields = ['tenant']

class ScoreCardSerializer(serializers.ModelSerializer):
    class Meta: 
        model = ScoreCard
        fields = '__all__'
        read_only_fields = ['tenant']

class TenantLoanProductSerializer(serializers.ModelSerializer):
    # Nested representation for Read operations (so frontend gets names/values)
    interest_details = InterestConfigSerializer(source='interest_config', read_only=True)
    repayment_config_details = RepaymentConfigSerializer(source='repayment_config', read_only=True)
    risk_details = RiskRuleSerializer(source='risk_rule', read_only=True)
    scorecard_details = ScoreCardSerializer(source='scorecard', read_only=True)
    
    # ✅ FULL DETAILS FOR FEES
    charges_details = ChargeConfigSerializer(source='charges', many=True, read_only=True)
    
    class Meta: 
        model = TenantLoanProduct
        fields = '__all__'
        read_only_fields = ['tenant']

class TenantTokenSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password required")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive")

        data = super().validate({
            "email": email,
            "password": password,
        })

        data["email"] = user.email
        return data

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get("email") or username
        if not email:
            return None

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

        