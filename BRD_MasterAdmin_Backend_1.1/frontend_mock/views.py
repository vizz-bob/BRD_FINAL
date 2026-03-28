from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# This view returns the exact JSON shape the frontend's mockDashboard has.
class DashboardFullView(APIView):
    permission_classes = [AllowAny]   # demo: allow public access so frontend doesn't need JWT

    def get(self, request):
        data = {
            "kpis": {
                "totalTenants": 24,
                "tenantsTrend": "+12.5%",
                "activeUsers": 3847,
                "usersTrend": "+8.2%",
                "totalLoans": 45892,
                "loansTrend": "+15.3%",
                "disbursedAmount": "₹2,847 Cr",
                "amountTrend": "+22.1%"
            },
            "charts": {
                "monthlyDisbursement": [
                    {"month": "Jan", "amount": 420000},
                    {"month": "Feb", "amount": 460000},
                    {"month": "Mar", "amount": 520000},
                    {"month": "Apr", "amount": 580000},
                    {"month": "May", "amount": 600000},
                    {"month": "Jun", "amount": 640000},
                    {"month": "Jul", "amount": 680000},
                    {"month": "Aug", "amount": 720000},
                    {"month": "Sep", "amount": 760000},
                    {"month": "Oct", "amount": 780000},
                    {"month": "Nov", "amount": 800000},
                    {"month": "Dec", "amount": 820000}
                ],
                "loanStatusDistribution": [
                    {"status": "Active", "count": 30000},
                    {"status": "Paid Off", "count": 12000},
                    {"status": "Default", "count": 2000},
                    {"status": "Pending", "count": 5000}
                ],
                "recentActivity": [
                    {"title": "Loan Application Approved", "subtitle": "HDFC Bank", "time": "2024-12-15 14:30:25"},
                    {"title": "Failed Login Attempt", "subtitle": "IP: 192.168.0.5", "time": "2024-12-15 14:25:10"}
                ]
            }
        }
        return Response(data)
class LoansListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = [
            {"loan_id": "LN001", "tenant_id": "tenant-001", "applicant_name": "Ravi", "amount": 500000, "term_months": 24, "applied_on": "2024-10-01T10:00:00Z", "status": "Pending"},
            {"loan_id": "LN002", "tenant_id": "tenant-002", "applicant_name": "Sita", "amount": 250000, "term_months": 12, "applied_on": "2024-10-05T12:00:00Z", "status": "Approved"}
        ]
        return Response(data)

class TenantsListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = [
            {"tenant_id":"tenant-001","company_name":"Acme Fin","email":"admin@acme.com","phone_number":"9999999999","status":"Active","created_at":"2024-01-01T00:00:00Z","subscription_plan":"Standard"},
            {"tenant_id":"tenant-002","company_name":"Beta Finance","email":"admin@beta.com","phone_number":"8888888888","status":"Trial","created_at":"2024-06-01T00:00:00Z","subscription_plan":"Trial"}
        ]
        return Response(data)

class IntegrationsListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = [
            {"config_id":"int-001","name":"S3 Backup","status":"Connected","last_validated":"2024-11-01T12:00:00Z"},
            {"config_id":"int-002","name":"Twilio","status":"Pending","last_validated":None}
        ]
        return Response(data)

class LogsListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = [
            {"log_id":"log-001","summary":"User logged in","event_type":"LOGIN","timestamp":"2024-12-15T14:20:00Z"},
            {"log_id":"log-002","summary":"Loan created","event_type":"CREATE","timestamp":"2024-12-15T14:25:00Z"}
        ]
        return Response(data)
