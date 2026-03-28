from django.utils import timezone
from .models import SupportTicket

def escalate_overdue_tickets():
    tickets = SupportTicket.objects.filter(status__in=['Open', 'In Progress'])
    for ticket in tickets:
        ticket.check_escalation()
