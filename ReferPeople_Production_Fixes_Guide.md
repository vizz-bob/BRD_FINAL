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
  ├── /tenant/api/         → tenant-backend:8000   ← Special rule (BEFORE /tenant/)
  ├── /tenant/             → tenant-frontend:80
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
Set `PUBLIC_URL` in each frontend's `.env` file:

```bash
cd /home/ubuntu/BRD_FINAL

echo "PUBLIC_URL=/"                > BRD-website-main/.env
echo "PUBLIC_URL=/master-admin"    > BRD_MasterAdmin_Frontend_1.1/.env
printf "PUBLIC_URL=/tenant\nVITE_API_BASE_URL=http://65.1.45.32/api/tenant" > BRD-MergedTenantMaster-Frontend/.env
echo "PUBLIC_URL=/crm"             > BRD_CRM-1.1/.env
echo "PUBLIC_URL=/finance"         > BRD_FINANCE_DASHBOARD/.env
echo "PUBLIC_URL=/sales-crm"       > BRD_SALES_CRM/.env
echo "PUBLIC_URL=/tenant-admin"    > BRD_TenantAdmin_Frontend_1.1/.env
echo "PUBLIC_URL=/channel"         > BRD-ChannelPartner-Dashboard/.env
echo "PUBLIC_URL=/fraud"           > BRD-FraudTeamDashboard/.env
echo "PUBLIC_URL=/legal"           > BRD-LEGAL-dashboard/.env
echo "PUBLIC_URL=/operations"      > BRD-Operation-Verification-Dashboard/.env
echo "PUBLIC_URL=/valuation"       > BRD-ValuationDashboard/.env
```

