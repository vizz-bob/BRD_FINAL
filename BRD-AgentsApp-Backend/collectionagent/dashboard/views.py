# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.utils.timezone import now
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from accounts.models import Account
# from rest_framework.permissions import AllowAny 
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from django.shortcuts import render
# from django.utils.timezone import now
# from django.db.models import Count, Sum
# from .models import CallLog, FieldVisit, PTP, Collection
# from django.http import JsonResponse
# from .models import Account, RecoveryHistory
# from .models import PTP



# from .models import *
# from .serializers import *

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def dashboard_home(request):

#     today = now().date()

#     # Today's collection
#     collection = DailyCollection.objects.filter(date=today).first()

#     # Stats
#     stats = AgentStats.objects.first()

#     # Buckets
#     buckets = BucketSummary.objects.all()

#     # Urgent PTPs
#     ptps = PTP.objects.filter(status='pending').order_by('due_date')[:5]

#     # Recent Activity
#     activities = Activity.objects.all().order_by('-created_at')[:5]

#     # Notifications
#     notifications_count = Notification.objects.filter(is_read=False).count()

#     return Response({
#         "collection": DailyCollectionSerializer(collection).data if collection else None,
#         "stats": AgentStatsSerializer(stats).data if stats else None,
#         "buckets": BucketSerializer(buckets, many=True).data,
#         "ptps": PTPSerializer(ptps, many=True).data,
#         "activities": ActivitySerializer(activities, many=True).data,
#         "notifications": notifications_count
#     })
# def notifications(request):
#     data = [
#         {
#             "title": "New Case Assigned",
#             "desc": "LOC-2025-8901 - Priya Sharma has been assigned to you",
#             "time": "2 minutes ago",
#             "type": "info"
#         },
#         {
#             "title": "Urgent: Priority Case",
#             "desc": "LOC-2025-8832 requires immediate attention",
#             "time": "15 minutes ago",
#             "type": "urgent"
#         },
#         {
#             "title": "Data Sync Complete",
#             "desc": "5 verifications uploaded successfully",
#             "time": "1 hour ago",
#             "type": "success"
#         },
#         {
#             "title": "Route Optimized",
#             "desc": "Your daily route has been updated with 3 new locations",
#             "time": "2 hours ago",
#             "type": "info"
#         }
#     ]

#     return render(request, "notifications.html", {"notifications": data})
# class DashboardView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         total = Account.objects.count()
#         sma0 = Account.objects.filter(bucket='SMA-0').count()
#         sma1 = Account.objects.filter(bucket='SMA-1').count()
#         sma2 = Account.objects.filter(bucket='SMA-2').count()
#         npa = Account.objects.filter(bucket='NPA').count()

#         return Response({
#             "total_accounts": total,
#             "SMA-0": sma0,
#             "SMA-1": sma1,
#             "SMA-2": sma2,
#             "NPA": npa
#         })


# def dashboard(request):
#     user = request.user
#     today = now().date()

#     # Calls Made (today)
#     calls = CallLog.objects.filter(user=user, created_at__date=today).count()

#     # Field Visits (today)
#     visits = FieldVisit.objects.filter(user=user, visit_date=today).count()

#     # Active PTPs
#     ptps = PTP.objects.filter(user=user, status='active').count()

#     # Success Rate
#     total = Collection.objects.filter(user=user).count()
#     success = Collection.objects.filter(user=user, is_success=True).count()

#     success_rate = 0
#     if total > 0:
#         success_rate = (success / total) * 100

#     context = {
#         "calls": calls,
#         "visits": visits,
#         "ptps": ptps,
#         "success_rate": round(success_rate, 1)
#     }

#     return render(request, "dashboard.html", context)

# def dashboard(request):
#     accounts = list(Account.objects.all().values())
#     recovery = list(RecoveryHistory.objects.all().values())

#     data = {
#         "quick_actions": {
#             "view_accounts": accounts,
#             "recovery_history": recovery
#         }
#     }

#     return JsonResponse(data)
# def get_ptp(request):
#     data = PTP.objects.all()
#     return JsonResponse({"ptp_count": data.count()})


# def dashboard_data(request):
#     accounts = Account.objects.count()
#     recovery = RecoveryHistory.objects.count()
#     ptp = PTP.objects.count()

