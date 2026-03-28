from rest_framework import serializers
from .models import PipelineLead, RawLead, LeadDead, LeadExpired, LeadLost, LeadRejected


class PipelineLeadSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="lead.full_name")
    phone = serializers.CharField(source="lead.phone")
    email = serializers.EmailField(source="lead.email")
    source = serializers.CharField(source="lead.source")

    class Meta:
        model = PipelineLead
        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "source",
            "status",
            "is_valid",
            "is_suppressed",
            "assigned_to",
            "created_at",
        ]

#----------------------------------
# Follow up
#----------------------------------
from rest_framework import serializers
from .models import FollowUp

class FollowUpSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = FollowUp
        fields = '__all__'

#----------------
#Scheduel View
#---------------
from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)

    class Meta:
        model = Activity
        fields = [
            'id',
            'lead_name',
            'activity_type',
            'task_type',
            'scheduled_date',
            'scheduled_time',
            'status'
        ]

#-------------------------------
#Escalations & SLA
#------------------------------
from rest_framework import serializers
from .models import Escalation


class EscalationSerializer(serializers.ModelSerializer):
    assigned_agent = serializers.CharField(source="assigned_agent.username", default=None)

    class Meta:
        model = Escalation
        fields = "__all__"


#-----------------------
# Meeting
#-----------------------
from rest_framework import serializers
from .models import Meeting


class MeetingSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Meeting
        fields = "__all__"  

    def get_status(self, obj):
        latest_log = obj.logs.order_by("-created_at").first()

        if latest_log:
            return latest_log.meeting_status

        return "Scheduled"  

#---------------------
# Reschuedule 
#---------------------
from rest_framework import serializers
from .models import MeetingLog


class MeetingLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingLog
        fields = "__all__"

#--------------------------------
# Deals (Conversion/Disbursed)
# Loan Application
#----------------------------------
from rest_framework import serializers
from .models import LoanApplication


class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = "__all__"
#--------------------------------
# Deals (Conversion/Disbursed)
# Application Status Tracking
#----------------------------------
from rest_framework import serializers
from .models import ApplicationTracking


class ApplicationTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationTracking
        fields = "__all__"

#------------------------------
# Deals
#Loan Disbursed
#------------------------------
from rest_framework import serializers
from .models import DisbursedLoan


class DisbursedLoanSerializer(serializers.ModelSerializer):

    class Meta:
        model = DisbursedLoan
        fields = "__all__"

#------------------------------
# Raw Lead
class RawLeadSerializer(serializers.ModelSerializer):
    interest_area = serializers.CharField(source = "lead.product_selection",read_only=True)
    class Meta:
        model = RawLead
        fields = "__all__"


class LeadDeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadDead
        fields = "__all__"


class LeadExpiredSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadExpired
        fields = "__all__"


class LeadRejectedSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadRejected
        fields = "__all__"


class LeadLostSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadLost
        fields = "__all__"
