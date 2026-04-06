# 🐙 GitHub Setup for BRD LoanCRM

## 📋 **GitHub Repository Setup**

### **Step 1: Initialize Git Repository**

```bash
cd /Users/vijayendrasingh/Claude-DevOps-Workspace/BRD/BRD_FINAL

# Check if git is already initialized
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized"
else
    echo "Git repository already exists"
fi

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BRD LoanCRM with complete AWS deployment setup

- Added 24 microservices (12 backends + 12 frontends)
- Complete Kubernetes manifests for EKS deployment
- Terraform infrastructure as code
- Docker build and push scripts
- CI/CD pipeline with GitHub Actions
- Monitoring setup with Prometheus and Grafana
- Comprehensive deployment documentation"

# Create GitHub repository (if not exists)
echo "Creating GitHub repository..."
gh repo create brd-loancrm --public --source=. --remote=origin --push

# Or if repo already exists:
# git remote add origin https://github.com/yourusername/brd-loancrm.git
# git branch -M main
# git push -u origin main
```

### **Step 2: Configure GitHub Secrets**

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these required secrets:

#### **Required Secrets:**

```
AWS_ACCESS_KEY_ID
Value: AKIAIOSFODNN7EXAMPLE (your actual AWS access key)

AWS_SECRET_ACCESS_KEY  
Value: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY (your actual AWS secret key)

AWS_ACCOUNT_ID
Value: 123456789012 (your 12-digit AWS account ID)
```

#### **Optional Secrets (for enhanced functionality):**

```
DOMAIN_NAME
Value: yourdomain.com

CERTIFICATE_ARN
Value: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012

SLACK_WEBHOOK_URL
Value: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### **Step 3: Verify GitHub Actions Workflow**

The workflow is already configured at:
`.github/workflows/aws-deploy.yml`

**What it does:**
1. **Build and Test** - Runs unit tests for backends and frontends
2. **Build Docker Images** - Builds all 24 Docker images
3. **Push to ECR** - Pushes images to Amazon ECR
4. **Deploy to EKS** - Applies Kubernetes manifests
5. **Run Migrations** - Runs database migrations
6. **Collect Static Files** - Collects Django static files
7. **Verify Deployment** - Checks pod status and services

### **Step 4: Test GitHub Actions**

```bash
# Make a small change to trigger workflow
echo "# BRD LoanCRM" >> README.md
git add README.md
git commit -m "Test GitHub Actions workflow"
git push origin main
```

Go to **Actions** tab in your GitHub repository to monitor the workflow.

## 🔄 **CI/CD Pipeline Details**

### **Workflow Triggers:**
- **Push to main branch** → Full deployment
- **Pull request to main** → Build and test only
- **Manual dispatch** → Can be triggered manually

### **Environment Setup:**
The workflow uses different environments:
- **Development** → For pull requests
- **Production** → For main branch deployments

### **Deployment Steps:**
1. **Setup AWS credentials**
2. **Login to Amazon ECR**
3. **Build and push Docker images**
4. **Update kubeconfig**
5. **Apply Kubernetes manifests**
6. **Run database migrations**
7. **Collect static files**
8. **Restart services**
9. **Verify deployment**

## 🛠️ **GitHub Actions Workflow Configuration**

### **Workflow File Location:**
`.github/workflows/aws-deploy.yml`

### **Key Sections:**

```yaml
# Environment variables
env:
  AWS_REGION: ap-south-1
  EKS_CLUSTER_NAME: brd-loancrm-cluster
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.ap-south-1.amazonaws.com

# Jobs
jobs:
  build-and-test:    # Build and test code
  build-and-push:    # Build and push Docker images
  deploy:            # Deploy to EKS
```

### **Customization Options:**

#### **Add Custom Tests:**
```yaml
- name: Run custom tests
  run: |
    # Add your custom test commands here
    python manage.py test
    npm run test
```

#### **Add Slack Notifications:**
```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### **Add Rollback:**
```yaml
- name: Rollback on failure
  if: failure()
  run: |
    kubectl rollout undo deployment/masteradmin-backend -n brd-loancrm
    # Add rollback for other services
```

## 📊 **Monitoring GitHub Actions**

### **View Workflow Status:**
1. Go to **Actions** tab
2. Click on workflow run
3. View logs for each step

### **Common Issues:**

#### **Permission Denied:**
```bash
# Ensure GitHub Actions has proper permissions
# Go to Settings → Actions → General → Workflow permissions
# Select "Read and write permissions"
```

#### **ECR Login Failed:**
```bash
# Check AWS credentials
# Ensure secrets are correctly set
# Verify AWS account ID is correct
```

#### **EKS Connection Failed:**
```bash
# Check EKS cluster name
# Verify AWS region
# Ensure IAM role has proper permissions
```

## 🔧 **Advanced GitHub Setup**

### **Branch Protection Rules:**

1. Go to **Settings** → **Branches** → **Add rule**
2. Select **main** branch
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Include **build-and-test** as required check

### **Environment Protection Rules:**

1. Go to **Settings** → **Environments**
2. Create **Production** environment
3. Add protection rules:
   - Required reviewers
   - Wait timer
   - Deployment branches

### **GitHub Pages for Documentation:**

```bash
# Enable GitHub Pages
# Go to Settings → Pages
# Source: Deploy from a branch
# Branch: main, folder: /docs
```

## 🚀 **Deployment Automation**

### **Automatic Deployment:**
- Push to **main** branch → Automatic deployment
- Pull request → Build and test only

### **Manual Deployment:**
```bash
# Trigger workflow manually
gh workflow run "AWS Deploy to EKS"

# Or via GitHub UI:
# Actions → "AWS Deploy to EKS" → "Run workflow"
```

### **Scheduled Deployment:**
```yaml
# Add to workflow file
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  push:
    branches: [ main ]
```

## 📝 **Best Practices**

### **Security:**
- Use GitHub secrets for sensitive data
- Rotate AWS keys regularly
- Use least privilege IAM roles
- Enable branch protection

### **Performance:**
- Use Docker layer caching
- Parallelize builds
- Optimize Docker image sizes
- Use proper resource limits

### **Reliability:**
- Add comprehensive tests
- Implement health checks
- Use proper error handling
- Add rollback mechanisms

### **Monitoring:**
- Monitor workflow performance
- Set up alerts for failures
- Track deployment metrics
- Log all deployment activities

## 🔗 **Useful GitHub Commands**

```bash
# Install GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Authenticate with GitHub
gh auth login

# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# Re-run workflow
gh run rerun <run-id>

# Cancel workflow
gh run cancel <run-id>
```

---

## 🎉 **GitHub Setup Complete!**

Your BRD LoanCRM project is now fully integrated with GitHub:

- ✅ Repository created and pushed
- ✅ CI/CD pipeline configured
- ✅ Secrets set up
- ✅ Automated deployment ready
- ✅ Monitoring and logging in place

**Next:** Push your changes to trigger the first automated deployment! 🚀
