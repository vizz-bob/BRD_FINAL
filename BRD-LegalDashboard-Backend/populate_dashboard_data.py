"""
Script to populate test data for dashboard
"""
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Legal_Dashboard.settings')
django.setup()

from Legal_Dashboard.dashboard.models import Document, Review, DocumentDetail
from django.contrib.auth.models import User
from django.utils import timezone

def create_sample_reviews():
    """Create sample reviews for testing"""
    
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='test_reviewer',
        defaults={
            'email': 'reviewer@example.com',
            'first_name': 'Test',
            'last_name': 'Reviewer'
        }
    )
    if created:
        user.set_password('password123')
        user.save()
        print(f"Created user: {user.username}")
    else:
        print(f"Using existing user: {user.username}")
    
    # Create reviews with different statuses
    review_data = [
        {
            'review_title': 'Loan Agreement Review - Pending',
            'description': 'Review loan agreement terms and conditions',
            'status': 'Pending',
            'days_ago': 2
        },
        {
            'review_title': 'Property Document Review - Pending',
            'description': 'Verify property ownership documents',
            'status': 'Pending',
            'days_ago': 3
        },
        {
            'review_title': 'Collateral Review - Pending',
            'description': 'Review collateral documentation',
            'status': 'Pending',
            'days_ago': 1
        },
        {
            'review_title': 'Income Proof Verification - Approved',
            'description': 'Verify income proof documents',
            'status': 'Approved',
            'days_ago': 0  # Today
        },
        {
            'review_title': 'Credit Agreement - Approved',
            'description': 'Credit agreement compliance check',
            'status': 'Approved',
            'days_ago': 0  # Today
        },
        {
            'review_title': 'Mortgage Agreement - Approved',
            'description': 'Mortgage documentation review',
            'status': 'Approved',
            'days_ago': 5
        },
        {
            'review_title': 'KYC Documents - Approved',
            'description': 'KYC documentation verification',
            'status': 'Approved',
            'days_ago': 7
        },
        {
            'review_title': 'Business Loan - Approved',
            'description': 'Business loan agreement review',
            'status': 'Approved',
            'days_ago': 10
        },
        {
            'review_title': 'Invalid Documents - Rejected',
            'description': 'Incomplete documentation',
            'status': 'Rejected',
            'days_ago': 4
        },
        {
            'review_title': 'Expired Proof - Rejected',
            'description': 'Documents expired',
            'status': 'Rejected',
            'days_ago': 8
        }
    ]
    
    created_count = 0
    for data in review_data:
        # Calculate created_at based on days_ago
        created_at = timezone.now() - timedelta(days=data['days_ago'])
        
        review, created = Review.objects.get_or_create(
            review_title=data['review_title'],
            defaults={
                'description': data['description'],
                'assigned_to': user,
                'status': data['status'],
                'created_at': created_at
            }
        )
        
        if created:
            # Update created_at manually (since auto_now_add prevents it)
            Review.objects.filter(id=review.id).update(created_at=created_at)
            created_count += 1
            print(f"Created review: {review.review_title} (Status: {review.status})")
    
    print(f"\nTotal reviews created: {created_count}")
    print(f"Total reviews in database: {Review.objects.count()}")
    
    # Print summary
    print("\n=== Review Summary ===")
    print(f"Pending: {Review.objects.filter(status='Pending').count()}")
    print(f"Approved: {Review.objects.filter(status='Approved').count()}")
    print(f"Rejected: {Review.objects.filter(status='Rejected').count()}")
    print(f"Approved Today: {Review.objects.filter(status='Approved', created_at__date=timezone.now().date()).count()}")
    
    # Update DocumentDetails with review timestamps
    print("\n=== Updating DocumentDetails ===")
    doc_details = DocumentDetail.objects.all()
    for detail in doc_details:
        if detail.status == 'Approved' and not detail.reviewed_at:
            detail.reviewed_at = timezone.now() - timedelta(days=1, hours=2)
            detail.save()
            print(f"Updated DocumentDetail {detail.id} with reviewed_at timestamp")

if __name__ == '__main__':
    create_sample_reviews()
    print("\n✓ Dashboard data population completed!")
