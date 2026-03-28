from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import *
from .serializers import *

class PaymentGatewayViewSet(viewsets.ModelViewSet):
    queryset = PaymentGateway.objects.all()
    serializer_class = PaymentGatewaySerializer


class CollectionControlViewSet(viewsets.ModelViewSet):
    queryset = CollectionControl.objects.all()
    serializer_class = CollectionControlSerializer


class ClientTeamMappingViewSet(viewsets.ModelViewSet):
    queryset = ClientTeamMapping.objects.all()
    serializer_class = ClientTeamMappingSerializer


class ClientAgentMappingViewSet(viewsets.ModelViewSet):
    queryset = ClientAgentMapping.objects.all()
    serializer_class = ClientAgentMappingSerializer


class PayoutManagementViewSet(viewsets.ModelViewSet):
    queryset = PayoutManagement.objects.all()
    serializer_class = PayoutManagementSerializer


class OverdueLoanViewSet(viewsets.ModelViewSet):
    queryset = OverdueLoan.objects.all()
    serializer_class = OverdueLoanSerializer


@api_view(['GET'])
def get_collection_stats(request):
    """Get collection statistics"""
    try:
        # Get or create default stats
        stats, created = CollectionStats.objects.get_or_create(
            id=1,
            defaults={
                'total_overdue': 17000.00,
                'npa_cases': 2,
                'efficiency_rate': 78.0
            }
        )
        
        response_data = {
            'totalOverdue': str(stats.total_overdue),
            'npaCases': stats.npa_cases,
            'efficiency': f"{stats.efficiency_rate}%"
        }
        
        return Response(response_data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_overdue_loans(request):
    """Get list of overdue loans"""
    try:
        # Get or create sample overdue loans
        if OverdueLoan.objects.count() == 0:
            # Create sample data
            OverdueLoan.objects.create(
                borrower_name="John Doe",
                loan_amount=50000.00,
                overdue_amount=5000.00,
                days_overdue=45,
                status="OVERDUE",
                phone="9876543210",
                email="john@example.com"
            )
            OverdueLoan.objects.create(
                borrower_name="Jane Smith",
                loan_amount=75000.00,
                overdue_amount=12000.00,
                days_overdue=90,
                status="NPA",
                phone="9876543211",
                email="jane@example.com"
            )
        
        overdue_loans = OverdueLoan.objects.all()
        serializer = OverdueLoanSerializer(overdue_loans, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
def record_action(request, loan_id):
    """Record collection action for an overdue loan"""
    try:
        serializer = RecordActionSerializer(data=request.data)
        if serializer.is_valid():
            # Try to get loan by UUID first, then by string ID
            try:
                loan = OverdueLoan.objects.get(id=loan_id)
            except (OverdueLoan.DoesNotExist, ValueError):
                # If UUID fails, try as string (for compatibility)
                loan = OverdueLoan.objects.get(id=str(loan_id))
            
            # Create collection action
            CollectionAction.objects.create(
                overdue_loan=loan,
                action_type=serializer.validated_data['action_type'],
                remarks=serializer.validated_data['remarks'],
                created_by="System User"  # You can get this from request.user
            )
            
            return Response(
                {'success': True, 'message': 'Action recorded successfully'}
            )
        else:
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
    except OverdueLoan.DoesNotExist:
        return Response(
            {'error': 'Overdue loan not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
