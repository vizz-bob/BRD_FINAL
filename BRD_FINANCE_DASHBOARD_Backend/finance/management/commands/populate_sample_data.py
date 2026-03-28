from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from finance.models import (
    Loan, Disbursement, ReconciliationTransaction, Repayment, 
    PaymentRecord, Reminder, Tenant, Dashboard
)


class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create sample Tenants
        tenant1, _ = Tenant.objects.get_or_create(
            name='HDFC Bank',
            defaults={'type': 'Bank', 'email': 'info@hdfc.com', 'active': True}
        )
        tenant2, _ = Tenant.objects.get_or_create(
            name='Bajaj Finance',
            defaults={'type': 'NBFC', 'email': 'info@bajaj.com', 'active': True}
        )
        self.stdout.write(self.style.SUCCESS(f'Created tenants: {tenant1}, {tenant2}'))
        
        # Create sample Loans
        loans_data = [
            {'loan_id': 'LN-101', 'borrower_name': 'John Doe', 'loan_amount': 500000},
            {'loan_id': 'LN-102', 'borrower_name': 'Aditi Sharma', 'loan_amount': 1000000},
            {'loan_id': 'LN-103', 'borrower_name': 'Rahul Verma', 'loan_amount': 750000},
            {'loan_id': 'LN-104', 'borrower_name': 'Priya Singh', 'loan_amount': 600000},
            {'loan_id': 'LN-105', 'borrower_name': 'Amit Kumar', 'loan_amount': 800000},
        ]
        
        loans = []
        for loan_data in loans_data:
            loan, _ = Loan.objects.get_or_create(
                loan_id=loan_data['loan_id'],
                defaults={
                    'borrower_name': loan_data['borrower_name'],
                    'loan_amount': loan_data['loan_amount']
                }
            )
            loans.append(loan)
        self.stdout.write(self.style.SUCCESS(f'Created {len(loans)} loans'))
        
        # Create sample Disbursements
        today = timezone.now().date()
        disbursement_data = [
            {'disbursement_id': 'DIS-001', 'loan': loans[0], 'recipient_name': 'John Doe', 'amount': 250000, 'status': 'Paid', 'payment_method': 'BANK_TRANSFER'},
            {'disbursement_id': 'DIS-002', 'loan': loans[1], 'recipient_name': 'Aditi Sharma', 'amount': 500000, 'status': 'Paid', 'payment_method': 'RTGS'},
            {'disbursement_id': 'DIS-003', 'loan': loans[2], 'recipient_name': 'Rahul Verma', 'amount': 400000, 'status': 'Pending', 'payment_method': 'NEFT'},
            {'disbursement_id': 'DIS-004', 'loan': loans[3], 'recipient_name': 'Priya Singh', 'amount': 300000, 'status': 'Paid', 'payment_method': 'BANK_TRANSFER'},
            {'disbursement_id': 'DIS-005', 'loan': loans[4], 'recipient_name': 'Amit Kumar', 'amount': 400000, 'status': 'Failed', 'payment_method': 'RTGS'},
        ]
        
        for disb_data in disbursement_data:
            Disbursement.objects.get_or_create(
                disbursement_id=disb_data['disbursement_id'],
                defaults={
                    'loan': disb_data['loan'],
                    'recipient_name': disb_data['recipient_name'],
                    'amount': disb_data['amount'],
                    'date': today,
                    'status': disb_data['status'],
                    'payment_method': disb_data['payment_method'],
                }
            )
        self.stdout.write(self.style.SUCCESS('Created disbursements'))
        
        # Create sample ReconciliationTransactions
        reconciliation_data = [
            {'transaction_id': 1001, 'description': 'Loan Interest Payment', 'amount': 25000, 'status': 'Reconciled'},
            {'transaction_id': 1002, 'description': 'Principal Repayment', 'amount': 150000, 'status': 'Unreconciled'},
            {'transaction_id': 1003, 'description': 'Late Fee Payment', 'amount': 5000, 'status': 'Pending'},
            {'transaction_id': 1004, 'description': 'Loan Disbursement', 'amount': 500000, 'status': 'Reconciled'},
        ]
        
        for rec_data in reconciliation_data:
            ReconciliationTransaction.objects.get_or_create(
                transaction_id=rec_data['transaction_id'],
                defaults={
                    'transaction_date': today,
                    'description': rec_data['description'],
                    'amount': rec_data['amount'],
                    'status': rec_data['status'],
                }
            )
        self.stdout.write(self.style.SUCCESS('Created reconciliation transactions'))
        
        # Create sample Repayments
        repayment_data = [
            {'repayment_id': 'REP-001', 'loan': loans[0], 'borrower_name': 'John Doe', 'amount_due': 50000, 'status': 'Paid'},
            {'repayment_id': 'REP-002', 'loan': loans[1], 'borrower_name': 'Aditi Sharma', 'amount_due': 100000, 'status': 'Pending'},
            {'repayment_id': 'REP-003', 'loan': loans[2], 'borrower_name': 'Rahul Verma', 'amount_due': 75000, 'status': 'Overdue'},
            {'repayment_id': 'REP-004', 'loan': loans[3], 'borrower_name': 'Priya Singh', 'amount_due': 60000, 'status': 'Paid'},
        ]
        
        for rep_data in repayment_data:
            Repayment.objects.get_or_create(
                repayment_id=rep_data['repayment_id'],
                defaults={
                    'loan': rep_data['loan'],
                    'borrower_name': rep_data['borrower_name'],
                    'amount_due': rep_data['amount_due'],
                    'due_date': today + timedelta(days=30),
                    'status': rep_data['status'],
                    'repayment_type': 'Principal',
                    'paid_date': today if rep_data['status'] == 'Paid' else None,
                }
            )
        self.stdout.write(self.style.SUCCESS('Created repayments'))
        
        # Create sample Dashboard
        Dashboard.objects.get_or_create(
            id=1,
            defaults={
                'total_disbursed': 1450000,
                'pending_disbursement': 400000,
                'collection_rate': 0.92,
                'overdue_amount': 75000,
            }
        )
        self.stdout.write(self.style.SUCCESS('Created dashboard'))
        
        self.stdout.write(self.style.SUCCESS('✓ Sample data created successfully!'))
