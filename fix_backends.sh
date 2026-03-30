#!/bin/bash
# ============================================================
#  fix_backends.sh — Run this on EC2 after git pull
#  Fixes: agents (numpy/opencv), crm (import_export encoding),
#         tenant/tenantadmin (duplicate requirements),
#         legal (missing requirements + hardcoded DB)
# ============================================================
set -e
cd ~/brdapp

echo "=========================================="
echo " Step 1: Rebuild only the 5 failing backends"
echo "=========================================="

docker compose build --no-cache \
  agents-backend \
  crm-backend \
  tenant-backend \
  tenantadmin-backend \
  legal-backend

echo "=========================================="
echo " Step 2: Restart the rebuilt containers"
echo "=========================================="

docker compose up -d \
  agents-backend \
  crm-backend \
  tenant-backend \
  tenantadmin-backend \
  legal-backend

echo "Waiting 30s for containers to start..."
sleep 30

echo "=========================================="
echo " Step 3: Status check"
echo "=========================================="

docker compose ps --format "table {{.Name}}\t{{.Status}}"

echo ""
echo "=========================================="
echo " Step 4: Check logs for any remaining errors"
echo "=========================================="

for backend in agents crm tenant tenantadmin legal; do
  echo ""
  echo "=== ${backend}_backend ==="
  docker logs loancrm_${backend}_backend --tail 5 2>&1
  echo "---"
done
