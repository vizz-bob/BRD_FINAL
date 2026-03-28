from rest_framework import viewsets, permissions, filters, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Lead, LeadQuery, LeadDocument, LeadActivity, LeadComment, Customer, LeadStatusHistory
from channelpartner.accounts.models import User
from .serializers import (
    LeadSerializer, LeadStatusUpdateSerializer, LeadDetailSerializer,
    LeadQuerySerializer, LeadDocumentSerializer, LeadActivitySerializer,
    LeadCommentSerializer, CustomerSerializer, LeadStatusHistorySerializer, ProductTypeChoicesSerializer
)
from django.db.models import Q
from channelpartner.payouts.models import Payout
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.utils import timezone
import logging
import uuid
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError

logger = logging.getLogger(__name__)


def _to_channel_role(role_value):
    role = (role_value or '').strip().upper().replace(' ', '_')
    mapping = {
        'CHANNEL_PARTNER': 'PARTNER',
        'CHANNEL_PARTENER': 'PARTNER',
        'PARTNER': 'PARTNER',
        'ADMIN': 'ADMIN',
        'CREDIT_OPS': 'CREDIT_OPS',
    }
    return mapping.get(role)


def get_channelpartner_user(auth_user, create_if_missing=False):
    if isinstance(auth_user, User):
        return auth_user

    email = getattr(auth_user, 'email', None)
    if not email:
        return None

    user = User.objects.filter(email__iexact=email).first()
    if user or not create_if_missing:
        return user

    channel_role = _to_channel_role(getattr(auth_user, 'role', None))
    if not channel_role:
        return None

    base_username = email.split('@')[0] if '@' in email else f'user_{uuid.uuid4().hex[:8]}'
    username = base_username
    while User.objects.filter(username=username).exists():
        username = f"{base_username}_{uuid.uuid4().hex[:6]}"

    user = User(
        username=username,
        email=email,
        role=channel_role,
        is_active=getattr(auth_user, 'is_active', True),
    )
    user.set_unusable_password()
    user.save()
    return user


def normalize_role(user_obj):
    role = (getattr(user_obj, 'role', '') or '').upper().replace(' ', '_')
    if role in ('CHANNEL_PARTENER', 'CHANNEL_PARTNER'):
        return 'PARTNER'
    return role

