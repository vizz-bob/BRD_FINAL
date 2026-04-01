#!/bin/bash
# =============================================================================
# BRD Loan CRM — LOCAL DEVELOPMENT STARTUP SCRIPT
# Starts all backends on localhost with unique ports.
# Each Django backend reads .env.local (DB_HOST=localhost).
#
# Usage:
#   chmod +x start-local.sh
#   ./start-local.sh              # starts all services
#   ./start-local.sh backends     # only backends
#   ./start-local.sh frontends    # only frontends
#   ./start-local.sh stop         # kill all BRD dev processes
# =============================================================================

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT/.local-logs"
mkdir -p "$LOG_DIR"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

# ── Port map ──────────────────────────────────────────────────────────────────
# BACKENDS: "dir:port"
BACKENDS=(
  "BRD_MasterAdmin_Backend_1.1:8001"
  "BRD-MergedTenantMaster-Backend:8002"
  "BRD_CRM_1.1_BACKEND:8003"
  "BRD_FINANCE_DASHBOARD_Backend:8004"
  "BRD-AgentsApp-Backend:8005"
  "BRD-ChannelPartnerDashboard-Backend:8006"
  "BRD-FraudTeam-Dashboard-Backend:8007"
  "BRD-LegalDashboard-Backend:8008"
  "BRD-OperationVerification-Backend:8009"
  "BRD-SalesCRM-Dashboard-Backend:8010"
  "BRD-TenantAdmin_backend_2.0:8011"
  "BRD-Valuation-Dashboard-Backend:8012"
  "BRD-website-main-backend:8013"
)

# FRONTENDS: "dir:dev_port"
FRONTENDS=(
  "BRD-website-main:5173"
  "BRD_MasterAdmin_Frontend_1.1:5174"
  "BRD_TenantAdmin_Frontend_1.1:5175"
  "BRD-MergedTenantMaster-Frontend:5176"
  "BRD_CRM-1.1:5177"
  "BRD_FINANCE_DASHBOARD:5178"
  "BRD_SALES_CRM:5179"
  "BRD-ChannelPartner-Dashboard:5180"
  "BRD-FraudTeamDashboard:5181"
  "BRD-LEGAL-dashboard:5182"
  "BRD-Operation-Verification-Dashboard:5183"
  "BRD-ValuationDashboard:5184"
)

# ── Stop all ──────────────────────────────────────────────────────────────────
stop_all() {
  echo -e "${YELLOW}Stopping all BRD local dev processes...${NC}"
  pkill -f "manage.py runserver" 2>/dev/null
  pkill -f "vite" 2>/dev/null
  echo -e "${GREEN}Done.${NC}"
  exit 0
}

# ── Check postgres ────────────────────────────────────────────────────────────
check_postgres() {
  if ! pg_isready -h localhost -U brdapp -d loancrm -q 2>/dev/null; then
    echo -e "${RED}[ERROR] PostgreSQL not reachable as brdapp@localhost/loancrm${NC}"
    echo -e "${YELLOW}Run first: psql -U postgres -f local-postgres-setup.sql${NC}"
    exit 1
  fi
  echo -e "${GREEN}[OK] PostgreSQL connected (brdapp@localhost/loancrm)${NC}"
}

# ── Start backends ────────────────────────────────────────────────────────────
start_backends() {
  echo -e "\n${CYAN}=== Starting Django Backends ===${NC}"
  for entry in "${BACKENDS[@]}"; do
    DIR="${entry%%:*}"
    PORT="${entry##*:}"
    FULL_PATH="$ROOT/$DIR"

    if [ ! -d "$FULL_PATH" ]; then
      echo -e "${YELLOW}[SKIP] $DIR — directory not found${NC}"
      continue
    fi
    if [ ! -f "$FULL_PATH/.env.local" ]; then
      echo -e "${YELLOW}[SKIP] $DIR — .env.local missing${NC}"
      continue
    fi
    if [ ! -f "$FULL_PATH/manage.py" ]; then
      echo -e "${YELLOW}[SKIP] $DIR — not a Django project (no manage.py)${NC}"
      continue
    fi

    LOG="$LOG_DIR/${DIR}-backend.log"

    # Install requirements if needed
    if [ -f "$FULL_PATH/requirements.txt" ]; then
      echo -e "${CYAN}[SETUP] $DIR — installing requirements...${NC}"
      cd "$FULL_PATH"
      pip install -q -r requirements.txt --break-system-packages 2>/dev/null || \
        pip install -q -r requirements.txt 2>/dev/null
    fi

    echo -e "${GREEN}[START] $DIR → http://localhost:$PORT${NC}"
    cd "$FULL_PATH"

    # Export .env.local vars and run migrations + server
    (
      set -o allexport
      source .env.local
      set +o allexport
      python manage.py migrate --run-syncdb 2>&1 | tail -5
      python manage.py runserver "$PORT" >> "$LOG" 2>&1
    ) &

    echo "  Log: $LOG"
  done
}

