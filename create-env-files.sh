#!/bin/bash
# ============================================================
# ReferPeople.in — Create all backend .env files
# Edit the 5 variables below, then run: bash create-env-files.sh
# ============================================================

DB_HOST="referpeople-db.cju28y6c0s6d.ap-south-1.rds.amazonaws.com"
DB_PORT="5432"
DB_USER="referpeopleadmin"
DB_PASSWORD="CHANGE_ME"          # ← put your RDS master password here
SERVER_IP="CHANGE_ME"            # ← put your EC2 Elastic IP here
SECRET_KEY="django-insecure-referpeople-$(openssl rand -hex 24)"
DJANGO_ENV="production"

echo "Creating .env files for all backends..."

# ── 1. Master Admin Backend ─────────────────────────────────
cat > BRD_MasterAdmin_Backend_1.1/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=masteradmin_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD_MasterAdmin_Backend_1.1/.env"

# ── 2. Merged Tenant Master Backend ────────────────────────
cat > BRD-MergedTenantMaster-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=tenant_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-MergedTenantMaster-Backend/.env"

# ── 3. CRM Backend ─────────────────────────────────────────
cat > BRD_CRM_1.1_BACKEND/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=crm_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD_CRM_1.1_BACKEND/.env"

# ── 4. Finance Dashboard Backend ───────────────────────────
cat > BRD_FINANCE_DASHBOARD_Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=finance_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD_FINANCE_DASHBOARD_Backend/.env"

# ── 5. Agents App Backend ───────────────────────────────────
cat > BRD-AgentsApp-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=agents_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-AgentsApp-Backend/.env"

# ── 6. Channel Partner Dashboard Backend ───────────────────
cat > BRD-ChannelPartnerDashboard-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=channel_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-ChannelPartnerDashboard-Backend/.env"

# ── 7. Fraud Team Dashboard Backend ────────────────────────
cat > BRD-FraudTeam-Dashboard-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=fraud_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-FraudTeam-Dashboard-Backend/.env"

# ── 8. Legal Dashboard Backend ─────────────────────────────
cat > BRD-LegalDashboard-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=legal_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-LegalDashboard-Backend/.env"

# ── 9. Operation Verification Backend ──────────────────────
cat > BRD-OperationVerification-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=operations_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-OperationVerification-Backend/.env"

# ── 10. Sales CRM Dashboard Backend ────────────────────────
cat > BRD-SalesCRM-Dashboard-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=salescrm_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-SalesCRM-Dashboard-Backend/.env"

# ── 11. Tenant Admin Backend 2.0 ───────────────────────────
cat > BRD-TenantAdmin_backend_2.0/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=tenantadmin_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-TenantAdmin_backend_2.0/.env"

# ── 12. Valuation Dashboard Backend ────────────────────────
cat > BRD-Valuation-Dashboard-Backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=valuation_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-Valuation-Dashboard-Backend/.env"

# ── 13. Website Main Backend ────────────────────────────────
cat > BRD-website-main-backend/.env << EOF
DEBUG=False
DJANGO_ENV=${DJANGO_ENV}
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${SERVER_IP},referpeople.in,www.referpeople.in,localhost

DB_NAME=masteradmin_db
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}

CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in,http://${SERVER_IP}

AWS_ACCESS_KEY_ID=CHANGE_ME
AWS_SECRET_ACCESS_KEY=CHANGE_ME
AWS_STORAGE_BUCKET_NAME=referpeople-media
AWS_S3_REGION_NAME=ap-south-1
EOF
echo "✅ BRD-website-main-backend/.env"

echo ""
echo "=============================================="
echo "✅ All 13 .env files created!"
echo "⚠️  Remember to add your AWS keys if using S3"
echo "=============================================="