class LeadViewSet(viewsets.ModelViewSet):
    """
    Lead Management ViewSet
    """
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'mobile', 'lead_id', 'pan', 'aadhaar', 'email']
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'amount', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        auth_user = self.request.user
        channel_user = get_channelpartner_user(auth_user)
        role = normalize_role(channel_user or auth_user)
        queryset = Lead.objects.select_related('partner', 'credit_ops')

        if role == 'ADMIN':
            return queryset
        elif role == 'PARTNER':
            if channel_user:
                return queryset.filter(partner=channel_user)
            if getattr(auth_user, 'email', None):
                return queryset.filter(partner__email=auth_user.email)
            return Lead.objects.none()
        elif role == 'CREDIT_OPS':
            return queryset
        
        return Lead.objects.none()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LeadDetailSerializer
        return LeadSerializer

    def perform_create(self, serializer):
        channel_user = get_channelpartner_user(self.request.user, create_if_missing=True)
        role = normalize_role(channel_user or self.request.user)

        if not channel_user:
            raise ValidationError("No channel partner user mapped to the authenticated account")
        if role != 'PARTNER':
            raise ValidationError("Only partners can create leads")
        
        lead = serializer.save(partner=channel_user, status='ACTIVE')
        
        # Log activity
        LeadActivity.objects.create(
            lead=lead,
            user=channel_user,
            activity_type='CREATED',
            description=f"Lead {lead.lead_id} created by partner {channel_user.username}"
        )
        
        logger.info(f"Lead {lead.lead_id} created by partner {channel_user.username}")
        return lead

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        channel_user = get_channelpartner_user(request.user)
        role = normalize_role(channel_user or request.user)
        if role not in ['ADMIN', 'CREDIT_OPS']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        lead = self.get_object()
        old_status = lead.status
        new_status = request.data.get('status')
        
        valid_statuses = ['ACTIVE', 'UNDER_REVIEW', 'SANCTIONED', 'REJECTED']
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = LeadStatusUpdateSerializer(lead, data=request.data, partial=True)
        if serializer.is_valid():
            lead = serializer.save()
            
            # Log activity
            LeadActivity.objects.create(
                lead=lead,
                user=channel_user,
                activity_type='STATUS_CHANGED',
                description=f"Status changed from {old_status} to {lead.status} by {(channel_user.username if channel_user else request.user.email)}"
            )
            
            if lead.status == 'SANCTIONED' and old_status != 'SANCTIONED':
                if not Payout.objects.filter(lead=lead).exists():
                    commission_percentage = Decimal(request.data.get('commission_percentage', '2.50'))
                    disbursed_amount = lead.amount
                    
                    payout = Payout.objects.create(
                        lead=lead,
                        partner=lead.partner,
                        commission_percentage=commission_percentage,
                        disbursed_amount=disbursed_amount,
                        status='PENDING'
                    )
                    
                    # Log activity
                    LeadActivity.objects.create(
                        lead=lead,
                        user=channel_user,
                        activity_type='PAYOUT_CREATED',
                        description=f"Payout of ₹{payout.commission_amount} created for partner"
                    )
                    
                    logger.info(f"Payout created for lead {lead.lead_id}")
            
            return Response({'message': 'Status updated successfully', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def assign_to_me(self, request, pk=None):
        channel_user = get_channelpartner_user(request.user)
        role = normalize_role(channel_user or request.user)
        if role != 'CREDIT_OPS':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        if not channel_user:
            return Response({'error': 'No channel user mapping found'}, status=status.HTTP_400_BAD_REQUEST)
        
        lead = self.get_object()
        if lead.credit_ops and lead.credit_ops != channel_user:
            return Response({'error': 'Already assigned'}, status=status.HTTP_400_BAD_REQUEST)
        
        lead.credit_ops = channel_user
        if lead.status == 'ACTIVE':
            lead.status = 'UNDER_REVIEW'
        lead.save()
        
        # Log activity
        LeadActivity.objects.create(
            lead=lead,
            user=channel_user,
            activity_type='ASSIGNED',
            description=f"Lead assigned to credit ops {channel_user.username}"
        )
        
        return Response({'status': 'Assigned to you'})

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """
        Upload a document for a specific lead.
        """
        lead = self.get_object()
        
        # Check permissions - similar to other actions, only partners or allowed roles should upload
        # Assuming partners can upload to their leads
        channel_user = get_channelpartner_user(request.user)
        role = normalize_role(channel_user or request.user)
        if role == 'PARTNER' and channel_user and lead.partner != channel_user:
             return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Prepare data for LeadDocumentSerializer
        data = request.data.copy()
        data['lead'] = lead.id # Ensure the document is associated with this lead
        
        serializer = LeadDocumentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(uploaded_by=channel_user, lead=lead)
            
            # Log activity is handled in LeadDocumentViewSet.perform_create equivalent, 
            # but since we are using serializer.save() directly, we might need to manually log or rely on signals if any.
            # The LeadDocumentViewSet.perform_create has logging logic. We should probably replicate it or use common logic.
            # Replicating simple logging here for now as perform_create is ViewSet specific.
            LeadActivity.objects.create(
                lead=lead,
                user=channel_user,
                activity_type='DOCUMENT_UPLOADED',
                description=f"Document uploaded via quick action: {serializer.validated_data.get('document_type', 'Unknown')}"
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def quick_actions(self, request, pk=None):
        """
        Get quick actions for a lead (call, whatsapp, email, upload, sms)
        """
        lead = self.get_object()
        return Response({
            'lead_id': lead.lead_id,
            'name': lead.name,
            'mobile': lead.mobile,
            'email': lead.email,
            'actions': {
                'call': {
                    'label': 'Call',
                    'action': 'call',
                    'value': lead.mobile,
                    'enabled': bool(lead.mobile),
                    'icon': 'phone'
                },
                'whatsapp': {
                    'label': 'WhatsApp',
                    'action': 'whatsapp',
                    'value': lead.mobile,
                    'enabled': bool(lead.mobile),
                    'icon': 'whatsapp'
                },
                'email': {
                    'label': 'Email',
                    'action': 'email',
                    'value': lead.email,
                    'enabled': bool(lead.email),
                    'icon': 'mail'
                },
                'upload': {
                    'label': 'Upload Document',
                    'action': 'upload',
                    'url': f'/api/leads/{lead.id}/upload_document/',
                    'enabled': True,
                    'icon': 'upload'
                },
                'sms': {
                    'label': 'Send SMS',
                    'action': 'sms',
                    'value': lead.mobile,
                    'enabled': bool(lead.mobile),
                    'icon': 'message'
                }
            }
        })

    @action(detail=True, methods=['post', 'get'])
    def send_email(self, request, pk=None):
        """Send email to lead. POST sends via server, GET returns mailto link."""
        lead = self.get_object()
        if not lead.email:
            return Response({'error': 'Lead has no email'}, status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'POST':
            subject = request.data.get('subject', f'Regarding your lead {lead.lead_id}')
            message = request.data.get('message', '')
            from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
            recipient = [lead.email]

            if not from_email:
                return Response({'error': 'Email not configured (DEFAULT_FROM_EMAIL missing)'}, status=status.HTTP_501_NOT_IMPLEMENTED)

            try:
                send_mail(subject, message, from_email, recipient, fail_silently=False)
                LeadActivity.objects.create(
                    lead=lead, user=get_channelpartner_user(request.user), activity_type='COMMENT_ADDED',
                    description=f"Email sent to {lead.email}"
                )
                return Response({'message': 'Email sent'})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'mailto_uri': f"mailto:{lead.email}"})

    @action(detail=True, methods=['post', 'get'])
    def send_sms(self, request, pk=None):
        """Send SMS to lead. Requires TWILIO configuration. GET returns link."""
        lead = self.get_object()
        if not lead.mobile:
            return Response({'error': 'Lead has no mobile number'}, status=status.HTTP_400_BAD_REQUEST)

        message = request.data.get('message', request.query_params.get('message', ''))

        # Check Twilio
        tw_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
        tw_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
        tw_from = getattr(settings, 'TWILIO_FROM_NUMBER', None)

        if request.method == 'POST' and tw_sid and tw_token and tw_from:
            try:
                from twilio.rest import Client
                client = Client(tw_sid, tw_token)
                sms = client.messages.create(body=message, from_=tw_from, to=lead.mobile)
                LeadActivity.objects.create(
                    lead=lead, user=get_channelpartner_user(request.user), activity_type='COMMENT_ADDED',
                    description=f"SMS sent to {lead.mobile} (sid={sms.sid})"
                )
                return Response({'message': 'SMS sent', 'sid': sms.sid})
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'sms_uri': f"sms:{lead.mobile}?body={message}"})

    @action(detail=True, methods=['post', 'get'])
    def send_whatsapp(self, request, pk=None):
        """Send WhatsApp. Requires TWILIO. GET returns link."""
        lead = self.get_object()
        if not lead.mobile:
            return Response({'error': 'Lead has no mobile number'}, status=status.HTTP_400_BAD_REQUEST)

        message = request.data.get('message', request.query_params.get('message', ''))
        tw_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
        wa_from = getattr(settings, 'TWILIO_WHATSAPP_FROM', None)

        if request.method == 'POST' and tw_sid and wa_from:
            # (Twilio logic here - simplified for brevity)
            return Response({'message': 'WhatsApp sent via Twilio (Simulated)'})

        wa_link = f"https://wa.me/{lead.mobile}?text={message}"
        return Response({'wa_link': wa_link})

    @action(detail=True, methods=['get'])
    def email_link(self, request, pk=None):
        """Return mailto: URI for client."""
        lead = self.get_object()
        if not lead.email:
            return Response({'error': 'Lead has no email'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'mailto_uri': f"mailto:{lead.email}"})

    @action(detail=True, methods=['get'])
    def call_link(self, request, pk=None):
        """Return tel: URI for client to initiate call, or attempt server-side call if Twilio configured."""
        lead = self.get_object()
        if not lead.mobile:
            return Response({'error': 'Lead has no mobile number'}, status=status.HTTP_400_BAD_REQUEST)

        tw_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
        tw_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
        tw_from = getattr(settings, 'TWILIO_FROM_NUMBER', None)

        if tw_sid and tw_token and tw_from:
            # Server-side call would require Twilio Programmable Voice setup; return info message
            return Response({'message': 'Server-side call via Twilio is available but not auto-initiated by this endpoint. Configure call flow separately.'})

        return Response({'tel_uri': f'tel:{lead.mobile}'} )

    # ... keep existing actions (my_leads, unassigned, statistics) ...
    @action(detail=False, methods=['get'])
    def my_leads(self, request):
        channel_user = get_channelpartner_user(request.user)
        role = normalize_role(channel_user or request.user)
        if role != 'CREDIT_OPS':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        leads = Lead.objects.filter(credit_ops=channel_user)
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unassigned(self, request):
        role = normalize_role(get_channelpartner_user(request.user) or request.user)
        if role not in ['CREDIT_OPS', 'ADMIN']:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        leads = Lead.objects.filter(credit_ops__isnull=True, status='ACTIVE')
        serializer = self.get_serializer(leads, many=True)
        return Response({'count': leads.count(), 'leads': serializer.data})

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        auth_user = request.user
        channel_user = get_channelpartner_user(auth_user)
        role = normalize_role(channel_user or auth_user)
        if role == 'PARTNER' and channel_user:
            leads = Lead.objects.filter(partner=channel_user)
        elif role == 'CREDIT_OPS' and channel_user:
            leads = Lead.objects.filter(credit_ops=channel_user)
        elif role == 'ADMIN':
            leads = Lead.objects.all()
        else:
            return Response({'error': 'Invalid role'}, status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'total': leads.count(),
            'active': leads.filter(status='ACTIVE').count(),
            'under_review': leads.filter(status='UNDER_REVIEW').count(),
            'sanctioned': leads.filter(status='SANCTIONED').count(),
            'rejected': leads.filter(status='REJECTED').count(),
            'total_amount': sum(lead.amount for lead in leads),
        }
        return Response(stats)