# ── Create superuser helper ───────────────────────────────────────────────────
create_superusers() {
  echo -e "\n${CYAN}=== Creating Superusers ===${NC}"
  for entry in "${BACKENDS[@]}"; do
    DIR="${entry%%:*}"
    FULL_PATH="$ROOT/$DIR"
    [ ! -f "$FULL_PATH/manage.py" ] && continue
    [ ! -f "$FULL_PATH/.env.local" ] && continue
    cd "$FULL_PATH"
    (
      set -o allexport
      source .env.local
      set +o allexport
      echo "from django.contrib.auth import get_user_model; U = get_user_model(); \
U.objects.filter(email='Admin@brd.com').exists() or \
U.objects.create_superuser(email='Admin@brd.com', password='Admin@1234')" \
        | python manage.py shell 2>/dev/null && echo -e "${GREEN}  [OK] $DIR${NC}" || true
    )
  done
}

# ── Start frontends ───────────────────────────────────────────────────────────
start_frontends() {
  echo -e "\n${CYAN}=== Starting Vite Frontends ===${NC}"
  for entry in "${FRONTENDS[@]}"; do
    DIR="${entry%%:*}"
    PORT="${entry##*:}"
    FULL_PATH="$ROOT/$DIR"

    if [ ! -d "$FULL_PATH" ]; then
      echo -e "${YELLOW}[SKIP] $DIR — directory not found${NC}"
      continue
    fi
    if [ ! -f "$FULL_PATH/package.json" ]; then
      echo -e "${YELLOW}[SKIP] $DIR — not an npm project${NC}"
      continue
    fi

    LOG="$LOG_DIR/${DIR}-frontend.log"
    echo -e "${GREEN}[START] $DIR → http://localhost:$PORT${NC}"

    cd "$FULL_PATH"
    # Install dependencies if node_modules absent
    [ ! -d "node_modules" ] && npm install -q 2>/dev/null

    # Vite: use --port flag to set the dev server port
    npm run dev -- --port "$PORT" --host >> "$LOG" 2>&1 &
    echo "  Log: $LOG"
  done
}

# ── Print summary ─────────────────────────────────────────────────────────────
print_summary() {
  echo -e "\n${CYAN}=== Service URLs ===${NC}"
  echo -e "${YELLOW}BACKENDS (Django / DRF)${NC}"
  echo "  Master Admin     → http://localhost:8001/api/master-admin/"
  echo "  Tenant/Merged    → http://localhost:8002/api/tenant/"
  echo "  CRM              → http://localhost:8003/api/"
  echo "  Finance          → http://localhost:8004/api/"
  echo "  Agents           → http://localhost:8005/api/"
  echo "  Channel Partner  → http://localhost:8006/api/"
  echo "  Fraud Team       → http://localhost:8007/api/"
  echo "  Legal            → http://localhost:8008/api/"
  echo "  Operations       → http://localhost:8009/api/"
  echo "  Sales CRM        → http://localhost:8010/api/"
  echo "  Tenant Admin 2.0 → http://localhost:8011/api/tenant-admin/"
  echo "  Valuation        → http://localhost:8012/api/"
  echo "  Website          → http://localhost:8013/api/"
  echo ""
  echo -e "${YELLOW}FRONTENDS (Vite React)${NC}"
  echo "  Website          → http://localhost:5173"
  echo "  Master Admin     → http://localhost:5174"
  echo "  Tenant Admin     → http://localhost:5175"
  echo "  Merged Tenant    → http://localhost:5176"
  echo "  CRM              → http://localhost:5177"
  echo "  Finance          → http://localhost:5178"
  echo "  Sales CRM        → http://localhost:5179"
  echo "  Channel Partner  → http://localhost:5180"
  echo "  Fraud Team       → http://localhost:5181"
  echo "  Legal            → http://localhost:5182"
  echo "  Operations       → http://localhost:5183"
  echo "  Valuation        → http://localhost:5184"
  echo ""
  echo -e "${YELLOW}Login Credentials${NC}"
  echo "  Email:    Admin@brd.com"
  echo "  Password: Admin@1234"
  echo ""
  echo -e "${GREEN}All services started. Logs in: $LOG_DIR/${NC}"
  echo -e "To stop all:  ${CYAN}./start-local.sh stop${NC}"
}

# ── Main ──────────────────────────────────────────────────────────────────────
case "${1:-all}" in
  stop)      stop_all ;;
  backends)  check_postgres; start_backends; print_summary ;;
  frontends) start_frontends; print_summary ;;
  superuser) create_superusers ;;
  all|*)
    check_postgres
    start_backends
    sleep 5   # give backends time to start migrations
    create_superusers
    start_frontends
    print_summary
    ;;
esac

# Keep script alive (optional — press Ctrl+C to stop)
echo -e "\n${CYAN}Press Ctrl+C to stop all services...${NC}"
wait
