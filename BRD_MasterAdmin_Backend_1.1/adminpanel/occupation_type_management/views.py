from rest_framework.viewsets import ModelViewSet
from .models import OccupationTypeMaster
from .serializers import OccupationTypeMasterSerializer

class OccupationTypeMasterViewSet(ModelViewSet):
    queryset = OccupationTypeMaster.objects.filter(isDeleted=False)
    serializer_class = OccupationTypeMasterSerializer
