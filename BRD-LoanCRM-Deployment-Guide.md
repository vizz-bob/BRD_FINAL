# BRD LoanCRM - Complete AWS Deployment Guide

**Version: 1.0**  
**Last Updated: April 2026**  
**Project: Microservices-based Loan CRM System**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Architecture Overview](#architecture-overview)
4. [Environment Setup](#environment-setup)
5. [Infrastructure Deployment](#infrastructure-deployment)
6. [Application Deployment](#application-deployment)
7. [Database Setup](#database-setup)
8. [Monitoring Setup](#monitoring-setup)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Management Commands](#management-commands)
11. [Troubleshooting](#troubleshooting)
12. [All Required Files](#all-required-files)

---

## 🎯 Project Overview

### **System Components**
- **24 Microservices**: 12 Django backends + 12 React frontends
- **Backend Services**: MasterAdmin, Tenant, CRM, Finance, Agents, Channel, Fraud, Legal, Operations, SalesCRM, TenantAdmin, Valuation
- **Frontend Applications**: Corresponding React/Vue applications for each backend
- **Infrastructure**: AWS EKS, RDS PostgreSQL, ElastiCache Redis, S3, Application Load Balancer

### **Technology Stack**
- **Backend**: Django 4.x, Python 3.11, PostgreSQL 15
- **Frontend**: React/Vue.js, Node.js 18
- **Containerization**: Docker, Kubernetes
- **Cloud**: AWS (EKS, RDS, ElastiCache, S3, ALB)
- **Monitoring**: Prometheus, Grafana, CloudWatch
- **CI/CD**: GitHub Actions

---

## 📋 Prerequisites

### **Required Tools**
```bash
# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Terraform (optional but recommended)
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Git (should be installed)
sudo apt-get update
sudo apt-get install git -y
```

### **AWS Requirements**
- AWS account with appropriate permissions
- IAM user with:
  - EKS full access
  - RDS full access
  - EC2 full access
  - S3 full access
  - ECR full access
  - ElastiCache full access
  - IAM full access
  - CloudWatch full access

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   Route53       │    │        CloudWatch              │ │
│  │   (DNS)         │    │     (Monitoring)               │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   ALB/ELB       │    │        EKS Cluster             │ │
│  │  (Load Balancer)│    │   (Kubernetes)                 │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                  │                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    EKS Pods                             │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐  │ │
│  │  │   Nginx      │ │   Redis     │ │   Backends       │  │ │
│  │  │ (Frontend)   │ │  (Cache)    │ │ (12 Services)    │  │ │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │              Frontends                              │  │ │
│  │  │            (12 Applications)                        │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │     RDS         │    │         ElastiCache              │ │
│  │  (PostgreSQL)   │    │         (Redis)                  │ │
│  │  (12 Databases) │    │                                 │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  S3 Storage                            │ │
│  │              (Media Files)                             │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Environment Setup

### **1. Configure AWS Credentials**

```bash
# Method 1: AWS CLI configure
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region: ap-south-1
# Enter default output format: json

# Method 2: Environment variables
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="ap-south-1"

# Verify configuration
aws sts get-caller-identity
```

### **2. Clone Repository**

```bash
# Clone the repository
git clone https://github.com/yourusername/brd-loancrm.git
cd brd-loancrm

# Or if deploying from local files
cp -r /path/to/BRD_FINAL /opt/brd-loancrm
cd /opt/brd-loancrm
```

### **3. Set Environment Variables**

Create `.env` file:

```bash
# Database Configuration
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432
DB_MASTER_USER=loancrm_admin
DB_MASTER_PASSWORD=YourStrongPassword123!

# Individual Database Configurations
WEBSITE_DB_NAME=website_db
WEBSITE_DB_USER=website_user
WEBSITE_DB_PASSWORD=WebsitePass123!

MASTERADMIN_DB_NAME=masteradmin_db
MASTERADMIN_DB_USER=masteradmin_user
MASTERADMIN_DB_PASSWORD=MasterAdminPass123!

TENANT_DB_NAME=tenant_db
TENANT_DB_USER=tenant_user
TENANT_DB_PASSWORD=TenantPass123!

CRM_DB_NAME=crm_db
CRM_DB_USER=crm_user
CRM_DB_PASSWORD=CrmPass123!

FINANCE_DB_NAME=finance_db
FINANCE_DB_USER=finance_user
FINANCE_DB_PASSWORD=FinancePass123!

AGENTS_DB_NAME=agents_db
AGENTS_DB_USER=agents_user
AGENTS_DB_PASSWORD=AgentsPass123!

CHANNEL_DB_NAME=channel_db
CHANNEL_DB_USER=channel_user
CHANNEL_DB_PASSWORD=ChannelPass123!

FRAUD_DB_NAME=fraud_db
FRAUD_DB_USER=fraud_user
FRAUD_DB_PASSWORD=FraudPass123!

LEGAL_DB_NAME=legal_db
LEGAL_DB_USER=legal_user
LEGAL_DB_PASSWORD=LegalPass123!

OPERATIONS_DB_NAME=operations_db
OPERATIONS_DB_USER=operations_user
OPERATIONS_DB_PASSWORD=OperationsPass123!

SALESCRM_DB_NAME=salescrm_db
SALESCRM_DB_USER=salescrm_user
SALESCRM_DB_PASSWORD=SalesCrmPass123!

TENANTADMIN_DB_NAME=tenantadmin_db
TENANTADMIN_DB_USER=tenantadmin_user
TENANTADMIN_DB_PASSWORD=TenantAdminPass123!

VALUATION_DB_NAME=valuation_db
VALUATION_DB_USER=valuation_user
VALUATION_DB_PASSWORD=ValuationPass123!

# Django Configuration
DJANGO_SECRET_KEY=your-50-character-random-secret-key-change-this-now
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,localhost,127.0.0.1

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=brd-loancrm-media-production
AWS_REGION=ap-south-1

# Redis Configuration
REDIS_URL=redis://brd-loancrm-redis:6379/0
CELERY_BROKER_URL=redis://brd-loancrm-redis:6379/1

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-minimum-32-characters-long
```

---

## 🏗️ Infrastructure Deployment

### **Option 1: Using Terraform (Recommended)**

```bash
cd aws-deployment/terraform

# Copy and edit configuration
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars
nano terraform.tfvars
```

**Update these values:**
```hcl
aws_region = "ap-south-1"
environment = "production"
project_name = "BRD-LoanCRM"

# Networking
vpc_cidr = "10.0.0.0/16"
azs = ["ap-south-1a", "ap-south-1b"]
public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets = ["10.0.11.0/24", "10.0.12.0/24"]

# EKS Cluster
cluster_name = "brd-loancrm-cluster"
cluster_version = "1.28"
instance_types = ["t3.medium", "t3.large"]
min_nodes = 2
max_nodes = 5
desired_nodes = 3

# RDS Database
db_instance_class = "db.t3.medium"
db_allocated_storage = 100
db_max_allocated_storage = 1000
db_username = "loancrm_admin"
db_password = "YourStrongPassword123!"

# Redis
redis_node_type = "cache.t3.micro"

# S3
s3_bucket_name = "brd-loancrm-media-production"

# Domain
domain_name = "yourdomain.com"
certificate_arn = ""  # Leave empty if no SSL cert yet
```

```bash
# Initialize and apply
terraform init
terraform plan
terraform apply

# Wait for infrastructure to be created (5-10 minutes)
```

### **Option 2: Manual Infrastructure Setup**

Follow the detailed steps in `aws-deployment/01-infrastructure-setup.md`

---

## 🚀 Application Deployment

### **1. Setup EKS Cluster Connection**

```bash
# Update kubeconfig
aws eks update-kubeconfig --name brd-loancrm-cluster --region ap-south-1

# Verify connection
kubectl cluster-info
```

### **2. Build and Push Docker Images**

```bash
# Make build script executable
chmod +x aws-deployment/docker/build-and-push.sh

# Build and push all images
./aws-deployment/docker/build-and-push.sh

# Update Kubernetes manifests with ECR images
chmod +x aws-deployment/docker/update-k8s-images.sh
./aws-deployment/docker/update-k8s-images.sh
```

### **3. Deploy Core Services**

```bash
# Apply namespace
kubectl apply -f aws-deployment/k8s/namespace.yaml

# Apply configurations
kubectl apply -f aws-deployment/k8s/configmaps.yaml

# Apply secrets (update with your values first)
kubectl apply -f aws-deployment/k8s/secrets.yaml

# Apply persistent volumes
kubectl apply -f aws-deployment/k8s/pvcs.yaml

# Deploy Redis
kubectl apply -f aws-deployment/k8s/redis.yaml

# Deploy Nginx
kubectl apply -f aws-deployment/k8s/nginx.yaml
```

### **4. Deploy Backend Services**

```bash
# Deploy all backends
chmod +x aws-deployment/k8s/deploy-all-backends.sh
./aws-deployment/k8s/deploy-all-backends.sh

# Wait for pods to be ready
kubectl wait --for=condition=available --timeout=600s deployment --all -n brd-loancrm
```

### **5. Deploy Frontend Applications**

```bash
# Deploy all frontends
kubectl apply -f aws-deployment/k8s/frontends/

# Wait for frontend pods
kubectl wait --for=condition=available --timeout=300s deployment --all -n brd-loancrm
```

### **6. Deploy Monitoring**

```bash
# Deploy Prometheus
kubectl apply -f aws-deployment/monitoring/prometheus.yaml

# Deploy Grafana
kubectl apply -f aws-deployment/monitoring/grafana.yaml

# Wait for monitoring pods
kubectl wait --for=condition=available --timeout=300s deployment --all -n monitoring
```

### **7. Setup Load Balancer**

```bash
# Apply ingress (update with your domain first)
kubectl apply -f aws-deployment/k8s/ingress.yaml

# Get Load Balancer URL
kubectl get ingress -n brd-loancrm
```

---

## 🗄️ Database Setup

### **1. Create Databases**

```bash
# Get RDS endpoint
aws rds describe-db-instances --db-instance-identifier brd-loancrm-db

# Connect to RDS
psql -h your-rds-endpoint.ap-south-1.rds.amazonaws.com -U loancrm_admin -d postgres

# Create databases
CREATE DATABASE website_db;
CREATE DATABASE masteradmin_db;
CREATE DATABASE tenant_db;
CREATE DATABASE crm_db;
CREATE DATABASE finance_db;
CREATE DATABASE agents_db;
CREATE DATABASE channel_db;
CREATE DATABASE fraud_db;
CREATE DATABASE legal_db;
CREATE DATABASE operations_db;
CREATE DATABASE salescrm_db;
CREATE DATABASE tenantadmin_db;
CREATE DATABASE valuation_db;

# Create users
CREATE USER website_user WITH PASSWORD 'WebsitePass123!';
CREATE USER masteradmin_user WITH PASSWORD 'MasterAdminPass123!';
CREATE USER tenant_user WITH PASSWORD 'TenantPass123!';
CREATE USER crm_user WITH PASSWORD 'CrmPass123!';
CREATE USER finance_user WITH PASSWORD 'FinancePass123!';
CREATE USER agents_user WITH PASSWORD 'AgentsPass123!';
CREATE USER channel_user WITH PASSWORD 'ChannelPass123!';
CREATE USER fraud_user WITH PASSWORD 'FraudPass123!';
CREATE USER legal_user WITH PASSWORD 'LegalPass123!';
CREATE USER operations_user WITH PASSWORD 'OperationsPass123!';
CREATE USER salescrm_user WITH PASSWORD 'SalesCrmPass123!';
CREATE USER tenantadmin_user WITH PASSWORD 'TenantAdminPass123!';
CREATE USER valuation_user WITH PASSWORD 'ValuationPass123!';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE website_db TO website_user;
GRANT ALL PRIVILEGES ON DATABASE masteradmin_db TO masteradmin_user;
GRANT ALL PRIVILEGES ON DATABASE tenant_db TO tenant_user;
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
GRANT ALL PRIVILEGES ON DATABASE finance_db TO finance_user;
GRANT ALL PRIVILEGES ON DATABASE agents_db TO agents_user;
GRANT ALL PRIVILEGES ON DATABASE channel_db TO channel_user;
GRANT ALL PRIVILEGES ON DATABASE fraud_db TO fraud_user;
GRANT ALL PRIVILEGES ON DATABASE legal_db TO legal_user;
GRANT ALL PRIVILEGES ON DATABASE operations_db TO operations_user;
GRANT ALL PRIVILEGES ON DATABASE salescrm_db TO salescrm_user;
GRANT ALL PRIVILEGES ON DATABASE tenantadmin_db TO tenantadmin_user;
GRANT ALL PRIVILEGES ON DATABASE valuation_db TO valuation_user;
```

### **2. Run Database Migrations**

```bash
# Wait for backend pods to be ready
kubectl wait --for=condition=ready pod -l app=masteradmin-backend -n brd-loancrm --timeout=300s

# Run migrations for each backend
kubectl exec -n brd-loancrm deployment/masteradmin-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/tenant-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/crm-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/finance-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/agents-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/channel-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/fraud-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/legal-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/operations-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/salescrm-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/tenantadmin-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/valuation-backend -- python manage.py migrate
```

### **3. Create Superuser**

```bash
# Create Django superuser for MasterAdmin
kubectl exec -n brd-loancrm deployment/masteradmin-backend -- python manage.py createsuperuser
```

### **4. Collect Static Files**

```bash
# Collect static files for each backend
kubectl exec -n brd-loancrm deployment/masteradmin-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/tenant-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/crm-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/finance-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/agents-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/channel-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/fraud-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/legal-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/operations-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/salescrm-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/tenantadmin-backend -- python manage.py collectstatic --noinput
kubectl exec -n brd-loancrm deployment/valuation-backend -- python manage.py collectstatic --noinput
```

---

## 📊 Monitoring Setup

### **1. Access Grafana Dashboard**

```bash
# Port forward Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000

# Open http://localhost:3000
# Username: admin
# Password: admin123
```

### **2. Access Prometheus**

```bash
# Port forward Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090

# Open http://localhost:9090
```

### **3. Configure Grafana Dashboards**

1. Login to Grafana (admin/admin123)
2. Add Prometheus data source
3. Import pre-configured dashboards
4. Set up alerts and notifications

---

## 🔄 CI/CD Pipeline

### **1. GitHub Actions Setup**

#### **Required GitHub Secrets:**
```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_ACCOUNT_ID=your-12-digit-account-id
```

#### **Workflow File Location:**
`.github/workflows/aws-deploy.yml`

#### **Workflow Triggers:**
- Push to main branch → Full deployment
- Pull request → Build and test only

### **2. Manual Deployment Script**

```bash
# Use the comprehensive deployment script
chmod +x aws-deployment/scripts/deploy.sh
./aws-deployment/scripts/deploy.sh infra
```

### **3. Update Application**

```bash
# Make changes to code
git add .
git commit -m "Update application"
git push origin main

# GitHub Actions will automatically deploy
```

---

## 🔧 Management Commands

### **Check Deployment Status**
```bash
# Check all pods
kubectl get pods -n brd-loancrm

# Check services
kubectl get services -n brd-loancrm

# Check ingress
kubectl get ingress -n brd-loancrm

# Check persistent volumes
kubectl get pvc -n brd-loancrm
```

### **Scale Services**
```bash
# Scale specific service
kubectl scale deployment/masteradmin-backend --replicas=3 -n brd-loancrm

# Scale all backends
kubectl scale deployment --all --replicas=2 -n brd-loancrm
```

### **View Logs**
```bash
# View specific service logs
kubectl logs -f deployment/masteradmin-backend -n brd-loancrm

# View all logs
kubectl logs -f --all-containers=true -n brd-loancrm

# View previous logs
kubectl logs -p deployment/masteradmin-backend -n brd-loancrm
```

### **Access Pods**
```bash
# Access pod shell
kubectl exec -it <pod-name> -n brd-loancrm -- /bin/bash

# Example
kubectl exec -it deployment/masteradmin-backend -n brd-loancrm -- /bin/bash
```

### **Update Deployment**
```bash
# Build and push new images
./aws-deployment/docker/build-and-push.sh

# Update specific deployment
kubectl rollout restart deployment/masteradmin-backend -n brd-loancrm

# Update all deployments
kubectl rollout restart deployment --all -n brd-loancrm
```

### **Rollback Deployment**
```bash
# Rollback to previous revision
kubectl rollout undo deployment/masteradmin-backend -n brd-loancrm

# Check rollout status
kubectl rollout status deployment/masteradmin-backend -n brd-loancrm

# View rollout history
kubectl rollout history deployment/masteradmin-backend -n brd-loancrm
```

---

## 🚨 Troubleshooting

### **Common Issues and Solutions**

#### **1. Pod Not Starting**
```bash
# Check pod status
kubectl describe pod <pod-name> -n brd-loancrm

# Check pod logs
kubectl logs <pod-name> -n brd-loancrm

# Common issues:
# - Image pull failure: Check ECR permissions
# - Resource limits: Check requests/limits
# - Secret issues: Verify secrets are correctly configured
```

#### **2. Database Connection Issues**
```bash
# Check secrets
kubectl get secrets -n brd-loancrm
kubectl describe secret brd-loancrm-secrets -n brd-loancrm

# Test database connection
kubectl exec -it <backend-pod> -n brd-loancrm -- python manage.py dbshell

# Common issues:
# - Wrong database endpoint
# - Incorrect credentials
# - Security group blocking connections
```

#### **3. Load Balancer Issues**
```bash
# Check ingress status
kubectl get ingress -n brd-loancrm
kubectl describe ingress brd-loancrm-ingress -n brd-loancrm

# Check ALB in AWS Console
# Common issues:
# - Target group health checks failing
# - Security group blocking traffic
# - SSL certificate issues
```

#### **4. Image Pull Issues**
```bash
# Check ECR login
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com

# Check image exists
aws ecr describe-images --repository-name brd-loancrm/masteradmin-backend

# Common issues:
# - ECR permissions
# - Image not found
# - Region mismatch
```

#### **5. High Resource Usage**
```bash
# Check resource usage
kubectl top pods -n brd-loancrm
kubectl top nodes

# Check resource limits
kubectl describe pod <pod-name> -n brd-loancrm

# Solutions:
# - Increase resource limits
# - Add more nodes
# - Optimize application
```

### **Useful Debugging Commands**
```bash
# Port forward for local debugging
kubectl port-forward -n brd-loancrm svc/masteradmin-backend 8000:8000

# Execute commands in pod
kubectl exec -n brd-loancrm deployment/masteradmin-backend -- python manage.py check

# Check events
kubectl get events -n brd-loancrm --sort-by='.lastTimestamp'

# Check node status
kubectl describe nodes
```

---

## 📁 All Required Files

### **1. Infrastructure Files**

#### **Terraform Configuration**
```
aws-deployment/terraform/
├── main.tf                    # Main Terraform configuration
├── variables.tf              # Variable definitions
├── terraform.tfvars.example  # Example variables
└── terraform.tfvars          # Your actual variables
```

#### **Manual Infrastructure Setup**
```
aws-deployment/01-infrastructure-setup.md    # Manual setup instructions
```

### **2. Kubernetes Manifests**

#### **Core Configuration**
```
aws-deployment/k8s/
├── namespace.yaml            # Namespace definition
├── configmaps.yaml           # Application configuration
├── secrets.yaml              # Secrets (update with your values)
├── pvcs.yaml                 # Persistent volume claims
├── redis.yaml                # Redis deployment
├── nginx.yaml                # Nginx reverse proxy
└── ingress.yaml              # Load balancer ingress
```

#### **Backend Deployments**
```
aws-deployment/k8s/backends/
├── masteradmin-backend.yaml   # MasterAdmin backend
├── tenant-backend.yaml        # Tenant backend
├── crm-backend.yaml          # CRM backend
├── finance-backend.yaml       # Finance backend
├── agents-backend.yaml       # Agents backend
├── channel-backend.yaml      # Channel backend
├── fraud-backend.yaml        # Fraud backend
├── legal-backend.yaml        # Legal backend
├── operations-backend.yaml    # Operations backend
├── salescrm-backend.yaml     # SalesCRM backend
├── tenantadmin-backend.yaml   # TenantAdmin backend
└── valuation-backend.yaml    # Valuation backend
```

#### **Frontend Deployments**
```
aws-deployment/k8s/frontends/
├── website-frontend.yaml     # Main website
├── masteradmin-frontend.yaml # MasterAdmin frontend
├── tenant-frontend.yaml      # Tenant frontend
├── crm-frontend.yaml        # CRM frontend
├── finance-frontend.yaml     # Finance frontend
├── salescrm-frontend.yaml    # SalesCRM frontend
├── tenantadmin-frontend.yaml # TenantAdmin frontend
├── channel-frontend.yaml     # Channel frontend
├── fraud-frontend.yaml       # Fraud frontend
├── legal-frontend.yaml       # Legal frontend
├── operations-frontend.yaml # Operations frontend
└── valuation-frontend.yaml  # Valuation frontend
```

### **3. Docker Files**

#### **Build Scripts**
```
aws-deployment/docker/
├── build-and-push.sh        # Build and push all images
└── update-k8s-images.sh    # Update K8s manifests
```

#### **Dockerfiles**
```
Dockerfile.backend           # Backend Dockerfile
Dockerfile.frontend          # Frontend Dockerfile

# Individual service Dockerfiles
BRD_MasterAdmin_Backend_1.1/Dockerfile
BRD-MergedTenantMaster-Backend/Dockerfile
BRD_CRM_1.1_BACKEND/Dockerfile
... (one for each backend service)

BRD-website-main/Dockerfile
BRD_MasterAdmin_Frontend_1.1/Dockerfile
BRD-MergedTenantMaster-Frontend/Dockerfile
... (one for each frontend service)
```

### **4. Monitoring Files**

```
aws-deployment/monitoring/
├── prometheus.yaml          # Prometheus deployment
└── grafana.yaml             # Grafana deployment
```

### **5. Scripts**

```
aws-deployment/scripts/
└── deploy.sh               # Main deployment script
```

### **6. CI/CD Files**

```
.github/workflows/
└── aws-deploy.yml          # GitHub Actions workflow
```

### **7. Configuration Files**

#### **Environment Files**
```
.env                        # Production environment
.env.example               # Environment template
```

#### **Application Configuration**
```
docker-compose.yml          # Local development
Makefile                   # Build commands
nginx/                     # Nginx configuration
```

### **8. Documentation Files**

```
DEPLOYMENT-STEPS.md         # Step-by-step deployment guide
GITHUB-SETUP.md           # GitHub setup instructions
aws-deployment/README.md    # Deployment overview
aws-deployment/02-complete-deployment-guide.md  # Complete guide
```

### **9. Application Source Code**

#### **Backend Services**
```
BRD_MasterAdmin_Backend_1.1/           # MasterAdmin backend
BRD-MergedTenantMaster-Backend/          # Tenant backend
BRD_CRM_1.1_BACKEND/                  # CRM backend
BRD_FINANCE_DASHBOARD_Backend/          # Finance backend
BRD-AgentsApp-Backend/                 # Agents backend
BRD-ChannelPartnerDashboard-Backend/     # Channel backend
BRD-FraudTeam-Dashboard-Backend/         # Fraud backend
BRD-LegalDashboard-Backend/              # Legal backend
BRD-OperationVerification-Backend/       # Operations backend
BRD-SalesCRM-Dashboard-Backend/          # SalesCRM backend
BRD-TenantAdmin_backend_2.0/            # TenantAdmin backend
BRD-Valuation-Dashboard-Backend/        # Valuation backend
```

#### **Frontend Applications**
```
BRD-website-main/                        # Main website
BRD_MasterAdmin_Frontend_1.1/           # MasterAdmin frontend
BRD-MergedTenantMaster-Frontend/          # Tenant frontend
BRD_CRM-1.1/                           # CRM frontend
BRD_FINANCE_DASHBOARD/                   # Finance frontend
BRD_SALES_CRM/                          # SalesCRM frontend
BRD_TenantAdmin_Frontend_1.1/            # TenantAdmin frontend
BRD-ChannelPartner-Dashboard/             # Channel frontend
BRD-FraudTeamDashboard/                  # Fraud frontend
BRD-LEGAL-dashboard/                     # Legal frontend
BRD-Operation-Verification-Dashboard/      # Operations frontend
BRD-ValuationDashboard/                  # Valuation frontend
```

---

## 🎯 Quick Deployment Checklist

### **Pre-Deployment Checklist**
- [ ] AWS CLI installed and configured
- [ ] kubectl installed
- [ ] Docker installed
- [ ] Terraform installed (optional)
- [ ] Git repository cloned
- [ ] Environment variables configured
- [ ] AWS credentials verified

### **Infrastructure Checklist**
- [ ] VPC and subnets created
- [ ] EKS cluster running
- [ ] RDS instance created
- [ ] ElastiCache Redis created
- [ ] ECR repositories created
- [ ] S3 bucket created
- [ ] IAM roles configured

### **Application Checklist**
- [ ] Docker images built and pushed
- [ ] Kubernetes manifests applied
- [ ] Secrets configured
- [ ] Databases created
- [ ] Migrations run
- [ ] Static files collected
- [ ] Load balancer configured
- [ ] Monitoring deployed

### **Post-Deployment Checklist**
- [ ] All pods running
- [ ] Services accessible
- [ ] Load balancer working
- [ ] Monitoring dashboards accessible
- [ ] CI/CD pipeline working
- [ ] Backups configured
- [ ] Alerts configured

---

## 🚀 Final Deployment Commands

### **One-Command Deployment**
```bash
# Complete deployment with single command
chmod +x aws-deployment/scripts/deploy.sh
./aws-deployment/scripts/deploy.sh infra
```

### **Step-by-Step Deployment**
```bash
# 1. Deploy infrastructure
cd aws-deployment/terraform
terraform init && terraform apply

# 2. Deploy application
cd ../..
./aws-deployment/scripts/deploy.sh

# 3. Verify deployment
kubectl get pods -n brd-loancrm
kubectl get ingress -n brd-loancrm
```

---

## 🎉 Success!

Your BRD LoanCRM system is now deployed on AWS with:
- ✅ 24 microservices running
- ✅ High availability setup
- ✅ Auto-scaling capabilities
- ✅ Monitoring and logging
- ✅ CI/CD pipeline
- ✅ Security best practices
- ✅ Cost optimization

**Access your application at the Load Balancer URL!**

---

## 📞 Support and Maintenance

### **Regular Maintenance Tasks**
- Monitor resource usage
- Update dependencies
- Backup databases
- Review security updates
- Optimize costs

### **Emergency Procedures**
- Scale services during high load
- Rollback failed deployments
- Restore from backups
- Troubleshoot issues

### **Contact Information**
- AWS Support: https://aws.amazon.com/support/
- Kubernetes Documentation: https://kubernetes.io/docs/
- Terraform Documentation: https://www.terraform.io/docs/

---

**Document Version: 1.0**  
**Last Updated: April 2026**  
**Next Review: May 2026**
