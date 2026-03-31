#!/bin/bash
# =============================================================================
# BRD Loan CRM Platform — One-Command Full Deployment Script
# Run this on EC2 after git pull
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
#
# What it does:
#   1. Generates all .env files
#   2. Starts all Docker containers
#   3. Runs database migrations for all 12 backends
#   4. Creates admin and tenant superusers
#   5. Collects static files
#   6. Prints health check results
# =============================================================================

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

header() {
  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  $1${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

ok()   { echo -e "  ${GREEN}✅ $1${NC}"; }
warn() { echo -e "  ${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "  ${RED}❌ $1${NC}"; }

# ── STEP 1: Generate .env files ───────────────────────────────────────────────
header "STEP 1: Generating .env files"
chmod +x setup_env.sh
./setup_env.sh
ok "All .env files created"

# ── STEP 2: Build and start containers ───────────────────────────────────────
header "STEP 2: Building Docker images (this takes 5-15 minutes)"
docker compose build --parallel
ok "All images built"

header "STEP 3: Starting all containers"
docker compose up -d
ok "Containers started"

# Wait for backends to be ready
echo ""
echo "  Waiting 20 seconds for backends to initialize..."
sleep 20

# ── STEP 4: Run migrations ────────────────────────────────────────────────────
header "STEP 4: Running database migrations"

BACKENDS=(
  loancrm_masteradmin_backend
  loancrm_tenant_backend
  loancrm_crm_backend
  loancrm_finance_backend
  loancrm_agents_backend
  loancrm_channel_backend
  loancrm_fraud_backend
  loancrm_legal_backend
  loancrm_operations_backend
  loancrm_salescrm_backend
  loancrm_tenantadmin_backend
  loancrm_valuation_backend
)

for CONTAINER in "${BACKENDS[@]}"; do
  echo -n "  Migrating $CONTAINER... "
  if docker exec "$CONTAINER" python manage.py migrate --noinput > /dev/null 2>&1; then
    echo -e "${GREEN}done${NC}"
  else
    echo -e "${RED}FAILED — check logs: docker logs $CONTAINER${NC}"
  fi
done

# ── STEP 5: Collect static files ─────────────────────────────────────────────
header "STEP 5: Collecting static files"
docker exec loancrm_masteradmin_backend python manage.py collectstatic --noinput > /dev/null 2>&1 && ok "Static files collected" || warn "collectstatic skipped"

# ── STEP 6: Create superusers ─────────────────────────────────────────────────
header "STEP 6: Creating superusers"

# Master Admin
echo -n "  Creating Master Admin (Admin@brd.com)... "
docker exec loancrm_masteradmin_backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='Admin@brd.com').exists():
    User.objects.create_superuser(username='admin', email='Admin@brd.com', password='Admin@1234')
    print('created')
else:
    print('already exists')
" 2>/dev/null && ok "Master Admin ready" || warn "Master Admin creation — check manually"

# Tenant
echo -n "  Creating Tenant user (Tenant@brd.com)... "
docker exec loancrm_tenant_backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='Tenant@brd.com').exists():
    User.objects.create_superuser(username='tenant', email='Tenant@brd.com', password='Tenant@1234')
    print('created')
else:
    print('already exists')
" 2>/dev/null && ok "Tenant user ready" || warn "Tenant creation — check manually"

# ── STEP 7: Health check ──────────────────────────────────────────────────────
header "STEP 7: Health Check"

echo "  Container status:"
TOTAL=$(docker compose ps --status running | grep loancrm | wc -l)
echo -e "  ${GREEN}$TOTAL containers running${NC}"
echo ""

echo "  Checking nginx routes..."
for ROUTE in "/" "/master-admin/" "/tenant/" "/crm/" "/finance/" "/sales-crm/" "/tenant-admin/" "/channel/" "/fraud/" "/legal/" "/operations/" "/valuation/"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://13.232.219.91${ROUTE}" 2>/dev/null || echo "000")
  if [[ "$CODE" == "200" || "$CODE" == "301" || "$CODE" == "302" ]]; then
    ok "http://13.232.219.91${ROUTE} → HTTP $CODE"
  else
    fail "http://13.232.219.91${ROUTE} → HTTP $CODE"
  fi
done

# ── DONE ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ BRD Loan CRM Platform Deployed Successfully!         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "  📍 Access URLs:"
echo "     Main Site:    http://13.232.219.91/"
echo "     Master Admin: http://13.232.219.91/master-admin/  (Admin@brd.com / Admin@1234)"
echo "     Tenant:       http://13.232.219.91/tenant/        (Tenant@brd.com / Tenant@1234)"
echo "     CRM:          http://13.232.219.91/crm/"
echo "     Finance:      http://13.232.219.91/finance/"
echo ""
echo "  🔧 Useful commands:"
echo "     docker compose ps               # check container status"
echo "     docker compose logs -f <name>   # follow logs"
echo "     docker compose restart <name>   # restart a service"
echo ""
