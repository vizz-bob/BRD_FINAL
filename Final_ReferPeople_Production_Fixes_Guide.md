# ReferPeople Platform — Complete Production Fix Guide

**Server:** 65.1.45.32 (AWS EC2)  
**Project Path:** `/home/ubuntu/BRD_FINAL`  
**Stack:** 12 React/Vite frontends + 12 Django backends + Nginx + Redis (Docker Compose)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Fix 1 — Blank Pages (PUBLIC_URL)](#2-fix-1--blank-pages-publicurl)
3. [Fix 2 — Sales CRM Sub-path](#3-fix-2--sales-crm-sub-path)
4. [Fix 3 — Nginx DNS Caching](#4-fix-3--nginx-dns-caching)
5. [Fix 4 — Hardcoded localhost API URLs](#5-fix-4--hardcoded-localhost-api-urls)
6. [Fix 5 — Docker Build Image Mix-up](#6-fix-5--docker-build-image-mix-up)
7. [Fix 6 — Nginx /sales/ Wrong Route](#7-fix-6--nginx-sales-wrong-route)
8. [Fix 7 — Tenant Login 405 Error](#8-fix-7--tenant-login-405-error)
9. [Fix 8 — Tenant API Token Endpoint Missing](#9-fix-8--tenant-api-token-endpoint-missing)
10. [Fix 9 — Tenant ProtectedRoute Key Mismatch](#10-fix-9--tenant-protectedroute-key-mismatch)
11. [Fix 10 — authService Logout Wrong Redirect](#11-fix-10--authservice-logout-wrong-redirect)
12. [Fix 11 — Login 401 / django-axes Lockout](#12-fix-11--login-401--django-axes-lockout)
13. [Fix 12 — Creating First Superuser](#13-fix-12--creating-first-superuser)
14. [Nginx Configuration Reference](#14-nginx-configuration-reference)
15. [All Service URLs](#15-all-service-urls)
16. [Standard Deployment Procedure](#16-standard-deployment-procedure)
17. [Troubleshooting Quick Reference](#17-troubleshooting-quick-reference)

---

## 1. Architecture Overview

```
Browser
  │
  ▼
Nginx (port 80)
  ├── /                    → website-frontend:80
  ├── /master-admin/       → masteradmin-frontend:80
  ├── /tenant/             → tenant-frontend:80
  ├── /tenant/api/         → tenant-backend:8000      ← Special rule (see Fix 7)
  ├── /crm/                → crm-frontend:80
  ├── /finance/            → finance-frontend:80
  ├── /sales-crm/          → salescrm-frontend:80
  ├── /tenant-admin/       → tenantadmin-frontend:80
  ├── /channel/            → channel-frontend:80
  ├── /fraud/              → fraud-frontend:80
  ├── /legal/              → legal-frontend:80
  ├── /operations/         → operations-frontend:80
  ├── /valuation/          → valuation-frontend:80
  ├── /api/master-admin/   → masteradmin-backend:8000
  ├── /api/tenant/         → tenant-backend:8000
  ├── /api/crm/            → crm-backend:8000
  ├── /api/finance/        → finance-backend:8000
  ├── /api/sales-crm/      → salescrm-backend:8000
  ├── /api/tenant-admin/   → tenantadmin-backend:8000
  ├── /api/channel/        → channel-backend:8000
  ├── /api/fraud/          → fraud-backend:8000
  ├── /api/legal/          → legal-backend:8000
  ├── /api/operations/     → operations-backend:8000
  └── /api/valuation/      → valuation-backend:8000
```

**Key Rule:** Nginx strips the location prefix before passing to backend.  
Example: `/api/tenant/api/v1/users/` → backend receives `/api/v1/users/`

---

## 2. Fix 1 — Blank Pages (PUBLIC_URL)

### Problem
All 12 frontend dashboards showed blank white pages. Browser F12 showed 404 errors on JS/CSS assets because Vite built assets with wrong base paths.

### Root Cause
Each frontend `.env` file was missing `PUBLIC_URL`, so Vite built assets at `/assets/` instead of `/tenant/assets/`, `/crm/assets/`, etc.

### Fix
Set `PUBLIC_URL` in each frontend's `.env` file to match its nginx sub-path:

```bash
# Set correct PUBLIC_URL for every frontend
declare -A ENVS=(
  ["BRD-website-main"]="/"
  ["BRD_MasterAdmin_Frontend_1.1"]="/master-admin"
  ["BRD-MergedTenantMaster-Frontend"]="/tenant"
  ["BRD_CRM-1.1"]="/crm"
  ["BRD_FINANCE_DASHBOARD"]="/finance"
  ["BRD_SALES_CRM"]="/sales-crm"
  ["BRD_TenantAdmin_Frontend_1.1"]="/tenant-admin"
  ["BRD-ChannelPartner-Dashboard"]="/channel"
  ["BRD-FraudTeamDashboard"]="/fraud"
  ["BRD-LEGAL-dashboard"]="/legal"
  ["BRD-Operation-Verification-Dashboard"]="/operations"
  ["BRD-ValuationDashboard"]="/valuation"
)

cd /home/ubuntu/BRD_FINAL
for folder in "${!ENVS[@]}"; do
  echo "PUBLIC_URL=${ENVS[$folder]}" > "$folder/.env"
  echo "Set $folder → PUBLIC_URL=${ENVS[$folder]}"
done
```

### Rebuild After Fix
```bash
# IMPORTANT: Build ONE AT A TIME to avoid image mix-up (see Fix 5)
cd /home/ubuntu/BRD_FINAL
for service in website-frontend masteradmin-frontend tenant-frontend crm-frontend finance-frontend salescrm-frontend tenantadmin-frontend channel-frontend fraud-frontend legal-frontend operations-frontend valuation-frontend; do
  echo "Building $service..."
  docker compose build $service
  docker compose up -d $service
done
docker compose restart nginx
```

---

## 3. Fix 2 — Sales CRM Sub-path

### Problem
`http://65.1.45.32/sales-crm/` showed blank page or 404 on assets.

### Root Cause
Three places in the Sales CRM frontend hardcoded `/sales/` instead of `/sales-crm/`:
1. `nginx/conf.d/loancrm.conf` had `location /sales/ {`
2. `BRD_SALES_CRM/vite.config.js` had `base: '/sales/'`
3. `BRD_SALES_CRM/src/` Router had `basename="/sales"`

### Fix

**Step 1 — Nginx config:**
```bash
sed -i 's|location /sales/ {|location /sales-crm/ {|g' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
```

**Step 2 — vite.config.js:**
```bash
sed -i "s|base: '/sales/'|base: '/sales-crm/'|g" \
  /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/vite.config.js
```

**Step 3 — React Router basename:**
```bash
# Find and fix the Router basename in the src folder
grep -rn 'basename="/sales"' /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/src/
# Then manually edit the file to change basename="/sales" to basename="/sales-crm"
```

**Step 4 — Rebuild:**
```bash
cd /home/ubuntu/BRD_FINAL
docker compose build salescrm-frontend
docker compose up -d salescrm-frontend
docker compose restart nginx
```

---

## 4. Fix 3 — Nginx DNS Caching

### Problem
After rebuilding any backend container, its frontend showed correct assets but API calls returned errors. Nginx still routed to the old (dead) container IP.

### Root Cause
Nginx caches Docker container IPs at startup. When a container is rebuilt it gets a new IP, but nginx still uses the old one.

### Fix — Add Docker DNS resolver to nginx config

In `/home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf`, inside the `server {}` block:

```nginx
# Add this line at the top of the server block
resolver 127.0.0.11 valid=10s ipv6=off;
```

### Always restart nginx after any container rebuild
```bash
docker compose restart nginx
```

---

## 5. Fix 4 — Hardcoded localhost API URLs

### Problem
Several frontend services had hardcoded `localhost:8000`, `localhost:8001` etc. in their API service files. These worked in local dev but failed completely in production.

### Fix
Replace all hardcoded localhost API URLs using `find` + `sed`:

```bash
cd /home/ubuntu/BRD_FINAL

# Replace localhost:8000 with production nginx path for each service
# Adjust the replacement URL per service

# Example for sales-crm (adjust base URL per service)
find BRD_SALES_CRM/src/services/ -name "*.js" -exec \
  sed -i 's|http://localhost:8000|http://65.1.45.32/api/sales-crm|g' {} \;

# Repeat for each affected service
for dir in BRD_FINANCE_DASHBOARD BRD-ChannelPartner-Dashboard BRD-FraudTeamDashboard \
           BRD-LEGAL-dashboard BRD-ValuationDashboard BRD-website-main; do
  find "$dir/src" -name "*.js" -o -name "*.jsx" | xargs \
    grep -l "localhost" 2>/dev/null | while read f; do
    echo "Fixing: $f"
    sed -i 's|http://localhost:[0-9]*|http://65.1.45.32|g' "$f"
  done
done
```

### Verify no localhost remains
```bash
grep -rn "localhost" /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/src/
grep -rn "localhost" /home/ubuntu/BRD_FINAL/BRD_FINANCE_DASHBOARD/src/
# (repeat for other services)
```

---

## 6. Fix 5 — Docker Build Image Mix-up

### Problem
After batch-building multiple frontends, pages loaded wrong content (e.g., `/crm/` loaded sales CRM assets, `/fraud/` loaded finance assets).

### Root Cause
Building multiple containers in parallel causes Docker to mislabel images — the wrong source code ends up in the wrong container.

### Fix — ALWAYS build ONE AT A TIME

```bash
# WRONG — DO NOT DO THIS:
docker compose build  # builds all at once — causes mix-up!

# CORRECT — build one service at a time:
docker compose build tenant-frontend
docker compose up -d tenant-frontend

docker compose build crm-frontend
docker compose up -d crm-frontend
# ... etc
```

### Verify assets are correct after build
```bash
# Check each frontend serves its own PUBLIC_URL assets
for service in tenant crm finance salescrm; do
  echo "=== $service ==="
  docker compose exec ${service}-frontend cat /usr/share/nginx/html/index.html | grep -o 'src="[^"]*"' | head -3
done
```

---

## 7. Fix 6 — Nginx /sales/ Wrong Route

### Problem
After a `git pull` that reverted the nginx config, `/sales-crm/` stopped working again.

### Root Cause
An old git commit had `location /sales/ {` and a git pull reverted our fix.

### Prevention
After every `git pull`, always verify the nginx config:

```bash
grep "location /sales" /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
# Must show: location /sales-crm/ {
# If it shows: location /sales/ { — re-apply the fix:
sed -i 's|location /sales/ {|location /sales-crm/ {|g' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
docker compose restart nginx
```

---

## 8. Fix 7 — Tenant Login 405 Error

### Problem
`http://65.1.45.32/tenant/login` showed "Network Error" on login. F12 showed:
```
POST http://65.1.45.32/tenant/api/token/  405 (Not Allowed)
```

### Root Cause
The tenant frontend `Login.jsx` constructs its API URL as:
```javascript
const API_BASE = "/tenant/api";
fetch(`${API_BASE}/token/`, ...)  // → /tenant/api/token/
```

The nginx rule `location /tenant/ { proxy_pass http://tenant-frontend:80/ }` was matching `/tenant/api/token/` and sending the request to the **frontend container** (not the backend). The frontend's nginx has no `/api/token/` handler → 405.

### Fix — Add specific nginx rule for `/tenant/api/`

In `/home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf`, add a new location block **BEFORE** the `/tenant/` frontend block:

```bash
sed -i 's|location /tenant/ {|location /tenant/api/ {\n        proxy_pass http://tenant-backend:8000/api/;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_read_timeout 120s;\n    }\n\n    location /tenant/ {|' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
```

Verify:
```bash
grep -n -A 3 "tenant" /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf | head -30
```

Result in nginx config (order matters — more specific first):
```nginx
location /tenant/api/ {
    proxy_pass http://tenant-backend:8000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 120s;
}

location /tenant/ {
    proxy_pass http://tenant-frontend:80/;
    proxy_set_header Host $host;
    ...
}
```

Reload nginx:
```bash
docker compose restart nginx
```

---

## 9. Fix 8 — Tenant API Token Endpoint Missing

### Problem
After the nginx fix, login returned `404` on `/api/v1/token/`.

### Root Cause
The tenant backend's `brd_platform/urls.py` only had `api/token/` but the axiosInstance (used for post-login API calls) calls `api/v1/token/`. Django's `path("api/v1/", include("activeloans.urls"))` catch-all was intercepting the request.

### Fix — Add `api/v1/token/` alias to urls.py

File: `/home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Backend/brd_platform/urls.py`

Add these two lines **before** the `path("api/v1/", include("activeloans.urls"))` line:

```python
path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair_v1'),
path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh_v1'),
```

Using sed:
```bash
sed -i "s|path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),|path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),\n    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair_v1'),\n    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh_v1'),|" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Backend/brd_platform/urls.py
```

Rebuild backend:
```bash
cd /home/ubuntu/BRD_FINAL
docker compose build tenant-backend
docker compose up -d tenant-backend
```

---

## 10. Fix 9 — Tenant ProtectedRoute Key Mismatch

### Problem
After successful login (POST `/tenant/api/token/` returned 200 with JWT), the dashboard showed blank. The React app immediately redirected back to `/tenant/login`.

### Root Cause
Three files used inconsistent localStorage keys:

| File | Key Used | Issue |
|---|---|---|
| `src/auth/Login.jsx` | `"tenant_access_token"` (original) / `"access_token"` (after our edit) | Inconsistent |
| `src/auth/ProtectedRoute.jsx` | `"tenant_access_token"` | Fixed key |
| `src/services/authService.js` | `ACCESS_KEY = "access_token"` | Wrong key |

`ProtectedRoute` checks `localStorage.getItem("tenant_access_token")` on every route. Since authService and Login.jsx used `"access_token"`, ProtectedRoute never found the token and always redirected to login.

### Fix — Make all three files use the same key

```bash
# Fix Login.jsx — save with correct key
sed -i 's/localStorage.setItem("access_token", data.access);/localStorage.setItem("tenant_access_token", data.access);/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx

sed -i 's/localStorage.setItem("refresh_token", data.refresh);/localStorage.setItem("tenant_refresh_token", data.refresh);/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx

# Fix authService.js — read with same key
sed -i 's/const ACCESS_KEY = "access_token";/const ACCESS_KEY = "tenant_access_token";/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

sed -i 's/const REFRESH_KEY = "refresh_token";/const REFRESH_KEY = "tenant_refresh_token";/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js
```

Verify all three match:
```bash
echo "=== Login.jsx ===" 
grep "localStorage.setItem.*token" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx

echo "=== authService.js ===" 
grep "ACCESS_KEY\|REFRESH_KEY" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

echo "=== ProtectedRoute.jsx ===" 
cat /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/ProtectedRoute.jsx
```

Rebuild frontend:
```bash
cd /home/ubuntu/BRD_FINAL
docker compose build tenant-frontend
docker compose up -d tenant-frontend
docker compose restart nginx
```

---

## 11. Fix 10 — authService Logout Wrong Redirect

### Problem
When any authenticated API call returned 401, the `axiosInstance` response interceptor called `authService.logout()`. This redirected the user to `/dashboard` (bare path), which nginx has no rule for — landing on a blank or wrong page instead of the login screen.

### Root Cause
In `src/services/authService.js`:
```javascript
logout: () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/dashboard";  // WRONG — no nginx route for this
},
```

### Fix
```bash
sed -i 's|window.location.href = "/dashboard";|window.location.href = "/tenant/login";|g' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

# Verify
grep "window.location" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js
```

---

## 12. Fix 11 — Login 401 / django-axes Lockout

### Problem
Login returned 401 "No active account found" after multiple failed attempts. Even correct credentials were rejected.

### Root Cause
`django-axes` blocks IP addresses after N failed login attempts. The IP was locked out.

### Fix — Clear lockout records
```bash
docker compose exec tenant-backend python manage.py shell -c "
from axes.models import AccessAttempt
count = AccessAttempt.objects.count()
AccessAttempt.objects.all().delete()
print(f'Cleared {count} lockout records')
"
```

Then use **Incognito/Private mode** to avoid browser-cached bad state.

### Fix — Reset password if credentials are also wrong
```bash
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
# List users to find the right one
for u in User.objects.all()[:10]:
    print(f'id={u.id} | email={u.email} | is_active={u.is_active}')
"

# Reset password for specific user
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(email='admin@referpeople.com')
u.set_password('Admin@1234')
u.is_active = True
u.save()
print('Password reset:', u.email)
"
```

---

## 13. Fix 12 — Creating First Superuser

### Problem
Tenant backend had no users at all — empty database. Login always returned "No active account found."

### Root Cause
Fresh deployment — no superuser created yet.

### Fix — Create superuser (email-based auth)
```bash
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.create_superuser(
    email='admin@referpeople.com',
    password='Admin@1234',
    first_name='Admin',
    last_name='User'
)
u.is_active = True
u.save()
print('Created:', u.email, '| is_active:', u.is_active)
"
```

### Verify login works
```bash
curl -s -X POST http://localhost/tenant/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@referpeople.com","password":"Admin@1234"}' | python3 -m json.tool
```

---

## 14. Nginx Configuration Reference

### Complete location block order in `nginx/conf.d/loancrm.conf`

```nginx
server {
    listen 80;
    server_name _;

    resolver 127.0.0.11 valid=10s ipv6=off;

    # ── TENANT (api before frontend — order is critical) ──
    location /tenant/api/ {
        proxy_pass http://tenant-backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
    location /tenant/ {
        proxy_pass http://tenant-frontend:80/;
        ...
    }

    # ── BACKEND API ROUTES ──
    location /api/master-admin/ { proxy_pass http://masteradmin-backend:8000/; ... }
    location /api/tenant/       { proxy_pass http://tenant-backend:8000/; ... }
    location /api/crm/          { proxy_pass http://crm-backend:8000/; ... }
    location /api/finance/      { proxy_pass http://finance-backend:8000/; ... }
    location /api/sales-crm/    { proxy_pass http://salescrm-backend:8000/; ... }
    location /api/tenant-admin/ { proxy_pass http://tenantadmin-backend:8000/; ... }
    location /api/channel/      { proxy_pass http://channel-backend:8000/; ... }
    location /api/fraud/        { proxy_pass http://fraud-backend:8000/; ... }
    location /api/legal/        { proxy_pass http://legal-backend:8000/; ... }
    location /api/operations/   { proxy_pass http://operations-backend:8000/; ... }
    location /api/valuation/    { proxy_pass http://valuation-backend:8000/; ... }

    # ── FRONTEND ROUTES ──
    location /master-admin/ { proxy_pass http://masteradmin-frontend:80/; ... }
    location /sales-crm/    { proxy_pass http://salescrm-frontend:80/; ... }
    location /crm/          { proxy_pass http://crm-frontend:80/; ... }
    location /finance/      { proxy_pass http://finance-frontend:80/; ... }
    location /tenant-admin/ { proxy_pass http://tenantadmin-frontend:80/; ... }
    location /channel/      { proxy_pass http://channel-frontend:80/; ... }
    location /fraud/        { proxy_pass http://fraud-frontend:80/; ... }
    location /legal/        { proxy_pass http://legal-frontend:80/; ... }
    location /operations/   { proxy_pass http://operations-frontend:80/; ... }
    location /valuation/    { proxy_pass http://valuation-frontend:80/; ... }
    location /              { proxy_pass http://website-frontend:80/; ... }
}
```

---

## 15. All Service URLs

### Frontend Pages

| Dashboard | URL |
|---|---|
| Website / Landing | http://65.1.45.32/ |
| Master Admin | http://65.1.45.32/master-admin |
| Tenant Portal | http://65.1.45.32/tenant/login |
| CRM | http://65.1.45.32/crm |
| Finance | http://65.1.45.32/finance |
| Sales CRM | http://65.1.45.32/sales-crm |
| Tenant Admin | http://65.1.45.32/tenant-admin |
| Channel Partner | http://65.1.45.32/channel |
| Fraud Team | http://65.1.45.32/fraud |
| Legal | http://65.1.45.32/legal |
| Operations | http://65.1.45.32/operations |
| Valuation | http://65.1.45.32/valuation |

### Backend Auth Endpoints (via Nginx)

| Service | Auth Endpoint | Method |
|---|---|---|
| master-admin | `/api/master-admin/api/v1/auth/login/` | POST |
| tenant | `/api/tenant/api/token/` or `/tenant/api/token/` | POST |
| crm | `/api/crm/api/token/` | POST |
| finance | `/api/finance/api/v1/auth/login/` | POST |
| sales-crm | `/api/sales-crm/api/auth/login/` | POST |
| tenant-admin | `/api/tenant-admin/api/token/` | POST |
| fraud | `/api/fraud/api/auth/login/` | POST |
| legal | `/api/legal/api/auth/login/` | POST |
| operations | `/api/operations/api/dashboard/` | GET (open) |
| channel | `/api/channel/api/dashboard/` | GET (open) |
| valuation | `/api/valuation/api/` | GET (open) |

---

## 16. Standard Deployment Procedure

### First-time deployment on a new server

```bash
# 1. SSH into server
ssh ubuntu@65.1.45.32

# 2. Clone repo
cd /home/ubuntu
git clone https://github.com/vizz-bob/BRD_FINAL.git
cd BRD_FINAL

# 3. Set PUBLIC_URL for all frontends
cat > set_env.sh << 'EOF'
#!/bin/bash
declare -A ENVS=(
  ["BRD-website-main"]="PUBLIC_URL=/"
  ["BRD_MasterAdmin_Frontend_1.1"]="PUBLIC_URL=/master-admin"
  ["BRD-MergedTenantMaster-Frontend"]="PUBLIC_URL=/tenant\nVITE_API_BASE_URL=http://65.1.45.32/api/tenant"
  ["BRD_CRM-1.1"]="PUBLIC_URL=/crm"
  ["BRD_FINANCE_DASHBOARD"]="PUBLIC_URL=/finance"
  ["BRD_SALES_CRM"]="PUBLIC_URL=/sales-crm"
  ["BRD_TenantAdmin_Frontend_1.1"]="PUBLIC_URL=/tenant-admin"
  ["BRD-ChannelPartner-Dashboard"]="PUBLIC_URL=/channel"
  ["BRD-FraudTeamDashboard"]="PUBLIC_URL=/fraud"
  ["BRD-LEGAL-dashboard"]="PUBLIC_URL=/legal"
  ["BRD-Operation-Verification-Dashboard"]="PUBLIC_URL=/operations"
  ["BRD-ValuationDashboard"]="PUBLIC_URL=/valuation"
)
for folder in "${!ENVS[@]}"; do
  echo -e "${ENVS[$folder]}" > "$folder/.env"
  echo "✓ $folder"
done
EOF
chmod +x set_env.sh && ./set_env.sh

# 4. Build and start all services ONE AT A TIME
for service in \
  website-frontend masteradmin-frontend tenant-frontend crm-frontend \
  finance-frontend salescrm-frontend tenantadmin-frontend channel-frontend \
  fraud-frontend legal-frontend operations-frontend valuation-frontend \
  website-backend masteradmin-backend tenant-backend crm-backend \
  finance-backend salescrm-backend tenantadmin-backend channel-backend \
  fraud-backend legal-backend operations-backend valuation-backend \
  nginx redis; do
  echo "Starting $service..."
  docker compose build $service 2>/dev/null
  docker compose up -d $service
done

# 5. Create superusers for email-based backends
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@referpeople.com').exists():
    u = User.objects.create_superuser(email='admin@referpeople.com', password='Admin@1234', first_name='Admin', last_name='User')
    print('Created tenant superuser')
else:
    print('Tenant superuser already exists')
"

# 6. Verify all containers are running
docker compose ps

# 7. Test all backends
for service in master-admin tenant crm finance sales-crm tenant-admin channel fraud legal operations valuation; do
  result=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/$service/ 2>/dev/null || echo "N/A")
  echo "$service → $result"
done
```

### Updating after code changes

```bash
cd /home/ubuntu/BRD_FINAL

# Pull latest code
git pull origin main

# Re-check nginx config hasn't been reverted
grep "location /sales" nginx/conf.d/loancrm.conf
# Must show: location /sales-crm/

# Rebuild only the changed service (ONE AT A TIME)
docker compose build <service-name>
docker compose up -d <service-name>
docker compose restart nginx
```

---

## 17. Troubleshooting Quick Reference

### Page shows blank / white screen
```bash
# Check PUBLIC_URL is set correctly
cat /home/ubuntu/BRD_FINAL/<FRONTEND_FOLDER>/.env

# Check assets are being served from correct path (F12 → Network tab)
# Asset path must start with /<service-name>/assets/

# Rebuild frontend
docker compose build <frontend-service>
docker compose up -d <frontend-service>
docker compose restart nginx
```

### Login returns 405 Method Not Allowed
```bash
# Nginx is routing API calls to wrong container
# Check nginx config has correct location order
grep -n "location" /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf

# For tenant specifically — /tenant/api/ must come BEFORE /tenant/
# Fix: see Fix 7 in this guide
docker compose restart nginx
```

### Login returns 401 Unauthorized
```bash
# Clear django-axes lockout
docker compose exec <backend> python manage.py shell -c "
from axes.models import AccessAttempt
AccessAttempt.objects.all().delete()
print('Cleared')
"
# Try again in Incognito/Private window
```

### Login returns 400 Bad Request
```bash
# Wrong credentials format — check if backend uses email or username
# Test directly:
curl -s -X POST http://localhost/api/<service>/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@referpeople.com","password":"Admin@1234"}'

curl -s -X POST http://localhost/api/<service>/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@1234"}'
```

### Dashboard loads but shows no data (blank after login)
```bash
# Check localStorage keys match in ProtectedRoute + authService + Login
# For tenant: all three must use "tenant_access_token"
grep -n "tenant_access_token\|access_token" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/ProtectedRoute.jsx \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

# Check backend logs for 401 on data calls
docker compose logs tenant-backend --tail=20
```

### API calls returning 502 Bad Gateway
```bash
# Backend container is down or nginx DNS cache is stale
docker compose ps  # check container status
docker compose restart <backend-service>
docker compose restart nginx
```

### Mixed-up assets across pages after rebuild
```bash
# Image mix-up from batch build — tear down and rebuild one by one
docker compose down
# Then rebuild ONE AT A TIME (see Fix 5)
```

### Git push rejected
```bash
git pull origin main --no-rebase
git push origin main
```

---

*Last updated: May 2026 | Server: 65.1.45.32 | Repo: github.com/vizz-bob/BRD_FINAL*
