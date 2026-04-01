# BRD Loan CRM — Local Development Setup Guide

## Root Causes of "Invalid Credentials / Backend Not Connected"

There are **three compounding problems** when running locally:

1. **All `.env` files point to the AWS RDS staging DB** — `stagging-db.cxa6qyk0oyb9.ap-south-1.rds.amazonaws.com`. If your machine can't reach that host, every Django backend silently fails to start, so the frontend gets a network error that surfaces as "Invalid credentials."
2. **All frontend `.env` files point to `http://13.232.219.91`** (the EC2 server) — so every API call goes to AWS instead of your local backend.
3. **The `brdapp` PostgreSQL user doesn't exist locally** — Django can't connect even if `DB_HOST=localhost`.

All three are fixed by the files created in this session.

---

## Step 1 — Install Prerequisites

Make sure these are installed on your machine:

- **PostgreSQL 14+** (`psql --version`)
- **Python 3.10+** and **pip** (`python --version`)
- **Node.js 18+** and **npm** (`node --version`)
- **Redis** running on `localhost:6379` (`redis-cli ping` → should return `PONG`)

---

## Step 2 — Set Up Local PostgreSQL

Run once as the postgres superuser to create the `loancrm` database and `brdapp` user:

```bash
psql -U postgres -f local-postgres-setup.sql
```

Expected output at the end:
```
SUCCESS: brdapp user configured on local loancrm database.
```

**Verify the connection works:**
```bash
psql -h localhost -U brdapp -d loancrm -c "SELECT current_user, current_database();"
```

---

## Step 3 — How the Local Config Files Work

Every service now has a `.env.local` file alongside the existing `.env`.
Django and Vite both **automatically prefer `.env.local`** when it exists.

| File | Used for |
|---|---|
| `.env` | Staging / production (AWS) |
| `.env.local` | **Local development** (localhost) |

**You never need to edit `.env` directly.** All local overrides live in `.env.local`.

---

## Step 4 — Start Everything (Automated)

```bash
chmod +x start-local.sh
./start-local.sh
```

This script will:
1. Check that PostgreSQL is reachable as `brdapp@localhost/loancrm`
2. Install pip requirements for each backend
3. Run `python manage.py migrate` for each backend
4. Start all 13 Django backends on their unique ports
5. Create the superuser `Admin@brd.com / Admin@1234` in each DB
6. Start all 12 Vite frontends on their unique ports

**Partial start options:**
```bash
./start-local.sh backends    # only Django backends
./start-local.sh frontends   # only Vite frontends
./start-local.sh superuser   # only create superusers
./start-local.sh stop        # kill all BRD dev processes
```

---

## Step 5 — Manual Start (Per Service)

If you only want to run a specific service manually:

```bash
cd BRD_MasterAdmin_Backend_1.1
set -o allexport && source .env.local && set +o allexport
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```

For a frontend:
```bash
cd BRD_MasterAdmin_Frontend_1.1
npm install
npm run dev -- --port 5174
```

---

## Complete Port Reference

### Django Backends (localhost)

| Service | Directory | Local Port | API Base |
|---|---|---|---|
| Master Admin | `BRD_MasterAdmin_Backend_1.1` | **8001** | `http://localhost:8001/api/master-admin/` |
| Merged Tenant | `BRD-MergedTenantMaster-Backend` | **8002** | `http://localhost:8002/api/tenant/` |
| CRM | `BRD_CRM_1.1_BACKEND` | **8003** | `http://localhost:8003/api/` |
| Finance | `BRD_FINANCE_DASHBOARD_Backend` | **8004** | `http://localhost:8004/api/` |
| Agents | `BRD-AgentsApp-Backend` | **8005** | `http://localhost:8005/api/` |
| Channel Partner | `BRD-ChannelPartnerDashboard-Backend` | **8006** | `http://localhost:8006/api/` |
| Fraud Team | `BRD-FraudTeam-Dashboard-Backend` | **8007** | `http://localhost:8007/api/` |
| Legal | `BRD-LegalDashboard-Backend` | **8008** | `http://localhost:8008/api/` |
| Operations | `BRD-OperationVerification-Backend` | **8009** | `http://localhost:8009/api/` |
| Sales CRM | `BRD-SalesCRM-Dashboard-Backend` | **8010** | `http://localhost:8010/api/` |
| Tenant Admin 2.0 | `BRD-TenantAdmin_backend_2.0` | **8011** | `http://localhost:8011/api/tenant-admin/` |
| Valuation | `BRD-Valuation-Dashboard-Backend` | **8012** | `http://localhost:8012/api/` |
| Website | `BRD-website-main-backend` | **8013** | `http://localhost:8013/api/` |

