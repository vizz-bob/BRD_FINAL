from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Create ONE Master Admin user (backend-only)"

    def handle(self, *args, **options):
        if User.objects.filter(is_master_admin=True).exists():
            self.stdout.write(
                self.style.ERROR("❌ Master Admin already exists. Cannot create another.")
            )
            return

        email = input("Enter Master Admin email: ").strip()
        password = input("Enter Master Admin password: ").strip()

        if not email or not password:
            self.stdout.write(self.style.ERROR("Email and password are required"))
            return

        user = User.objects.create_master_admin(
            email=email,
            password=password
        )

        self.stdout.write(
            self.style.SUCCESS(f"✅ Master Admin created successfully: {user.email}")
        )
