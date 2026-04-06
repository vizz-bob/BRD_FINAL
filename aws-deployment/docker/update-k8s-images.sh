#!/bin/bash

set -e

# Configuration
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Function to update image in deployment file
update_image() {
    local service_name=$1
    local deployment_file=$2
    
    echo "Updating image for ${service_name} in ${deployment_file}..."
    
    # Replace placeholder with actual ECR image
    sed -i.bak "s|<account-id>.dkr.ecr.ap-south-1.amazonaws.com/brd-loancrm/${service_name}:latest|${ECR_REGISTRY}/brd-loancrm/${service_name}:latest|g" ${deployment_file}
    
    echo "Updated ${service_name} image"
}

# Update backend deployment files
echo "Updating backend deployment files..."

update_image "masteradmin-backend" "k8s/backends/masteradmin-backend.yaml"
update_image "tenant-backend" "k8s/backends/tenant-backend.yaml"
update_image "crm-backend" "k8s/backends/crm-backend.yaml"
update_image "finance-backend" "k8s/backends/finance-backend.yaml"
update_image "agents-backend" "k8s/backends/agents-backend.yaml"
update_image "channel-backend" "k8s/backends/channel-backend.yaml"
update_image "fraud-backend" "k8s/backends/fraud-backend.yaml"
update_image "legal-backend" "k8s/backends/legal-backend.yaml"
update_image "operations-backend" "k8s/backends/operations-backend.yaml"
update_image "salescrm-backend" "k8s/backends/salescrm-backend.yaml"
update_image "tenantadmin-backend" "k8s/backends/tenantadmin-backend.yaml"
update_image "valuation-backend" "k8s/backends/valuation-backend.yaml"

# Update frontend deployment files
echo "Updating frontend deployment files..."

update_image "website-frontend" "k8s/frontends/website-frontend.yaml"
update_image "masteradmin-frontend" "k8s/frontends/masteradmin-frontend.yaml"
update_image "tenant-frontend" "k8s/frontends/tenant-frontend.yaml"
update_image "crm-frontend" "k8s/frontends/crm-frontend.yaml"
update_image "finance-frontend" "k8s/frontends/finance-frontend.yaml"
update_image "salescrm-frontend" "k8s/frontends/salescrm-frontend.yaml"
update_image "tenantadmin-frontend" "k8s/frontends/tenantadmin-frontend.yaml"
update_image "channel-frontend" "k8s/frontends/channel-frontend.yaml"
update_image "fraud-frontend" "k8s/frontends/fraud-frontend.yaml"
update_image "legal-frontend" "k8s/frontends/legal-frontend.yaml"
update_image "operations-frontend" "k8s/frontends/operations-frontend.yaml"
update_image "valuation-frontend" "k8s/frontends/valuation-frontend.yaml"

echo "All deployment files updated successfully!"
