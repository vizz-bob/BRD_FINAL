
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AgentProfile,
    Performance,
    Collection,
    AppSettings,
    PrivacyPolicy,
    FAQ,
    SupportContact,
    SupportTicket,
)

from .serializers import (
    AppSettingsSerializer,
    PrivacyPolicySerializer,
    FAQSerializer,
    SupportContactSerializer,
    SupportTicketSerializer,
)


User = get_user_model()


def _format_inr(amount):
    value = int(amount or 0)
    s = str(abs(value))

    if len(s) <= 3:
        return f"₹{s}"

    head = s[:-3]
    tail = s[-3:]
    groups = []
    while len(head) > 2:
        groups.insert(0, head[-2:])
        head = head[:-2]
    if head:
        groups.insert(0, head)

    return f"₹{','.join(groups)},{tail}"


def _get_start_of_month(d):
    return d.replace(day=1)



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            profile = AgentProfile.objects.get(user=user)

            today = timezone.localdate()
            this_month_start = _get_start_of_month(today)
            last_month_start = _get_start_of_month(this_month_start - timedelta(days=1))

            this_month_collections = Collection.objects.filter(
                agent=profile,
                date__gte=this_month_start,
            )
            last_month_collections = Collection.objects.filter(
                agent=profile,
                date__gte=last_month_start,
                date__lt=this_month_start,
            )

            this_month_collected = this_month_collections.aggregate(total=Sum('amount'))['total'] or 0
            last_month_collected = last_month_collections.aggregate(total=Sum('amount'))['total'] or 0
            this_month_accounts = this_month_collections.aggregate(total=Sum('accounts_count'))['total'] or 0
            last_month_accounts = last_month_collections.aggregate(total=Sum('accounts_count'))['total'] or 0

            perf_rows = Performance.objects.filter(agent=profile).order_by('-id')
            this_perf = perf_rows.first()
            last_perf = perf_rows[1] if perf_rows.count() > 1 else None

            overall_collected = Collection.objects.filter(agent=profile).aggregate(total=Sum('amount'))['total'] or 0
            overall_accounts = Collection.objects.filter(agent=profile).aggregate(total=Sum('accounts_count'))['total'] or 0
            overall_target = Performance.objects.filter(agent=profile).aggregate(total=Sum('total_target'))['total'] or 0
            overall_achieved = Performance.objects.filter(agent=profile).aggregate(total=Sum('total_achieved'))['total'] or 0

            success_rate = int((overall_achieved / overall_target) * 100) if overall_target else 0
            avg_ticket = int(overall_collected / overall_accounts) if overall_accounts else 0

            if hasattr(user, 'get_full_name') and user.get_full_name():
                display_name = user.get_full_name()
            else:
                email = getattr(user, 'email', '') or ''
                display_name = email.split('@')[0] if email else 'Collection Agent'

            profile_data = {
                'agentId': profile.agent_id,
                'name': display_name,
                'email': getattr(user, 'email', ''),
                'mobile': profile.phone,
                'branch': profile.branch,
                'joinDate': profile.joined_date.strftime('%b %Y') if profile.joined_date else None,
                'profileImage': request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None,
            }

            performance_stats = {
                'thisMonth': {
                    'collected': int(this_month_collected),
                    'target': int(this_perf.total_target) if this_perf else 0,
                    'accounts': int(this_month_accounts),
                    'calls': int(this_perf.calls) if this_perf else 0,
                    'fieldVisits': int(this_perf.field_visits) if this_perf else 0,
                    'ptps': int(this_perf.ptp) if this_perf else 0,
                },
                'lastMonth': {
                    'collected': int(last_month_collected),
                    'target': int(last_perf.total_target) if last_perf else 0,
                    'accounts': int(last_month_accounts),
                },
                'overall': {
                    'totalCollected': int(overall_collected),
                    'successRate': success_rate,
                    'avgTicketSize': avg_ticket,
                },
            }

            recent_collection_rows = Collection.objects.filter(agent=profile).order_by('-date')[:5]
            recent_collections = [
                {
                    'date': row.date.strftime('%b %d, %Y'),
                    'amount': _format_inr(row.amount),
                    'accounts': row.accounts_count,
                }
                for row in recent_collection_rows
            ]

            return Response({
                'profileData': profile_data,
                'performanceStats': performance_stats,
                'recentCollections': recent_collections,
            })

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        except AgentProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)


class UpdateSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def _update_settings(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            profile = AgentProfile.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except AgentProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

        settings, _ = AppSettings.objects.get_or_create(agent=profile)

        serializer = AppSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated successfully"})
        return Response(serializer.errors)

    def post(self, request, user_id):
        return self._update_settings(request, user_id)

    def patch(self, request, user_id):
        return self._update_settings(request, user_id)


# 🔐 Privacy Policy
class PrivacyPolicyView(APIView):
    def get(self, request):
        policy = PrivacyPolicy.objects.first()
        serializer = PrivacyPolicySerializer(policy)
        return Response(serializer.data)


# ❓ FAQ
class FAQView(APIView):
    def get(self, request):
        faqs = FAQ.objects.filter(is_active=True)
        serializer = FAQSerializer(faqs, many=True)
        return Response(serializer.data)


# 📞 Support Contact
class SupportContactView(APIView):
    def get(self, request):
        contact = SupportContact.objects.first()
        serializer = SupportContactSerializer(contact)
        return Response(serializer.data)


# 🎫 Create Support Ticket
class CreateSupportTicketView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SupportTicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(agent=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# 📋 My Tickets
class MySupportTicketsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tickets = SupportTicket.objects.filter(agent=request.user)
        serializer = SupportTicketSerializer(tickets, many=True)
        return Response(serializer.data)

