from django.test import TestCase
from django.contrib.auth.models import User
from .models import Channel, ChannelAnalytics, ChannelAPILog
from .services import log_api_failure
from unittest.mock import patch

class ChannelModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.channel = Channel.objects.create(
            channel_name='Facebook Ads',
            channel_type='social',
            source_code='FB001',
            created_by=self.user,
            cost_per_lead=100
        )

    def test_channel_creation(self):
        self.assertEqual(self.channel.channel_name, 'Facebook Ads')
        self.assertTrue(self.channel.is_active)

class ChannelAnalyticsTest(TestCase):
    def setUp(self):
        user = User.objects.create(username='testuser')
        channel = Channel.objects.create(
            channel_name='JustDial',
            channel_type='aggregator',
            source_code='JD001',
            created_by=user
        )
        self.analytics = ChannelAnalytics.objects.create(
            channel=channel,
            total_leads=100,
            total_conversions=20,
            total_cost=2000,
            revenue_generated=5000
        )

    def test_cpl_calculation(self):
        self.assertEqual(self.analytics.cpl, 2000/100)

    def test_conversion_rate(self):
        self.assertEqual(self.analytics.conversion_rate, 20.0)

    def test_roi_calculation(self):
        self.assertEqual(self.analytics.roi, ((5000-2000)/2000)*100)

class ChannelAPILogTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='admin')
        self.channel = Channel.objects.create(
            channel_name='WhatsApp',
            channel_type='messaging',
            source_code='WA001',
            created_by=self.user
        )

    @patch('channels_app.services.send_mail')
    def test_log_api_failure_email_trigger(self, mock_send_mail):
        # Trigger failures
        for _ in range(3):
            log_api_failure(self.channel, "API error")

        # Check if log created
        self.assertEqual(ChannelAPILog.objects.filter(channel=self.channel).count(), 3)

        # Check if email triggered
        mock_send_mail.assert_called_once()
