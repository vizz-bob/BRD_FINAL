# 🚀 Step-by-Step AWS Deployment Guide

## 📋 **Prerequisites Checklist**

Before starting, ensure you have:

- [ ] AWS account with appropriate permissions
- [ ] AWS CLI installed and configured
- [ ] Docker installed
- [ ] kubectl installed
- [ ] Terraform installed (optional)
- [ ] Git installed
- [ ] Domain name (optional, for SSL)

## 🔧 **Step 1: Setup Local Environment**

### 1.1 Install Required Tools

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Terraform (optional)
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### 1.2 Configure AWS Credentials

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

## 🐙 **Step 2: Setup GitHub Repository**

### 2.1 Initialize Git Repository

```bash
cd /Users/vijayendrasingh/Claude-DevOps-Workspace/BRD/BRD_FINAL

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: BRD LoanCRM with AWS deployment"

# Create GitHub repository (if not exists)
# Go to https://github.com and create a new repository
# Then connect local repo to GitHub:
git remote add origin https://github.com/yourusername/brd-loancrm.git
git branch -M main
git push -u origin main
```

### 2.2 Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_ACCOUNT_ID=123456789012
```

### 2.3 Verify GitHub Actions Workflow

The GitHub Actions workflow is already configured at:
`.github/workflows/aws-deploy.yml`

It will automatically:
1. Build and test code
2. Build Docker images
3. Push to ECR
4. Deploy to EKS
5. Run migrations
6. Verify deployment

## 🏗️ **Step 3: Deploy Infrastructure**

### 3.1 Using Terraform (Recommended)

```bash
cd aws-deployment/terraform

# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
nano terraform.tfvars
```

**Update these values in terraform.tfvars:**
```hcl
aws_region = "ap-south-1"
environment = "production"
project_name = "BRD-LoanCRM"

# Database
db_password = "YourStrongPassword123!"
db_username = "loancrm_admin"

# Domain
domain_name = "yourdomain.com"
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"

# S3
s3_bucket_name = "brd-loancrm-media-production"
```

```bash
# Initialize and apply Terraform
terraform init
terraform plan
terraform apply

# Wait for infrastructure to be created (5-10 minutes)
```

### 3.2 Manual Infrastructure Setup (Alternative)

If you prefer manual setup, follow:
`aws-deployment/01-infrastructure-setup.md`

## 🚀 **Step 4: Deploy Application**

### 4.1 Quick Deployment (Recommended)

```bash
cd /Users/vijayendrasingh/Claude-DevOps-Workspace/BRD/BRD_FINAL

# Make deployment script executable
chmod +x aws-deployment/scripts/deploy.sh

# Deploy everything
./aws-deployment/scripts/deploy.sh infra
```

This script will:
1. Setup EKS cluster connection
2. Build and push Docker images
3. Deploy Kubernetes manifests
4. Run database migrations
5. Collect static files
6. Verify deployment

### 4.2 Step-by-Step Deployment

If you prefer manual deployment:

```bash
# 1. Update kubeconfig
aws eks update-kubeconfig --name brd-loancrm-cluster --region ap-south-1

# 2. Build and push Docker images
chmod +x aws-deployment/docker/build-and-push.sh
./aws-deployment/docker/build-and-push.sh

# 3. Update Kubernetes manifests with ECR images
chmod +x aws-deployment/docker/update-k8s-images.sh
./aws-deployment/docker/update-k8s-images.sh

# 4. Deploy core services
kubectl apply -f aws-deployment/k8s/namespace.yaml
kubectl apply -f aws-deployment/k8s/configmaps.yaml
kubectl apply -f aws-deployment/k8s/secrets.yaml
kubectl apply -f aws-deployment/k8s/pvcs.yaml
kubectl apply -f aws-deployment/k8s/redis.yaml
kubectl apply -f aws-deployment/k8s/nginx.yaml

# 5. Deploy backends
chmod +x aws-deployment/k8s/deploy-all-backends.sh
./aws-deployment/k8s/deploy-all-backends.sh

# 6. Deploy frontends
kubectl apply -f aws-deployment/k8s/frontends/

# 7. Deploy monitoring
kubectl apply -f aws-deployment/monitoring/prometheus.yaml
kubectl apply -f aws-deployment/monitoring/grafana.yaml

# 8. Apply ingress
kubectl apply -f aws-deployment/k8s/ingress.yaml
```

## 🔐 **Step 5: Configure Secrets**

### 5.1 Update Kubernetes Secrets

Edit `aws-deployment/k8s/secrets.yaml`:

```bash
# Generate base64 encoded values
echo -n "your-rds-endpoint.ap-south-1.rds.amazonaws.com" | base64
echo -n "YourStrongPassword123!" | base64
echo -n "your-50-character-django-secret-key" | base64
echo -n "your-32-character-jwt-secret-key" | base64
echo -n "your-aws-access-key-id" | base64
echo -n "your-aws-secret-access-key" | base64
echo -n "your-email@gmail.com" | base64
echo -n "your-email-app-password" | base64

