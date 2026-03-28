from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random
from ipaddress import ip_address

from users.models import AuditLog
from tenants.models import Tenant

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate dummy audit logs for testing Audit & Security module'

    def handle(self, *args, **options):
        self.stdout.write('Starting to populate audit logs...')
        
        # Get the demo tenant and users
        tenant = Tenant.objects.filter(name='Demo Bank').first()
        if not tenant:
            self.stdout.write(self.style.ERROR('Demo Bank tenant not found. Please run populate_dummy_data first.'))
            return
        
        users = User.objects.filter(tenant=tenant)
        if not users:
            self.stdout.write(self.style.ERROR('No users found for Demo Bank tenant. Please run populate_dummy_data first.'))
            return
        
        # Clear existing audit logs
        AuditLog.objects.filter(tenant=tenant).delete()
        
        # Create sample audit logs
        audit_logs_data = [
            # Login Activities
            {
                'action_type': 'LOGIN',
                'module': 'AUTHENTICATION',
                'description': 'User logged in successfully',
                'ip_address': '192.168.1.100'
            },
            {
                'action_type': 'LOGIN',
                'module': 'AUTHENTICATION',
                'description': 'User logged in from mobile device',
                'ip_address': '10.0.0.50'
            },
            
            # Collections Activities
            {
                'action_type': 'CREATE',
                'module': 'COLLECTIONS',
                'description': 'Created new delinquency record for Borrower 1',
                'ip_address': '192.168.1.101'
            },
            {
                'action_type': 'UPDATE',
                'module': 'COLLECTIONS',
                'description': 'Updated delinquency bucket from 31-60 to 61-90',
                'ip_address': '192.168.1.102'
            },
            {
                'action_type': 'CREATE',
                'module': 'COLLECTIONS',
                'description': 'Added collection note for overdue payment follow-up',
                'ip_address': '192.168.1.103'
            },
            
            # Support Tickets Activities
            {
                'action_type': 'CREATE',
                'module': 'SUPPORT',
                'description': 'Created new support ticket: Mobile app crash during repayment',
                'ip_address': '192.168.1.104'
            },
            {
                'action_type': 'UPDATE',
                'module': 'SUPPORT',
                'description': 'Changed ticket status from OPEN to IN_PROGRESS',
                'ip_address': '192.168.1.105'
            },
            {
                'action_type': 'APPROVE',
                'module': 'SUPPORT',
                'description': 'Approved resolution for payment dispute ticket',
                'ip_address': '192.168.1.106'
            },
            
            # Knowledge Base Activities
            {
                'action_type': 'CREATE',
                'module': 'KNOWLEDGE_BASE',
                'description': 'Uploaded new resource: Collections Best Practices Guide',
                'ip_address': '192.168.1.107'
            },
            {
                'action_type': 'UPDATE',
                'module': 'KNOWLEDGE_BASE',
                'description': 'Updated knowledge resource category from Processes to Training',
                'ip_address': '192.168.1.108'
            },
            
            # Training Activities
            {
                'action_type': 'CREATE',
                'module': 'TRAINING',
                'description': 'Added new training module: Legal Compliance in Lending',
                'ip_address': '192.168.1.109'
            },
            {
                'action_type': 'UPDATE',
                'module': 'TRAINING',
                'description': 'Marked training module as completed for user',
                'ip_address': '192.168.1.110'
            },
            
            # Escalation Rules Activities
            {
                'action_type': 'CREATE',
                'module': 'ESCALATION',
                'description': 'Created new escalation rule for Underwriting stage',
                'ip_address': '192.168.1.111'
            },
            {
                'action_type': 'UPDATE',
                'module': 'ESCALATION',
                'description': 'Modified escalation rule trigger delay from 24 to 48 hours',
                'ip_address': '192.168.1.112'
            },
            
            # User Management Activities
            {
                'action_type': 'CREATE',
                'module': 'USER_MANAGEMENT',
                'description': 'Created new user account: collector1@demo.bank',
                'ip_address': '192.168.1.113'
            },
            {
                'action_type': 'UPDATE',
                'module': 'USER_MANAGEMENT',
                'description': 'Changed user role from LOAN_OFFICER to ADMIN',
                'ip_address': '192.168.1.114'
            },
            
            # Security Activities
            {
                'action_type': 'LOGIN',
                'module': 'SECURITY',
                'description': 'Failed login attempt - invalid password',
                'ip_address': '203.0.113.1'
            },
            {
                'action_type': 'LOGIN',
                'module': 'SECURITY',
                'description': 'Multiple failed login attempts detected',
                'ip_address': '203.0.113.2'
            },
            {
                'action_type': 'UPDATE',
                'module': 'SECURITY',
                'description': 'User enabled 2FA authentication',
                'ip_address': '192.168.1.115'
            },
            
            # System Activities
            {
                'action_type': 'UPDATE',
                'module': 'SYSTEM',
                'description': 'System configuration updated: Email notifications enabled',
                'ip_address': '127.0.0.1'
            },
            {
                'action_type': 'DELETE',
                'module': 'SYSTEM',
                'description': 'Deleted expired user sessions',
                'ip_address': '127.0.0.1'
            }
        ]
        
        # Create audit logs with random users and timestamps
        created_logs = []
        for log_data in audit_logs_data:
            user = random.choice(users)
            
            # Generate random timestamp within last 30 days
            days_ago = random.randint(0, 30)
            hours_ago = random.randint(0, 23)
            timestamp = timezone.now() - timedelta(days=days_ago, hours=hours_ago)
            
            audit_log = AuditLog.objects.create(
                user=user,
                tenant=tenant,
                **log_data,
                timestamp=timestamp
            )
            created_logs.append(audit_log)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(created_logs)} audit logs!'))
        
        # Display summary
        action_counts = {}
        module_counts = {}
        
        for log in created_logs:
            action_counts[log.action_type] = action_counts.get(log.action_type, 0) + 1
            module_counts[log.module] = module_counts.get(log.module, 0) + 1
        
        self.stdout.write('\n=== Audit Log Summary ===')
        self.stdout.write('Action Types:')
        for action, count in action_counts.items():
            self.stdout.write(f'  {action}: {count}')
        
        self.stdout.write('\nModules:')
        for module, count in module_counts.items():
            self.stdout.write(f'  {module}: {count}')
        
        self.stdout.write('\n=== Recent Activities ===')
        recent_logs = sorted(created_logs, key=lambda x: x.timestamp, reverse=True)[:5]
        for log in recent_logs:
            self.stdout.write(f'  {log.timestamp.strftime("%Y-%m-%d %H:%M")} - {log.user.email} - {log.action_type} - {log.module} - {log.description[:50]}...')