### Rebuild (ONE AT A TIME — see Fix 5)
```bash
cd /home/ubuntu/BRD_FINAL
for service in website-frontend masteradmin-frontend tenant-frontend crm-frontend \
  finance-frontend salescrm-frontend tenantadmin-frontend channel-frontend \
  fraud-frontend legal-frontend operations-frontend valuation-frontend; do
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
Three places hardcoded `/sales/` instead of `/sales-crm/`:
1. `nginx/conf.d/loancrm.conf` → `location /sales/ {`
2. `BRD_SALES_CRM/vite.config.js` → `base: '/sales/'`
3. `BRD_SALES_CRM/src/` Router → `basename="/sales"`

### Fix

```bash
# 1. Fix nginx config
sed -i 's|location /sales/ {|location /sales-crm/ {|g' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf

# 2. Fix vite.config.js
sed -i "s|base: '/sales/'|base: '/sales-crm/'|g" \
  /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/vite.config.js

# 3. Fix React Router basename — find the file and change basename="/sales" to basename="/sales-crm"
grep -rn 'basename="/sales"' /home/ubuntu/BRD_FINAL/BRD_SALES_CRM/src/
# Then edit the file shown above

# 4. Rebuild
docker compose build salescrm-frontend
docker compose up -d salescrm-frontend
docker compose restart nginx
```

---

## 4. Fix 3 — Nginx DNS Caching

### Problem
After rebuilding any backend container, API calls returned errors. Nginx routed to the old dead container IP.

### Root Cause
Nginx caches Docker container IPs at startup. Rebuilt containers get new IPs.

### Fix — Add Docker DNS resolver to nginx config
In `/home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf`, inside the `server {}` block:

```nginx
resolver 127.0.0.11 valid=10s ipv6=off;
```

**Always restart nginx after any container rebuild:**
```bash
docker compose restart nginx
```

---

## 5. Fix 4 — Hardcoded localhost API URLs

### Problem
Several frontends had hardcoded `localhost:8000` in their API service files — worked in dev, failed in production.

### Fix
```bash
cd /home/ubuntu/BRD_FINAL

# Find and fix all localhost references in frontend src folders
for dir in BRD_SALES_CRM BRD_FINANCE_DASHBOARD BRD-ChannelPartner-Dashboard \
           BRD-FraudTeamDashboard BRD-LEGAL-dashboard BRD-ValuationDashboard BRD-website-main; do
  find "$dir/src" \( -name "*.js" -o -name "*.jsx" \) | xargs grep -l "localhost" 2>/dev/null | while read f; do
    echo "Fixing: $f"
    sed -i 's|http://localhost:[0-9]*||g' "$f"
  done
done

# Verify no localhost remains
grep -rn "localhost" BRD_SALES_CRM/src/ BRD_FINANCE_DASHBOARD/src/ 2>/dev/null
```

---

## 6. Fix 5 — Docker Build Image Mix-up

### Problem
After batch-building, pages loaded wrong content (e.g., `/crm/` loaded sales-crm assets).

### Root Cause
Building multiple containers in parallel causes Docker to mislabel images.

### Rule — ALWAYS build ONE AT A TIME

```bash
# WRONG:
docker compose build          # Never do this!
docker compose up -d          # Never do this for frontends!

# CORRECT:
docker compose build tenant-frontend
docker compose up -d tenant-frontend
# then next one...
```

---

## 7. Fix 6 — Nginx /sales/ Wrong Route

### Problem
After `git pull`, `/sales-crm/` stopped working — old commit reverted nginx fix.

### Fix + Prevention
```bash
# Always verify after git pull:
grep "location /sales" /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
# Must show: location /sales-crm/ {

# If reverted, re-apply:
sed -i 's|location /sales/ {|location /sales-crm/ {|g' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf
docker compose restart nginx
```

---

## 8. Fix 7 — Tenant Login 405 Error

### Problem
`POST http://65.1.45.32/tenant/api/token/` returned 405.

### Root Cause
`Login.jsx` builds its URL as `/tenant/api/token/`. The nginx rule `location /tenant/` matched this and proxied it to the **frontend container** (not backend). Frontend nginx has no `/api/token/` handler → 405.

### Fix — Add `/tenant/api/` proxy rule BEFORE `/tenant/` in nginx

```bash
sed -i 's|location /tenant/ {|location /tenant/api/ {\n        proxy_pass http://tenant-backend:8000/api/;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_read_timeout 120s;\n    }\n\n    location /tenant/ {|' \
  /home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf

docker compose restart nginx

# Verify
curl -s -X POST http://localhost/tenant/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@referpeople.com","password":"Admin@1234"}'
```

Result in nginx config (order is critical):
```nginx
location /tenant/api/ {          # ← Must come FIRST
    proxy_pass http://tenant-backend:8000/api/;
    ...
}
location /tenant/ {              # ← Frontend after
    proxy_pass http://tenant-frontend:80/;
    ...
}
```

---

## 9. Fix 8 — Tenant API Token Endpoint Missing

### Problem
`POST /api/tenant/api/v1/token/` returned 404. The axiosInstance (used for post-login calls) calls `api/v1/token/` but the backend only had `api/token/`.

### Root Cause
`BRD-MergedTenantMaster-Backend/brd_platform/urls.py` had `api/token/` but not `api/v1/token/`. The catch-all `path("api/v1/", include("activeloans.urls"))` intercepted the request.

### Fix — Add alias in urls.py

```bash
sed -i "s|path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),|path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),\n    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair_v1'),\n    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh_v1'),|" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Backend/brd_platform/urls.py

# Verify
grep -n "token" /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Backend/brd_platform/urls.py

# Rebuild backend
docker compose build tenant-backend
docker compose up -d tenant-backend
```

---

## 10. Fix 9 — Tenant ProtectedRoute Key Mismatch

### Problem
Login POST returned 200 with JWT token, but dashboard showed blank and user was immediately redirected back to login.

### Root Cause
Three files used different localStorage keys — token was saved with one key and read with another:

| File | Key Used |
|---|---|
| `src/auth/Login.jsx` | `"tenant_access_token"` |
| `src/auth/ProtectedRoute.jsx` | `"tenant_access_token"` |
| `src/services/authService.js` | `ACCESS_KEY = "access_token"` ← WRONG |

`ProtectedRoute` checked for `"tenant_access_token"` but `authService` saved/read `"access_token"` — mismatch caused immediate redirect to login on every page load.

### Fix — Make all files use `"tenant_access_token"`

```bash
# Fix Login.jsx to save with correct key
sed -i 's/localStorage.setItem("access_token", data.access);/localStorage.setItem("tenant_access_token", data.access);/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx

sed -i 's/localStorage.setItem("refresh_token", data.refresh);/localStorage.setItem("tenant_refresh_token", data.refresh);/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx

# Fix authService.js to read with same key
sed -i 's/const ACCESS_KEY = "access_token";/const ACCESS_KEY = "tenant_access_token";/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

sed -i 's/const REFRESH_KEY = "refresh_token";/const REFRESH_KEY = "tenant_refresh_token";/' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

# Verify all three match
grep "tenant_access_token\|access_token" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/Login.jsx \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/auth/ProtectedRoute.jsx \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

# Rebuild
docker compose build tenant-frontend
docker compose up -d tenant-frontend
docker compose restart nginx
```

---

## 11. Fix 10 — authService Logout Wrong Redirect

### Problem
When any API call returned 401, `authService.logout()` redirected to `/dashboard` — a path nginx has no rule for, sending users to a blank/wrong page.

### Root Cause
```javascript
// src/services/authService.js
logout: () => {
    localStorage.clear();
    window.location.href = "/dashboard";  // WRONG — no nginx route
},
```

### Fix
```bash
sed -i 's|window.location.href = "/dashboard";|window.location.href = "/tenant/login";|g' \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js

grep "window.location" \
  /home/ubuntu/BRD_FINAL/BRD-MergedTenantMaster-Frontend/src/services/authService.js
```

---

## 12. Fix 11 — Login 401 / django-axes Lockout

### Problem
Login returned 401 "No active account found" even with correct credentials after multiple failed attempts.

### Root Cause
`django-axes` locks out IP addresses after N consecutive failed logins.

### Fix
```bash
# Clear all lockout records
docker compose exec tenant-backend python manage.py shell -c "
from axes.models import AccessAttempt
count = AccessAttempt.objects.count()
AccessAttempt.objects.all().delete()
print(f'Cleared {count} lockout records')
"

# Then try login in Incognito/Private browser window
```

### Also reset password if needed
```bash
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
for u in User.objects.all()[:10]:
    print(f'email={u.email} | is_active={u.is_active}')
"

docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(email='admin@referpeople.com')
u.set_password('Admin@1234')
u.is_active = True
u.save()
print('Password reset done')
"
```

---

## 13. Fix 12 — Creating First Superuser

### Problem
Tenant backend had no users — fresh database. Every login returned "No active account found."

### Fix — Create email-based superuser
```bash
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@referpeople.com').exists():
    u = User.objects.create_superuser(
        email='admin@referpeople.com',
        password='Admin@1234',
        first_name='Admin',
        last_name='User'
    )
    u.is_active = True
    u.save()
    print('Created:', u.email)
else:
    print('User already exists')
"

# Verify login works
curl -s -X POST http://localhost/tenant/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@referpeople.com","password":"Admin@1234"}' | python3 -m json.tool
```

---

## 14. Nginx Configuration Reference

### `/home/ubuntu/BRD_FINAL/nginx/conf.d/loancrm.conf`

```nginx
server {
    listen 80;
    server_name _;

    resolver 127.0.0.11 valid=10s ipv6=off;

    # TENANT — api rule MUST come before frontend rule
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # BACKEND API ROUTES
    location /api/master-admin/ { proxy_pass http://masteradmin-backend:8000/;  ... }
    location /api/tenant/       { proxy_pass http://tenant-backend:8000/;        ... }
    location /api/crm/          { proxy_pass http://crm-backend:8000/;           ... }
    location /api/finance/      { proxy_pass http://finance-backend:8000/;       ... }
    location /api/sales-crm/    { proxy_pass http://salescrm-backend:8000/;      ... }
    location /api/tenant-admin/ { proxy_pass http://tenantadmin-backend:8000/;   ... }
    location /api/channel/      { proxy_pass http://channel-backend:8000/;       ... }
    location /api/fraud/        { proxy_pass http://fraud-backend:8000/;         ... }
    location /api/legal/        { proxy_pass http://legal-backend:8000/;         ... }
    location /api/operations/   { proxy_pass http://operations-backend:8000/;    ... }
    location /api/valuation/    { proxy_pass http://valuation-backend:8000/;     ... }

    # FRONTEND ROUTES
    location /master-admin/ { proxy_pass http://masteradmin-frontend:80/;  ... }
    location /sales-crm/    { proxy_pass http://salescrm-frontend:80/;     ... }
    location /crm/          { proxy_pass http://crm-frontend:80/;          ... }
    location /finance/      { proxy_pass http://finance-frontend:80/;      ... }
    location /tenant-admin/ { proxy_pass http://tenantadmin-frontend:80/;  ... }
    location /channel/      { proxy_pass http://channel-frontend:80/;      ... }
    location /fraud/        { proxy_pass http://fraud-frontend:80/;        ... }
    location /legal/        { proxy_pass http://legal-frontend:80/;        ... }
    location /operations/   { proxy_pass http://operations-frontend:80/;   ... }
    location /valuation/    { proxy_pass http://valuation-frontend:80/;    ... }
    location /              { proxy_pass http://website-frontend:80/;      ... }
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

### Backend Auth Endpoints

| Service | Auth Endpoint | Format |
|---|---|---|
| master-admin | `POST /api/master-admin/api/v1/auth/login/` | `{"email":"...","password":"..."}` |
| tenant | `POST /tenant/api/token/` | `{"email":"...","password":"..."}` |
| crm | `POST /api/crm/api/token/` | `{"username":"...","password":"..."}` |
| finance | `POST /api/finance/api/v1/auth/login/` | `{"username":"...","password":"..."}` |
| sales-crm | `POST /api/sales-crm/api/auth/login/` | `{"username":"...","password":"..."}` |
| tenant-admin | `POST /api/tenant-admin/api/token/` | `{"username":"...","password":"..."}` |
| fraud | `POST /api/fraud/api/auth/login/` | `{"username":"...","password":"..."}` |
| legal | `POST /api/legal/api/auth/login/` | `{"username":"...","password":"..."}` |
| operations | `GET /api/operations/api/dashboard/` | open API |
| channel | `GET /api/channel/api/dashboard/` | open API |
| valuation | `GET /api/valuation/api/` | open API |

---

## 16. Standard Deployment Procedure

### Full fresh deployment

```bash
ssh ubuntu@65.1.45.32
cd /home/ubuntu/BRD_FINAL
git pull origin main

# Step 1 — Set all .env files
echo "PUBLIC_URL=/"                > BRD-website-main/.env
printf "PUBLIC_URL=/tenant\nVITE_API_BASE_URL=http://65.1.45.32/api/tenant" \
                                   > BRD-MergedTenantMaster-Frontend/.env
echo "PUBLIC_URL=/master-admin"    > BRD_MasterAdmin_Frontend_1.1/.env
echo "PUBLIC_URL=/crm"             > BRD_CRM-1.1/.env
echo "PUBLIC_URL=/finance"         > BRD_FINANCE_DASHBOARD/.env
echo "PUBLIC_URL=/sales-crm"       > BRD_SALES_CRM/.env
echo "PUBLIC_URL=/tenant-admin"    > BRD_TenantAdmin_Frontend_1.1/.env
echo "PUBLIC_URL=/channel"         > BRD-ChannelPartner-Dashboard/.env
echo "PUBLIC_URL=/fraud"           > BRD-FraudTeamDashboard/.env
echo "PUBLIC_URL=/legal"           > BRD-LEGAL-dashboard/.env
echo "PUBLIC_URL=/operations"      > BRD-Operation-Verification-Dashboard/.env
echo "PUBLIC_URL=/valuation"       > BRD-ValuationDashboard/.env

# Step 2 — Start backends and infrastructure first
docker compose up -d redis
for svc in masteradmin-backend tenant-backend crm-backend finance-backend \
  salescrm-backend tenantadmin-backend channel-backend fraud-backend \
  legal-backend operations-backend valuation-backend website-backend; do
  docker compose build $svc && docker compose up -d $svc
done

# Step 3 — Build and start frontends ONE AT A TIME
for svc in website-frontend masteradmin-frontend tenant-frontend crm-frontend \
  finance-frontend salescrm-frontend tenantadmin-frontend channel-frontend \
  fraud-frontend legal-frontend operations-frontend valuation-frontend; do
  docker compose build $svc && docker compose up -d $svc
done

# Step 4 — Start nginx last
docker compose up -d nginx

# Step 5 — Run migrations on all backends
for svc in masteradmin-backend tenant-backend crm-backend finance-backend \
  salescrm-backend tenantadmin-backend channel-backend fraud-backend \
  legal-backend operations-backend valuation-backend; do
  docker compose exec $svc python manage.py migrate --run-syncdb 2>/dev/null || true
done

# Step 6 — Create tenant superuser
docker compose exec tenant-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@referpeople.com').exists():
    u = User.objects.create_superuser(email='admin@referpeople.com', password='Admin@1234', first_name='Admin', last_name='User')
    u.is_active = True
    u.save()
    print('Tenant superuser created')
"

# Step 7 — Verify all 26 containers running
docker compose ps
```

### After any code change

```bash
cd /home/ubuntu/BRD_FINAL
git pull origin main

# Verify nginx fixes not reverted
grep "location /sales" nginx/conf.d/loancrm.conf  # must be /sales-crm/

# Rebuild only the changed service
docker compose build <service-name>
docker compose up -d <service-name>
docker compose restart nginx
```

---

## 17. Troubleshooting Quick Reference

| Symptom | Likely Cause | Fix |
|---|---|---|
| Blank white page | Missing PUBLIC_URL in .env | Set PUBLIC_URL, rebuild frontend |
| 404 on `/assets/...` | Wrong PUBLIC_URL value | Fix .env, rebuild frontend |
| Wrong dashboard assets on a page | Docker batch build mix-up | Tear down, rebuild ONE AT A TIME |
| 405 on `/tenant/api/token/` | Nginx /tenant/ routing API to frontend | Add `/tenant/api/` location before `/tenant/` |
| 404 on `/api/v1/token/` | Missing URL alias in urls.py | Add `api/v1/token/` path, rebuild backend |
| Login 401 after correct credentials | django-axes lockout | Clear AccessAttempt, use Incognito |
| Login 400 | Wrong field (email vs username) | Check which field the backend requires |
| Dashboard blank after login | ProtectedRoute localStorage key mismatch | Align keys in Login.jsx + authService.js + ProtectedRoute.jsx |
| Redirected to blank page after 401 | logout() redirects to wrong URL | Fix window.location.href in authService.js |
| API 502 Bad Gateway | Backend container down / nginx DNS stale | `docker compose restart <backend> nginx` |
| Git push rejected | Remote has newer commits | `git pull origin main --no-rebase` then push |
| Nginx routes to old container after rebuild | Docker DNS cache | Add `resolver 127.0.0.11 valid=10s ipv6=off;` in nginx server block |

### Health check all backends
```bash
for svc in master-admin tenant crm finance sales-crm tenant-admin channel fraud legal operations valuation; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/$svc/api/ 2>/dev/null)
  echo "$svc → $code"
done
```

### Quick container status
```bash
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

---

*Last updated: May 2026 | Server: 65.1.45.32 | Repo: github.com/vizz-bob/BRD_FINAL*
