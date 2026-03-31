#!/bin/bash
# ============================================================
# BRD Loan CRM - Fix Migration Error & Redeploy
# Run this on your EC2 server: bash fix_and_deploy.sh
# ============================================================

set -e
APPDIR="/home/ubuntu/brdapp"
cd "$APPDIR"

echo "============================================"
echo " Step 1: Stop the crashing backend container"
echo "============================================"
docker compose stop masteradmin-backend
docker compose rm -f masteradmin-backend

echo ""
echo "============================================"
echo " Step 2: Pull latest code from GitHub"
echo " (includes the migration fix)"
echo "============================================"
git pull origin main

echo ""
echo "============================================"
echo " Step 3: Clean the partially-applied migration"
echo " from the database (mark 0002 as unapplied)"
echo "============================================"
# We need to use a temporary container with DB access to run this
docker compose run --rm masteradmin-backend python manage.py migrate adminpanel 0001 --no-input || true

echo ""
echo "============================================"
echo " Step 4: Rebuild the backend image"
echo "============================================"
docker compose build masteradmin-backend

echo ""
echo "============================================"
echo " Step 5: Start the backend"
echo " (migrations will run automatically)"
echo "============================================"
docker compose up -d masteradmin-backend

echo ""
echo "============================================"
echo " Step 6: Watch logs to confirm success"
echo "============================================"
echo "Waiting 5 seconds for container to start..."
sleep 5
docker logs loancrm_masteradmin_backend --tail 40

echo ""
echo "============================================"
echo " Step 7: Create superuser (run after backend"
echo " is healthy - not restarting)"
echo "============================================"
echo "Run this AFTER confirming the container is healthy:"
echo ""
echo "  docker compose exec masteradmin-backend python manage.py createsuperuser \\"
echo "    --email admin@brd.com --noinput --username admin"
echo ""
echo "Or with custom password:"
echo "  docker compose exec masteradmin-backend python manage.py shell -c \\"
echo "    \"from django.contrib.auth import get_user_model; U=get_user_model(); U.objects.create_superuser('admin', 'admin@brd.com', 'Admin@1234') if not U.objects.filter(email='admin@brd.com').exists() else print('Already exists')\""
echo ""
echo "Done! Check status with: docker compose ps"
