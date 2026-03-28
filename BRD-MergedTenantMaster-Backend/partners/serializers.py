# from rest_framework import serializers
# from .models import ThirdPartyUser

# class ThirdPartyUserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#     confirm_password = serializers.CharField(write_only=True)

#     class Meta:
#         model = ThirdPartyUser
#         fields = "__all__"

#     def validate(self, data):
#         if data['password'] != data['confirm_password']:
#             raise serializers.ValidationError("Passwords do not match")
#         return data

#     def create(self, validated_data):
#         validated_data.pop('confirm_password')
#         password = validated_data.pop('password')
#         user = ThirdPartyUser(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user


from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from .models import ThirdPartyUser

User = get_user_model()


class ThirdPartyUserSerializer(serializers.ModelSerializer):
    # Flatten AUTH_USER fields
    email = serializers.EmailField(source="user.email")
    password = serializers.CharField(write_only=True, required=False)

    # CamelCase API fields
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    organizationName = serializers.CharField(source="organization_name")
    thirdPartyType = serializers.CharField(source="third_party_type")
    panNumber = serializers.CharField(source="pan_number", allow_blank=True, required=False)
    mobileNumber = serializers.CharField(source="mobile_no")

    addressLine1 = serializers.CharField(source="address_line1", required=False, allow_blank=True)
    addressLine2 = serializers.CharField(source="address_line2", required=False, allow_blank=True)
    isActive = serializers.BooleanField(source="is_active")
    isVerified = serializers.BooleanField(source="verification_verified")

    class Meta:
        model = ThirdPartyUser
        fields = [
            "id",
            "email",
            "password",
            "firstName",
            "lastName",
            "organizationName",
            "thirdPartyType",
            "panNumber",
            "mobileNumber",
            "addressLine1",
            "addressLine2",
            "country",
            "state",
            "city",
            "pincode",
            "isActive",
            "isVerified",
            "created_at",
        ]

    # ✅ Validate email uniqueness (PREVENTS 500 error)
    def validate_email(self, value):
        qs = User.objects.filter(email=value)

        # Allow same email when updating the same instance
        if self.instance:
            qs = qs.exclude(id=self.instance.user_id)

        if qs.exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value

    # ✅ Safe create (transaction + correct user creation)
    def create(self, validated_data):
        user_data = validated_data.pop("user")
        password = validated_data.pop("password", None)

        with transaction.atomic():
            user = User.objects.create_user(
                email=user_data["email"],
                password=password
            )

            return ThirdPartyUser.objects.create(
                user=user,
                **validated_data
            )

    # ✅ Safe update
    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)

        if user_data:
            instance.user.email = user_data.get(
                "email", instance.user.email
            )
            instance.user.save(update_fields=["email"])

        return super().update(instance, validated_data)
