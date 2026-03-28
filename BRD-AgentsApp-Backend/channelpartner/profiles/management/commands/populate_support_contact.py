from django.core.management.base import BaseCommand
from profiles.models import SupportContactInfo


class Command(BaseCommand):
    help = 'Populate default support contact information'

    def handle(self, *args, **options):
        # Check if support contact info already exists
        if SupportContactInfo.objects.exists():
            self.stdout.write(
                self.style.WARNING('Support contact info already exists. Skipping...')
            )
            return

        # Create default support contact info
        support_info = SupportContactInfo.objects.create(
            phone_number="+91-1800-SUPPORT",
            whatsapp_number="+91-9876543210",
            email="support@leadmanagement.com",
            support_hours="Monday - Friday, 9:00 AM - 6:00 PM IST",
            is_active=True
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'✓ Successfully created default support contact info:\n'
                f'  Phone: {support_info.phone_number}\n'
                f'  WhatsApp: {support_info.whatsapp_number}\n'
                f'  Email: {support_info.email}\n'
                f'  Hours: {support_info.support_hours}'
            )
        )
