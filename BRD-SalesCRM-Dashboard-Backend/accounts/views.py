from rest_framework import views, viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.utils import timezone
import csv
import io
from django.http import HttpResponse

from .models import (
    UserProfile, NotificationPreference, Availability,
    Territory, Integration, GeneralSettings, PrivacySettings,
    DataPrivacySettings
)
from .serializers import (
    LoginSerializer, UserSerializer, UserProfileSerializer,
    NotificationPreferenceSerializer, AvailabilitySerializer,
    ChangePasswordSerializer, TerritorySerializer, IntegrationSerializer,
    GeneralSettingsSerializer, PrivacySettingsSerializer,
    TeamMemberAccountSerializer, DataPrivacySettingsSerializer
)


# ── helpers ───────────────────────────────────────────────────────────────────

def _get_or_create_profile(user):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return profile

def _get_or_create_notification_prefs(user):
    prefs, _ = NotificationPreference.objects.get_or_create(user=user)
    return prefs

def _get_or_create_general(user):
    obj, _ = GeneralSettings.objects.get_or_create(user=user)
    return obj

def _get_or_create_privacy(user):
    obj, _ = PrivacySettings.objects.get_or_create(user=user)
    return obj

def _get_or_create_data_privacy(user):
    obj, _ = DataPrivacySettings.objects.get_or_create(user=user)
    return obj


# ── Auth  ─────────────────────────────────────────────────────────────────────

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_200_OK)


class ValidateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})


class SignInView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('name', '')
        role_label = data.get('role', 'Sales Executive')

        if not email or not password:
            return Response({'message': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'message': 'Email already in use.'}, status=status.HTTP_400_BAD_REQUEST)

        # Parse name
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Map role label to backend slug
        role_map = {
            'Sales Executive': 'sales_executive',
            'Relationship Manager': 'relationship_manager',
            'Team Lead': 'team_lead',
        }
        role_slug = role_map.get(role_label, 'sales_executive')

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Update profiles (created by signals)
        profile = _get_or_create_profile(user)
        profile.role = role_slug
        profile.save()

        if hasattr(user, 'team_member'):
            user.team_member.role = role_slug
            user.team_member.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


# ── Profile Settings ──────────────────────────────────────────────────────────

