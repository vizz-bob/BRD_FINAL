# ReferPeople.in — Production Deployment Guide
## Complete Step-by-Step Guide with Troubleshooting

**Version:** 2.0 | **Date:** May 2026 | **Server:** 65.1.45.32

---

## TABLE OF CONTENTS

1. [Platform Architecture](#1-platform-architecture)
2. [AWS Infrastructure Setup](#2-aws-infrastructure-setup)
3. [EC2 Server Preparation](#3-ec2-server-preparation)
4. [Repository & Environment Setup](#4-repository--environment-setup)
5. [Critical Frontend Fixes (Must Do Before Build)](#5-critical-frontend-fixes-must-do-before-build)
6. [Docker Build & Deploy](#6-docker-build--deploy)
7. [Database Setup & Migrations](#7-database-setup--migrations)
8. [Superuser Creation & Login](#8-superuser-creation--login)
9. [Post-Deploy Verification](#9-post-deploy-verification)
10. [⚠️ Troubleshooting Guide (All Issues & Fixes)](#10-️-troubleshooting-guide-all-issues--fixes)
11. [Nginx Restart Rule](#11-nginx-restart-rule)
12. [Future Steps & Recommendations](#12-future-steps--recommendations)
13. [Quick Reference Card](#13-quick-reference-card)

---

## 1. Platform Architecture

```
                        INTERNET
                           │
                    ┌──────▼──────┐
                    │   Nginx     │  Port 80 / 443
                    │  (Router)   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
   │  Frontends  │  │  Backends   │  │  Static /  │
   │ (React/Vite)│  │  (Django)   │  │   Media    │
   │  12 apps    │  │  12 APIs    │  │  /var/www/ │
   └──────┬──────┘  └──────┬──────┘  └────────────┘
          │                │
          │         ┌──────▼──────┐
          │         │    Redis    │  Port 6379
          │         │  (Queue)   │
          │         └─────────────┘
          │
          │         ┌─────────────┐
          └────────►│ RDS Postgres│  Port 5432
                    │ 12 databases│
                    └─────────────┘
```

### Service Map

| Route | Frontend Container | Port | Backend Container | Port |
|---|---|---|---|---|
| `/` | website-frontend | 3000 | — | — |
| `/master-admin/` | masteradmin-frontend | 3001 | masteradmin-backend | 8001 |
| `/tenant/` | tenant-frontend | 3002 | tenant-backend | 8002 |
| `/crm/` | crm-frontend | 3003 | crm-backend | 8003 |
| `/finance/` | finance-frontend | 3004 | finance-backend | 8004 |
| `/sales-crm/` | salescrm-frontend | 3005 | salescrm-backend | 8010 |
| `/tenant-admin/` | tenantadmin-frontend | 3006 | tenantadmin-backend | 8011 |
| `/channel/` | channel-frontend | 3007 | channel-backend | 8006 |
| `/fraud/` | fraud-frontend | 3008 | fraud-backend | 8007 |
| `/legal/` | legal-frontend | 3009 | legal-backend | 8008 |
| `/operations/` | operations-frontend | 3010 | operations-backend | 8009 |
| `/valuation/` | valuation-frontend | 3011 | valuation-backend | 8012 |

---

## 2. AWS Infrastructure Setup

### 2.1 VPC & Subnets

```
AWS Console → VPC → Create VPC
  Name: referpeople-vpc
  CIDR: 10.0.0.0/16

Subnets:
  referpeople-public-1a → AZ: ap-south-1a → CIDR: 10.0.1.0/24
  referpeople-public-1b → AZ: ap-south-1b → CIDR: 10.0.2.0/24

Internet Gateway:
  Name: referpeople-igw → Attach to referpeople-vpc

Route Table (public subnets):
  Destination: 0.0.0.0/0 → Target: referpeople-igw
```

### 2.2 RDS PostgreSQL

```
Engine: PostgreSQL 16 | Template: Free Tier
DB Identifier: referpeople-db
Master Username: referpeopleadmin
Master Password: ReferPeopleDB2024
Instance: db.t3.micro | Storage: 20GB gp2
VPC: referpeople-vpc | Public Access: No
Security Group: Allow port 5432 from EC2 security group
```

> **Note your RDS endpoint** — looks like:
> `referpeople-db.xxxxxxxx.ap-south-1.rds.amazonaws.com`

### 2.3 EC2 Instance

```
AMI: Ubuntu Server 22.04 LTS
Instance Type: t3.large  ← REQUIRED (8GB RAM for 26 containers)
Key Pair: referpeople-key (download .pem file)
VPC: referpeople-vpc | Subnet: referpeople-public-1a
Auto-assign IP: Enable
Security Group:
  Port 22  (SSH)   → Your IP
  Port 80  (HTTP)  → Anywhere 0.0.0.0/0
  Port 443 (HTTPS) → Anywhere 0.0.0.0/0
Storage: 30GB gp3  ← Change from default 8GB
```

After launch → assign **Elastic IP** so the IP never changes.

---

## 3. EC2 Server Preparation

### 3.1 Connect to EC2

```bash
chmod 400 ~/Downloads/referpeople-key.pem
ssh -i ~/Downloads/referpeople-key.pem ubuntu@65.1.45.32
```

### 3.2 Install Docker

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker ubuntu
sudo apt install -y docker-compose-plugin

# DISCONNECT AND RECONNECT SSH for group change to apply
exit
ssh -i ~/Downloads/referpeople-key.pem ubuntu@65.1.45.32

docker --version
docker compose version
```

### 3.3 Add Swap Space (Prevents RAM crash during build)

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h   # Verify: Swap: 4.0G
```

### 3.4 Install tmux (Required for long builds)

```bash
sudo apt install -y tmux
```

### 3.5 Clone Repository

```bash
cd ~
git clone https://github.com/vizz-bob/BRD_FINAL.git
cd BRD_FINAL
```

---

## 4. Repository & Environment Setup

### 4.1 Set PUBLIC_URL for Every Frontend

> ⚠️ **CRITICAL — Do this BEFORE building. Skipping this causes all pages to be blank.**

```bash
cd /home/ubuntu/BRD_FINAL

echo 'PUBLIC_URL=/'              > BRD-website-main/.env
echo 'PUBLIC_URL=/master-admin'  > BRD_MasterAdmin_Frontend_1.1/.env
echo 'PUBLIC_URL=/tenant'        > BRD-MergedTenantMaster-Frontend/.env
echo 'PUBLIC_URL=/crm'           > BRD_CRM-1.1/.env
echo 'PUBLIC_URL=/finance'       > BRD_FINANCE_DASHBOARD/.env
echo 'PUBLIC_URL=/sales-crm'     > BRD_SALES_CRM/.env
echo 'PUBLIC_URL=/tenant-admin'  > BRD_TenantAdmin_Frontend_1.1/.env
echo 'PUBLIC_URL=/channel'       > BRD-ChannelPartner-Dashboard/.env
echo 'PUBLIC_URL=/fraud'         > BRD-FraudTeamDashboard/.env
echo 'PUBLIC_URL=/legal'         > BRD-LEGAL-dashboard/.env
echo 'PUBLIC_URL=/operations'    > BRD-Operation-Verification-Dashboard/.env
echo 'PUBLIC_URL=/valuation'     > BRD-ValuationDashboard/.env
```

**Verify all 12 files:**

```bash
for dir in BRD-website-main BRD_MasterAdmin_Frontend_1.1 BRD-MergedTenantMaster-Frontend \
           BRD_CRM-1.1 BRD_FINANCE_DASHBOARD BRD_SALES_CRM BRD_TenantAdmin_Frontend_1.1 \
           BRD-ChannelPartner-Dashboard BRD-FraudTeamDashboard BRD-LEGAL-dashboard \
           BRD-Operation-Verification-Dashboard BRD-ValuationDashboard; do
  echo "$dir → $(cat $dir/.env)"
done
```

### 4.2 Fix Nginx Config — sales-crm Route

> ⚠️ **CRITICAL — The nginx config has `/sales/` but must be `/sales-crm/`**

```bash
sed -i 's|location /sales/ {|location /sales-crm/ {|g' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf

# Verify
grep "location /sales" /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
# Must show: location /sales-crm/ {
```

### 4.3 Fix Sales CRM — Vite Base Path

> ⚠️ **CRITICAL — vite.config.js has base: '/sales/' — must be '/sales-crm/'**

```bash
sed -i "s|base: '/sales/'|base: '/sales-crm/'|g" \
  /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/vite.config.js

grep "base" /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/vite.config.js
# Must show: base: '/sales-crm/'
```

### 4.4 Fix Sales CRM — React Router Basename

> ⚠️ **CRITICAL — Router basename="/sales" must be "/sales-crm"**

```bash
grep -r 'basename="/sales"' /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/src/ -rl | \
  xargs sed -i 's|basename="/sales"|basename="/sales-crm"|g'

# Verify
grep -r 'basename' /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/src/ --include="*.jsx" --include="*.tsx" --include="*.js"
# Must show: basename="/sales-crm"
```

### 4.5 Fix Hardcoded localhost API URLs

> ⚠️ **CRITICAL — Several frontends have localhost:8000 hardcoded in source files**

```bash
cd /home/ubuntu/BRD_FINAL

# Sales CRM
find BRD_SALES_CRM/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:8000|http://65.1.45.32/api/sales-crm|g' {} +

# Finance
find BRD_FINANCE_DASHBOARD/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:[0-9]*/|http://65.1.45.32/api/finance/|g' {} +

# Channel Partner
find BRD-ChannelPartner-Dashboard/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:[0-9]*/|http://65.1.45.32/api/channel/|g' {} +

# Fraud
find BRD-FraudTeamDashboard/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:[0-9]*/|http://65.1.45.32/api/fraud/|g' {} +

# Legal
find BRD-LEGAL-dashboard/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:[0-9]*/|http://65.1.45.32/api/legal/|g' {} +

# Valuation
find BRD-ValuationDashboard/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:[0-9]*/|http://65.1.45.32/api/valuation/|g' {} +

# Website
find BRD-website-main/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i 's|http://localhost:8000|http://65.1.45.32/api/master-admin|g' {} +
```

**Verify no localhost remains:**

```bash
for dir in BRD-website-main BRD_FINANCE_DASHBOARD BRD_SALES_CRM \
           BRD-ChannelPartner-Dashboard BRD-FraudTeamDashboard \
           BRD-LEGAL-dashboard BRD-ValuationDashboard; do
  COUNT=$(grep -r "localhost:8" /home/ubuntu/BRD_FINAL/$dir/src/ \
    --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  [ "$COUNT" -gt 0 ] && echo "⚠️  $dir → $COUNT remaining" || echo "✅ $dir → clean"
done
```

### 4.6 Set Backend .env Files

```bash
cd /home/ubuntu/BRD_FINAL
bash create-env-files.sh
```

Edit `create-env-files.sh` first and set:
```bash
DB_PASSWORD="ReferPeopleDB2024"
SERVER_IP="65.1.45.32"
DB_HOST="referpeople-db.xxxxxxxx.ap-south-1.rds.amazonaws.com"
```

---

## 5. Critical Frontend Fixes (Must Do Before Build)

### Folder → Service → PUBLIC_URL Mapping (Reference)

| Folder | Docker Service | PUBLIC_URL |
|---|---|---|
| BRD-website-main | website-frontend | `/` |
| BRD_MasterAdmin_Frontend_1.1 | masteradmin-frontend | `/master-admin` |
| BRD-MergedTenantMaster-Frontend | tenant-frontend | `/tenant` |
| BRD_CRM-1.1 | crm-frontend | `/crm` |
| BRD_FINANCE_DASHBOARD | finance-frontend | `/finance` |
| BRD_SALES_CRM | salescrm-frontend | `/sales-crm` |
| BRD_TenantAdmin_Frontend_1.1 | tenantadmin-frontend | `/tenant-admin` |
| BRD-ChannelPartner-Dashboard | channel-frontend | `/channel` |
| BRD-FraudTeamDashboard | fraud-frontend | `/fraud` |
| BRD-LEGAL-dashboard | legal-frontend | `/legal` |
| BRD-Operation-Verification-Dashboard | operations-frontend | `/operations` |
| BRD-ValuationDashboard | valuation-frontend | `/valuation` |

---

## 6. Docker Build & Deploy

### 6.1 Start tmux Session (Required)

```bash
tmux new -s deploy
# Detach anytime: Ctrl+B then D
# Reattach: tmux attach -t deploy
```

### 6.2 Build All Frontends — ONE AT A TIME

> ⚠️ **CRITICAL — Never batch-build frontends. Build one at a time to prevent Docker from assigning wrong images to wrong services.**

```bash
cd /home/ubuntu/BRD_FINAL

for svc in website-frontend masteradmin-frontend tenant-frontend crm-frontend \
           finance-frontend salescrm-frontend tenantadmin-frontend channel-frontend \
           fraud-frontend legal-frontend operations-frontend valuation-frontend; do
  echo "=== Building $svc ==="
  docker compose build --no-cache $svc
  echo "=== $svc built ✅ ==="
done
```

### 6.3 Build All Backends (batch is safe for backends)

```bash
docker compose build --no-cache \
  masteradmin-backend tenant-backend crm-backend finance-backend \
  agents-backend channel-backend fraud-backend legal-backend \
  operations-backend salescrm-backend tenantadmin-backend valuation-backend
```

### 6.4 Start All Containers

```bash
docker compose up -d

# Verify all 26 containers are Up
docker compose ps
```

### 6.5 Restart Nginx After Every Frontend Rebuild

> ⚠️ **CRITICAL — Always do this after rebuilding any frontend**

```bash
docker compose restart nginx
```

---

## 7. Database Setup & Migrations

### 7.1 Create All 12 Databases (First Time Only)

```bash
docker compose exec -T masteradmin-backend python -c "
import psycopg2
conn = psycopg2.connect(
    host='referpeople-db.xxxxxxxx.ap-south-1.rds.amazonaws.com',
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
cur.close(); conn.close()
"
```

### 7.2 Run All Migrations

```bash
for svc in masteradmin-backend tenant-backend crm-backend finance-backend \
           agents-backend channel-backend fraud-backend legal-backend \
           operations-backend salescrm-backend tenantadmin-backend valuation-backend; do
  echo "=== $svc ==="
  docker compose exec -T $svc python manage.py migrate --noinput 2>&1 | tail -3
done
```

---

## 8. Superuser Creation & Login

### 8.1 Create Master Admin Superuser

```bash
cd /home/ubuntu/BRD_FINAL
docker compose exec masteradmin-backend python manage.py createsuperuser
# Email:    admin@referpeople.com
# Username: admin
# Password: Admin@1234
```

### 8.2 Create Superuser for All Other Backends

```bash
for svc in crm-backend finance-backend agents-backend channel-backend \
           fraud-backend legal-backend operations-backend salescrm-backend \
           tenantadmin-backend valuation-backend tenant-backend; do
  echo "=== $svc ==="
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

### 8.3 Reset Password If Login Fails

```bash
for svc in masteradmin-backend crm-backend finance-backend agents-backend channel-backend \
           fraud-backend legal-backend operations-backend salescrm-backend \
           tenantadmin-backend valuation-backend tenant-backend; do
  docker compose exec -T $svc python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
try:
    u = User.objects.get(email='admin@referpeople.com')
    u.set_password('Admin@1234')
    u.is_active = True
    u.save()
    print('Reset OK')
except Exception as e:
    print(f'Error: {e}')
" 2>&1
done
```

### 8.4 Clear django-axes Lockout (If Login Still Fails)

```bash
for svc in masteradmin-backend crm-backend finance-backend channel-backend \
           fraud-backend legal-backend operations-backend salescrm-backend \
           tenantadmin-backend valuation-backend tenant-backend; do
  echo "=== $svc ==="
  docker compose exec -T $svc python manage.py shell -c "
try:
    from axes.models import AccessAttempt
    c = AccessAttempt.objects.count()
    AccessAttempt.objects.all().delete()
    print(f'Cleared {c} lockouts')
except Exception as e:
    print(f'No axes: {e}')
" 2>&1
done
```

### 8.5 Login Credentials

| Dashboard | URL | Email | Password |
|---|---|---|---|
| Master Admin | http://65.1.45.32/master-admin/ | admin@referpeople.com | Admin@1234 |
| Tenant Admin | http://65.1.45.32/tenant-admin/ | admin@referpeople.com | Admin@1234 |
| CRM | http://65.1.45.32/crm/ | admin@referpeople.com | Admin@1234 |
| Finance | http://65.1.45.32/finance/ | admin@referpeople.com | Admin@1234 |
| Sales CRM | http://65.1.45.32/sales-crm/ | admin@referpeople.com | Admin@1234 |
| Channel | http://65.1.45.32/channel/ | admin@referpeople.com | Admin@1234 |
| Fraud | http://65.1.45.32/fraud/ | admin@referpeople.com | Admin@1234 |
| Legal | http://65.1.45.32/legal/ | admin@referpeople.com | Admin@1234 |
| Operations | http://65.1.45.32/operations/ | admin@referpeople.com | Admin@1234 |
| Valuation | http://65.1.45.32/valuation/ | admin@referpeople.com | Admin@1234 |
| Tenant Portal | http://65.1.45.32/tenant/ | admin@referpeople.com | Admin@1234 |
| Website | http://65.1.45.32/ | — | — |

---

## 9. Post-Deploy Verification

### 9.1 Verify All Frontend Paths

```bash
for svc in masteradmin-frontend crm-frontend finance-frontend salescrm-frontend \
           tenantadmin-frontend channel-frontend fraud-frontend legal-frontend \
           operations-frontend valuation-frontend tenant-frontend website-frontend; do
  RESULT=$(docker compose exec $svc cat /usr/share/nginx/html/index.html 2>/dev/null | grep -o 'src="[^"]*"' | head -1)
  echo "$svc → $RESULT"
done
```

### 9.2 Verify nginx Routes Correctly

```bash
for path in / /master-admin/ /crm/ /finance/ /sales-crm/ /tenant-admin/ \
            /channel/ /fraud/ /legal/ /operations/ /valuation/ /tenant/; do
  RESULT=$(curl -s http://localhost$path | grep -o 'src="[^"]*"' | head -1)
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost$path)
  echo "$STATUS $path → $RESULT"
done
```

> Each path must serve its OWN assets. Example:
> `/fraud/` must show `src="/fraud/assets/..."` NOT `src="/finance/assets/..."`

### 9.3 Verify All Backend Ports

```bash
for port in 8001 8002 8003 8004 8005 8006 8007 8008 8009 8010 8011 8012; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:$port/admin/)
  echo "Port $port: $STATUS"
done
# All should show 200 or 302
```

### 9.4 Test Login API

```bash
curl -s -X POST http://localhost:8001/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@referpeople.com","password":"Admin@1234"}' | python3 -m json.tool
# Should return: access token, refresh token, roles, permissions
```

### 9.5 Verify Redis & Database

```bash
docker compose exec redis redis-cli ping                    # PONG
docker compose exec masteradmin-backend python -c "
from django.db import connection
cursor = connection.cursor()
cursor.execute('SELECT version()')
print('DB OK:', cursor.fetchone()[0][:40])
"
```

---

## 10. ⚠️ Troubleshooting Guide (All Issues & Fixes)

---

### ❌ Issue 1: All Pages Load Blank (No Content)

**Symptom:**
```
Chrome F12: GET http://65.1.45.32/static/js/main.js 404 Not Found
```
The page title shows but nothing renders.

**Root Cause:**
React apps built without `PUBLIC_URL` default to serving assets from `/` (root). When deployed at sub-paths like `/crm/`, the browser requests `/static/js/main.js` but nginx cannot match it to the right container.

**Fix:**
```bash
# Set PUBLIC_URL in each frontend folder BEFORE building
echo 'PUBLIC_URL=/crm' > BRD_CRM-1.1/.env
# Repeat for all 12 frontends (see Section 4.1)
# Then rebuild
docker compose build --no-cache crm-frontend
docker compose up -d crm-frontend
docker compose restart nginx
```

---

### ❌ Issue 2: Pages Load Wrong Assets (Mixed Up)

**Symptom:**
```
/fraud/ loads finance/assets/index-xxx.js  ← wrong
/finance/ loads fraud/assets/index-xxx.js  ← wrong
```

**Root Cause A — PUBLIC_URL was set to wrong path:**
Happens when the folder→service mapping is guessed incorrectly.

**Fix A:**
Use exact folder names from `docker-compose.yml`:
```bash
grep -A3 "frontend:" docker-compose.yml | grep -E "frontend:|context:"
# Then set .env in the EXACT folder shown
```

**Root Cause B — Batch rebuild mixed up Docker images:**
When multiple frontends are rebuilt at once with `--no-cache`, Docker can assign wrong built images to wrong services.

**Fix B:**
Always rebuild frontends **one at a time**:
```bash
docker compose build --no-cache fraud-frontend && docker compose up -d fraud-frontend
docker compose build --no-cache finance-frontend && docker compose up -d finance-frontend
# Never: docker compose build --no-cache fraud-frontend finance-frontend (in one command)
```

**Root Cause C — Nginx cached old container IPs:**
After container rebuild, nginx still routes to old container IPs.

**Fix C:**
```bash
docker compose restart nginx   # Always run after any frontend rebuild
```

---

### ❌ Issue 3: Sales CRM Shows Blank / Router Error

**Symptom:**
```
<Router basename="/sales"> is not able to match the URL "/sales-crm/"
```

**Root Cause:**
Three places had `/sales` hardcoded instead of `/sales-crm`:
1. `vite.config.js` → `base: '/sales/'`
2. React Router → `<BrowserRouter basename="/sales">`
3. nginx config → `location /sales/ {`

**Fix:**
```bash
# 1. Fix vite.config.js
sed -i "s|base: '/sales/'|base: '/sales-crm/'|g" BRD_SALES_CRM/vite.config.js

# 2. Fix React Router basename
grep -r 'basename="/sales"' BRD_SALES_CRM/src/ -rl | \
  xargs sed -i 's|basename="/sales"|basename="/sales-crm"|g'

# 3. Fix nginx
sed -i 's|location /sales/ {|location /sales-crm/ {|g' nginx/conf.d/loancrm.conf

# 4. Rebuild
docker compose build --no-cache salescrm-frontend
docker compose up -d salescrm-frontend
docker compose restart nginx
```

---

### ❌ Issue 4: Login Returns "Invalid Credentials" (401)

**Symptom:**
```
POST /api/master-admin/api/v1/auth/login/ → 401 Unauthorized
{"error": "Invalid credentials"}
```

**Root Cause:**
Password hash from `createsuperuser` may not match what the login view expects, especially if the user was created before migrations were fully applied.

**Fix — Force password reset:**
```bash
cd /home/ubuntu/BRD_FINAL
docker compose exec masteradmin-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(email='admin@referpeople.com')
u.set_password('Admin@1234')
u.is_active = True
u.save()
print('Done')
"
```

---

### ❌ Issue 5: Login Still Fails After Password Reset (IP Blocked)

**Symptom:**
API test via curl works but browser login returns 401.

**Root Cause:**
`django-axes` library tracks failed login attempts and blocks the IP address after multiple failures.

**Fix:**
```bash
docker compose exec masteradmin-backend python manage.py shell -c "
from axes.models import AccessAttempt
AccessAttempt.objects.all().delete()
print('Lockouts cleared')
"
# Then open login page in Incognito window
```

---

### ❌ Issue 6: Frontend Calling localhost:8000 (API Not Found)

**Symptom:**
```
localhost:8000/api/auth/login/ net::ERR_CONNECTION_REFUSED
```

**Root Cause:**
Several frontends (Sales CRM, Finance, Channel, Fraud, Legal, Valuation, Website) had API URLs hardcoded to `localhost:8000` in their source files — the development server URL.

**Fix:**
```bash
# Find all affected files
for dir in BRD_SALES_CRM BRD_FINANCE_DASHBOARD BRD-ChannelPartner-Dashboard \
           BRD-FraudTeamDashboard BRD-LEGAL-dashboard BRD-ValuationDashboard; do
  COUNT=$(grep -r "localhost:8" /home/ubuntu/BRD_FINAL/$dir/src/ --include="*.js" --include="*.jsx" 2>/dev/null | wc -l)
  echo "$dir: $COUNT refs"
done

# Fix each one (use find -type f to avoid directory issues)
find BRD_FINANCE_DASHBOARD/src -type f \( -name "*.js" -o -name "*.jsx" \) \
  -exec sed -i 's|http://localhost:[0-9]*/|http://65.1.45.32/api/finance/|g' {} +
```

---

### ❌ Issue 7: Nginx Routing to Wrong Container After Rebuild

**Symptom:**
Container verification shows correct content but `curl http://localhost/fraud/` returns finance's assets.

**Root Cause:**
Nginx caches DNS lookups for Docker service names. When a container is recreated, it gets a new IP. Nginx still routes to the old IP until it re-resolves DNS.

**Fix:**
```bash
docker compose restart nginx
```

**Prevention — Add this to nginx config for automatic re-resolution:**
```nginx
resolver 127.0.0.11 valid=10s;  # Docker's internal DNS
```

---

### ❌ Issue 8: Container Keeps Restarting

**Symptom:**
```
docker compose ps → loancrm_xxx_backend   Restarting
```

**Fix:**
```bash
# Check what's failing
docker compose logs --tail=30 <container-name>

# Common causes:
# 1. Wrong DB credentials → fix .env, then:
docker compose up -d --force-recreate <container-name>

# 2. Migration error → fake it:
docker compose run --rm --no-deps <backend> python manage.py migrate <app> <number> --fake

# 3. Missing env var → add to .env and recreate
```

---

### ❌ Issue 9: 502 Bad Gateway

**Symptom:** Browser shows 502 Bad Gateway.

**Fix:**
```bash
docker compose ps | grep backend           # Find restarting container
docker compose logs --tail=20 <container>  # Find the error
docker compose restart <container>         # Restart it
docker compose restart nginx               # Restart nginx too
```

---

### ❌ Issue 10: No Space Left on Device

```bash
df -h /                      # Check usage
docker system prune -af      # Remove unused images/containers
docker volume prune -f       # Remove unused volumes
```

---

## 11. Nginx Restart Rule

> **Golden Rule: Always restart nginx after rebuilding any frontend container.**

```bash
docker compose restart nginx
```

When a frontend container is rebuilt:
- Docker assigns a new container IP
- Nginx still has the old IP cached
- Result: nginx routes to the wrong container (or dead container)
- Fix: restart nginx to force DNS re-resolution

**Add this to your deployment script:**
```bash
docker compose build --no-cache <frontend-service>
docker compose up -d <frontend-service>
docker compose restart nginx    # ← Always
```

---

## 12. Future Steps & Recommendations

### 12.1 SSL / HTTPS Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (after pointing DNS to your server)
sudo certbot --nginx -d referpeople.in -d www.referpeople.in

# Update nginx server_name
sed -i 's|server_name _;|server_name referpeople.in www.referpeople.in;|g' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf

docker compose restart nginx

# Test auto-renewal
sudo certbot renew --dry-run
```

### 12.2 Add Nginx DNS Re-resolution (Prevents IP Caching)

Add to `nginx/conf.d/loancrm.conf` inside the `server {}` block:

```nginx
resolver 127.0.0.11 valid=10s;
```

This makes nginx re-resolve Docker service names every 10 seconds, preventing stale IP routing.

### 12.3 Move API URLs to Environment Variables

Instead of hardcoding `http://65.1.45.32/api/finance/` in source files, use env variables:

```bash
# In each frontend .env:
VITE_API_URL=http://65.1.45.32/api/finance
# Or for CRA:
REACT_APP_API_URL=http://65.1.45.32/api/finance
```

Then in source code use `import.meta.env.VITE_API_URL` or `process.env.REACT_APP_API_URL`.

### 12.4 GitHub Actions CI/CD

Set these secrets in GitHub → Settings → Secrets → Actions:

| Secret | Value |
|---|---|
| EC2_HOST | 65.1.45.32 |
| EC2_USER | ubuntu |
| EC2_APP_DIR | /home/ubuntu/BRD_FINAL |
| EC2_SSH_KEY | Contents of referpeople-key.pem |

The pipeline: push to `main` → auto SSH into EC2 → pull code → rebuild → migrate.

### 12.5 Monitoring & Alerts

```bash
# Check all containers health
docker compose ps

# Set up a simple health check cron
echo "*/5 * * * * curl -sf http://localhost/health || docker compose -f /home/ubuntu/BRD_FINAL/docker-compose.yml restart nginx" | crontab -
```

### 12.6 Backup Strategy

```bash
# Daily RDS snapshot (set in AWS Console → RDS → Maintenance & Backups)
# Retention: 7 days minimum

# Backup media files to S3
aws s3 sync /var/www/media/ s3://referpeople-media-backup/
```

### 12.7 Scaling Recommendations

| Current | Recommended for Production |
|---|---|
| t3.large (8GB RAM) | t3.xlarge (16GB) or m5.large |
| Single EC2 | Load Balancer + 2 EC2 instances |
| db.t3.micro | db.t3.small with Multi-AZ |
| No CDN | CloudFront for static assets |
| No monitoring | CloudWatch + alerts |

---

## 13. Quick Reference Card

### Key Commands

```bash
# Check all containers
docker compose ps

# View logs
docker compose logs -f <container-name>

# Restart one container
docker compose restart <container-name>

# Rebuild one frontend (ALWAYS one at a time)
docker compose build --no-cache <frontend>
docker compose up -d <frontend>
docker compose restart nginx   # ← Never forget this

# Full restart
docker compose down && docker compose up -d

# Clear login lockouts
docker compose exec masteradmin-backend python manage.py shell -c "
from axes.models import AccessAttempt; AccessAttempt.objects.all().delete(); print('Done')"

# Check disk
df -h /

# Check RAM
free -h
```

### Credentials

| Item | Value |
|---|---|
| Server IP | 65.1.45.32 |
| SSH | `ssh -i referpeople-key.pem ubuntu@65.1.45.32` |
| App Directory | `/home/ubuntu/BRD_FINAL` |
| RDS Host | `referpeople-db.cju28y6c0s6d.ap-south-1.rds.amazonaws.com` |
| RDS User | `referpeopleadmin` |
| RDS Password | `ReferPeopleDB2024` |
| Admin Email | `admin@referpeople.com` |
| Admin Password | `Admin@1234` |

### Deployment Checklist

- [ ] PUBLIC_URL set in all 12 frontend `.env` files
- [ ] nginx config: `location /sales-crm/` (not `/sales/`)
- [ ] vite.config.js: `base: '/sales-crm/'`
- [ ] React Router: `basename="/sales-crm"`
- [ ] No `localhost:8000` in any source file
- [ ] All 12 databases created on RDS
- [ ] All migrations run
- [ ] Superusers created for all 12 backends
- [ ] django-axes lockouts cleared
- [ ] nginx restarted after all frontend builds
- [ ] All 12 pages verified with curl (correct asset paths)
- [ ] Login tested in Incognito window

---

*ReferPeople.in Production Deployment Guide v2.0 — May 2026*
*All steps verified working on EC2 t3.large, Ubuntu 22.04, Docker Compose*
