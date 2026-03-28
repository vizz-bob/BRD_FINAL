from rest_framework import serializers
from .models import Role, Permission, RolePermission, UserRole


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='name', required=False)
    role_status = serializers.CharField(source='status', required=False)
    permissions = serializers.SerializerMethodField()
    
    # Permission categories for frontend compatibility
    loan_management = serializers.SerializerMethodField()
    document_management = serializers.SerializerMethodField()
    system_administration = serializers.SerializerMethodField()
    reports = serializers.SerializerMethodField()
    branch_permissions = serializers.SerializerMethodField()
    rules_management = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = [
            "id", "name", "role_name", "description", "role_type", 
            "status", "role_status", "is_active", "created_at", 
            "permissions", "loan_management", "document_management", 
            "system_administration", "reports", "branch_permissions", 
            "rules_management"
        ]
        extra_kwargs = {
            "name": {"required": False},
            "status": {"required": False},
        }

    def get_permissions(self, obj):
        return [rp.permission.code for rp in obj.permissions.all()]

    def _get_category_permissions(self, obj, category_prefix):
        # The frontend expects these fields to contain the codes.
        # We return all codes for now as the frontend handles the filtering by category.
        return [rp.permission.code for rp in obj.permissions.all()]

    def get_loan_management(self, obj):
        return self._get_category_permissions(obj, "LOAN")
    
    def get_document_management(self, obj):
        return self._get_category_permissions(obj, "DOC")

    def get_system_administration(self, obj):
        return self._get_category_permissions(obj, "SYS")

    def get_reports(self, obj):
        return self._get_category_permissions(obj, "REPORT")

    def get_branch_permissions(self, obj):
        return self._get_category_permissions(obj, "BRANCH")
        
    def get_rules_management(self, obj):
        return self._get_category_permissions(obj, "RULE")

    def create(self, validated_data):
        # Extract permissions categories if present in initial_data
        initial_data = self.initial_data
        categories = ["loan_management", "document_management", "system_administration", "reports", "branch_permissions", "rules_management"]
        
        role = super().create(validated_data)
        
        # Handle permissions
        new_permissions = []
        for cat in categories:
            if cat in initial_data:
                val = initial_data[cat]
                if isinstance(val, list):
                    new_permissions.extend(val)
                elif isinstance(val, str):
                    new_permissions.append(val)
        
        # If flat permissions list is sent, add them too
        if "permissions" in initial_data and isinstance(initial_data["permissions"], list):
            new_permissions.extend(initial_data["permissions"])
            
        if new_permissions:
            self._update_permissions(role, list(set(new_permissions)))
            
        return role

    def update(self, instance, validated_data):
        initial_data = self.initial_data
        categories = ["loan_management", "document_management", "system_administration", "reports", "branch_permissions", "rules_management"]
        
        role = super().update(instance, validated_data)
        
        # Handle permissions
        new_permissions = []
        for cat in categories:
            if cat in initial_data:
                val = initial_data[cat]
                if isinstance(val, list):
                    new_permissions.extend(val)
                elif isinstance(val, str):
                    new_permissions.append(val)
        
        if "permissions" in initial_data and isinstance(initial_data["permissions"], list):
            new_permissions.extend(initial_data["permissions"])
            
        if new_permissions:
            self._update_permissions(role, list(set(new_permissions)))
        
        return role

    def _update_permissions(self, role, codes):
        from .models import RolePermission, Permission
        # Remove old permissions
        RolePermission.objects.filter(role=role).delete()
        
        # Add new ones
        for code in codes:
            try:
                # Find the permission by code (this is what the frontend sends)
                perm = Permission.objects.filter(code=code).first()
                if not perm:
                    # If it doesn't exist, we might create it or just skip. 
                    # Usually better to pre-seed permissions.
                    continue
                RolePermission.objects.create(role=role, permission=perm)
            except Exception as e:
                print(f"Failed to assign permission {code}: {e}")


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = "__all__"


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = "__all__"

# serializers.py
class AssignPermissionsSerializer(serializers.Serializer):
    role = serializers.UUIDField()
    permissions = serializers.ListField(
        child=serializers.UUIDField()
    )

    def create(self, validated_data):
        role_id = validated_data["role"]
        perm_ids = validated_data["permissions"]

        role_permissions = []
        for pid in perm_ids:
            rp, created = RolePermission.objects.get_or_create(
                role_id=role_id,
                permission_id=pid
            )
            role_permissions.append(rp)

        return role_permissions  # return list of instances
