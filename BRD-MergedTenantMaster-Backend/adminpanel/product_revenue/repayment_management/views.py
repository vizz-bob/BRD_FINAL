from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import RepaymentConfiguration
from .serializers import RepaymentConfigurationSerializer


class RepaymentConfigurationViewSet(viewsets.ModelViewSet):
    """
    Repayment Management APIs
    -------------------------
    GET  /api/admin/repayments/
    POST /api/admin/repayments/
    PUT  /api/admin/repayments/{id}/
    """

    queryset = RepaymentConfiguration.objects.all()
    serializer_class = RepaymentConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print(f"DEBUG: RepaymentConfigurationViewSet.create called")
        print(f"DEBUG: Request data: {request.data}")
        print(f"DEBUG: Request content type: {request.content_type}")
        
        try:
            response = super().create(request, *args, **kwargs)
            print(f"DEBUG: Create successful: {response.data}")
            return response
        except Exception as e:
            print(f"DEBUG: Create failed with error: {str(e)}")
            return Response(
                {"error": str(e), "details": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
