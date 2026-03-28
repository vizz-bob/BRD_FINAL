from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now
from django.db.models import Avg
from datetime import timedelta

from .models import Document, Review, Report
from .serializers import (
    DocumentSerializer,
    ReviewSerializer,
    ReportSerializer
)


# =========================
# DOCUMENT VIEWSET
# =========================
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by('-uploaded_at')
    serializer_class = DocumentSerializer


# =========================
# REVIEW VIEWSET
# =========================
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer


# =========================
# REPORT VIEWSET
# =========================
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by('-generated_at')
    serializer_class = ReportSerializer


# =========================
# DASHBOARD SUMMARY API
# =========================
class DashboardSummaryAPIView(APIView):

    def get(self, request):

        pending_reviews = Review.objects.filter(status="Pending").count()

        approved_today = Review.objects.filter(
            status="Approved",
            created_at__date=now().date()
        ).count()

        total_reviews = Review.objects.count()
        compliance_score = 0

        if total_reviews > 0:
            approved_count = Review.objects.filter(status="Approved").count()
            compliance_score = round((approved_count / total_reviews) * 100, 2)

        # Calculate Average TAT (Turnaround Time)
        from .models import DocumentDetail
        
        # Get all reviewed documents with timestamps
        reviewed_docs = DocumentDetail.objects.filter(
            reviewed_at__isnull=False,
            created_at__isnull=False
        )
        
        average_tat = 0
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
        
        # Document status distribution
        doc_status_counts = {}
        for status_choice in DocumentDetail.STATUS_CHOICES:
            status = status_choice[0]
            count = DocumentDetail.objects.filter(status=status).count()
            doc_status_counts[status] = count
        
        # Document type distribution
        doc_type_counts = {}
        documents = Document.objects.values('document_type').distinct()
        for doc in documents:
            doc_type = doc['document_type']
            count = Document.objects.filter(document_type=doc_type).count()
            doc_type_counts[doc_type] = count
        
        # Review status distribution
        review_status_counts = {
            'Pending': Review.objects.filter(status='Pending').count(),
            'Approved': Review.objects.filter(status='Approved').count(),
            'Rejected': Review.objects.filter(status='Rejected').count(),
        }
        
        # Timeline data (last 6 months)
        from django.db.models.functions import TruncMonth
        from django.db.models import Count
        import calendar
        
        six_months_ago = now() - timedelta(days=180)
        
        # Reviews per month
        reviews_timeline = Review.objects.filter(
            created_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')
        
        timeline_labels = []
        timeline_values = []
        for entry in reviews_timeline:
            month_name = calendar.month_abbr[entry['month'].month]
            timeline_labels.append(month_name)
            timeline_values.append(entry['count'])
        
        # Compliance trend (last 6 months)
        compliance_trend_labels = []
        compliance_trend_values = []
        
        for i in range(5, -1, -1):
            month_date = now() - timedelta(days=30*i)
            month_start = month_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            # Calculate next month start
            if month_start.month == 12:
                month_end = month_start.replace(year=month_start.year + 1, month=1)
            else:
                month_end = month_start.replace(month=month_start.month + 1)
            
            total = Review.objects.filter(created_at__gte=month_start, created_at__lt=month_end).count()
            approved = Review.objects.filter(status='Approved', created_at__gte=month_start, created_at__lt=month_end).count()
            
            score = round((approved / total * 100), 2) if total > 0 else 0
            compliance_trend_labels.append(calendar.month_abbr[month_start.month])
            compliance_trend_values.append(score)

        return Response({
            "pending_reviews": pending_reviews,
            "approved_today": approved_today,
            "average_tat": average_tat,
            "compliance_score": compliance_score,
            "document_status_distribution": doc_status_counts,
            "document_type_distribution": doc_type_counts,
            "review_status_distribution": review_status_counts,
            "reviews_timeline": {
                "labels": timeline_labels if timeline_labels else ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
                "values": timeline_values if timeline_values else [0, 0, 0, 0, 0, 0]
            },
            "compliance_trend": {
                "labels": compliance_trend_labels,
                "values": compliance_trend_values
            }
        })
from rest_framework.generics import RetrieveAPIView
from .models import DocumentDetail
from .serializers import DocumentDetailSerializer


class DocumentDetailAPIView(RetrieveAPIView):
    queryset = DocumentDetail.objects.all()
    serializer_class = DocumentDetailSerializer
    lookup_field = 'document_id'