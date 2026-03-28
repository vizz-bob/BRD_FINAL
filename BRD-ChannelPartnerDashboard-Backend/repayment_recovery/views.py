#-----------------------------
# add record
#-----------------------------
from rest_framework import generics
from .models import RecoveryRecord
from .serializers import RecoveryRecordSerializer


class RecoveryRecordListCreateView(generics.ListCreateAPIView):
    queryset = RecoveryRecord.objects.all()
    serializer_class = RecoveryRecordSerializer


class RecoveryRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RecoveryRecord.objects.all()
    serializer_class = RecoveryRecordSerializer
#---------------------------
# Dashboard
#----------------------------
from rest_framework import generics
from .models import Dashboard
from .serializers import DashboardSerializer


class DashboardListCreateView(generics.ListCreateAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer


class DashboardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
#---------------------------
# search
#---------------------------
from rest_framework import generics
from .models import Recovery_Search
from .serializers import RecoverySearchSerializer


class RecoverySearchListCreateView(generics.ListCreateAPIView):
    queryset = Recovery_Search.objects.all()
    serializer_class = RecoverySearchSerializer


class RecoverySearchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recovery_Search.objects.all()
    serializer_class = RecoverySearchSerializer
#----------------------------------
# Recovery payment main edit
#-----------------------------------
from rest_framework import generics
from .models import EditRecovery
from .serializers import EditRecoverySerializer


class EditRecoveryListCreateView(generics.ListCreateAPIView):
    queryset = EditRecovery.objects.all()
    serializer_class = EditRecoverySerializer


class EditRecoveryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EditRecovery.objects.all()
    serializer_class = EditRecoverySerializer