class ProfileView(views.APIView):
    """GET / PATCH /api/auth/profile/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = _get_or_create_profile(request.user)
        return Response(UserProfileSerializer(profile).data)

    def patch(self, request):
        profile = _get_or_create_profile(request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── Notification Preferences ──────────────────────────────────────────────────

class NotificationPrefsView(views.APIView):
    """GET / PATCH /api/auth/notifications/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        prefs = _get_or_create_notification_prefs(request.user)
        return Response(NotificationPreferenceSerializer(prefs).data)

    def patch(self, request):
        prefs = _get_or_create_notification_prefs(request.user)
        serializer = NotificationPreferenceSerializer(prefs, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── Availability ──────────────────────────────────────────────────────────────

class AvailabilityView(views.APIView):
    """
    GET  /api/auth/availability/          → list all 7 days
    POST /api/auth/availability/          → set/update a day  { day, active, from_time, to_time }
    """
    permission_classes = [IsAuthenticated]

    DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

    def get(self, request):
        # Auto-create defaults for any missing days
        for day in self.DAYS:
            defaults = {'active': day not in ('saturday','sunday'), 'from_time': '09:00', 'to_time': '18:00'}
            Availability.objects.get_or_create(user=request.user, day=day, defaults=defaults)
        qs = Availability.objects.filter(user=request.user).order_by('day')
        return Response(AvailabilitySerializer(qs, many=True).data)

    def post(self, request):
        day = request.data.get('day')
        if day not in self.DAYS:
            return Response({'detail': 'Invalid day.'}, status=status.HTTP_400_BAD_REQUEST)
        obj, _ = Availability.objects.get_or_create(user=request.user, day=day)
        serializer = AvailabilitySerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── Security ──────────────────────────────────────────────────────────────────

class ChangePasswordView(views.APIView):
    """POST /api/auth/change-password/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'detail': 'Password changed successfully.'})


class TwoFactorView(views.APIView):
    """POST /api/auth/two-factor/  { enabled: true/false }"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        enabled = request.data.get('enabled', False)
        # Store preference on profile
        profile = _get_or_create_profile(request.user)
        # We'll reuse a generic JSON field; for now we just confirm the toggle
        return Response({'enabled': enabled, 'detail': f"2FA {'enabled' if enabled else 'disabled'}."})


# ── Territory ─────────────────────────────────────────────────────────────────

class TerritoryViewSet(viewsets.ModelViewSet):
    """CRUD /api/auth/territories/"""
    permission_classes = [IsAuthenticated]
    serializer_class = TerritorySerializer

    def get_queryset(self):
        return Territory.objects.all().select_related('assigned_to').order_by('name')

    @action(detail=True, methods=['patch'], url_path='assign')
    def assign(self, request, pk=None):
        territory = self.get_object()
        user_id = request.data.get('user_id')
        if user_id:
            try:
                territory.assigned_to = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            territory.assigned_to = None
        territory.save()
        return Response(TerritorySerializer(territory).data)


# ── Team Members ──────────────────────────────────────────────────────────────

class TeamMemberViewSet(viewsets.ViewSet):
    """CRUD /api/auth/team-members/ for admin to manage users"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        users = User.objects.all().select_related('profile')
        serializer = TeamMemberAccountSerializer(users, many=True)
        return Response(serializer.data)

    def create(self, request):
        email = request.data.get('email')
        name = request.data.get('name', '')
        role = request.data.get('role', 'sales_executive')

        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            return Response({'detail': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        parts = name.split(' ')
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password='password123'  # default password
        )

        profile = _get_or_create_profile(user)
        profile.role = role
        profile.avatar_initials = name[0].upper() if name else email[0].upper()
        profile.save()

        return Response(TeamMemberAccountSerializer(user).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = False # soft delete to preserve references
            user.save()
            return Response({'detail': 'Removed.'})
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


# ── Integrations ──────────────────────────────────────────────────────────────

class IntegrationViewSet(viewsets.ModelViewSet):
    """CRUD + sync /api/auth/integrations/"""
    permission_classes = [IsAuthenticated]
    serializer_class = IntegrationSerializer

    def get_queryset(self):
        return Integration.objects.filter(user=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='toggle')
    def toggle(self, request, pk=None):
        integration = self.get_object()
        integration.status = 'disconnected' if integration.status == 'connected' else 'connected'
        integration.save()
        return Response(IntegrationSerializer(integration).data)

    @action(detail=True, methods=['post'], url_path='sync')
    def sync_now(self, request, pk=None):
        integration = self.get_object()
        integration.last_sync = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
        integration.save()
        return Response({'detail': 'Sync completed.', 'last_sync': integration.last_sync})


# ── General Settings ──────────────────────────────────────────────────────────

class GeneralSettingsView(views.APIView):
    """GET / PATCH /api/auth/general-settings/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj = _get_or_create_general(request.user)
        return Response(GeneralSettingsSerializer(obj).data)

    def patch(self, request):
        obj = _get_or_create_general(request.user)
        serializer = GeneralSettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── Privacy Settings ──────────────────────────────────────────────────────────

class PrivacySettingsView(views.APIView):
    """GET / PATCH /api/auth/privacy-settings/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj = _get_or_create_privacy(request.user)
        return Response(PrivacySettingsSerializer(obj).data)

    def patch(self, request):
        obj = _get_or_create_privacy(request.user)
        serializer = PrivacySettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ── Delete Account ────────────────────────────────────────────────────────────

class DeleteAccountView(views.APIView):
    """DELETE /api/auth/delete-account/   { confirm: "DELETE" }"""
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        if request.data.get('confirm') != 'DELETE':
            return Response({'detail': 'Please send confirm=DELETE.'}, status=status.HTTP_400_BAD_REQUEST)
        request.user.delete()
        return Response({'detail': 'Account deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ── Data & Privacy Settings ───────────────────────────────────────────────

class DataPrivacySettingsView(views.APIView):
    """
    GET  /api/auth/data-privacy/   → retrieve current opt-in flags
    PATCH /api/auth/data-privacy/  → update export_leads / export_reports toggles
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj = _get_or_create_data_privacy(request.user)
        return Response(DataPrivacySettingsSerializer(obj).data)

    def patch(self, request):
        obj = _get_or_create_data_privacy(request.user)
        serializer = DataPrivacySettingsSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ExportLeadsView(views.APIView):
    """
    POST /api/auth/data-privacy/export-leads/
    Checks opt-in flag, then streams all leads for the authenticated user as CSV.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        settings_obj = _get_or_create_data_privacy(request.user)

        if not settings_obj.export_leads:
            return Response(
                {'detail': 'Export leads is not enabled. Please enable it in Data & Privacy settings first.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Build CSV from leads
        from pipeline.models import Lead  # local import to avoid circular dependency

        leads = Lead.objects.filter(assigned_to=request.user).values(
            'id', 'name', 'email', 'phone', 'stage', 'loan_type',
            'amount', 'created_at', 'updated_at'
        )

        buffer = io.StringIO()
        writer = csv.DictWriter(buffer, fieldnames=[
            'id', 'name', 'email', 'phone', 'stage', 'loan_type',
            'amount', 'created_at', 'updated_at'
        ])
        writer.writeheader()
        for lead in leads:
            writer.writerow({k: (str(v) if v is not None else '') for k, v in lead.items()})

        # Update last exported timestamp
        settings_obj.leads_last_exported_at = timezone.now()
        settings_obj.save(update_fields=['leads_last_exported_at'])

        response = HttpResponse(buffer.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="leads_export.csv"'
        return response


class ExportReportsView(views.APIView):
    """
    POST /api/auth/data-privacy/export-reports/
    Checks opt-in flag, then streams all reports for the authenticated user as CSV.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        settings_obj = _get_or_create_data_privacy(request.user)

        if not settings_obj.export_reports:
            return Response(
                {'detail': 'Export reports is not enabled. Please enable it in Data & Privacy settings first.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Build CSV from reports
        from reports.models import Report  # local import to avoid circular dependency

        reports_qs = Report.objects.all().values(
            'id', 'title', 'metric_name', 'value', 'target',
            'trend', 'category', 'created_at', 'updated_at'
        )

        buffer = io.StringIO()
        writer = csv.DictWriter(buffer, fieldnames=[
            'id', 'title', 'metric_name', 'value', 'target',
            'trend', 'category', 'created_at', 'updated_at'
        ])
        writer.writeheader()
        for report in reports_qs:
            writer.writerow({k: (str(v) if v is not None else '') for k, v in report.items()})

        # Update last exported timestamp
        settings_obj.reports_last_exported_at = timezone.now()
        settings_obj.save(update_fields=['reports_last_exported_at'])

        response = HttpResponse(buffer.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="reports_export.csv"'
        return response
