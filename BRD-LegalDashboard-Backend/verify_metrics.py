"""
Verify dashboard metrics
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Legal_Dashboard.settings')
django.setup()

from Legal_Dashboard.dashboard.models import Review, DocumentDetail
from django.utils import timezone

print("=== Dashboard Metrics Verification ===\n")

# Review counts
pending = Review.objects.filter(status='Pending').count()
approved_total = Review.objects.filter(status='Approved').count()
approved_today = Review.objects.filter(status='Approved', created_at__date=timezone.now().date()).count()
total_reviews = Review.objects.count()

print(f"Pending Reviews: {pending}")
print(f"Approved Today: {approved_today}")
print(f"Total Approved: {approved_total}")
print(f"Total Reviews: {total_reviews}")

# Compliance Score
if total_reviews > 0:
    compliance_score = round((approved_total / total_reviews) * 100, 2)
    print(f"Compliance Score: {compliance_score}%")
else:
    print("Compliance Score: 0%")

# Average TAT
reviewed_docs = DocumentDetail.objects.filter(
    reviewed_at__isnull=False,
    created_at__isnull=False
)

if reviewed_docs.exists():
    total_tat = 0
    count = 0
    for doc in reviewed_docs:
        tat = doc.average_tat()
        if tat is not None:
            total_tat += tat
            count += 1
    
    if count > 0:
        average_tat = round(total_tat / count, 2)
        print(f"Average TAT: {average_tat} days")
    else:
        print("Average TAT: 0 days")
else:
    print("Average TAT: 0 days (No reviewed documents)")

print("\n✓ Dashboard metrics calculated successfully!")
