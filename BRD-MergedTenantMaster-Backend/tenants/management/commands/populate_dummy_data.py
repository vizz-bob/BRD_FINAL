from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
import random
from datetime import datetime, timedelta

from tenants.models import Tenant, Branch
from lms.models import LoanAccount, Repayment
from los.models import LoanApplication
from crm.models import Customer
from loan_collections.models import Delinquency
from ticket.models import Ticket
from knowledge_base.models import KnowledgeResource
from training.models import TrainingModule

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate dummy data for Collections, Support Tickets, Knowledge Base, and Training Academy modules'

    def handle(self, *args, **options):
        self.stdout.write('Starting to populate dummy data...')
        
        # Create or get a sample tenant
        tenant, created = Tenant.objects.get_or_create(
            name='Demo Bank',
            defaults={
                'tenant_type': 'BANK',
                'email': 'admin@demo.bank',
                'phone': '+1234567890',
                'address': '123 Banking Street, Financial District',
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'pincode': '400001',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(f'Created tenant: {tenant.name}')
        
        # Create sample users
        self.create_sample_users(tenant)
        
        # Create sample loan applications and accounts
        loan_accounts = self.create_sample_loans(tenant)
        
        # Create collections data
        self.create_collections_data(loan_accounts)
        
        # Create support tickets
        self.create_support_tickets(tenant)
        
        # Create knowledge base resources
        self.create_knowledge_base(tenant)
        
        # Create training modules
        self.create_training_modules(tenant)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated dummy data!'))

    def create_sample_users(self, tenant):
        users_data = [
            {'email': 'collector1@demo.bank', 'first_name': 'John', 'last_name': 'Smith', 'role': 'LOAN_OFFICER'},
            {'email': 'agent1@demo.bank', 'first_name': 'Sarah', 'last_name': 'Johnson', 'role': 'LOAN_OFFICER'},
            {'email': 'manager1@demo.bank', 'first_name': 'Mike', 'last_name': 'Wilson', 'role': 'ADMIN'},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'role': user_data['role'],
                    'tenant': tenant,
                    'is_active': True
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.email}')

    def create_sample_loans(self, tenant):
        # Create sample customers first
        customers = []
        for i in range(10):
            customer = Customer.objects.create(
                tenant=tenant,
                name=f'Borrower {i+1}',
                email=f'borrower{i+1}@email.com',
                phone=f'+123456789{i}',
                company=f'Company {i+1}',
                kyc_status='VERIFIED'
            )
            customers.append(customer)
        
        # Create sample loan applications
        loan_applications = []
        for i, customer in enumerate(customers):
            app = LoanApplication.objects.create(
                tenant=tenant,
                customer=customer,
                amount=Decimal(random.randint(50000, 500000)),
                tenure_months=random.randint(12, 60),
                interest_rate=Decimal(random.uniform(10, 18)).quantize(Decimal('0.01')),
                status='APPROVED',
                created_at=timezone.now() - timedelta(days=random.randint(30, 365))
            )
            loan_applications.append(app)
        
        # Create loan accounts from approved applications
        loan_accounts = []
        for app in loan_applications:
            account = LoanAccount.objects.create(
                loan_application=app,
                outstanding_principal=app.amount * Decimal('0.8'),  # 80% remaining
                emi_amount=app.amount / Decimal(app.tenure_months),
                tenor_months=app.tenure_months,
                interest_rate=app.interest_rate,
                disbursed_at=timezone.now() - timedelta(days=random.randint(1, 30))
            )
            loan_accounts.append(account)
        
        self.stdout.write(f'Created {len(loan_accounts)} loan accounts')
        return loan_accounts

    def create_collections_data(self, loan_accounts):
        buckets = ['0-30', '31-60', '61-90', '90+']
        actions = ['CALL', 'VISIT', 'LEGAL', 'SETTLED']
        
        for i, account in enumerate(loan_accounts[:7]):  # Create delinquency for 7 accounts
            Delinquency.objects.create(
                loan_account=account,
                borrower_name=account.loan_application.customer.name,
                dpd=random.randint(5, 120),
                overdue_amount=account.outstanding_principal * Decimal('0.1'),
                bucket=random.choice(buckets),
                action_type=random.choice(actions),
                remarks=f'Follow-up required for overdue payment. DPD: {random.randint(5, 120)} days.'
            )
        
        self.stdout.write('Created collections delinquency data')

    def create_support_tickets(self, tenant):
        categories = ['TECHNICAL', 'PAYMENT', 'REPAYMENT', 'ACCOUNT', 'DISPUTE', 'OTHER']
        priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
        
        tickets_data = [
            {
                'subject': 'Unable to access loan dashboard',
                'category': 'TECHNICAL',
                'priority': 'HIGH',
                'description': 'Customer unable to login to view loan details. Getting error 500.',
                'status': 'IN_PROGRESS'
            },
            {
                'subject': 'EMI payment not reflected',
                'category': 'PAYMENT',
                'priority': 'CRITICAL',
                'description': 'Customer paid EMI on 15th but still showing as overdue in system.',
                'status': 'OPEN'
            },
            {
                'subject': 'Loan account statement request',
                'category': 'ACCOUNT',
                'priority': 'MEDIUM',
                'description': 'Customer needs detailed loan account statement for tax filing.',
                'status': 'RESOLVED'
            },
            {
                'subject': 'Dispute on late payment charges',
                'category': 'DISPUTE',
                'priority': 'HIGH',
                'description': 'Customer claims they paid on time but were charged late fees.',
                'status': 'IN_PROGRESS'
            },
            {
                'subject': 'Mobile app crash during repayment',
                'category': 'TECHNICAL',
                'priority': 'HIGH',
                'description': 'App crashes when customer tries to make online payment.',
                'status': 'OPEN'
            }
        ]
        
        for ticket_data in tickets_data:
            Ticket.objects.create(
                tenant=tenant,
                **ticket_data
            )
        
        self.stdout.write('Created support tickets')

    def create_knowledge_base(self, tenant):
        resources_data = [
            {
                'title': 'Loan Application Process Guide',
                'category': 'Processes',
                'type': 'PDF',
                'file_url': 'https://example.com/loan-process-guide.pdf',
                'size': '2.5 MB'
            },
            {
                'title': 'Collections Best Practices',
                'category': 'Training',
                'type': 'VIDEO',
                'file_url': 'https://example.com/collections-training.mp4',
                'size': '15.3 MB'
            },
            {
                'title': 'Customer Service Guidelines',
                'category': 'Policies',
                'type': 'PDF',
                'file_url': 'https://example.com/service-guidelines.pdf',
                'size': '1.8 MB'
            },
            {
                'title': 'Legal Notice Templates',
                'category': 'Legal',
                'type': 'LINK',
                'file_url': 'https://example.com/legal-templates',
                'size': 'Web Resource'
            },
            {
                'title': 'Repayment Process Overview',
                'category': 'Processes',
                'type': 'VIDEO',
                'file_url': 'https://example.com/repayment-process.mp4',
                'size': '8.7 MB'
            }
        ]
        
        for resource_data in resources_data:
            KnowledgeResource.objects.create(
                tenant=tenant,
                **resource_data
            )
        
        self.stdout.write('Created knowledge base resources')

    def create_training_modules(self, tenant):
        modules_data = [
            {
                'title': 'Introduction to Loan Management',
                'category': 'Onboarding',
                'type': 'VIDEO',
                'duration': '25 mins',
                'file_url': 'https://example.com/loan-management-intro.mp4',
                'completed': True
            },
            {
                'title': 'Collections Communication Skills',
                'category': 'Collections',
                'type': 'VIDEO',
                'duration': '45 mins',
                'file_url': 'https://example.com/collections-communication.mp4',
                'completed': True
            },
            {
                'title': 'Understanding Credit Scoring',
                'category': 'Risk Assessment',
                'type': 'PDF',
                'duration': '30 mins',
                'file_url': 'https://example.com/credit-scoring-guide.pdf',
                'completed': False
            },
            {
                'title': 'Customer Service Excellence',
                'category': 'Soft Skills',
                'type': 'VIDEO',
                'duration': '35 mins',
                'file_url': 'https://example.com/customer-service.mp4',
                'completed': False
            },
            {
                'title': 'Legal Compliance in Lending',
                'category': 'Compliance',
                'type': 'PDF',
                'duration': '40 mins',
                'file_url': 'https://example.com/legal-compliance.pdf',
                'completed': False
            }
        ]
        
        for module_data in modules_data:
            TrainingModule.objects.create(
                tenant=tenant,
                **module_data
            )
        
        self.stdout.write('Created training modules')