### Vite Frontends (localhost)

| App | Directory | Dev Port | Connects to Backend |
|---|---|---|---|
| Website | `BRD-website-main` | **5173** | 8013 |
| Master Admin | `BRD_MasterAdmin_Frontend_1.1` | **5174** | 8001 |
| Tenant Admin | `BRD_TenantAdmin_Frontend_1.1` | **5175** | 8011 |
| Merged Tenant | `BRD-MergedTenantMaster-Frontend` | **5176** | 8002 |
| CRM | `BRD_CRM-1.1` | **5177** | 8003 |
| Finance | `BRD_FINANCE_DASHBOARD` | **5178** | 8004 |
| Sales CRM | `BRD_SALES_CRM` | **5179** | 8010 |
| Channel Partner | `BRD-ChannelPartner-Dashboard` | **5180** | 8006 |
| Fraud Team | `BRD-FraudTeamDashboard` | **5181** | 8007 |
| Legal | `BRD-LEGAL-dashboard` | **5182** | 8008 |
| Operations | `BRD-Operation-Verification-Dashboard` | **5183** | 8009 |
| Valuation | `BRD-ValuationDashboard` | **5184** | 8012 |

---

## Login Credentials (All Apps)

| Field | Value |
|---|---|
| Email | `Admin@brd.com` |
| Password | `Admin@1234` |

---

## Troubleshooting

### Still getting "Invalid credentials"

1. Confirm the backend is actually running:
   ```bash
   curl http://localhost:8001/api/master-admin/auth/login/ -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"Admin@brd.com","password":"Admin@1234"}'
   ```
   - If you get `{"access": "..."}` → backend is fine, check frontend `VITE_API_URL`
   - If you get `connection refused` → backend didn't start; check `.local-logs/`

2. Make sure the superuser was created:
   ```bash
   cd BRD_MasterAdmin_Backend_1.1
   source .env.local
   python manage.py shell -c "from django.contrib.auth import get_user_model; print(get_user_model().objects.all())"
   ```

3. Verify the frontend is reading `.env.local` (not the old `.env`):
   ```bash
   cat BRD_MasterAdmin_Frontend_1.1/.env.local
   # Should show: VITE_API_URL=http://localhost:8001/api/master-admin
   ```

### "No active role assigned" (403)

The login in `BRD-MergedTenantMaster-Backend` requires RBAC roles after authentication.
After creating the superuser, run:
```bash
cd BRD-MergedTenantMaster-Backend
source .env.local
python manage.py shell
```
```python
from django.contrib.auth import get_user_model
from adminpanel.access_control.models import Role, UserRole
User = get_user_model()
user = User.objects.get(email='Admin@brd.com')
role, _ = Role.objects.get_or_create(name='MASTER_ADMIN', defaults={'is_active': True})
UserRole.objects.get_or_create(user=user, role=role)
print("Role assigned!")
```

### PostgreSQL "peer authentication" error

Edit `/etc/postgresql/*/main/pg_hba.conf` and ensure this line exists for local connections:
```
host    all    all    127.0.0.1/32    md5
```
Then restart: `sudo service postgresql restart`

### Django "relation does not exist" error

Run migrations for that specific backend:
```bash
cd <backend-dir>
source .env.local
python manage.py migrate --run-syncdb
```

---

## Files Created in This Session

| File | Purpose |
|---|---|
| `local-postgres-setup.sql` | Creates `loancrm` DB + `brdapp` user with full permissions |
| `<backend>/.env.local` (×13) | Local backend config — `DB_HOST=localhost`, CORS for localhost frontends |
| `<frontend>/.env.local` (×12) | Local frontend config — `VITE_API_URL=http://localhost:<port>` |
| `start-local.sh` | One-command startup for all 25 services |
| `LOCAL_DEV_SETUP.md` | This guide |
