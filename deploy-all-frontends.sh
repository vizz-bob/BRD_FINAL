#!/bin/bash
# deploy-all-frontends.sh

set -e

declare -A FRONTENDS=(
  ["crm"]="/apps/loancrm/BRD_CRM-1.1:loancrm_crm_frontend"
  ["finance"]="/apps/loancrm/BRD_FINANCE_DASHBOARD:loancrm_finance_frontend"
  ["tenant"]="/apps/loancrm/BRD_TenantAdmin_Frontend_1.1:loancrm_tenant_frontend"
  ["sales"]="/apps/loancrm/BRD_SALES_CRM:loancrm_salescrm_frontend"
)

for BASE in "${!FRONTENDS[@]}"; do
  IFS=':' read -r LOCAL_DIR CONTAINER <<< "${FRONTENDS[$BASE]}"

  echo "==============================="
  echo "Deploying $BASE frontend..."
  echo "Local dir: $LOCAL_DIR"
  echo "Container: $CONTAINER"
  echo "Base path: /$BASE/"

  cd "$LOCAL_DIR"

  echo "Installing npm packages..."
  npm install

  echo "Building frontend..."
  npx vite build --base "/$BASE/"

  echo "Copying build to container..."
  sudo docker cp dist/. "$CONTAINER:/usr/share/nginx/html/$BASE/"

  echo "Reloading Nginx in container..."
  sudo docker exec "$CONTAINER" nginx -s reload

  echo "$BASE frontend deployed successfully!"
done

echo "==============================="
echo "All frontends deployed!"
