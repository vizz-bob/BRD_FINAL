# ReferPeople.in — Complete Platform Guide
## Deployment, Operations & User Management

**Version:** 1.0 | **Date:** May 2026 | **Server:** 13.201.38.123

---

## TABLE OF CONTENTS

1. [What is ReferPeople.in?](#1-what-is-referpeoplein)
2. [Platform Architecture](#2-platform-architecture)
3. [All Services — Ports, URLs & What They Do](#3-all-services--ports-urls--what-they-do)
4. [Complete Fresh Deployment Guide](#4-complete-fresh-deployment-guide)
5. [Environment Files (.env) Setup](#5-environment-files-env-setup)
6. [Docker Build & Start All Containers](#6-docker-build--start-all-containers)
7. [Database Setup & Migrations](#7-database-setup--migrations)
8. [Testing All Connections](#8-testing-all-connections)
9. [Super Admin — Access & Operations](#9-super-admin--access--operations)
10. [Admin Account — Create & Manage](#10-admin-account--create--manage)
11. [User Account — Create & Manage](#11-user-account--create--manage)
12. [Property & Loan Data Management](#12-property--loan-data-management)
13. [GitHub CI/CD Pipeline](#13-github-cicd-pipeline)
14. [SSL & Domain Setup](#14-ssl--domain-setup)
15. [Common Issues & Fixes](#15-common-issues--fixes)
16. [All Configuration Files Reference](#16-all-configuration-files-reference)

---

## 1. What is ReferPeople.in?

ReferPeople.in is a **multi-tenant loan and property management platform** built for financial institutions. It allows organisations to manage the full lifecycle of loans and property valuations through a suite of specialised dashboards.

### What the Platform Does

The platform connects multiple roles in the loan/property business:

- **Master Admin** manages the entire platform — all tenants, all users, all products
- **Tenant Admin** manages their organisation's staff, branches, and loan products
- **CRM** handles customer leads and follow-ups for loan enquiries
- **Sales CRM** tracks the sales pipeline from lead to disbursement
- **Finance Dashboard** monitors loan disbursements, repayments, and financial reports
- **Agents App** for field agents who collect documents and verify customers
- **Channel Partner Dashboard** for referral partners who bring in loan leads
- **Fraud Team Dashboard** flags and investigates suspicious applications
- **Legal Dashboard** manages legal documentation and agreements
- **Operations Verification** verifies documents and disburses approved loans
- **Valuation Dashboard** handles property valuation assignments for loan collateral
- **Website** public-facing landing page for loan enquiries

### How a Loan Works (End to End)

```
Customer visits referpeople.in
        ↓
Fills enquiry form → Lead created in CRM
        ↓
Sales CRM agent calls customer, qualifies them
        ↓
CRM creates loan application
        ↓
Documents collected by Agent (field app)
        ↓
Operations team verifies documents
        ↓
Valuation team visits property (if secured loan)
        ↓
Legal team prepares agreement
        ↓
Finance team disburses funds
        ↓
Loan goes into repayment tracking
```

### How Property Valuation Works

```
Loan application marked as "requires property valuation"
        ↓
Valuation Dashboard gets the assignment
        ↓
Valuation officer visits property
        ↓
Report uploaded to Valuation Dashboard
        ↓
Report linked back to loan application
        ↓
Legal/Finance proceeds with disbursement
```

---

## 2. Platform Architecture

```
Internet
    │
    ▼
Nginx (Port 80 / 443 after SSL)
    │
    ├─ Route /                    → website-frontend (React, Port 3000)
    ├─ Route /master-admin/       → masteradmin-frontend (React, Port 3001)
    ├─ Route /tenant/             → tenant-frontend (React, Port 3002)
    ├─ Route /crm/                → crm-frontend (React, Port 3003)
    ├─ Route /finance/            → finance-frontend (React, Port 3004)
    ├─ Route /sales-crm/          → salescrm-frontend (React, Port 3005)
    ├─ Route /tenant-admin/       → tenantadmin-frontend (React, Port 3006)
    ├─ Route /channel/            → channel-frontend (React, Port 3007)
    ├─ Route /fraud/              → fraud-frontend (React, Port 3008)
    ├─ Route /legal/              → legal-frontend (React, Port 3009)
    ├─ Route /operations/         → operations-frontend (React, Port 3010)
    ├─ Route /valuation/          → valuation-frontend (React, Port 3011)
    │
    ├─ Route /api/master-admin/   → masteradmin-backend (Django, Port 8001)
    ├─ Route /api/tenant/         → tenant-backend (Django, Port 8002)
    ├─ Route /api/crm/            → crm-backend (Django, Port 8003)
    ├─ Route /api/finance/        → finance-backend (Django, Port 8004)
    ├─ Route /api/agents/         → agents-backend (Django, Port 8005)
    ├─ Route /api/channel/        → channel-backend (Django, Port 8006)
    ├─ Route /api/fraud/          → fraud-backend (Django, Port 8007)
    ├─ Route /api/legal/          → legal-backend (Django, Port 8008)
    ├─ Route /api/operations/     → operations-backend (Django, Port 8009)
    ├─ Route /api/sales-crm/      → salescrm-backend (Django, Port 8010)
    ├─ Route /api/tenant-admin/   → tenantadmin-backend (Django, Port 8011)
    └─ Route /api/valuation/      → valuation-backend (Django, Port 8012)

Redis (Port 6379) — background tasks queue
RDS PostgreSQL (Port 5432) — all databases
```

### Infrastructure

| Component | Service | Details |
|-----------|---------|---------|
| Web Server | EC2 t3.large | Ubuntu 22.04, 8 vCPU, 8GB RAM, 30GB disk |
| Database | RDS PostgreSQL 16 | db.t3.micro, Multi-AZ off, ap-south-1 |
| Cache/Queue | Redis 7 | Docker container |
| Proxy | Nginx 1.25 | Docker container, routes all traffic |
| Runtime | Docker Compose | 26 containers total |

---

## 3. All Services — Ports, URLs & What They Do

### Frontend Services

| Container | Port | URL to Open | What It Is |
|-----------|------|-------------|------------|
| website-frontend | 3000 | http://65.1.45.32/ | Public website / loan enquiry form |
| masteradmin-frontend | 3001 | http://65.1.45.32/master-admin/ | Platform super-admin panel |
| tenant-frontend | 3002 | http://65.1.45.32/tenant/ | Tenant organisation portal |
| crm-frontend | 3003 | http://65.1.45.32/crm/ | CRM - leads & customers |
| finance-frontend | 3004 | http://65.1.45.32/finance/ | Finance & disbursement |
| salescrm-frontend | 3005 | http://65.1.45.32/sales-crm/ | Sales pipeline |
| tenantadmin-frontend | 3006 | http://65.1.45.32/tenant-admin/ | Tenant admin panel |
| channel-frontend | 3007 | http://65.1.45.32/channel/ | Channel partners |
| fraud-frontend | 3008 | http://65.1.45.32/fraud/ | Fraud detection team |
| legal-frontend | 3009 | http://65.1.45.32/legal/ | Legal team |
| operations-frontend | 3010 | http://65.1.45.32/operations/ | Operations verification |
| valuation-frontend | 3011 | http://65.1.45.32/valuation/ | Property valuation |

### Backend Services (Django REST APIs)

| Container | Port | API Base URL | Django Admin |
|-----------|------|-------------|--------------|
| masteradmin-backend | 8001 | http://65.1.45.32/api/master-admin/ | http://65.1.45.32:8001/admin/ |
| tenant-backend | 8002 | http://65.1.45.32/api/tenant/ | http://65.1.45.32:8002/admin/ |
| crm-backend | 8003 | http://65.1.45.32/api/crm/ | http://65.1.45.32:8003/admin/ |
| finance-backend | 8004 | http://65.1.45.32/api/finance/ | http://65.1.45.32:8004/admin/ |
| agents-backend | 8005 | http://65.1.45.32/api/agents/ | http://65.1.45.32:8005/admin/ |
| channel-backend | 8006 | http://65.1.45.32/api/channel/ | http://65.1.45.32:8006/admin/ |
| fraud-backend | 8007 | http://65.1.45.32/api/fraud/ | http://65.1.45.32:8007/admin/ |
| legal-backend | 8008 | http://65.1.45.32/api/legal/ | http://65.1.45.32:8008/admin/ |
| operations-backend | 8009 | http://65.1.45.32/api/operations/ | http://65.1.45.32:8009/admin/ |
| salescrm-backend | 8010 | http://65.1.45.32/api/sales-crm/ | http://65.1.45.32:8010/admin/ |
| tenantadmin-backend | 8011 | http://65.1.45.32/api/tenant-admin/ | http://65.1.45.32:8011/admin/ |
| valuation-backend | 8012 | http://65.1.45.32/api/valuation/ | http://65.1.45.32:8012/admin/ |

### Infrastructure Services

| Container | Port | Purpose |
|-----------|------|---------|
| nginx | 80 | Reverse proxy — routes all traffic |
| redis | 6379 | Task queue for background jobs |

### Databases on RDS

| Database Name | Used By |
|---------------|---------|
| masteradmin_db | masteradmin-backend |
| tenant_db | tenant-backend |
| crm_db | crm-backend |
| finance_db | finance-backend |
| agents_db | agents-backend |
| channel_db | channel-backend |
| fraud_db | fraud-backend |
| legal_db | legal-backend |
| operations_db | operations-backend |
| salescrm_db | salescrm-backend |
| tenantadmin_db | tenantadmin-backend |
| valuation_db | valuation-backend |

---

## 4. Complete Fresh Deployment Guide

This section walks you through deploying the platform on a brand-new server from scratch.

### 4.1 AWS Prerequisites

Before starting, you need:
- AWS account with billing enabled
- Domain name (referpeople.in) with DNS access
- GitHub account with access to the BRD_FINAL repository
- EC2 key pair (.pem file) saved on your laptop

### 4.2 Create AWS VPC (Network)

Log into AWS Console → VPC → Create VPC

**Settings:**
```
VPC name:        referpeople-vpc
IPv4 CIDR:       10.0.0.0/16
```

Then create subnets (VPC → Subnets → Create subnet):

```
Subnet 1 (Public):
  Name: referpeople-public-1a
  AZ:   ap-south-1a
  CIDR: 10.0.1.0/24

Subnet 2 (Public):
  Name: referpeople-public-1b
  AZ:   ap-south-1b
  CIDR: 10.0.2.0/24
```

Create Internet Gateway → attach to VPC:
```
Name: referpeople-igw
Attach to: referpeople-vpc
```

Update Route Table for public subnets:
```
Destination: 0.0.0.0/0
Target: referpeople-igw (the internet gateway)
```

### 4.3 Create RDS PostgreSQL Database

AWS Console → RDS → Create database

```
Engine:           PostgreSQL 16
Template:         Free tier
DB identifier:    referpeople-db
Master username:  referpeopleadmin
Master password:  ReferPeopleDB2024
Instance:         db.t3.micro
Storage:          20 GB gp2
VPC:              referpeople-vpc
Public access:    No
Security group:   Allow port 5432 from EC2 security group
```

Note the endpoint after creation — it will look like:
`referpeople-db.xxxxxxxx.ap-south-1.rds.amazonaws.com`

### 4.4 Create EC2 Instance

AWS Console → EC2 → Launch Instance

```
Name:           referpeople-server
AMI:            Ubuntu Server 22.04 LTS
Instance type:  t3.large  (8GB RAM — required for 26 containers)
Key pair:       referpeople-key (create new, download .pem file)
VPC:            referpeople-vpc
Subnet:         referpeople-public-1a
Auto-assign IP: Enable
Security group: Allow inbound:
                  Port 22   (SSH)   from your IP
                  Port 80   (HTTP)  from anywhere
                  Port 443  (HTTPS) from anywhere
Storage:        30 GB gp3  (IMPORTANT: change from default 8GB)
```

After launch, assign an Elastic IP (so IP never changes):
```
EC2 → Elastic IPs → Allocate → Associate → select your instance
```

### 4.5 Connect to EC2

```bash
# From your laptop (Mac/Linux):
chmod 400 ~/Downloads/referpeople-key.pem
ssh -i ~/Downloads/referpeople-key.pem ubuntu@13.201.38.123

# If you get "Permission denied" — check the key file path
# If connection hangs — check security group has port 22 open
```

### 4.6 Install Docker on EC2

Run these commands after SSH-ing into EC2:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo bash

# Add ubuntu user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# IMPORTANT: Disconnect and reconnect SSH for group change to take effect
exit
ssh -i ~/Downloads/referpeople-key.pem ubuntu@13.201.38.123

# Verify Docker works
docker --version
docker compose version
```

### 4.7 Add Swap Space (Prevents crashes during build)

```bash
# Add 4GB swap — prevents RAM exhaustion during Docker builds
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
# Should show: Swap: 4.0G
```

### 4.8 Clone Repository

```bash
cd ~
git clone https://github.com/vizz-bob/BRD_FINAL.git
cd BRD_FINAL
ls
# You should see all the backend and frontend folders
```

### 4.9 Set Up Environment Files

```bash
# Edit the setup script with your actual values
nano create-env-files.sh

# Change these two lines:
# DB_PASSWORD="ReferPeopleDB2024"     ← your RDS password
# SERVER_IP="13.201.38.123"           ← your EC2 Elastic IP

# Run the script
bash create-env-files.sh

# Verify files were created
find . -name ".env" | head -15
```

For the 4 backends with their own legacy .env files, update them separately:

```bash
# Finance, Fraud, Legal, Operations backends need these values:
# DB_USER=referpeopleadmin
# DB_PASSWORD=ReferPeopleDB2024
# DB_NAME=finance_db (or fraud_db, legal_db, operations_db)
# PGSSLMODE=require
```

### 4.10 Build and Start All Containers

**IMPORTANT:** Use tmux so SSH disconnects don't kill the build

```bash
# Install tmux
sudo apt install -y tmux

# Start tmux session
tmux new -s deploy

# Build in batches to avoid RAM exhaustion
# Batch 1: Core services
docker compose build --no-cache masteradmin-backend masteradmin-frontend tenant-backend tenant-frontend

# Batch 2: CRM + Finance
docker compose build --no-cache crm-backend crm-frontend finance-backend finance-frontend

# Batch 3: Sales + Tenant Admin
docker compose build --no-cache salescrm-backend salescrm-frontend tenantadmin-backend tenantadmin-frontend

# Batch 4: Agents + Channel
docker compose build --no-cache agents-backend channel-backend channel-frontend

# Batch 5: Fraud + Legal
docker compose build --no-cache fraud-backend fraud-frontend legal-backend legal-frontend

# Batch 6: Operations + Valuation
docker compose build --no-cache operations-backend operations-frontend valuation-backend valuation-frontend

# Batch 7: Website
docker compose build --no-cache website-frontend

# Start everything
docker compose up -d

# Check all containers are running
docker compose ps
# All 26 should show "Up" — none should show "Restarting"
```

**If SSH disconnects during build:**
```bash
# After reconnecting:
ssh -i ~/Downloads/referpeople-key.pem ubuntu@13.201.38.123
tmux attach -t deploy   # Rejoin the session
```

---

## 5. Environment Files (.env) Setup

Each backend needs a `.env` file with database credentials. Here is the template:

### Standard Template (for most backends)

```env
DEBUG=False
DJANGO_ENV=production
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=13.201.38.123,referpeople.in,www.referpeople.in,localhost

DB_NAME=masteradmin_db        ← change per service
DB_USER=referpeopleadmin
DB_PASSWORD=ReferPeopleDB2024
DB_HOST=referpeople-db.cju28y6c0s6d.ap-south-1.rds.amazonaws.com
DB_PORT=5432
PGSSLMODE=require             ← required for RDS SSL

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://65.1.45.32

AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
```

### DB_NAME Per Service

| Backend Folder | DB_NAME |
|----------------|---------|
| BRD_MasterAdmin_Backend_1.1 | masteradmin_db |
| BRD-MergedTenantMaster-Backend | tenant_db |
| BRD_CRM_1.1_BACKEND | crm_db |
| BRD_FINANCE_DASHBOARD_Backend | finance_db |
| BRD-AgentsApp-Backend | agents_db |
| BRD-ChannelPartnerDashboard-Backend | channel_db |
| BRD-FraudTeam-Dashboard-Backend | fraud_db |
| BRD-LegalDashboard-Backend | legal_db |
| BRD-OperationVerification-Backend | operations_db |
| BRD-SalesCRM-Dashboard-Backend | salescrm_db |
| BRD-TenantAdmin_backend_2.0 | tenantadmin_db |
| BRD-Valuation-Dashboard-Backend | valuation_db |

---

## 6. Docker Build & Start All Containers

### Start / Stop Commands

```bash
cd /home/ubuntu/BRD_FINAL

# Start all containers
docker compose up -d

# Stop all containers
docker compose down

# Restart a single container
docker compose restart masteradmin-backend

# Rebuild and restart a single container (after code changes)
docker compose up -d --build masteradmin-backend

# View logs of one container
docker compose logs -f masteradmin-backend

# View logs of all containers
docker compose logs -f

# Check container status
docker compose ps
```

### What to Expect After Start

After `docker compose up -d`, run `docker compose ps` and you should see 26 containers all showing **Up**:

```
loancrm_masteradmin_backend    Up    0.0.0.0:8001->8000/tcp
loancrm_masteradmin_frontend   Up    0.0.0.0:3001->80/tcp
loancrm_tenant_backend         Up    0.0.0.0:8002->8000/tcp
... (all 26 containers)
loancrm_nginx                  Up    0.0.0.0:80->80/tcp
loancrm_redis                  Up (healthy)
```

If any show **Restarting**, check logs: `docker compose logs <container-name>`

---

## 7. Database Setup & Migrations

### Create Databases (First Time Only)

```bash
# Run from EC2, using the masteradmin container to connect to RDS
docker compose exec -T masteradmin-backend python -c "
import psycopg2
conn = psycopg2.connect(
    host='referpeople-db.cju28y6c0s6d.ap-south-1.rds.amazonaws.com',
    port=5432, user='referpeopleadmin', password='ReferPeopleDB2024',
    dbname='postgres', sslmode='require'
)
conn.autocommit = True
cur = conn.cursor()
databases = ['masteradmin_db','tenant_db','crm_db','finance_db','agents_db',
             'channel_db','fraud_db','legal_db','operations_db',
             'salescrm_db','tenantadmin_db','valuation_db']
for db in databases:
    try:
        cur.execute(f'CREATE DATABASE {db}')
        print(f'Created: {db}')
    except Exception as e:
        print(f'Skipped {db}: {e}')
cur.close()
conn.close()
"
```

### Run Migrations (After First Deploy)

```bash
# Run migrations on all backends
for svc in masteradmin-backend tenant-backend crm-backend finance-backend \
           agents-backend channel-backend fraud-backend legal-backend \
           operations-backend salescrm-backend tenantadmin-backend valuation-backend; do
  echo "=== $svc ==="
  docker compose exec -T $svc python manage.py migrate --noinput 2>&1 | tail -3
done
```

---

## 8. Testing All Connections

### Quick Health Check — All 12 Routes

```bash
for path in / /master-admin/ /crm/ /finance/ /sales-crm/ /tenant-admin/ \
            /channel/ /fraud/ /legal/ /operations/ /valuation/ /tenant/; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost$path)
  echo "$STATUS  http://65.1.45.32$path"
done
```

All should return **200**.

### Test Backend APIs Directly

```bash
# Test masteradmin API
curl -s http://localhost:8001/api/ | head -100

# Test if Django admin is accessible
curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/admin/
# Should return 200 or 302

# Test all backend ports
for port in 8001 8002 8003 8004 8005 8006 8007 8008 8009 8010 8011 8012; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:$port/admin/ 2>/dev/null || echo "ERR")
  echo "Port $port: $STATUS"
done
```

### Test Database Connections

```bash
# Test RDS connection from any backend
docker compose exec masteradmin-backend python -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute('SELECT version()')
print('DB connected:', cursor.fetchone()[0][:50])
"
```

### Test Redis

```bash
docker compose exec redis redis-cli ping
# Should return: PONG
```

### Check Container Memory Usage

```bash
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Check Disk Space

```bash
df -h /
# Should show at least 5GB free — if under 2GB, run docker system prune
```

---

## 9. Super Admin — Access & Operations

The Super Admin has full platform access — they can create tenants, manage all users, and see all data across the platform.

### Accessing Super Admin Panel

Open in browser:
```
http://65.1.45.32/master-admin/
```

Or the Django admin panel (raw database access):
```
http://65.1.45.32:8001/admin/
```

### Super Admin Credentials (Created During Setup)

```
Email:    admin@referpeople.com
Password: (set when you created the superuser)
```

### Create Super Admin (If Not Done Yet)

```bash
docker compose exec masteradmin-backend python manage.py createsuperuser
# Enter:
#   Email:    admin@referpeople.com
#   Username: admin
#   Password: (choose strong password)
```

### What Super Admin Can Do

From the Master Admin dashboard (`/master-admin/`):

- **Tenant Management** — create new tenant organisations, activate/deactivate them
- **User Management** — view all users across all tenants, reset passwords
- **Product Management** — define loan products (home loan, personal loan, etc.)
- **Reports** — platform-wide analytics and reports
- **System Settings** — configure platform-level settings

### Creating a New Tenant (Organisation)

1. Log in at `http://65.1.45.32/master-admin/`
2. Go to **Tenants** → **Add New Tenant**
3. Fill in organisation name, contact details, subscription plan
4. Click **Create** — the tenant gets their own login credentials
5. The Tenant Admin can now log in at `http://65.1.45.32/tenant-admin/`

---

## 10. Admin Account — Create & Manage

Admins are organisation-level administrators. They manage their team, set up branches, and configure their loan products.

### Types of Admins

- **Tenant Admin** — manages their entire organisation
- **Branch Manager** — manages a specific branch
- **Team Lead** — manages a team of agents/CRM staff

### Creating a Tenant Admin Account

**Method 1: Via Django Admin (Backend Direct)**

```bash
docker compose exec tenantadmin-backend python manage.py createsuperuser
# Or use the Django admin panel:
# http://65.1.45.32:8011/admin/
```

**Method 2: Via Master Admin Panel**

1. Log in at `http://65.1.45.32/master-admin/`
2. Go to **Tenants** → select the tenant organisation
3. Click **Manage Users** → **Add Admin User**
4. Fill in: Name, Email, Phone, Role = "Admin"
5. A welcome email with credentials is sent automatically

### Tenant Admin Login

```
URL:      http://65.1.45.32/tenant-admin/
Email:    (created above)
Password: (set during creation)
```

### What Tenant Admin Can Do

- **Staff Management** — add/remove CRM agents, sales agents, operations staff
- **Branch Management** — create branches, assign staff to branches
- **Loan Products** — activate loan products for their organisation
- **Reports** — view all applications, disbursements, repayments for their org
- **Settings** — company profile, logos, notification templates

### Resetting an Admin Password

```bash
# Via Django shell
docker compose exec tenantadmin-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='admin@example.com')
user.set_password('NewPassword123!')
user.save()
print('Password reset done')
"
```

---

## 11. User Account — Create & Manage

Users are staff members — CRM agents, sales agents, field agents, operations staff, etc.

### Creating a User Account

**Via Tenant Admin Panel:**

1. Log in at `http://65.1.45.32/tenant-admin/`
2. Go to **Users** → **Add User**
3. Fill in:
   - Full Name
   - Email (used as login)
   - Phone Number
   - Role (CRM Agent / Sales Agent / Field Agent / Operations / etc.)
   - Branch (assign to a branch)
4. Click **Create User**
5. User receives email with temporary password

**Via Django Admin (direct):**

```bash
# For any specific backend, e.g., CRM backend
docker compose exec crm-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.create_user(
    email='newagent@referpeople.com',
    username='newagent',
    password='Temp@12345',
    first_name='John',
    last_name='Smith'
)
user.save()
print(f'User created: {user.email}')
"
```

### User Logins by Dashboard

| Role | Dashboard URL |
|------|--------------|
| CRM Agent | http://65.1.45.32/crm/ |
| Sales Agent | http://65.1.45.32/sales-crm/ |
| Finance Officer | http://65.1.45.32/finance/ |
| Field Agent | http://65.1.45.32/ (agents app — mobile) |
| Channel Partner | http://65.1.45.32/channel/ |
| Fraud Analyst | http://65.1.45.32/fraud/ |
| Legal Officer | http://65.1.45.32/legal/ |
| Operations Staff | http://65.1.45.32/operations/ |
| Valuation Officer | http://65.1.45.32/valuation/ |

### Update User Data

**Via Tenant Admin Panel:**

1. Go to **Users** → search for the user
2. Click the user name → **Edit**
3. Update fields → **Save**

**Via Django Shell:**

```bash
docker compose exec masteradmin-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='agent@referpeople.com')
user.first_name = 'Updated Name'
user.phone_number = '9876543210'
user.save()
print('Updated successfully')
"
```

### Deactivate a User

```bash
docker compose exec masteradmin-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='agent@referpeople.com')
user.is_active = False
user.save()
print('User deactivated')
"
```

---

## 12. Property & Loan Data Management

### Creating a Loan Application

1. CRM agent logs in at `http://65.1.45.32/crm/`
2. Click **Leads** → **New Lead** → fill customer details
3. Lead is qualified → converted to **Loan Application**
4. Application goes through the pipeline:
   - **Applied** → **Documents Collected** → **Under Review** → **Approved** / **Rejected**

### Checking Loan Status

- CRM Dashboard: `http://65.1.45.32/crm/` — see all leads and applications
- Sales CRM: `http://65.1.45.32/sales-crm/` — see pipeline stage
- Finance Dashboard: `http://65.1.45.32/finance/` — see disbursement queue

### Property Valuation Workflow

1. Loan application is created and flagged as needing property valuation
2. Valuation officer logs in at `http://65.1.45.32/valuation/`
3. Click **Assignments** → finds the new assignment
4. Visits the property, fills valuation report
5. Uploads report in the **Valuation Dashboard**
6. Status updates automatically in the loan application

### Updating Loan Data via Django Admin

Each backend has a full Django admin at its port:

```
Master Admin:   http://65.1.45.32:8001/admin/
CRM:            http://65.1.45.32:8003/admin/
Finance:        http://65.1.45.32:8004/admin/
Valuation:      http://65.1.45.32:8012/admin/
```

Log in with the superuser credentials for that backend to edit any record directly.

### Creating Superuser for Each Backend

To access Django admin of each backend:

```bash
# Create superuser for each backend (run once per backend)
for svc in crm-backend finance-backend agents-backend channel-backend \
           fraud-backend legal-backend operations-backend salescrm-backend \
           tenantadmin-backend valuation-backend tenant-backend; do
  echo "=== Creating superuser for $svc ==="
  docker compose exec -T $svc python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@referpeople.com').exists():
    User.objects.create_superuser(email='admin@referpeople.com', password='Admin@1234', username='admin')
    print('Created')
else:
    print('Already exists')
" 2>&1
done
```

---

## 13. GitHub CI/CD Pipeline

Every time you push code to the `main` branch, GitHub Actions automatically deploys to EC2.

### How It Works

```
You push code to GitHub (main branch)
        ↓
GitHub Actions starts automatically
        ↓
Step 1: Code Checks (verify all folders exist, Python syntax, YAML valid)
        ↓
Step 2: SSH into EC2
        ↓
Step 3: rsync new code to EC2
        ↓
Step 4: docker compose build + up -d
        ↓
Step 5: Run Django migrations
        ↓
Step 6: Health check (curl the site)
        ↓
✅ Deploy complete  OR  ❌ Check logs
```

### GitHub Secrets Required

Go to: GitHub Repo → Settings → Secrets and variables → Actions

| Secret Name | Value |
|-------------|-------|
| EC2_HOST | 13.201.38.123 |
| EC2_USER | ubuntu |
| EC2_APP_DIR | /home/ubuntu/BRD_FINAL |
| EC2_SSH_KEY | Full contents of referpeople-key.pem |

### Getting the SSH Key Content

```bash
cat ~/referpeople-key.pem
# Copy ALL output including -----BEGIN and -----END lines
# Paste as value of EC2_SSH_KEY secret
```

### Checking Pipeline Status

Go to: `https://github.com/vizz-bob/BRD_FINAL/actions`

- Green checkmark ✅ = deployed successfully
- Red X ❌ = something failed, click to see which step and the error logs

### Manual Deploy (Without Git Push)

```bash
# Run from EC2
cd /home/ubuntu/BRD_FINAL
git pull origin main
docker compose up -d --build
docker compose exec -T masteradmin-backend python manage.py migrate --noinput
```

---

## 14. SSL & Domain Setup

### Step 1: Point DNS to EC2

In your domain registrar (GoDaddy/BigRock/Namecheap):

```
Type: A    Name: @      Value: 13.201.38.123    TTL: 300
Type: A    Name: www    Value: 13.201.38.123    TTL: 300
```

Wait 15 minutes then verify:
```bash
nslookup referpeople.in
# Should show: Address: 13.201.38.123
```

### Step 2: Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Step 3: Get SSL Certificate

```bash
sudo certbot --nginx -d referpeople.in -d www.referpeople.in
# Enter email, agree to terms, say No to EFF newsletter
```

### Step 4: Update Nginx Config for HTTPS

After certbot runs, update `nginx/conf.d/loancrm.conf`:
- Change `server_name _;` to `server_name referpeople.in www.referpeople.in;`
- Certbot adds the SSL certificate lines automatically

### Step 5: Restart Nginx

```bash
docker compose restart nginx
```

### Step 6: Verify HTTPS

```bash
curl -I https://referpeople.in
# Should return: HTTP/2 200
```

### Auto-Renewal

Certbot creates a cron job automatically. Test it:
```bash
sudo certbot renew --dry-run
# Should show: Congratulations, all simulated renewals succeeded
```

---

## 15. Common Issues & Fixes

### Container is Restarting

```bash
# Check what error is causing the restart
docker compose logs --tail=20 <container-name>

# Common causes and fixes:
# 1. Wrong DB credentials → check .env file
# 2. Migration error → fake the migration (see below)
# 3. Missing Python package → add to requirements.txt, rebuild
# 4. Missing import os → add "import os" to settings.py
```

### Database Connection Failed

```bash
# Check the .env file has correct values
cat BRD_MasterAdmin_Backend_1.1/.env | grep DB_

# Must have:
# DB_HOST=referpeople-db.cju28y6c0s6d.ap-south-1.rds.amazonaws.com
# DB_USER=referpeopleadmin
# DB_PASSWORD=ReferPeopleDB2024
# PGSSLMODE=require

# After fixing .env, force-recreate the container
docker compose up -d --force-recreate masteradmin-backend
```

### Migration Error (Column Already Exists)

```bash
# Fake the specific migration
docker compose run --rm --no-deps <backend> python manage.py migrate <app_name> <migration_number> --fake

# Example:
docker compose run --rm --no-deps crm-backend python manage.py migrate data_ingestion 0002 --fake
```

### No Space Left on Device

```bash
df -h /
# If over 90% full:

# Remove unused Docker layers
docker system prune -af

# Check which folders are large
du -sh /home/ubuntu/BRD_FINAL/* | sort -h | tail -20
```

### EC2 Freezes During Docker Build

```bash
# Check RAM
free -h
# If swap is 0, add swap first (see Section 4.7)

# Build in smaller batches
docker compose build --no-cache masteradmin-backend tenant-backend
# Wait for it to finish, then build next batch
```

### SSH Disconnects

```bash
# Always use tmux for long operations
tmux new -s work        # start session
# ... do work ...
Ctrl+B then D           # detach (safe — work continues)
tmux attach -t work     # reconnect later
```

### Site Returns 502 Bad Gateway

```bash
# Nginx can't reach the backend
docker compose ps | grep backend
# Check if backend containers are Up

docker compose logs nginx | tail -20
# Look for "host not found" errors

# Restart nginx
docker compose restart nginx
```

### GitHub Actions Deploy Fails

Common causes:
1. **Wrong EC2_SSH_KEY secret** — make sure it includes the BEGIN/END lines
2. **EC2 disk full** — SSH in and run `docker system prune`
3. **Migration error** — check Actions logs, fix the migration, push again
4. **Security group blocks port 22** — check AWS security group allows SSH

---

## 16. All Configuration Files Reference

### File: docker-compose.yml

Location: `/home/ubuntu/BRD_FINAL/docker-compose.yml`

Defines all 26 containers. Key sections:
- `env_file:` — points to each backend's .env file
- `ports:` — maps container ports to host ports
- `networks:` — all containers on `loancrm_network` so they can talk to each other
- `depends_on:` — backends wait for redis to be healthy before starting

### File: nginx/conf.d/loancrm.conf

Location: `/home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf`

Routes incoming requests to the right frontend or backend. Uses Docker service names (not container names) for upstream definitions.

### File: docker-entrypoint.sh

Location: `/home/ubuntu/BRD_FINAL/docker-entrypoint.sh`

Runs inside each backend container on startup:
1. Waits for database to be ready
2. Runs `python manage.py migrate --noinput`
3. Starts Gunicorn

### File: .github/workflows/deploy.yml

Location: `/home/ubuntu/BRD_FINAL/.github/workflows/deploy.yml`

GitHub Actions CI/CD pipeline:
- **Job 1 (checks):** Runs on every push to main or develop — verifies all folders exist, Python syntax, YAML validity
- **Job 2 (deploy):** Only on push to main — SSHes into EC2, rsyncs code, rebuilds containers, runs migrations
- **Job 3 (develop-ok):** On develop push — just confirms checks passed

### File: create-env-files.sh

Location: `/home/ubuntu/BRD_FINAL/create-env-files.sh`

Script to generate all 13 `.env` files. Edit the variables at the top (DB_PASSWORD, SERVER_IP) then run `bash create-env-files.sh`.

---

## Quick Reference Card

### Daily Operations

| Task | Command |
|------|---------|
| Check all containers | `docker compose ps` |
| View logs | `docker compose logs -f <name>` |
| Restart one container | `docker compose restart <name>` |
| Restart everything | `docker compose down && docker compose up -d` |
| Check disk space | `df -h /` |
| Check memory | `free -h` |

### Important URLs

| What | URL |
|------|-----|
| Main website | http://referpeople.in (or http://65.1.45.32/) |
| Super Admin | http://65.1.45.32/master-admin/ |
| CRM | http://65.1.45.32/crm/ |
| Finance | http://65.1.45.32/finance/ |
| GitHub Actions | https://github.com/vizz-bob/BRD_FINAL/actions |

### Key Credentials

| What | Value |
|------|-------|
| EC2 IP | 13.201.38.123 |
| EC2 User | ubuntu |
| RDS Host | referpeople-db.cju28y6c0s6d.ap-south-1.rds.amazonaws.com |
| RDS User | referpeopleadmin |
| Super Admin Email | admin@referpeople.com |

---

*ReferPeople.in — Complete Platform Guide v1.0*
*Generated May 2026*
