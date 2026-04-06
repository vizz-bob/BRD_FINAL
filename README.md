 BRD LoanCRM - AWS Kubernetes Deployment

🚀 **Complete microservices deployment on AWS with Docker, Kubernetes, and RDS**

## 📋 **Project Overview**

This is a comprehensive **Loan CRM system** with **24 microservices** (12 backends + 12 frontends) deployed on AWS EKS with Kubernetes orchestration.

### **Architecture Components:**
- **12 Django Backend Services** (MasterAdmin, Tenant, CRM, Finance, Agents, Channel, Fraud, Legal, Operations, SalesCRM, TenantAdmin, Valuation)
- **12 React/Vue Frontend Applications**
- **PostgreSQL RDS** (12 databases)
- **Redis ElastiCache** (caching & Celery)
- **Nginx** (reverse proxy)
- **AWS EKS** (Kubernetes orchestration)
- **Application Load Balancer** (traffic routing)
- **S3** (media storage)
- **Prometheus/Grafana** (monitoring)

## 🏗️ **Directory Structure**

```
aws-deployment/
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                   # Main Terraform configuration
│   ├── variables.tf              # Variable definitions
│   └── terraform.tfvars.example  # Example variables
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml            # Namespace
│   ├── configmaps.yaml           # Configuration
│   ├── secrets.yaml              # Secrets (update with your values)
│   ├── pvcs.yaml                 # Persistent volumes
│   ├── redis.yaml                # Redis deployment
│   ├── nginx.yaml                # Nginx reverse proxy
│   ├── ingress.yaml              # Load balancer ingress
│   ├── backends/                 # Backend deployments
│   └── frontends/                # Frontend deployments
├── docker/                       # Docker build scripts
│   ├── build-and-push.sh         # Build and push to ECR
│   └── update-k8s-images.sh      # Update K8s manifests
├── monitoring/                   # Monitoring setup
│   ├── prometheus.yaml           # Prometheus deployment
│   └── grafana.yaml              # Grafana deployment
├── scripts/                      # Deployment scripts
│   └── deploy.sh                 # Main deployment script
├── 01-infrastructure-setup.md    # Manual infrastructure setup
├── 02-complete-deployment-guide.md # Complete deployment guide
└── README.md                     # This file
```

## 🚀 **Quick Start**

### **1. Prerequisites**
```bash
# Install required tools
curl -sSL https://get.docker.com/ | sh
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### **2. Set AWS Credentials**
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="ap-south-1"
```

### **3. Deploy Everything**
```bash
# Clone and navigate to project
git clone <repository-url>
cd BRD_FINAL

# Deploy with our script (recommended)
chmod +x aws-deployment/scripts/deploy.sh
./aws-deployment/scripts/deploy.sh infra
```

### **4. Access Your Application**
```bash
# Get Load Balancer URL
kubectl get ingress -n brd-loancrm

# Access monitoring dashboards
kubectl port-forward -n monitoring svc/grafana 3000:3000
# Open http://localhost:3000 (admin/admin123)
```

## 📊 **Deployment Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                           │
├─────────────────────────────────────────────────────────────┤
│  Route53 (DNS) │ CloudWatch (Monitoring) │ ALB (Load Balancer) │
├─────────────────────────────────────────────────────────────┤
│                    EKS Kubernetes Cluster                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Nginx      │ │   Redis     │ │    24 Microservices     │ │
│  │ (Frontend)   │ │  (Cache)    │ │ (12 Backends + 12 Apps)  │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│     RDS PostgreSQL (12 DBs)     │     ElastiCache Redis     │
├─────────────────────────────────────────────────────────────┤
│                    S3 Storage (Media)                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 **Configuration**

### **Environment Variables**
Copy and update `.env.example`:
```bash
cp .env.example .env
# Update with your actual values
```

### **Key Configuration Files:**
- `aws-deployment/k8s/secrets.yaml` - Database credentials and API keys
- `aws-deployment/terraform/terraform.tfvars` - Infrastructure parameters
- `aws-deployment/k8s/ingress.yaml` - Load balancer and SSL configuration

## 📈 **Monitoring**

### **Grafana Dashboards:**
- Application performance metrics
- Infrastructure monitoring
- Error rates and response times
- Resource utilization

### **Access Monitoring:**
```bash
# Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
# URL: http://localhost:3000 (admin/admin123)

# Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090
# URL: http://localhost:9090
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions**
Automated deployment pipeline included:
1. **Build & Test** - Run unit tests
2. **Build Images** - Build and push to ECR
3. **Deploy to EKS** - Apply Kubernetes manifests
4. **Run Migrations** - Database setup
5. **Health Checks** - Verify deployment

### **Manual Deployment**
```bash
# Full deployment
./aws-deployment/scripts/deploy.sh infra

# Application only
./aws-deployment/scripts/deploy.sh
```

## 🛠️ **Management Commands**

### **Check Deployment Status**
```bash
kubectl get pods -n brd-loancrm
kubectl get services -n brd-loancrm
kubectl get ingress -n brd-loancrm
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
# View service logs
kubectl logs -f deployment/masteradmin-backend -n brd-loancrm

# View all logs
kubectl logs -f --all-containers=true -n brd-loancrm
```

### **Update Deployment**
```bash
# Build and push new images
./aws-deployment/docker/build-and-push.sh

# Update Kubernetes deployment
kubectl rollout restart deployment/masteradmin-backend -n brd-loancrm
```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Pod Not Starting:**
```bash
kubectl describe pod <pod-name> -n brd-loancrm
kubectl logs <pod-name> -n brd-loancrm
```

2. **Database Connection:**
```bash
# Check secrets
kubectl get secrets -n brd-loancrm
kubectl describe secret brd-loancrm-secrets -n brd-loancrm

# Test connection
kubectl exec -it <backend-pod> -n brd-loancrm -- python manage.py dbshell
```

3. **Load Balancer Issues:**
```bash
kubectl get ingress -n brd-loancrm
kubectl describe ingress brd-loancrm-ingress -n brd-loancrm
```

4. **Image Pull Issues:**
```bash
# Check ECR login
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ap-south-1.amazonaws.com
```

## 🔒 **Security Features**

- **Network Security:** Private subnets, security groups, VPC endpoints
- **Application Security:** Secrets management, SSL/TLS encryption
- **Access Control:** IAM roles, RBAC, principle of least privilege
- **Data Encryption:** RDS encryption, S3 encryption, in-transit encryption

## 💰 **Cost Optimization**

- **Auto Scaling:** Horizontal pod autoscaling
- **Right-sizing:** Appropriate instance sizes
- **Spot Instances:** Cost-effective compute
- **Monitoring:** Resource utilization tracking

## 📞 **Support**

### **Documentation:**
- `01-infrastructure-setup.md` - Manual infrastructure setup
- `02-complete-deployment-guide.md` - Detailed deployment guide

### **Getting Help:**
1. Check troubleshooting section
2. Review CloudWatch logs
3. Check Prometheus metrics
4. Verify resource utilization

---

## 🎉 **Deployment Complete!**

Your BRD LoanCRM system is now running on AWS with:
- ✅ **24 microservices** deployed
- ✅ **High availability** setup
- ✅ **Auto-scaling** capabilities
- ✅ **Monitoring** and logging
- ✅ **CI/CD pipeline**
- ✅ **Security** best practices
- ✅ **Cost optimization**

**Access your application at the Load Balancer URL from the ingress!**
