"""
Update DocumentDetail records with reviewed_at timestamps
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Legal_Dashboard.settings')
django.setup()

from Legal_Dashboard.dashboard.models import DocumentDetail
from django.utils import timezone
from datetime import timedelta
import random

def update_reviewed_timestamps():
    """Add reviewed_at timestamps to approved documents"""
    
    details = DocumentDetail.objects.filter(status='Approved', reviewed_at__isnull=True)
    count = 0
    
    for detail in details:
        # Set reviewed_at to 1-3 days after creation
        days_offset = random.randint(1, 3)
        hours_offset = random.randint(1, 12)
        detail.reviewed_at = detail.created_at + timedelta(days=days_offset, hours=hours_offset)
        detail.save()
        count += 1
        print(f"Updated DocumentDetail {detail.id}: reviewed_at set to {detail.reviewed_at}")
    
    print(f"\nUpdated {count} DocumentDetail records with reviewed_at timestamps")
    reviewed = DocumentDetail.objects.filter(reviewed_at__isnull=False).count()
    print(f"Total reviewed documents: {reviewed}")

if __name__ == '__main__':
    update_reviewed_timestamps()
    print("\n✓ Timestamp update completed!")
