terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

data "aws_eks_cluster" "cluster" {
  name = var.cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = var.cluster_name
}

# VPC Module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway = true
  single_nat_gateway = false
  one_nat_gateway_per_az = true

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = var.vpc_name
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  subnet_ids      = module.vpc.private_subnets

  vpc_id = module.vpc.vpc_id

  cluster_endpoint_private_access = true
  cluster_endpoint_public_access  = true

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    main = {
      name       = "brd-loancrm-nodes"
      instance_types = var.instance_types
      min_size     = var.min_nodes
      max_size     = var.max_nodes
      desired_size = var.desired_nodes

      iam_role_additional_policies = {
        AmazonEC2ContainerRegistryReadOnly = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        AmazonSSMManagedInstanceCore       = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
        CloudWatchAgentServerPolicy        = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
      }
    }
  }

  tags = {
    Name        = var.cluster_name
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "brd-loancrm-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name        = "BRD-LoanCRM-DB-Subnet-Group"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name_prefix = "brd-loancrm-rds-sg"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "BRD-LoanCRM-RDS-SG"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "brd-loancrm-db"

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = "postgres"
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot       = false
  final_snapshot_identifier = "brd-loancrm-db-final-snapshot"

  deletion_protection = false

  tags = {
    Name        = "BRD-LoanCRM-RDS"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "brd-loancrm-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name        = "BRD-LoanCRM-Redis-Subnet-Group"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# ElastiCache Security Group
resource "aws_security_group" "redis" {
  name_prefix = "brd-loancrm-redis-sg"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "BRD-LoanCRM-Redis-SG"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# ElastiCache Redis Cluster
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "brd-loancrm-redis"
  engine               = "redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  tags = {
    Name        = "BRD-LoanCRM-Redis"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# ECR Repositories
resource "aws_ecr_repository" "backends" {
  for_each = toset([
    "masteradmin-backend",
    "tenant-backend",
    "crm-backend",
    "finance-backend",
    "agents-backend",
    "channel-backend",
    "fraud-backend",
    "legal-backend",
    "operations-backend",
    "salescrm-backend",
    "tenantadmin-backend",
    "valuation-backend"
  ])

  name                 = "brd-loancrm/${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "BRD-LoanCRM-${each.key}"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

resource "aws_ecr_repository" "frontends" {
  for_each = toset([
    "website-frontend",
    "masteradmin-frontend",
    "tenant-frontend",
    "crm-frontend",
    "finance-frontend",
    "salescrm-frontend",
    "tenantadmin-frontend",
    "channel-frontend",
    "fraud-frontend",
    "legal-frontend",
    "operations-frontend",
    "valuation-frontend"
  ])

  name                 = "brd-loancrm/${each.key}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "BRD-LoanCRM-${each.key}"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# S3 Bucket for Media Files
resource "aws_s3_bucket" "media" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = "BRD-LoanCRM-Media"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM Policy for S3 Access
resource "aws_iam_policy" "s3_access" {
  name        = "BRD-LoanCRM-S3-Policy"
  description = "Policy for BRD LoanCRM S3 access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.media.arn,
          "${aws_s3_bucket.media.arn}/*"
        ]
      }
    ]
  })

  tags = {
    Name        = "BRD-LoanCRM-S3-Policy"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

# Load Balancer Controller IAM Role
resource "aws_iam_role" "lb_controller" {
  name = "AmazonEKSLoadBalancerControllerRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = module.eks.oidc_provider_arn
        }
        Condition = {
          StringEquals = {
            "${module.eks.oidc_provider}:sub" = "system:serviceaccount:kube-system:aws-load-balancer-controller"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "BRD-LoanCRM-LB-Controller"
    Environment = var.environment
    Project     = "BRD-LoanCRM"
  }
}

resource "aws_iam_role_policy_attachment" "lb_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AWSLoadBalancerControllerIAMPolicy"
  role       = aws_iam_role.lb_controller.name
}

# Outputs
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "db_instance_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.main.cache_nodes[0].address
}

output "s3_bucket_name" {
  value = aws_s3_bucket.media.id
}

output "ecr_registry_url" {
  value = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
}

data "aws_caller_identity" "current" {}
