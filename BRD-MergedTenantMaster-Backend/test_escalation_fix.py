#!/usr/bin/env python
"""
Test script to verify Escalation Master save fix
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brd_platform.settings')
django.setup()

from adminpanel.approval_master.models import EscalationMaster
from users.models import User
from adminpanel.approval_master.serializers import EscalationMasterSerializer
from datetime import datetime, timedelta

def test_escalation_save():
    """Test creating Escalation Master record"""
    
    print("=" * 60)
    print("Testing Escalation Master Save Fix")
    print("=" * 60)
    
    # Test 1: Serializer validation
    print("\n[Test 1] Testing serializer with valid data...")
    try:
        # Create or get test users
        manager_user, _ = User.objects.get_or_create(
            email="escalation_manager@test.com",
            defaults={
                "first_name": "Manager",
                "last_name": "User",
                "is_active": True,
            }
        )
        
        to_user, _ = User.objects.get_or_create(
            email="escalation_to@test.com",
            defaults={
                "first_name": "Escalation",
                "last_name": "User",
                "is_active": True,
            }
        )
        
        payload = {
            "escalation_level": 1,
            "escalation_time": (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M"),
            "escalation_manager": manager_user.id,
            "escalation_to": to_user.id,
            "status": "ACTIVE",
        }
        
        serializer = EscalationMasterSerializer(data=payload)
        if serializer.is_valid():
            print(f"✅ Serializer validation PASSED")
            print(f"   Escalation Level: {serializer.validated_data['escalation_level']}")
            print(f"   Manager: {serializer.validated_data['escalation_manager']}")
            print(f"   To: {serializer.validated_data['escalation_to']}")
        else:
            print(f"❌ Serializer validation FAILED:")
            for field, errors in serializer.errors.items():
                print(f"   {field}: {errors}")
            return False
        
        # Save the record
        escalation = serializer.save()
        print(f"✅ Escalation record created successfully")
        print(f"   ID: {escalation.id}")
        print(f"   Level: {escalation.escalation_level}")
        
        # Clean up
        escalation.delete()
        manager_user.delete()
        to_user.delete()
        
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 60)
    print("✅ Escalation Master save fix is working!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = test_escalation_save()
    sys.exit(0 if success else 1)
