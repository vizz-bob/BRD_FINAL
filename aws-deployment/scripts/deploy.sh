#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="ap-south-1"
EKS_CLUSTER_NAME="brd-loancrm-cluster"
NAMESPACE="brd-loancrm"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists aws; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists kubectl; then
        print_error "kubectl is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists terraform; then
        print_warning "Terraform is not installed. You'll need it for infrastructure setup."
    fi
    
    print_status "Prerequisites check completed."
}

# Setup AWS credentials
setup_aws_credentials() {
    print_status "Setting up AWS credentials..."
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        print_error "AWS credentials are not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
        exit 1
    fi
    
    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    aws configure set default.region $AWS_REGION
    
    print_status "AWS credentials configured."
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    print_status "Deploying infrastructure with Terraform..."
    
    cd aws-deployment/terraform
    
    if [ ! -f "terraform.tfvars" ]; then
        print_warning "terraform.tfvars not found. Copying from example..."
        cp terraform.tfvars.example terraform.tfvars
        print_warning "Please update terraform.tfvars with your values and run again."
        exit 1
    fi
    
    terraform init
    terraform plan -out=tfplan
    terraform apply tfplan
    
    cd ../..
    
    print_status "Infrastructure deployment completed."
}

# Setup EKS cluster
setup_eks_cluster() {
    print_status "Setting up EKS cluster..."
    
    # Update kubeconfig
    aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $AWS_REGION
    
    # Verify cluster connection
    kubectl cluster-info
    
    print_status "EKS cluster setup completed."
}

# Build and push Docker images
build_and_push_images() {
    print_status "Building and pushing Docker images..."
    
    chmod +x aws-deployment/docker/build-and-push.sh
    ./aws-deployment/docker/build-and-push.sh
    
    print_status "Docker images built and pushed."
}

# Deploy Kubernetes manifests
deploy_kubernetes_manifests() {
    print_status "Deploying Kubernetes manifests..."
    
    # Update k8s manifests with ECR images
    chmod +x aws-deployment/docker/update-k8s-images.sh
    ./aws-deployment/docker/update-k8s-images.sh
    
    # Apply manifests
    kubectl apply -f aws-deployment/k8s/namespace.yaml
    kubectl apply -f aws-deployment/k8s/configmaps.yaml
    kubectl apply -f aws-deployment/k8s/secrets.yaml
    kubectl apply -f aws-deployment/k8s/pvcs.yaml
    kubectl apply -f aws-deployment/k8s/redis.yaml
    kubectl apply -f aws-deployment/k8s/nginx.yaml
    
    # Deploy backends
    chmod +x aws-deployment/k8s/deploy-all-backends.sh
    ./aws-deployment/k8s/deploy-all-backends.sh
    
    # Deploy frontends
    kubectl apply -f aws-deployment/k8s/frontends/
    
    # Apply ingress
    kubectl apply -f aws-deployment/k8s/ingress.yaml
    
    print_status "Kubernetes manifests deployed."
}

# Setup databases
setup_databases() {
    print_status "Setting up databases..."
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=masteradmin-backend -n $NAMESPACE --timeout=300s
    
    # Run migrations
    kubectl exec -n $NAMESPACE deployment/masteradmin-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/tenant-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/crm-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/finance-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/agents-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/channel-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/fraud-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/legal-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/operations-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/salescrm-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/tenantadmin-backend -- python manage.py migrate
    kubectl exec -n $NAMESPACE deployment/valuation-backend -- python manage.py migrate
    
    # Create superuser (optional)
    # kubectl exec -n $NAMESPACE deployment/masteradmin-backend -- python manage.py createsuperuser
    
    print_status "Database setup completed."
}

# Collect static files
collect_static_files() {
    print_status "Collecting static files..."
    
    kubectl exec -n $NAMESPACE deployment/masteradmin-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/tenant-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/crm-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/finance-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/agents-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/channel-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/fraud-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/legal-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/operations-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/salescrm-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/tenantadmin-backend -- python manage.py collectstatic --noinput
    kubectl exec -n $NAMESPACE deployment/valuation-backend -- python manage.py collectstatic --noinput
    
    print_status "Static files collected."
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check pods
    kubectl get pods -n $NAMESPACE
    
    # Check services
    kubectl get services -n $NAMESPACE
    
    # Check ingress
    kubectl get ingress -n $NAMESPACE
    
    # Wait for all deployments to be ready
    kubectl wait --for=condition=available --timeout=600s deployment --all -n $NAMESPACE
    
    print_status "Deployment verification completed."
}

# Main deployment function
main() {
    print_status "Starting BRD LoanCRM AWS deployment..."
    
    check_prerequisites
    setup_aws_credentials
    
    if [ "$1" = "infra" ]; then
        deploy_infrastructure
        setup_eks_cluster
    fi
    
    build_and_push_images
    deploy_kubernetes_manifests
    setup_databases
    collect_static_files
    verify_deployment
    
    print_status "Deployment completed successfully!"
    print_status "Your application is now running on AWS EKS."
    print_status "Access your application at: https://yourdomain.com"
}

# Usage information
usage() {
    echo "Usage: $0 [infra]"
    echo ""
    echo "Options:"
    echo "  infra    Deploy infrastructure first (VPC, EKS, RDS, etc.)"
    echo ""
    echo "Environment variables required:"
    echo "  AWS_ACCESS_KEY_ID"
    echo "  AWS_SECRET_ACCESS_KEY"
    echo ""
    echo "Example:"
    echo "  AWS_ACCESS_KEY_ID=AKIA... AWS_SECRET_ACCESS_KEY=... $0 infra"
}

# Check if help is requested
if [ "$1" = "help" ] || [ "$1" = "-h" ]; then
    usage
    exit 0
fi

# Run main function
main "$@"
