#!/bin/bash
# =============================================================================
# BRD Loan CRM Platform — Environment Setup Script
# Run this on EC2 ONCE after git pull, before docker compose up
# Usage: chmod +x setup_env.sh && ./setup_env.sh
# =============================================================================

set -e

EC2_IP="13.232.219.91"
DB_HOST="stagging-db.cxa6qyk0oyb9.ap-south-1.rds.amazonaws.com"
DB_NAME="loancrm"
DB_USER="brdapp"
DB_PASSWORD="Brd12345!"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   BRD Loan CRM — Environment Setup                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Helper: create backend .env ──────────────────────────────────────────────
create_backend_env() {
  local DIR=$1
  local BACKEND_PORT=$2
  local FRONTEND_PORT=$3

  cat > "$DIR/.env" << EOF
DEBUG=False
SECRET_KEY=brd-$(openssl rand -hex 24)-secret-key
ALLOWED_HOSTS=${EC2_IP},localhost,127.0.0.1,0.0.0.0

# PostgreSQL RDS
DB_ENGINE=django.db.backends.postgresql
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=5432
DB_SSLMODE=require

# Redis
REDIS_URL=redis://loancrm_redis:6379/0
CELERY_BROKER_URL=redis://loancrm_redis:6379/0
CELERY_RESULT_BACKEND=redis://loancrm_redis:6379/1

# CORS
CORS_ALLOWED_ORIGINS=http://${EC2_IP},http://localhost,http://localhost:${FRONTEND_PORT},http://localhost:${BACKEND_PORT}
CORS_ALLOW_ALL_ORIGINS=False

# JWT
JWT_SECRET_KEY=brd-jwt-$(openssl rand -hex 24)
ACCESS_TOKEN_LIFETIME=60
REFRESH_TOKEN_LIFETIME=1440

# Superuser (used by entrypoint if createsuperuser is called)
DJANGO_SUPERUSER_EMAIL=Admin@brd.com
DJANGO_SUPERUSER_PASSWORD=Admin@1234
DJANGO_SUPERUSER_USERNAME=admin
EOF
  echo "  ✅ $DIR/.env"
}

# ── Helper: create frontend .env ─────────────────────────────────────────────
create_frontend_env() {
  local DIR=$1
  local API_PATH=$2
  local BASE_PATH=$3

  cat > "$DIR/.env" << EOF
VITE_API_BASE_URL=http://${EC2_IP}
VITE_API_URL=http://${EC2_IP}/${API_PATH}
VITE_BASE_PATH=/${BASE_PATH}/
EOF
  echo "  ✅ $DIR/.env"
}

# ── Backend .env files ────────────────────────────────────────────────────────
echo "📦 Creating backend .env files..."
create_backend_env "BRD_MasterAdmin_Backend_1.1"          8001 3001
create_backend_env "BRD-MergedTenantMaster-Backend"       8002 3002
create_backend_env "BRD_CRM_1.1_BACKEND"                  8003 3003
create_backend_env "BRD_FINANCE_DASHBOARD_Backend"         8004 3004
create_backend_env "BRD-AgentsApp-Backend"                 8005 3005
create_backend_env "BRD-ChannelPartnerDashboard-Backend"   8006 3007
create_backend_env "BRD-FraudTeam-Dashboard-Backend"       8007 3008
create_backend_env "BRD-LegalDashboard-Backend"            8008 3009
create_backend_env "BRD-OperationVerification-Backend"     8009 3010
create_backend_env "BRD-SalesCRM-Dashboard-Backend"        8010 3005
create_backend_env "BRD-TenantAdmin_backend_2.0"           8011 3006
create_backend_env "BRD-Valuation-Dashboard-Backend"       8012 3011
create_backend_env "BRD-website-main-backend"              8013 3000

# ── Tenant backend needs extra JWT vars ──────────────────────────────────────
cat >> "BRD-MergedTenantMaster-Backend/.env" << EOF

# Tenant-specific
TENANT_API_URL=http://${EC2_IP}/tenant/api
EOF

# ── Frontend .env files ──────────────────────────────────────────────────────
echo ""
echo "🎨 Creating frontend .env files..."
create_frontend_env "BRD-website-main"                     "api"              ""
create_frontend_env "BRD_MasterAdmin_Frontend_1.1"         "api/master-admin" "master-admin"
create_frontend_env "BRD-MergedTenantMaster-Frontend"      "api/tenant"       "tenant"
create_frontend_env "BRD_CRM-1.1"                          "api/crm"          "crm"
create_frontend_env "BRD_FINANCE_DASHBOARD"                "api/finance"      "finance"
create_frontend_env "BRD_SALES_CRM"                        "api/sales-crm"    "sales-crm"
create_frontend_env "BRD_TenantAdmin_Frontend_1.1"         "api/tenant-admin" "tenant-admin"
create_frontend_env "BRD-ChannelPartner-Dashboard"         "api/channel"      "channel"
create_frontend_env "BRD-FraudTeamDashboard"               "api/fraud"        "fraud"
create_frontend_env "BRD-LEGAL-dashboard"                  "api/legal"        "legal"
create_frontend_env "BRD-Operation-Verification-Dashboard" "api/operations"   "operations"
create_frontend_env "BRD-ValuationDashboard"               "api/valuation"    "valuation"

# Tenant frontend also needs the tenant/api URL
cat >> "BRD-MergedTenantMaster-Frontend/.env" << EOF
VITE_TENANT_API_URL=http://${EC2_IP}/tenant/api
EOF

echo ""
echo "✅ All .env files created successfully!"
echo ""
echo "Next step: Run the DB setup, then start containers:"
echo "  psql -h ${DB_HOST} -U postgres -d postgres -f init_db.sql"
echo "  docker compose up -d --build"
echo ""
