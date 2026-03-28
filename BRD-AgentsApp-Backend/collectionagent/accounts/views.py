from rest_framework import generics, filters
from .models import CollectionAccount
from .serializers import CollectionAccountSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import CollectionAccount, Recovery, FollowUp, VisitRecording, VisitPhoto, VisitAudioRecording
from .serializers import (
    CollectionAccountSerializer,
    RecoverySerializer,
    FollowUpSerializer,
    VisitRecordingSerializer,
    VisitPhotoSerializer,
    VisitAudioRecordingSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Recovery, FollowUp
from .serializers import RecoverySerializer, FollowUpSerializer
from .models import RepossessionHistory
from .serializers import RepossessionHistorySerializer
from collectionagent.recovery.models import Payment
from django.utils import timezone
from datetime import timedelta


class CollectionAccountListView(generics.ListAPIView):
    queryset = CollectionAccount.objects.all()
    serializer_class = CollectionAccountSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['account_id', 'customer_name', 'phone']
    ordering_fields = ['dpd', 'emi_amount', 'due_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        bucket = self.request.query_params.get('bucket')

        if bucket:
            queryset = queryset.filter(bucket=bucket)

        return queryset

# Create Recovery
class CreateRecoveryView(generics.CreateAPIView):
    queryset = Recovery.objects.all()
    serializer_class = RecoverySerializer
    permission_classes = [IsAuthenticated]

# Create FollowUp
class CreateFollowUpView(generics.CreateAPIView):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer
    permission_classes = [IsAuthenticated]


# -----------------------
# Create Recovery
# -----------------------
class CreateRecoveryView(APIView):
    def post(self, request):
        serializer = RecoverySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(agent=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# -----------------------
# List Recovery
# -----------------------
class RecoveryListView(APIView):
    def get(self, request):
        data = Recovery.objects.filter(agent=request.user)
        serializer = RecoverySerializer(data, many=True)
        return Response(serializer.data)


# -----------------------
# Create FollowUp
# -----------------------
class CreateFollowUpView(APIView):
    def post(self, request):
        serializer = FollowUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(agent=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# -----------------------
# List FollowUps
# -----------------------
class FollowUpListView(APIView):
    def get(self, request):
        followups = FollowUp.objects.all().order_by('-id')
        serializer = FollowUpSerializer(followups, many=True)
        return Response(serializer.data)

class RepossessionListView(APIView):
    def get(self, request):
        repos = RepossessionHistory.objects.all().order_by('-id')
        serializer = RepossessionHistorySerializer(repos, many=True)
        return Response(serializer.data)

from django.http import HttpResponse

def call_phone(request):
    # Get the phone number from query params, fallback to default
    phone_number = request.GET.get("number", "+911234567890")
    
    # Return clickable link that opens dialer
    html_content = f'''
        <html>
            <body>
                <a href="tel:{phone_number}" style="font-size:24px;">📞 Call {phone_number}</a>
            </body>
        </html>
    '''
    return HttpResponse(html_content)

from django.shortcuts import redirect

def call_phone_redirect(request):
    phone_number = request.GET.get("number", "+911234567890")
    return redirect(f"tel:{phone_number}")

from rest_framework.views import APIView
from rest_framework.response import Response

class CallPhoneAPI(APIView):
    permission_classes = []  # If you want public access, otherwise add IsAuthenticated

    def get(self, request):
        # Example: fetch number dynamically from DB
        # Here, fallback default number is +911234567890
        phone_number = request.GET.get("number", "+911234567890")
        return Response({"phone_number": phone_number})


class AccountActionLinksView(APIView):
    """
    Returns dynamic links for phone, WhatsApp, and Maps
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, account_id):
        try:
            account = CollectionAccount.objects.get(id=account_id)
        except CollectionAccount.DoesNotExist:
            return Response({"error": "Account not found"}, status=404)

        phone_number = account.phone_number
        location = account.location  # can be "City, State" or "latitude,longitude"

        data = {
            "call_link": f"tel:{phone_number}",                       # opens phone dialer
            "whatsapp_link": f"https://wa.me/{phone_number}",        # opens WhatsApp chat
            "maps_link": f"https://www.google.com/maps/search/?api=1&query={location}"  # opens Maps
        }

        return Response(data)


def _resolve_account_queryset(request):
    account_uuid = request.query_params.get('account')
    account_id = request.query_params.get('account_id')
    accounts = CollectionAccount.objects.all()
    if account_uuid:
        accounts = accounts.filter(id=account_uuid)
    elif account_id:
        accounts = accounts.filter(account_id=account_id)
    return accounts


def _format_indian_amount(value, with_symbol=False):
    amount = int(value or 0)
    digits = str(abs(amount))
    if len(digits) > 3:
        head = digits[:-3]
        tail = digits[-3:]
        groups = []
        while len(head) > 2:
            groups.insert(0, head[-2:])
            head = head[:-2]
        if head:
            groups.insert(0, head)
        digits = ','.join(groups + [tail])
    return f"₹{digits}" if with_symbol else digits


class PTPHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = _resolve_account_queryset(request)
        ptp_rows = FollowUp.objects.filter(
            account__in=accounts,
            ptp_amount__isnull=False
        ).exclude(ptp_date__isnull=True).order_by('-ptp_date', '-id')[:30]

        today = timezone.localdate()
        data = []
        for row in ptp_rows:
            if row.ptp_date == today + timedelta(days=1):
                display_date = 'Tomorrow'
            else:
                display_date = row.ptp_date.strftime('%d %b %Y')

            status_text = 'Pending' if row.ptp_date >= today else 'Completed'
            data.append({
                'id': row.id,
                'date': display_date,
                'amount': _format_indian_amount(row.ptp_amount),
                'status': status_text,
            })

        return Response(data)


class CallHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = _resolve_account_queryset(request)
        call_rows = FollowUp.objects.filter(
            account__in=accounts,
            followup_type='phone_call'
        ).order_by('-created_at', '-id')[:30]

        today = timezone.localdate()
        data = []
        for row in call_rows:
            call_date = timezone.localtime(row.created_at)
            if call_date.date() == today:
                dt_label = f"Today, {call_date.strftime('%I:%M %p').lstrip('0')}"
            elif call_date.date() == (today - timedelta(days=1)):
                dt_label = f"Yesterday, {call_date.strftime('%I:%M %p').lstrip('0')}"
            else:
                dt_label = call_date.strftime('%d %b %Y, %I:%M %p').lstrip('0')

            data.append({
                'id': row.id,
                'disposition': (row.disposition or '').replace('_', ' ').upper(),
                'datetime': dt_label,
                'duration': '-',
                'notes': row.notes or '',
            })

        return Response(data)


class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = _resolve_account_queryset(request)
        payments = Payment.objects.filter(
            account__in=accounts
        ).order_by('-collection_date', '-id')[:30]

        data = []
        for row in payments:
            data.append({
                'id': row.id,
                'date': row.collection_date.strftime('%d %b %Y'),
                'amount': _format_indian_amount(row.amount, with_symbol=True),
                'mode': row.payment_mode.upper(),
                'status': 'Success',
            })

        return Response(data)


class VisitRecordingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account_uuid = request.query_params.get('account')
        account_id = request.query_params.get('account_id')

        visits = VisitRecording.objects.filter(agent=request.user).order_by('-created_at')
        if account_uuid:
            visits = visits.filter(account_id=account_uuid)
        elif account_id:
            visits = visits.filter(account__account_id=account_id)

        serializer = VisitRecordingSerializer(visits, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VisitRecordingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(agent=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisitRecordingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, visit_id):
        try:
            return VisitRecording.objects.get(id=visit_id, agent=request.user)
        except VisitRecording.DoesNotExist:
            return None

    def get(self, request, visit_id):
        visit = self.get_object(request, visit_id)
        if not visit:
            return Response({'error': 'Visit recording not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = VisitRecordingSerializer(visit)
        return Response(serializer.data)

    def patch(self, request, visit_id):
        visit = self.get_object(request, visit_id)
        if not visit:
            return Response({'error': 'Visit recording not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = VisitRecordingSerializer(visit, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, visit_id):
        visit = self.get_object(request, visit_id)
        if not visit:
            return Response({'error': 'Visit recording not found'}, status=status.HTTP_404_NOT_FOUND)
        visit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class VisitPhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, visit_id):
        try:
            visit = VisitRecording.objects.get(id=visit_id, agent=request.user)
        except VisitRecording.DoesNotExist:
            return Response({'error': 'Visit recording not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = VisitPhotoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(visit=visit)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisitAudioUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, visit_id):
        try:
            visit = VisitRecording.objects.get(id=visit_id, agent=request.user)
        except VisitRecording.DoesNotExist:
            return Response({'error': 'Visit recording not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = VisitAudioRecordingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(visit=visit)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)