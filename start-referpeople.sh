#!/bin/bash
# ============================================================
# ReferPeople.in — Local Development Startup Script
# Usage:
#   ./start-referpeople.sh              - Start everything
#   ./start-referpeople.sh backends     - Start backends only
#   ./start-referpeople.sh frontends    - Start frontends only
#   ./start-referpeople.sh stop         - Stop everything
#   ./start-referpeople.sh superuser    - Create super admin
#   ./start-referpeople.sh migrate      - Run all migrations
# ============================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
PURPLE='\033[0;35m'
RED='\033[0;31m'
NC='\033[0m'

BACKENDS=(
  "auth-backend:8000"
  "realestate-backend:8001"
  "loans-backend:8002"
  "jobs-backend:8003"
  "education-backend:8004"
  "masteradmin-backend:8005"
)

FRONTENDS=(
  "realestate-frontend:3000"
  "loans-frontend:3001"
  "jobs-frontend:3002"
  "education-frontend:3003"
  "masteradmin-frontend:3004"
)

print_banner() {
  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║     ReferPeople.in — Local Development           ║${NC}"
  echo -e "${BLUE}║     Real Estate | Loans | Jobs | Education       ║${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_env_files() {
  echo -e "${BLUE}Checking .env files...${NC}"
  SERVICES=("auth-backend" "realestate-backend" "loans-backend" "jobs-backend" "education-backend" "masteradmin-backend")
  for svc in "${SERVICES[@]}"; do
    if [ ! -f "./$svc/.env" ]; then
      echo -e "${RED}WARNING: ./$svc/.env not found. Copying from .env.example...${NC}"
      if [ -f "./$svc/.env.example" ]; then
        cp "./$svc/.env.example" "./$svc/.env"
        echo -e "${ORANGE}   Created ./$svc/.env — please update DB credentials!${NC}"
      fi
    fi
  done
  echo -e "${GREEN}Env check done.${NC}"
}

start_backends() {
  echo -e "${BLUE}Starting backend services...${NC}"
  for entry in "${BACKENDS[@]}"; do
    IFS=: read -r svc port <<< "$entry"
    echo -e "  Starting ${BLUE}$svc${NC} on port ${ORANGE}$port${NC}..."
    cd "$svc"
    # Install dependencies if needed
    if [ ! -d "venv" ]; then
      python3 -m venv venv
      source venv/bin/activate
      pip install -r requirements.txt -q
    else
      source venv/bin/activate
    fi
    export DJANGO_SETTINGS_MODULE="$(ls */settings.py 2>/dev/null | head -1 | cut -d/ -f1).settings"
    python manage.py migrate --noinput > /dev/null 2>&1
    nohup python manage.py runserver "0.0.0.0:$port" > "../logs/$svc.log" 2>&1 &
    echo $! > "../.pids/$svc.pid"
    deactivate
    cd ..
    echo -e "  ${GREEN}Started $svc on http://localhost:$port${NC}"
  done
}

start_frontends() {
  echo -e "${BLUE}Starting frontend services...${NC}"
  for entry in "${FRONTENDS[@]}"; do
    IFS=: read -r svc port <<< "$entry"
    echo -e "  Starting ${BLUE}$svc${NC} on port ${ORANGE}$port${NC}..."
    cd "$svc"
    if [ ! -d "node_modules" ]; then
      npm install --silent
    fi
    nohup npm run dev -- --port "$port" --host > "../logs/$svc.log" 2>&1 &
    echo $! > "../.pids/$svc.pid"
    cd ..
    echo -e "  ${GREEN}Started $svc on http://localhost:$port${NC}"
  done
}

stop_all() {
  echo -e "${RED}Stopping all services...${NC}"
  if [ -d ".pids" ]; then
    for pidfile in .pids/*.pid; do
      if [ -f "$pidfile" ]; then
        pid=$(cat "$pidfile")
        kill "$pid" 2>/dev/null || true
        rm "$pidfile"
      fi
    done
  fi
  # Also stop Docker if running
  docker compose down 2>/dev/null || true
  echo -e "${GREEN}All services stopped.${NC}"
}

create_superuser() {
  echo -e "${BLUE}Creating Super Admin...${NC}"
  cd auth-backend
  source venv/bin/activate 2>/dev/null || true
  python manage.py shell -c "
from apps.accounts.models import User
if not User.objects.filter(email='superadmin@referpeople.in').exists():
    u = User.objects.create_superuser('superadmin@referpeople.in', 'SuperAdmin@2024')
    print('Super Admin created: superadmin@referpeople.in')
else:
    print('Super Admin already exists.')
"
  cd ..
}

print_urls() {
  echo ""
  echo -e "${GREEN}======================================================${NC}"
  echo -e "${GREEN}  ReferPeople.in — All Services Running!              ${NC}"
  echo -e "${GREEN}======================================================${NC}"
  echo ""
  echo -e "${BLUE}PUBLIC PAGES:${NC}"
  echo -e "  ${GREEN}Real Estate:${NC}  http://localhost:3000        (referpeople.in/)"
  echo -e "  ${ORANGE}Loans:${NC}        http://localhost:3001        (referpeople.in/loans/)"
  echo -e "  ${PURPLE}Jobs:${NC}         http://localhost:3002        (referpeople.in/jobs/)"
  echo -e "  ${BLUE}Education:${NC}    http://localhost:3003        (referpeople.in/education/)"
  echo ""
  echo -e "${BLUE}ADMIN PANELS:${NC}"
  echo -e "  Master Admin: http://localhost:3004"
  echo ""
  echo -e "${BLUE}APIs (for testing with Postman):${NC}"
  echo -e "  Auth:         http://localhost:8000/api/"
  echo -e "  Real Estate:  http://localhost:8001/api/"
  echo -e "  Loans:        http://localhost:8002/api/"
  echo -e "  Jobs:         http://localhost:8003/api/"
  echo -e "  Education:    http://localhost:8004/api/"
  echo ""
  echo -e "${ORANGE}Default Login: superadmin@referpeople.in / SuperAdmin@2024${NC}"
  echo ""
}

# Create required directories
mkdir -p logs .pids

# Parse command
case "${1:-all}" in
  backends)
    print_banner
    check_env_files
    start_backends
    ;;
  frontends)
    print_banner
    start_frontends
    print_urls
    ;;
  stop)
    stop_all
    ;;
  superuser)
    create_superuser
    ;;
  migrate)
    for entry in "${BACKENDS[@]}"; do
      IFS=: read -r svc port <<< "$entry"
      echo "Migrating $svc..."
      cd "$svc" && source venv/bin/activate && python manage.py migrate && deactivate && cd ..
    done
    ;;
  docker)
    print_banner
    docker compose up -d
    print_urls
    ;;
  all)
    print_banner
    check_env_files
    start_backends
    sleep 3
    start_frontends
    print_urls
    ;;
  *)
    echo "Usage: $0 [backends|frontends|stop|superuser|migrate|docker|all]"
    exit 1
    ;;
esac