#     return JsonResponse({
#         "accounts": accounts,
#         "recovery": recovery,
#         "ptp": ptp
#     })

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import JsonResponse
from django.utils.timezone import now
from django.db.models import Count, Sum

from collectionagent.accounts.models import CollectionAccount   # ✅ only from accounts
from collectionagent.accounts.serializers import AccountSerializer
from .models import *
from .serializers import *

from datetime import date
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import CallLog, FieldVisit, PTP, RecoveryHistory
from collectionagent.accounts.models import CollectionAccount as Account
from .serializers import QuickStatsSerializer


# ✅ DASHBOARD MAIN API
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_home(request):

    today = now().date()

    # Always get or create today's collection
    collection, created = DailyCollection.objects.get_or_create(
        date=today,
        defaults={"target_amount": 0, "collected_amount": 0}
    )
    
    stats = AgentStats.objects.first()
    buckets = BucketSummary.objects.all()
    ptps = PTP.objects.filter(status='pending').order_by('due_date')[:5]
    activities = Activity.objects.all().order_by('-created_at')[:5]
    notifications_count = Notification.objects.filter(is_read=False).count()

    return Response({
        "collection": DailyCollectionSerializer(collection).data,
        "stats": AgentStatsSerializer(stats).data if stats else None,
        "buckets": BucketSerializer(buckets, many=True).data,
        "ptps": PTPSerializer(ptps, many=True).data,
        "activities": ActivitySerializer(activities, many=True).data,
        "notifications": notifications_count
    })

# ✅ VIEW ACCOUNTS
@api_view(['GET'])
def view_accounts(request):
    accounts = Account.objects.all()
    serializer = AccountSerializer(accounts, many=True)
    return Response(serializer.data)


# ✅ RECOVERY HISTORY
@api_view(['GET'])
def recovery_history(request):
    recovery = RecoveryHistory.objects.all()
    serializer = RecoveryHistorySerializer(recovery, many=True)
    return Response(serializer.data)


# ✅ DASHBOARD QUICK STATS
@api_view(['GET'])
def dashboard_data(request):
    return Response({
        "accounts_count": Account.objects.count(),
        "recovery_count": RecoveryHistory.objects.count(),
        "ptp_count": PTP.objects.count()
    })
@api_view(['GET'])
def get_ptp(request):
    ptps = PTP.objects.filter(status='pending').order_by('due_date')
    return Response(PTPSerializer(ptps, many=True).data)


# ✅ BUCKET SUMMARY (optional)
class DashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "total_accounts": Account.objects.count(),
            "SMA-0": Account.objects.filter(bucket='SMA-0').count(),
            "SMA-1": Account.objects.filter(bucket='SMA-1').count(),
            "SMA-2": Account.objects.filter(bucket='SMA-2').count(),
            "NPA": Account.objects.filter(bucket='NPA').count()
        })

from django.shortcuts import render

def notifications(request):
    data = [
        {
            "title": "New Case Assigned",
            "desc": "LOC-2025-8901 assigned",
            "time": "2 mins ago",
            "type": "info"
        }
    ]

    return render(request, "notifications.html", {"notifications": data})

class QuickStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = date.today()

        # Calls made today
        calls_made = CallLog.objects.filter(
            created_by=user,
            created_at__date=today
        ).count()

        # Field visits today
        field_visits = FieldVisit.objects.filter(
            created_by=user,
            created_at__date=today
        ).count()

        # Active PTPs
        active_ptps = PTP.objects.filter(
            created_by=user,
            status="ACTIVE"
        ).count()

        # Success rate
        total_actions = RecoveryHistory.objects.filter(
            created_by=user
        ).count()

        successful_actions = RecoveryHistory.objects.filter(
            created_by=user,
            status="SUCCESS"
        ).count()

        success_rate = (
            (successful_actions / total_actions) * 100
            if total_actions > 0 else 0
        )

        data = {
            "calls_made": calls_made,
            "field_visits": field_visits,
            "active_ptps": active_ptps,
            "success_rate": round(success_rate, 2),
        }

        serializer = QuickStatsSerializer(data)
        return Response(serializer.data)

