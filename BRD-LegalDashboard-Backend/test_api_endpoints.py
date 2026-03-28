"""
Test API endpoints for creating reviews and reports
"""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Legal_Dashboard.settings')
django.setup()

from django.contrib.auth.models import User
from Legal_Dashboard.dashboard.models import Review, Report
from rest_framework.test import APIRequestFactory
from Legal_Dashboard.dashboard.views import ReviewViewSet, ReportViewSet

# Test data
test_user = User.objects.first()
print(f"Test User: {test_user.username} (ID: {test_user.id})\n")

# Test Create Review
print("=" * 50)
print("TESTING REVIEW CREATION")
print("=" * 50)

review_data = {
    'review_title': 'Test API Review',
    'description': 'This is a test review created via API',
    'assigned_to': test_user.id,
    'status': 'Pending'
}

factory = APIRequestFactory()
request = factory.post('/api/dashboard/reviews/', review_data, format='json')
view = ReviewViewSet.as_view({'post': 'create'})
response = view(request)

print(f"Status Code: {response.status_code}")
if response.status_code in [200, 201]:
    print("✓ Review created successfully!")
    print(f"Response Data: {json.dumps(response.data, indent=2, default=str)}")
else:
    print("✗ Failed to create review")
    print(f"Error: {response.data}")

# Test Create Report
print("\n" + "=" * 50)
print("TESTING REPORT GENERATION")
print("=" * 50)

report_data = {
    'report_type': 'summary',
    'date_from': '2026-02-01',
    'date_to': '2026-03-04'
}

request = factory.post('/api/dashboard/reports/', report_data, format='json')
view = ReportViewSet.as_view({'post': 'create'})
response = view(request)

print(f"Status Code: {response.status_code}")
if response.status_code in [200, 201]:
    print("✓ Report generated successfully!")
    print(f"Response Data: {json.dumps(response.data, indent=2, default=str)}")
else:
    print("✗ Failed to generate report")
    print(f"Error: {response.data}")

# Verify data was saved
print("\n" + "=" * 50)
print("VERIFICATION")
print("=" * 50)
print(f"Total Reviews in DB: {Review.objects.count()}")
print(f"Total Reports in DB: {Report.objects.count()}")

# Show latest review
latest_review = Review.objects.order_by('-created_at').first()
if latest_review:
    print(f"\nLatest Review: {latest_review.review_title}")
    print(f"  Status: {latest_review.status}")
    print(f"  Assigned to: {latest_review.assigned_to.username}")

# Show latest report
latest_report = Report.objects.order_by('-generated_at').first()
if latest_report:
    print(f"\nLatest Report: {latest_report.report_type}")
    print(f"  Date Range: {latest_report.date_from} to {latest_report.date_to}")

print("\n✓ API endpoint testing completed!")
