from rest_framework import viewsets, permissions, response, status, views, serializers
from django.contrib.auth import get_user_model
from .models import ProfileSettings, UserDocument, PrivacyPolicy, SupportTicket, SupportContactInfo
from .serializers import (
    UserProfileSerializer, ProfileSettingsSerializer, UserDocumentSerializer,
    PrivacyPolicySectionSerializer, SupportTicketSerializer, SupportContactInfoSerializer
)
from channelpartner.payouts.models import Payout
from channelpartner.leads.models import Lead
from django.db.models import Sum

User = get_user_model()


def resolve_user_for_model(auth_user, target_model):
    if isinstance(auth_user, target_model):
        return auth_user

    email = getattr(auth_user, 'email', None)
    if not email:
        return None

    return target_model.objects.filter(email=email).first()


def resolve_profile_settings_user(auth_user):
    profile_user_model = ProfileSettings._meta.get_field('user').remote_field.model
    return resolve_user_for_model(auth_user, profile_user_model)

class MyProfileView(views.APIView):
    """
    Get or update the current user's profile
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        payload = serializer.data
        return response.Response({
            **payload,
            'data': payload,
        })
    
    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileSettingsUpdateView(views.APIView):
    """
    Update profile settings (notifications etc)
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        profile_user = resolve_profile_settings_user(request.user)
        if not profile_user:
            return response.Response(
                {'detail': 'No channel partner user found for this account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure settings exist
        settings_obj, created = ProfileSettings.objects.get_or_create(user=profile_user)
        serializer = ProfileSettingsSerializer(settings_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDocumentViewSet(viewsets.ModelViewSet):
    """
    Manage user documents
    """
    serializer_class = UserDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile_user = resolve_profile_settings_user(self.request.user)
        if not profile_user:
            return UserDocument.objects.none()
        return UserDocument.objects.filter(user=profile_user)

    def perform_create(self, serializer):
        profile_user = resolve_profile_settings_user(self.request.user)
        if not profile_user:
            raise serializers.ValidationError('No channel partner user found for this account.')
        serializer.save(user=profile_user)

class ProfilePrivacySettingsView(views.APIView):
    """
    Get or update privacy settings
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile_user = resolve_profile_settings_user(request.user)
        if not profile_user:
            return response.Response(
                {'detail': 'No channel partner user found for this account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settings_obj, created = ProfileSettings.objects.get_or_create(user=profile_user)
        privacy_data = {
            'profile_visibility': settings_obj.profile_visibility,
            'show_phone': settings_obj.show_phone,
            'show_email': settings_obj.show_email,
            'allow_contact_requests': settings_obj.allow_contact_requests,
            'allow_lead_sharing': settings_obj.allow_lead_sharing,
        }
        return response.Response(privacy_data)

    def patch(self, request):
        profile_user = resolve_profile_settings_user(request.user)
        if not profile_user:
            return response.Response(
                {'detail': 'No channel partner user found for this account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settings_obj, created = ProfileSettings.objects.get_or_create(user=profile_user)
        
        # Update only privacy-related fields
        allowed_fields = ['profile_visibility', 'show_phone', 'show_email', 'allow_contact_requests', 'allow_lead_sharing']
        for field in allowed_fields:
            if field in request.data:
                setattr(settings_obj, field, request.data[field])
        
        settings_obj.save()
        
        privacy_data = {
            'profile_visibility': settings_obj.profile_visibility,
            'show_phone': settings_obj.show_phone,
            'show_email': settings_obj.show_email,
            'allow_contact_requests': settings_obj.allow_contact_requests,
            'allow_lead_sharing': settings_obj.allow_lead_sharing,
        }
        return response.Response(privacy_data)


class ProfileSecuritySettingsView(views.APIView):
    """
    Get or update security settings
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile_user = resolve_profile_settings_user(request.user)
        if not profile_user:
            return response.Response(
                {'detail': 'No channel partner user found for this account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settings_obj, created = ProfileSettings.objects.get_or_create(user=profile_user)
        security_data = {
            'two_factor_enabled': settings_obj.two_factor_enabled,
            'login_alerts': settings_obj.login_alerts,
            'suspicious_activity_alerts': settings_obj.suspicious_activity_alerts,
            'session_timeout_minutes': settings_obj.session_timeout_minutes,
            'require_ip_verification': settings_obj.require_ip_verification,
            'blocked_ips': settings_obj.blocked_ips,
            'last_password_change': settings_obj.last_password_change,
        }
        return response.Response(security_data)


class PrivacyPolicyView(views.APIView):
    """
    Get the Privacy & Security Policy with all 10 sections
    """
    permission_classes = [permissions.AllowAny]  # Anyone can read privacy policy

    def get(self, request):
        """Retrieve the active privacy policy"""
        privacy_policy = PrivacyPolicy.objects.filter(is_active=True).first()
        
        if not privacy_policy:
            return response.Response({
                'error': 'Privacy policy not available'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PrivacyPolicySectionSerializer(privacy_policy)
        return response.Response(serializer.data)


class PrivacyPolicyDetailView(views.APIView):
    """
    Get specific privacy policy sections by ID
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk=None):
        """Retrieve specific privacy policy version"""
        try:
            privacy_policy = PrivacyPolicy.objects.get(id=pk)
            serializer = PrivacyPolicySectionSerializer(privacy_policy)
            return response.Response(serializer.data)
        except PrivacyPolicy.DoesNotExist:
            return response.Response({
                'error': 'Privacy policy not found'
            }, status=status.HTTP_404_NOT_FOUND)


class PrivacyNoticeView(views.APIView):
    """
    Get a quick summary notice about privacy and security
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Retrieve privacy notice with quick summary"""
        privacy_policy = PrivacyPolicy.objects.filter(is_active=True).first()
        
        if not privacy_policy:
            return response.Response({
                'title': 'Your Privacy Matters - Important Notice',
                'message': 'Privacy policy not configured yet'
            }, status=status.HTTP_404_NOT_FOUND)
        
        return response.Response({
            'title': privacy_policy.title,
            'introduction': privacy_policy.introduction,
            'quick_summary': privacy_policy.quick_summary,
            'version': privacy_policy.version,
            'last_updated': privacy_policy.last_updated,
            'sections_count': 10,
            'message': 'Click on Privacy & Security to view detailed policy'
        })

    def patch(self, request):
        profile_user = resolve_profile_settings_user(request.user)
        if not profile_user:
            return response.Response(
                {'detail': 'No channel partner user found for this account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        settings_obj, created = ProfileSettings.objects.get_or_create(user=profile_user)
        
        # Update only security-related fields
        allowed_fields = ['two_factor_enabled', 'login_alerts', 'suspicious_activity_alerts', 
                         'session_timeout_minutes', 'require_ip_verification', 'blocked_ips']
        for field in allowed_fields:
            if field in request.data:
                setattr(settings_obj, field, request.data[field])
        
        settings_obj.save()
        
        security_data = {
            'two_factor_enabled': settings_obj.two_factor_enabled,
            'login_alerts': settings_obj.login_alerts,
            'suspicious_activity_alerts': settings_obj.suspicious_activity_alerts,
            'session_timeout_minutes': settings_obj.session_timeout_minutes,
            'require_ip_verification': settings_obj.require_ip_verification,
            'blocked_ips': settings_obj.blocked_ips,
            'last_password_change': settings_obj.last_password_change,
        }
        return response.Response(security_data)


class SupportContactInfoView(views.APIView):
    """
    Get support contact information and available actions
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Retrieve support contact info with available actions"""
        contact_info = SupportContactInfo.objects.first()
        
        if not contact_info:
            # Return default support info
            return response.Response({
                'phone_number': '+91-XXXX-XXXX-XX',
                'whatsapp_number': '+91-XXXX-XXXX-XX',
                'email': 'support@example.com',
                'support_hours': 'Mon-Fri, 9 AM - 6 PM IST',
                'is_active': False,
                'actions': {}
            })
        
        serializer = SupportContactInfoSerializer(contact_info)
        return response.Response(serializer.data)


class SupportTicketViewSet(viewsets.ModelViewSet):
    """
    Create and manage support tickets
    """
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users see only their own tickets, admins see all"""
        user = self.request.user
        if user.role in ['ADMIN', 'CREDIT_OPS']:
            return SupportTicket.objects.all().order_by('-created_at')
        return SupportTicket.objects.filter(user=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        """Automatically assign current user and set status"""
        serializer.save(user=self.request.user, status='OPEN')
    
    def list(self, request, *args, **kwargs):
        """List support tickets with summary"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add ticket summary
        open_count = queryset.filter(status='OPEN').count()
        in_progress_count = queryset.filter(status='IN_PROGRESS').count()
        resolved_count = queryset.filter(status='RESOLVED').count()
        
        return response.Response({
            'summary': {
                'total': queryset.count(),
                'open': open_count,
                'in_progress': in_progress_count,
                'resolved': resolved_count
            },
            'tickets': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        """Get detailed support ticket info"""
        instance = self.get_object()
        
        # Check permission
        if request.user != instance.user and request.user.role not in ['ADMIN', 'CREDIT_OPS']:
            return response.Response(
                {'detail': 'You do not have permission to view this ticket.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance)
        return response.Response(serializer.data)


class PrivacyPolicyWithSupportView(views.APIView):
    """
    Get privacy policy with 'Have Questions?' section linking to support
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Retrieve privacy policy with 'Have Questions?' and support contact options
        """
        privacy_policy = PrivacyPolicy.objects.filter(is_active=True).first()
        contact_info = SupportContactInfo.objects.first()
        
        if not privacy_policy:
            return response.Response({
                'error': 'Privacy policy not available'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize privacy policy
        privacy_serializer = PrivacyPolicySectionSerializer(privacy_policy)
        privacy_data = privacy_serializer.data
        
        # Add "Have Questions?" section with support contact options
        have_questions_section = {
            'section_title': 'Have Questions?',
            'description': 'If you have any questions about this Privacy Policy or our privacy practices, please contact us:',
            'contact_support': {
                'enabled': contact_info.is_active if contact_info else False,
                'phone': contact_info.phone_number if contact_info else 'N/A',
                'whatsapp': contact_info.whatsapp_number if contact_info else 'N/A',
                'email': contact_info.email if contact_info else 'N/A',
                'support_hours': contact_info.support_hours if contact_info else 'N/A',
            },
            'raise_support_ticket': {
                'label': 'Raise a Support Ticket',
                'description': 'For detailed assistance, please create a support ticket',
                'url': '/api/profiles/support-tickets/',
                'action': 'create_ticket'
            },
            'actions': []
        }
        
        # Add contact actions if contact info exists
        if contact_info:
            contact_serializer = SupportContactInfoSerializer(contact_info)
            have_questions_section['actions'] = contact_serializer.data.get('actions', {})
        
        # Combine privacy policy with have questions section
        privacy_data['have_questions'] = have_questions_section
        
        return response.Response(privacy_data)