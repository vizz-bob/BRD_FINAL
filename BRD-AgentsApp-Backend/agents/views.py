from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.utils.timezone import now
from .models import AgentProfile,FieldVerification,Case,FieldVerificationPhoto,PrivacyPolicy,PrivacyPolicySection,PrivacyQuickSummary,FAQ,SupportContact,SupportTicket #CollectionProfile,Account,Recovery,FollowUp,RecoveryHub,RecoveryHubPhoto
from .serializers import (
    SignUpSerializer,
    SignInSerializer,
    AgentSerializer,
    CaseSerializer,AgentProfileSerializer,
    AgentProfileDetailSerializer,
    FieldVerificationSerializer,
    FieldVerificationPhotoSerializer,
    CaseSerializer,
    PrivacyPolicySerializer,PrivacyPolicySectionSerializer,PrivacyQuickSummarySerializer,
    FAQSerializer,SupportContactSerializer,SupportTicketSerializer

    # CollectionProfileSerializer,
    # AccountSerializer,
    # RecoverySerializer,FollowUpSerializer,RecoveryHubPhotoSerializer,RecoveryHubSerializer
)
from rest_framework import generics
from .permissions import IsFieldAgent #IsCollectionAgent
# SIGN UP
class SignUpView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Account created successfully',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': AgentSerializer(user).data
        })


# SIGN IN
class SignInView(APIView):
    def post(self, request):
        serializer = SignInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': AgentSerializer(user).data
        })


# HOME (Dashboard)
class HomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Welcome to Agent Home",
            "total_cases": request.user.cases.count(),
            "pending_cases": request.user.cases.filter(status='pending').count(),
            "completed_cases": request.user.cases.filter(status='completed').count(),
        })


# CASES
class CaseViewSet(viewsets.ModelViewSet):
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(agent=self.request.user)

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def urgent(self, request):
        """Get all urgent cases for the authenticated agent in frontend format"""
        urgent_cases = Case.objects.filter(agent=request.user, priority='urgent')
        
        formatted_cases = [
            {
                'id': case.id,
                'name': case.customer_name,
                'priority': case.priority.capitalize(),
                'distance': f"{case.distance} km" if case.distance else 'N/A',
                'address': case.address
            }
            for case in urgent_cases
        ]
        
        return Response(formatted_cases)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def today_stats(self, request):
        """Get today's case statistics"""
        user_cases = Case.objects.filter(agent=request.user)
        
        completed = user_cases.filter(status='completed').count()
        pending = user_cases.filter(status='pending').count()
        target = user_cases.count()
        
        return Response({
            'completed': completed,
            'pending': pending,
            'target': target,
            'syncStatus': 'synced'
        })
        

class AgentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = AgentProfileSerializer
    permission_classes = [IsAuthenticated, IsFieldAgent]

    def get_queryset(self):
        return AgentProfile.objects.filter(agent=self.request.user)

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)
    
    def get_serializer_class(self):
        """Use detailed serializer for retrieve action"""
        if self.action == 'retrieve':
            return AgentProfileDetailSerializer
        return AgentProfileSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsFieldAgent])
    def me(self, request):
        """Get enriched profile with earnings, attendance, and sync status"""
        profile, _ = AgentProfile.objects.get_or_create(
            agent=request.user,
            defaults={
                'name': request.user.email.split('@')[0] if request.user.email else 'Field Agent',
                'agent_code': request.user.id,
            },
        )
        serializer = AgentProfileDetailSerializer(profile)
        return Response(serializer.data)
class FieldVerificationViewSet(viewsets.ModelViewSet):
    serializer_class = FieldVerificationSerializer
    permission_classes = [IsAuthenticated, IsFieldAgent]

    def get_queryset(self):
        return FieldVerification.objects.filter(agent=self.request.user)

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)
class FieldVerificationPhotoViewSet(viewsets.ModelViewSet):
    serializer_class = FieldVerificationPhotoSerializer
    permission_classes = [IsAuthenticated, IsFieldAgent]

    queryset = FieldVerificationPhoto.objects.all()
class FieldAgentDashboard(APIView):
    permission_classes = [IsAuthenticated, IsFieldAgent]

    def get(self, request):
        total_cases = request.user.field_verifications.count()
        successful_cases = request.user.field_verifications.filter(
            negative_profile_detected=False
        ).count()

        success_rate = (
            (successful_cases / total_cases) * 100
            if total_cases > 0 else 0
        )

        return Response({
            "cases_done": total_cases,
            "success_rate": round(success_rate, 2),
            "rating": 4.8  # can calculate dynamically later
        })
class PrivacyPolicyView(generics.ListAPIView):
    queryset = PrivacyPolicy.objects.all()
    serializer_class = PrivacyPolicySerializer
    permission_classes = [IsAuthenticated]
class FAQView(generics.ListAPIView):
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticated]
class SupportContactView(generics.RetrieveAPIView):
    queryset = SupportContact.objects.all()
    serializer_class = SupportContactSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return SupportContact.objects.first()
class SupportTicketViewSet(viewsets.ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SupportTicket.objects.filter(agent=self.request.user)

    def perform_create(self, serializer):
        serializer.save(agent=self.request.user)
class PrivacyPolicyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        policy = PrivacyPolicy.objects.first()
        serializer = PrivacyPolicySerializer(policy)
        return Response(serializer.data)

# class CollectionDashboardView(APIView):
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     def get(self, request):
#         total_accounts = request.user.accounts.count()
#         overdue_accounts = request.user.accounts.filter(status='overdue').count()

#         total_due = request.user.accounts.aggregate(
#             total=Sum('due_amount')
#         )['total'] or 0

#         total_collected = request.user.recoveries.aggregate(
#             total=Sum('amount_collected')
#         )['total'] or 0

#         return Response({
#             "total_accounts": total_accounts,
#             "overdue_accounts": overdue_accounts,
#             "total_due_amount": total_due,
#             "total_collected_amount": total_collected
#         })
# class CollectionProfileViewSet(viewsets.ModelViewSet):
#     serializer_class = CollectionProfileSerializer
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     def get_queryset(self):
#         return CollectionProfile.objects.filter(agent=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(agent=self.request.user)
# class AccountViewSet(viewsets.ModelViewSet):
#     serializer_class = AccountSerializer
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     def get_queryset(self):
#         return Account.objects.filter(collection_agent=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(collection_agent=self.request.user)
# class RecoveryViewSet(viewsets.ModelViewSet):
#     serializer_class = RecoverySerializer
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     def get_queryset(self):
#         return Recovery.objects.filter(agent=self.request.user)

#     def perform_create(self, serializer):
#         recovery = serializer.save(agent=self.request.user)

#         # Reduce due amount automatically
#         account = recovery.account
#         account.due_amount -= recovery.amount_collected
#         account.save()
# class FollowUpViewSet(viewsets.ModelViewSet):
#     serializer_class = FollowUpSerializer
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     def get_queryset(self):
#         return FollowUp.objects.filter(agent=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(agent=self.request.user)
# class RecoveryHubViewSet(viewsets.ModelViewSet):
#     serializer_class = RecoveryHubSerializer
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     def get_queryset(self):
#         return RecoveryHub.objects.filter(agent=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(agent=self.request.user)
# class RecoveryHubPhotoViewSet(viewsets.ModelViewSet):
#     serializer_class = RecoveryHubPhotoSerializer
#     permission_classes = [IsAuthenticated, IsCollectionAgent]

#     queryset = RecoveryHubPhoto.objects.all()