# Update the secrets.yaml file with these base64 values
nano aws-deployment/k8s/secrets.yaml
```

### 5.2 Apply Updated Secrets

```bash
kubectl apply -f aws-deployment/k8s/secrets.yaml
```

## 🗄️ **Step 6: Database Setup**

### 6.1 Create Databases

Connect to your RDS instance and create databases:

```bash
# Get RDS endpoint from Terraform output or AWS Console
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
-- ... create all users as shown in infrastructure guide

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE website_db TO website_user;
GRANT ALL PRIVILEGES ON DATABASE masteradmin_db TO masteradmin_user;
-- ... grant for all databases
```

### 6.2 Run Migrations

```bash
# Wait for pods to be ready
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

### 6.3 Create Superuser

```bash
kubectl exec -n brd-loancrm deployment/masteradmin-backend -- python manage.py createsuperuser
```

## 📊 **Step 7: Verify Deployment**

### 7.1 Check Pod Status

```bash
# Check all pods
kubectl get pods -n brd-loancrm

# Check services
kubectl get services -n brd-loancrm

# Check ingress
kubectl get ingress -n brd-loancrm

# Check pod logs if any issues
kubectl logs -f deployment/masteradmin-backend -n brd-loancrm
```

### 7.2 Access Application

```bash
# Get Load Balancer URL
kubectl get ingress -n brd-loancrm

# The URL will be shown in the ADDRESS column
# Access your application at: http://<load-balancer-url>
```

### 7.3 Access Monitoring

```bash
# Access Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
# Open http://localhost:3000
# Username: admin, Password: admin123

# Access Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090
# Open http://localhost:9090
```

## 🔄 **Step 8: Setup CI/CD with GitHub Actions**

### 8.1 Push to GitHub

```bash
# Add all changes
git add .
git commit -m "Add AWS deployment configuration"
git push origin main
```

### 8.2 Monitor GitHub Actions

1. Go to your GitHub repository
2. Click on "Actions" tab
3. You'll see the "AWS Deploy to EKS" workflow running
4. Monitor the progress

### 8.3 Automatic Deployment

The workflow will automatically:
- Build and test your code
- Build Docker images
- Push to ECR
- Deploy to EKS
- Run migrations
- Verify deployment

## 🌐 **Step 9: Setup Domain and SSL (Optional)**

### 9.1 Setup DNS

```bash
# Get Load Balancer DNS name
kubectl get ingress -n brd-loancrm

# Go to your domain registrar
# Add A record pointing to the Load Balancer DNS name
```

### 9.2 Setup SSL Certificate

```bash
# Request SSL certificate with AWS ACM
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# Update the certificate ARN in terraform.tfvars
# Re-apply terraform or update ingress manually
```

## 🔧 **Step 10: Common Management Tasks**

### 10.1 Scale Services

```bash
# Scale specific service
kubectl scale deployment/masteradmin-backend --replicas=3 -n brd-loancrm

# Scale all services
kubectl scale deployment --all --replicas=2 -n brd-loancrm
```

### 10.2 Update Application

```bash
# Make changes to your code
git add .
git commit -m "Update application"
git push origin main

# GitHub Actions will automatically deploy
```

### 10.3 View Logs

```bash
# View specific service logs
kubectl logs -f deployment/masteradmin-backend -n brd-loancrm

# View all logs
kubectl logs -f --all-containers=true -n brd-loancrm
```

### 10.4 Access Pods

```bash
# Access pod shell
kubectl exec -it <pod-name> -n brd-loancrm -- /bin/bash

# Example
kubectl exec -it deployment/masteradmin-backend -n brd-loancrm -- /bin/bash
```

## 🚨 **Troubleshooting**

### Common Issues and Solutions:

1. **Pod not starting**
   ```bash
   kubectl describe pod <pod-name> -n brd-loancrm
   kubectl logs <pod-name> -n brd-loancrm
   ```

2. **Database connection issues**
   ```bash
   # Check secrets
   kubectl get secrets -n brd-loancrm
   kubectl describe secret brd-loancrm-secrets -n brd-loancrm
   ```

3. **Image pull issues**
   ```bash
   # Check ECR login
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com
   ```

4. **Load Balancer issues**
   ```bash
   kubectl get ingress -n brd-loancrm
   kubectl describe ingress brd-loancrm-ingress -n brd-loancrm
   ```

## 📞 **Support**

If you encounter issues:

1. Check the troubleshooting section above
2. Review CloudWatch logs in AWS Console
3. Check Prometheus metrics
4. Verify resource utilization
5. Test database connectivity

---

## 🎉 **Deployment Complete!**

Your BRD LoanCRM system is now running on AWS with:
- ✅ 24 microservices deployed
- ✅ High availability setup
- ✅ Auto-scaling capabilities
- ✅ Monitoring and logging
- ✅ CI/CD pipeline
- ✅ Security best practices

**Access your application at the Load Balancer URL!**
