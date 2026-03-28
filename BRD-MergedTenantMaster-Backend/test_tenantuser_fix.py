#!/usr/bin/env python
"""
Test script to verify TenantUser FK constraint fix
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brd_platform.settings')
django.setup()

from tenantuser.models import TenantUser
from role.models import Role as RoleModel
from users.models import User

def test_tenantuser_creation():
    """Test creating TenantUser without FK issues"""
    
    print("=" * 60)
    print("Testing TenantUser Creation with FK Constraint Fix")
    print("=" * 60)
    
    # Test 1: Create TenantUser without role_id (should work)
    print("\n[Test 1] Creating TenantUser without role_id...")
    try:
        user = TenantUser.objects.create(
            first_name="Test",
            last_name="User",
            email="test@example.com",
            mobile_number="9876543210",
            role_type="STANDARD",
            password="testpass123",
            # role_id is intentionally left null
        )
        print(f"✅ SUCCESS: Created TenantUser: {user}")
        print(f"   Email: {user.email}")
        print(f"   Role ID: {user.role_id}")
        # Don't delete yet - test passes
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        return False
    
    # Test 2: Create TenantUser with role_id
    print("\n[Test 2] Creating TenantUser with valid role_id...")
    try:
        # Create or get a role from the 'role' app
        role, _ = RoleModel.objects.get_or_create(
            role_name="Standard User Role",
            defaults={
                "description": "Standard user role",
                "role_type": "STANDARD",
                "role_status": "active"
            }
        )
        print(f"  Using role: {role.role_name}")
        
        user2 = TenantUser.objects.create(
            first_name="Test2",
            last_name="User2",
            email="test2@example.com",
            mobile_number="9876543211",
            role_type="STANDARD",
            password="testpass123",
            role_id=role
        )
        print(f"✅ SUCCESS: Created TenantUser with role: {user2}")
        print(f"   Email: {user2.email}")
        print(f"   Role ID: {user2.role_id}")
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 60)
    print("✅ All tests passed!")
    print("✅ TenantUser FK constraint fix is working correctly!")
    print("   - Can create TenantUser without role_id (nullable)")
    print("   - Can create TenantUser with role_id (foreign key)")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_tenantuser_creation()
    sys.exit(0 if success else 1)
