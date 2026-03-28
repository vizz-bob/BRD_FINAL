from django.core.management.base import BaseCommand
from profiles.models import PrivacyPolicy


class Command(BaseCommand):
    help = 'Populate default privacy policy'

    def handle(self, *args, **options):
        # Check if privacy policy already exists
        if PrivacyPolicy.objects.filter(is_active=True).exists():
            self.stdout.write(
                self.style.WARNING('Active privacy policy already exists. Skipping...')
            )
            return

        # Create default privacy policy
        privacy_policy = PrivacyPolicy.objects.create(
            title="Your Privacy Matters - Important Notice",
            version="1.0",
            is_active=True,
            introduction="We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.",
            information_we_collect="We collect information you provide directly to us, such as when you create an account, submit a lead, or contact us. This includes your name, email address, phone number, loan details, and any other information you choose to provide.",
            how_we_use_information="We use your information to process your lead applications, communicate with you about your account, provide customer support, send marketing communications (with your consent), and improve our services.",
            information_sharing="We may share your information with our partners, financial institutions, and service providers who need to access your information to provide services. We do not sell your personal information to third parties.",
            data_security="We use industry-standard encryption and security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
            your_rights_and_choices="You have the right to access, correct, or delete your personal information. You can opt out of marketing communications at any time. Contact us for any privacy-related requests.",
            data_retention="We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, or as required by law.",
            cookies_and_tracking="We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.",
            third_party_services="Our platform may contain links to third-party websites. We are not responsible for the privacy practices of external sites. Please review their privacy policies.",
            childrens_privacy="Our services are not intended for children under 18 years of age. We do not knowingly collect information from children. If we become aware of such information, we will delete it promptly.",
            changes_to_policy="We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on our platform and updating the 'last updated' date.",
            contact_us="If you have questions about this Privacy Policy or our privacy practices, please contact us at support@leadmanagement.com or call +91-1800-SUPPORT.",
            quick_summary="We collect information to process your loan applications and improve our services. We protect your data with industry-standard security. We don't sell your information. You have rights over your data. Contact us with any privacy concerns."
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'✓ Successfully created default privacy policy (v{privacy_policy.version})'
            )
        )
