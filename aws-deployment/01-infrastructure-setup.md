# AWS Infrastructure Setup

## Prerequisites
- AWS CLI installed and configured
- kubectl installed
- eksctl installed
- Docker installed
- Domain name (optional)

## 1. VPC and Networking Setup

### Create VPC
```bash
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=BRD-LoanCRM-VPC}]' \
  --query Vpc.VpcId --output text
```

### Create Subnets
```bash
# Public Subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone ap-south-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=BRD-Public-1a}]'
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone ap-south-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=BRD-Public-1b}]'

# Private Subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.11.0/24 --availability-zone ap-south-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=BRD-Private-1a}]'
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.12.0/24 --availability-zone ap-south-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=BRD-Private-1b}]'
```

### Create Internet Gateway
```bash
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=BRD-IGW}]'
aws ec2 attach-internet-gateway --vpc-id vpc-xxxxxxxxx --internet-gateway-id igw-xxxxxxxxx
```

### Create NAT Gateway
```bash
aws ec2 allocate-address --domain vpc
aws ec2 create-nat-gateway --subnet-id subnet-xxxxxxxxx --allocation-id eipalloc-xxxxxxxxx --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=BRD-NAT}]'
```

### Create Route Tables
```bash
# Public Route Table
aws ec2 create-route-table --vpc-id vpc-xxxxxxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=BRD-Public-RT}]'
aws ec2 create-route --route-table-id rtb-xxxxxxxxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxxxxxxxx

# Private Route Table
aws ec2 create-route-table --vpc-id vpc-xxxxxxxxx --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=BRD-Private-RT}]'
aws ec2 create-route --route-table-id rtb-xxxxxxxxx --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-xxxxxxxxx
```

## 2. RDS PostgreSQL Setup

### Create Subnet Group
```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name brd-loancrm-subnet-group \
  --db-subnet-group-description "Subnet group for BRD LoanCRM RDS" \
  --subnet-ids subnet-xxxxxxxxx subnet-xxxxxxxxx
```

### Create Security Group
```bash
aws ec2 create-security-group --group-name brd-rds-sg --description "RDS Security Group" --vpc-id vpc-xxxxxxxxx
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxxx --protocol tcp --port 5432 --source-group sg-xxxxxxxxx
```

### Create RDS Instance
```bash
aws rds create-db-instance \
  --db-instance-identifier brd-loancrm-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username loancrm_admin \
  --master-user-password YourStrongPassword123! \
  --allocated-storage 100 \
  --storage-type gp2 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name brd-loancrm-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --publicly-accessible false \
  --storage-encrypted \
  --tags Key=Name,Value=BRD-LoanCRM-RDS
```

### Create Databases
```bash
# Connect to RDS and create databases
psql -h your-rds-endpoint.ap-south-1.rds.amazonaws.com -U loancrm_admin -d postgres

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

-- Create users for each database
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

-- Grant privileges
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

## 3. ElastiCache Redis Setup

### Create Subnet Group
```bash
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name brd-loancrm-redis-subnet-group \
  --cache-subnet-group-description "Subnet group for BRD LoanCRM Redis" \
  --subnet-ids subnet-xxxxxxxxx subnet-xxxxxxxxx
```

### Create Security Group
```bash
aws ec2 create-security-group --group-name brd-redis-sg --description "Redis Security Group" --vpc-id vpc-xxxxxxxxx
aws ec2 authorize-security-group-ingress --group-id sg-xxxxxxxxx --protocol tcp --port 6379 --source-group sg-xxxxxxxxx
```

### Create Redis Cluster
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id brd-loancrm-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxxxxxx \
  --cache-subnet-group-name brd-loancrm-redis-subnet-group \
  --tags Key=Name,Value=BRD-LoanCRM-Redis
```

## 4. EKS Cluster Setup

### Create EKS Cluster
```bash
eksctl create cluster \
  --name brd-loancrm-cluster \
  --version 1.28 \
  --region ap-south-1 \
  --vpc-private-subnets subnet-xxxxxxxxx,subnet-xxxxxxxxx \
  --nodegroup-name brd-loancrm-nodes \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 5 \
  --managed \
  --ssh-access \
  --ssh-public-key ~/.ssh/id_rsa.pub \
  --with-oidc \
  --iam-with-oidc \
  --instance-types t3.medium,t3.large
```

### Update kubeconfig
```bash
aws eks update-kubeconfig --region ap-south-1 --name brd-loancrm-cluster
```

## 5. ECR Repository Setup

### Create ECR Repositories
```bash
# Backend repositories
aws ecr create-repository --repository-name brd-loancrm/masteradmin-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/tenant-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/crm-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/finance-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/agents-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/channel-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/fraud-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/legal-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/operations-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/salescrm-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/tenantadmin-backend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/valuation-backend --image-scanning-configuration scanOnPush=true

# Frontend repositories
aws ecr create-repository --repository-name brd-loancrm/website-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/masteradmin-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/tenant-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/crm-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/finance-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/salescrm-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/tenantadmin-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/channel-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/fraud-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/legal-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/operations-frontend --image-scanning-configuration scanOnPush=true
aws ecr create-repository --repository-name brd-loancrm/valuation-frontend --image-scanning-configuration scanOnPush=true
```

## 6. S3 Bucket Setup

### Create S3 Bucket for Media Files
```bash
aws s3 mb s3://brd-loancrm-media-production --region ap-south-1
aws s3api put-bucket-encryption --bucket brd-loancrm-media-production --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

### Create IAM Policy for S3 Access
```bash
cat > s3-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::brd-loancrm-media-production",
                "arn:aws:s3:::brd-loancrm-media-production/*"
            ]
        }
    ]
}
EOF

aws iam create-policy --policy-name BRD-LoanCRM-S3-Policy --policy-document file://s3-policy.json
```

## 7. Application Load Balancer Setup

### Install AWS Load Balancer Controller
```bash
# Create IAM OIDC provider
eksctl utils associate-iam-oidc-provider --region ap-south-1 --cluster brd-loancrm-cluster --approve

# Create IAM policy
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document iam_policy.json

# Create service account
eksctl create iamserviceaccount \
  --cluster=brd-loancrm-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/AWSLoadBalancerControllerIAMPolicy \
  --approve \
  --override-existing-serviceaccounts

# Install the controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=brd-loancrm-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

## 8. SSL Certificate Setup (Optional)

### Request SSL Certificate
```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --subject-alternative-names www.yourdomain.com,*.yourdomain.com \
  --region us-east-1  # ACM for CloudFront must be in us-east-1
```

## 9. Monitoring Setup

### Create CloudWatch Log Group
```bash
aws logs create-log-group --log-group-name /aws/eks/brd-loancrm-cluster/containers
aws logs create-log-group --log-group-name /aws/eks/brd-loancrm-cluster/pods
```

### Install Prometheus and Grafana
```bash
# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage=50Gi

# Install Grafana
helm install grafana grafana/grafana \
  --namespace monitoring \
  --create-namespace \
  --set persistence.storageClassName=gp2 \
  --set persistence.size=20Gi \
  --set adminPassword=admin123
```

## Next Steps

1. Update your .env file with the actual AWS resource values
2. Build and push Docker images to ECR
3. Deploy Kubernetes manifests
4. Configure DNS and SSL
5. Set up CI/CD pipeline
