from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from .models import Coupon
from .serializers import CouponSerializer


class CouponViewSet(ModelViewSet):
    """
    MASTER ADMIN ONLY
    """
    queryset = Coupon.objects.filter(is_deleted=False)
    serializer_class = CouponSerializer
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()