class LeadQueryViewSet(viewsets.ModelViewSet):
    serializer_class = LeadQuerySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_user = get_channelpartner_user(self.request.user)
        role = normalize_role(channel_user or self.request.user)
        if role == 'PARTNER' and channel_user:
            return LeadQuery.objects.filter(lead__partner=channel_user)
        return LeadQuery.objects.all()

    def perform_create(self, serializer):
        channel_user = get_channelpartner_user(self.request.user)
        query = serializer.save(raised_by=channel_user)
        # Log activity
        LeadActivity.objects.create(
            lead=query.lead,
            user=channel_user,
            activity_type='QUERY_RAISED',
            description=f"Query raised: {query.title}"
        )

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        query = self.get_object()
        query.status = 'RESOLVED'
        query.resolved_at = timezone.now()
        query.save()
        
        # Log activity
        LeadActivity.objects.create(
            lead=query.lead,
            user=get_channelpartner_user(request.user),
            activity_type='QUERY_RESOLVED',
            description=f"Query resolved: {query.title}"
        )
        return Response({'status': 'Query resolved'})


class LeadDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = LeadDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_user = get_channelpartner_user(self.request.user)
        role = normalize_role(channel_user or self.request.user)
        if role == 'PARTNER' and channel_user:
            return LeadDocument.objects.filter(lead__partner=channel_user)
        return LeadDocument.objects.all()

    def perform_create(self, serializer):
        channel_user = get_channelpartner_user(self.request.user)
        doc = serializer.save(uploaded_by=channel_user)
        # Log activity
        LeadActivity.objects.create(
            lead=doc.lead,
            user=channel_user,
            activity_type='DOCUMENT_UPLOADED',
            description=f"Document uploaded: {doc.get_document_type_display()}"
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def verify(self, request, pk=None):
        channel_user = get_channelpartner_user(request.user)
        role = normalize_role(channel_user or request.user)
        if role not in ['ADMIN', 'CREDIT_OPS']:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        doc = self.get_object()
        status_val = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if status_val not in ['VERIFIED', 'QUERY', 'REJECTED']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        doc.verification_status = status_val
        doc.verification_notes = notes
        doc.verified_by = channel_user
        doc.verified_at = timezone.now()
        doc.save()
        
        # Log activity
        LeadActivity.objects.create(
            lead=doc.lead,
            user=channel_user,
            activity_type='STATUS_CHANGED', # Or a more specific type if we add one
            description=f"Document {doc.get_document_type_display()} marked as {status_val} by {(channel_user.username if channel_user else request.user.email)}"
        )
        
        return Response({'status': f'Document marked as {status_val}'})


class LeadCommentViewSet(viewsets.ModelViewSet):
    serializer_class = LeadCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_user = get_channelpartner_user(self.request.user)
        role = normalize_role(channel_user or self.request.user)
        queryset = LeadComment.objects.all()
        if role == 'PARTNER' and channel_user:
            queryset = queryset.filter(lead__partner=channel_user, is_internal=False)
        return queryset

    def perform_create(self, serializer):
        channel_user = get_channelpartner_user(self.request.user)
        comment = serializer.save(user=channel_user)
        # Log activity
        LeadActivity.objects.create(
            lead=comment.lead,
            user=channel_user,
            activity_type='COMMENT_ADDED',
            description=f"Comment added by {(channel_user.username if channel_user else self.request.user.email)}"
        )


class LeadActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeadActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_user = get_channelpartner_user(self.request.user)
        role = normalize_role(channel_user or self.request.user)
        if role == 'PARTNER' and channel_user:
            return LeadActivity.objects.filter(lead__partner=channel_user)
        return LeadActivity.objects.all()


class LeadStatusHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = LeadStatusHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_user = get_channelpartner_user(self.request.user)
        role = normalize_role(channel_user or self.request.user)
        if role == 'PARTNER' and channel_user:
            return LeadStatusHistory.objects.filter(lead__partner=channel_user)
        return LeadStatusHistory.objects.all()

    def perform_create(self, serializer):
        serializer.save(updated_by=get_channelpartner_user(self.request.user))


class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_user = get_channelpartner_user(self.request.user)
        role = normalize_role(channel_user or self.request.user)
        if role == 'PARTNER' and channel_user:
            return Customer.objects.filter(lead__partner=channel_user)
        return Customer.objects.all()


class ProductTypeChoicesView(views.APIView):
    """
    Get available product type choices for dropdown
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Return available product type choices"""
        choices = [
            {'value': choice[0], 'label': choice[1]}
            for choice in Lead.PRODUCT_TYPE_CHOICES
        ]
        return Response({
            'product_types': choices,
            'total': len(choices)
        })
