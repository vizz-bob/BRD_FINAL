# Complete AWS Deployment Guide for BRD LoanCRM

## 🚀 **Quick Start Deployment**

### **Prerequisites**
- AWS CLI installed and configured
- Docker installed
- kubectl installed
- Terraform installed (optional, for infrastructure setup)
- Domain name (optional, for SSL)

### **Step 1: Environment Setup**

1. **Clone the repository:**
```bash
git clone <your-repository-url>
cd BRD_FINAL
```

2. **Set AWS credentials:**
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="ap-south-1"
```

3. **Install required tools:**
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Terraform
wget https://releases.hashicorp.com/terraform/1.5.0/terraform_1.5.0_linux_amd64.zip
unzip terraform_1.5.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### **Step 2: Infrastructure Deployment**

**Option A: Using Terraform (Recommended)**
```bash
cd aws-deployment/terraform

# Copy and update configuration
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Deploy infrastructure
terraform init
terraform plan
terraform apply
```

**Option B: Manual Setup**
```bash
# Follow the manual steps in aws-deployment/01-infrastructure-setup.md
```

### **Step 3: Application Deployment**

1. **Deploy everything with our script:**
```bash
chmod +x aws-deployment/scripts/deploy.sh
./aws-deployment/scripts/deploy.sh infra
```

2. **Or deploy step by step:**
```bash
# Setup EKS cluster
aws eks update-kubeconfig --name brd-loancrm-cluster --region ap-south-1

# Build and push Docker images
chmod +x aws-deployment/docker/build-and-push.sh
./aws-deployment/docker/build-and-push.sh

# Deploy Kubernetes manifests
chmod +x aws-deployment/docker/update-k8s-images.sh
./aws-deployment/docker/update-k8s-images.sh

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

# Deploy monitoring
kubectl apply -f aws-deployment/monitoring/prometheus.yaml
kubectl apply -f aws-deployment/monitoring/grafana.yaml

# Apply ingress
kubectl apply -f aws-deployment/k8s/ingress.yaml
```

### **Step 4: Database Setup**

1. **Update secrets:**
```bash
# Edit aws-deployment/k8s/secrets.yaml
# Replace base64 encoded values with your actual values
```

2. **Run database migrations:**
```bash
# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=masteradmin-backend -n brd-loancrm --timeout=300s

# Run migrations
kubectl exec -n brd-loancrm deployment/masteradmin-backend -- python manage.py migrate
kubectl exec -n brd-loancrm deployment/tenant-backend -- python manage.py migrate
# ... repeat for all backends
```

### **Step 5: Access Your Application**

1. **Get the Load Balancer URL:**
```bash
kubectl get ingress -n brd-loancrm
```

2. **Access monitoring dashboards:**
```bash
# Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
# Open http://localhost:3000 (admin/admin123)

# Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090
# Open http://localhost:9090
```

## 📊 **Architecture Overview**

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

## 🔧 **Configuration Files**

### **Key Files Created:**
- `aws-deployment/terraform/` - Infrastructure as code
- `aws-deployment/k8s/` - Kubernetes manifests
- `aws-deployment/docker/` - Docker build scripts
- `aws-deployment/monitoring/` - Prometheus and Grafana
- `aws-deployment/scripts/` - Deployment scripts
- `.github/workflows/` - CI/CD pipeline

### **Environment Variables:**
Update `.env.example` with your actual values:
```bash
# Database Configuration
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_MASTER_PASSWORD=YourStrongPassword123!

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Django Configuration
DJANGO_SECRET_KEY=your-50-character-random-secret-key
ALLOWED_HOSTS=yourdomain.com,localhost
```

## 🔍 **Monitoring and Logging**

### **Prometheus Metrics:**
- Custom Django metrics
- Kubernetes metrics
- Application performance metrics
- Resource utilization

### **Grafana Dashboards:**
- Application performance
- Infrastructure monitoring
- Error rates and response times
- Resource usage

### **CloudWatch Logs:**
- Application logs
- Kubernetes logs
- System logs
- Audit logs

## 🚨 **Alerting**

### **Default Alerts:**
- High error rates
- High response times
- Resource utilization
- Database connection issues
- Pod restarts

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow:**
1. **Build and Test** - Run unit tests
2. **Build Docker Images** - Build and push to ECR
3. **Deploy to EKS** - Apply Kubernetes manifests
4. **Run Migrations** - Database migrations
5. **Health Checks** - Verify deployment

### **Manual Deployment:**
```bash
# Full deployment
./aws-deployment/scripts/deploy.sh infra

# Application only
./aws-deployment/scripts/deploy.sh
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Pod not starting:**
```bash
kubectl describe pod <pod-name> -n brd-loancrm
kubectl logs <pod-name> -n brd-loancrm
```

2. **Database connection issues:**
```bash
# Check secrets
kubectl get secrets -n brd-loancrm
kubectl describe secret brd-loancrm-secrets -n brd-loancrm

# Test database connection
kubectl exec -it <backend-pod> -n brd-loancrm -- python manage.py dbshell
```

3. **Load Balancer issues:**
```bash
kubectl get ingress -n brd-loancrm
kubectl describe ingress brd-loancrm-ingress -n brd-loancrm
```

4. **Image pull issues:**
```bash
# Check ECR permissions
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com
```

### **Useful Commands:**
```bash
# Check all resources
kubectl get all -n brd-loancrm

# Check pod logs
kubectl logs -f deployment/<service-name> -n brd-loancrm

# Port forward for debugging
kubectl port-forward -n brd-loancrm svc/<service-name> 8000:8000

# Scale services
kubectl scale deployment/<service-name> --replicas=3 -n brd-loancrm
```

## 📈 **Scaling and Performance**

### **Horizontal Scaling:**
```bash
# Scale backend services
kubectl scale deployment/masteradmin-backend --replicas=3 -n brd-loancrm
kubectl scale deployment/tenant-backend --replicas=3 -n brd-loancrm
```

### **Vertical Scaling:**
Update resource limits in deployment manifests:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

### **Database Scaling:**
- Use RDS read replicas for read-heavy workloads
- Enable RDS Multi-AZ for high availability
- Consider Aurora for better performance

## 🔒 **Security**

### **Best Practices:**
1. **Network Security:**
   - Use private subnets for databases
   - Security groups for traffic control
   - VPC endpoints for AWS services

2. **Application Security:**
   - Secrets management with Kubernetes secrets
   - SSL/TLS encryption
   - Regular security updates

3. **Access Control:**
   - IAM roles and policies
   - RBAC for Kubernetes
   - Principle of least privilege

## 💰 **Cost Optimization**

### **Tips:**
1. **Use Spot Instances** for non-critical workloads
2. **Right-size instances** based on actual usage
3. **Enable Auto Scaling** for variable workloads
4. **Use Reserved Instances** for predictable workloads
5. **Monitor and clean up** unused resources

## 📞 **Support**

For issues and questions:
1. Check the troubleshooting section
2. Review CloudWatch logs
3. Check Prometheus metrics
4. Verify resource utilization
5. Test database connectivity

---

**🎉 Your BRD LoanCRM is now deployed on AWS with Kubernetes!**

The deployment includes:
- ✅ 12 microservices (backends)
- ✅ 12 frontend applications  
- ✅ PostgreSQL RDS database
- ✅ Redis caching
- ✅ Load balancing and SSL
- ✅ Monitoring with Prometheus/Grafana
- ✅ CI/CD pipeline
- ✅ Auto-scaling capabilities
- ✅ High availability setup

Access your application at the Load Balancer URL obtained from the ingress!
