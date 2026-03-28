from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contact, Account, Activity
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta

from .serializers import (
    ContactSerializer,
    AccountSerializer,
    ActivitySerializer
)

from django.views.decorators.csrf import ensure_csrf_cookie
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})
class ContactViewSet(ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_contacts = Contact.objects.count()
        total_accounts = Account.objects.count()
        
        # Active contacts: created in last 60 days
        sixty_days_ago = timezone.now().date() - timedelta(days=60)
        active_contacts = Contact.objects.filter(created_at__date__gte=sixty_days_ago).count()
        
        # Dormant contacts: created more than 60 days ago
        dormant_contacts = total_contacts - active_contacts
        
        # New contacts this month
        current_month_start = timezone.now().replace(day=1).date()
        new_this_month = Contact.objects.filter(created_at__date__gte=current_month_start).count()
        
        # Linked accounts: accounts that have contacts (accounts with assigned_to matching contact assigned_to)
        linked_accounts = Account.objects.filter(assigned_to__isnull=False).exclude(assigned_to='').count()
        
        data = {
            'totalContacts': total_contacts,
            'totalAccounts': total_accounts,
            'activeContacts': active_contacts,
            'dormantContacts': dormant_contacts,
            'newThisMonth': new_this_month,
            'linkedAccounts': linked_accounts
        }
        return Response(data)



#---------------------------
#Account New
#----------------------------

class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all().order_by('-id')
    serializer_class = AccountSerializer


#----------------------------
# Task New
#---------------------------
from rest_framework.viewsets import ModelViewSet
from .models import Activity,Meeting
from .serializers import ActivitySerializer,MeetingSerializer

class ActivityViewSet(ModelViewSet):
    queryset = Activity.objects.all().order_by('-created_at')
    serializer_class = ActivitySerializer

class MeetingViewSet(ModelViewSet):
    queryset = Meeting.objects.all().order_by('-datetime')
    serializer_class = MeetingSerializer

#-----------------------------
# Meeting
#----------------------------
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Meeting
from .forms import MeetingForm

@login_required
def add_meeting(request):
    if request.method == 'POST':
        form = MeetingForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('meeting_list')  # change to your meeting list page
    else:
        form = MeetingForm()
    return render(request, 'meetings/add_meeting.html', {'form': form})
