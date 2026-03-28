from django.core.management.base import BaseCommand
from adminpanel.models import RoleMaster

class Command(BaseCommand):
    help = "Update roles with new permission structure"

    def handle(self, *args, **kwargs):
        # ✅ Master List of Permissions (Frontend se match ki gayi)
        ALL_PERMISSIONS = {
            # Dashboard
            "view_dashboard": True,
            "view_reports": True,
            "download_reports": True,

            # User Management
            "user_view": True,
            "user_create": True,
            "user_edit": True,
            "user_delete": True,

            # Loan Management
            "loan_create": True,
            "loan_view": True,
            "loan_edit": True,
            "loan_approve": True,
            "loan_reject": True,
            "loan_disburse": True,

            # Organization
            "org_manage": True,
            "branch_create": True,
            "branch_view": True,
            "branch_edit": True,

            # System
            "role_manage": True,
            "audit_view": True,
            "settings_manage": True,
        }

        # 1. Update 'Admin' Role (Full Access)
        try:
            admin_role = RoleMaster.objects.get(name="Admin")
            # Existing permissions ko preserve karte hue update karein
            current_perms = admin_role.permissions or {}
            # Nayi permissions merge karein
            updated_perms = {**ALL_PERMISSIONS, **current_perms} 
            
            # Lekin hum chahte hain ki Admin ke paas SAB kuch True ho
            # Toh hum direct ALL_PERMISSIONS set kar dete hain (optional)
            admin_role.permissions = ALL_PERMISSIONS
            admin_role.save()
            
            self.stdout.write(self.style.SUCCESS(f"✅ Updated 'Admin' role with {len(ALL_PERMISSIONS)} permissions."))
        except RoleMaster.DoesNotExist:
            self.stdout.write(self.style.WARNING("⚠️ Role 'Admin' not found. Creating it..."))
            RoleMaster.objects.create(name="Admin", description="Super Admin Role", permissions=ALL_PERMISSIONS)
            self.stdout.write(self.style.SUCCESS("✅ Created 'Admin' role with full permissions."))

        # 2. Update Other Roles (Optional - Default to False)
        # Agar aap chahte hain ki baaki roles (jaise Loan Officer) mein bhi ye keys aa jayein (value: False)
        other_roles = RoleMaster.objects.exclude(name="Admin")
        
        # Default False structure
        DEFAULT_PERMISSIONS = {k: False for k in ALL_PERMISSIONS}

        for role in other_roles:
            # Sirf missing keys add karein, purani values disturb na karein
            current = role.permissions or {}
            new_perms = {**DEFAULT_PERMISSIONS, **current} # Pehle default, fir override with existing
            
            role.permissions = new_perms
            role.save()
            self.stdout.write(self.style.SUCCESS(f"🔹 Updated '{role.name}' with permission structure."))

        self.stdout.write(self.style.SUCCESS("\n🎉 Permissions Database Updated Successfully!"))