from .models import ChannelAPILog
from django.core.mail import send_mail

FAILURE_THRESHOLD = 3

def log_api_failure(channel, message):
    """
    Log API failure for a channel.
    If failures exceed FAILURE_THRESHOLD, send an alert email to admin.
    """
    # 1. Log the failure
    ChannelAPILog.objects.create(channel=channel, status='failed', message=message)

    # 2. Count total failed attempts for this channel
    failures = ChannelAPILog.objects.filter(channel=channel, status='failed').count()

    # 3. If threshold exceeded, send email alert
    if failures >= FAILURE_THRESHOLD:
        send_mail(
            subject='Channel API Failure Alert',
            message=f'API failed {FAILURE_THRESHOLD}+ times for channel: {channel.channel_name}',
            from_email='crm@company.com',
            recipient_list=['admin@company.com'],
            fail_silently=True
        )
