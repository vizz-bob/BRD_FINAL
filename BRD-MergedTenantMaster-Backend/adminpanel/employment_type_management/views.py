from rest_framework.viewsets import ModelViewSet
from .models import EmploymentTypeMaster
from .serializers import EmploymentTypeMasterSerializer

class EmploymentTypeMasterViewSet(ModelViewSet):
    queryset = EmploymentTypeMaster.objects.filter(isDeleted=False)
    serializer_class = EmploymentTypeMasterSerializer
