#!/bin/bash

set -e

# Configuration
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Get AWS ECR login token
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Function to build and push backend image
build_push_backend() {
    local service_name=$1
    local context_dir=$2
    local dockerfile=$3
    
    echo "Building and pushing ${service_name}..."
    
    # Build image
    docker build \
        -t ${ECR_REGISTRY}/brd-loancrm/${service_name}:latest \
        -f ${dockerfile} \
        ${context_dir}
    
    # Push image
    docker push ${ECR_REGISTRY}/brd-loancrm/${service_name}:latest
    
    echo "Successfully pushed ${service_name}"
}

# Function to build and push frontend image
build_push_frontend() {
    local service_name=$1
    local context_dir=$2
    
    echo "Building and pushing ${service_name}..."
    
    # Build image
    docker build \
        -t ${ECR_REGISTRY}/brd-loancrm/${service_name}:latest \
        --build-arg VITE_API_URL=https://yourdomain.com/api \
        ${context_dir}
    
    # Push image
    docker push ${ECR_REGISTRY}/brd-loancrm/${service_name}:latest
    
    echo "Successfully pushed ${service_name}"
}

# Build and push all backend services
echo "Building backend services..."

build_push_backend "masteradmin-backend" "BRD_MasterAdmin_Backend_1.1" "BRD_MasterAdmin_Backend_1.1/Dockerfile"
build_push_backend "tenant-backend" "BRD-MergedTenantMaster-Backend" "BRD-MergedTenantMaster-Backend/Dockerfile"
build_push_backend "crm-backend" "BRD_CRM_1.1_BACKEND" "BRD_CRM_1.1_BACKEND/Dockerfile"
build_push_backend "finance-backend" "BRD_FINANCE_DASHBOARD_Backend" "BRD_FINANCE_DASHBOARD_Backend/Dockerfile"
build_push_backend "agents-backend" "BRD-AgentsApp-Backend" "BRD-AgentsApp-Backend/Dockerfile"
build_push_backend "channel-backend" "BRD-ChannelPartnerDashboard-Backend" "BRD-ChannelPartnerDashboard-Backend/Dockerfile"
build_push_backend "fraud-backend" "BRD-FraudTeam-Dashboard-Backend" "BRD-FraudTeam-Dashboard-Backend/Dockerfile"
build_push_backend "legal-backend" "BRD-LegalDashboard-Backend" "BRD-LegalDashboard-Backend/Dockerfile"
build_push_backend "operations-backend" "BRD-OperationVerification-Backend" "BRD-OperationVerification-Backend/Dockerfile"
build_push_backend "salescrm-backend" "BRD-SalesCRM-Dashboard-Backend" "BRD-SalesCRM-Dashboard-Backend/Dockerfile"
build_push_backend "tenantadmin-backend" "BRD-TenantAdmin_backend_2.0" "BRD-TenantAdmin_backend_2.0/Dockerfile"
build_push_backend "valuation-backend" "BRD-Valuation-Dashboard-Backend" "BRD-Valuation-Dashboard-Backend/Dockerfile"

# Build and push all frontend services
echo "Building frontend services..."

build_push_frontend "website-frontend" "BRD-website-main"
build_push_frontend "masteradmin-frontend" "BRD_MasterAdmin_Frontend_1.1"
build_push_frontend "tenant-frontend" "BRD-MergedTenantMaster-Frontend"
build_push_frontend "crm-frontend" "BRD_CRM-1.1"
build_push_frontend "finance-frontend" "BRD_FINANCE_DASHBOARD"
build_push_frontend "salescrm-frontend" "BRD_SALES_CRM"
build_push_frontend "tenantadmin-frontend" "BRD_TenantAdmin_Frontend_1.1"
build_push_frontend "channel-frontend" "BRD-ChannelPartner-Dashboard"
build_push_frontend "fraud-frontend" "BRD-FraudTeamDashboard"
build_push_frontend "legal-frontend" "BRD-LEGAL-dashboard"
build_push_frontend "operations-frontend" "BRD-Operation-Verification-Dashboard"
build_push_frontend "valuation-frontend" "BRD-ValuationDashboard"

echo "All images built and pushed successfully!"
