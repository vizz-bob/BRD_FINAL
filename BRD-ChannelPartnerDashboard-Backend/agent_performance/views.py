#--------------------------
# New Agent 
#-------------------------
from rest_framework import generics
from .models import New_agent
from .serializers import NewAgentSerializer
class NewAgentListCreateView(generics.ListCreateAPIView):
    queryset = New_agent.objects.all()
    serializer_class = NewAgentSerializer
class NewAgentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = New_agent.objects.all()
    serializer_class = NewAgentSerializer
#----------------------------
# Dashboard
#-----------------------------
from rest_framework import generics
from .models import Dashboard
from .serializers import DashboardSerializer
class DashboardListCreateView(generics.ListCreateAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
class DashboardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
#---------------------------------
# all agent
#---------------------------------
from rest_framework import generics, filters
from .models import All_Agent
from .serializers import AllAgentSerializer


class AllAgentListCreateView(generics.ListCreateAPIView):
    queryset = All_Agent.objects.all()
    serializer_class = AllAgentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'agent_id']


class AllAgentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = All_Agent.objects.all()
    serializer_class = AllAgentSerializer
#------------------------------
# Edit Agent
#------------------------------
from rest_framework import generics
from .models import Edit_Agent
from .serializers import EditAgentSerializer


class EditAgentListCreateView(generics.ListCreateAPIView):
    queryset = Edit_Agent.objects.all()
    serializer_class = EditAgentSerializer


class EditAgentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Edit_Agent.objects.all()
    serializer_class = EditAgentSerializer
#------------------------- 
# View agent
#-------------------------
from rest_framework import generics
from .models import View_Agent
from .serializers import ViewAgentSerializer


class ViewAgentListCreateView(generics.ListCreateAPIView):
    queryset = View_Agent.objects.all()
    serializer_class = ViewAgentSerializer


class ViewAgentDetailView(generics.RetrieveAPIView):
    queryset = View_Agent.objects.all()
    serializer_class = ViewAgentSerializer
#-----------------------
# Remove Agent
#------------------------
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from .models import Remove_Agent, View_Agent
from .serializers import RemoveAgentSerializer


class RemoveAgentView(generics.CreateAPIView):
    queryset = Remove_Agent.objects.all()
    serializer_class = RemoveAgentSerializer

    def create(self, request, *args, **kwargs):

        agent_id = request.data.get("agent_id")
        reason = request.data.get("reason", "")

        try:
            agent = View_Agent.objects.get(id=agent_id)

            # Soft delete mark
            agent.status = "Inactive"
            agent.save()

            removed_agent = Remove_Agent.objects.create(
                agent_name=agent.name,
                agent_id=agent.agent_id,
                reason=reason,
                is_removed=True
            )

            serializer = self.get_serializer(removed_agent)

            return Response({
                "message": "Agent removed successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        except View_Agent.DoesNotExist:
            return Response({
                "error": "Agent not found"
            }, status=status.HTTP_404_NOT_FOUND)