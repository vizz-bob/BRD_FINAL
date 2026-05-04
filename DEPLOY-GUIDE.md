# ReferPeople.in — Complete Deployment Guide
## GitHub Cleanup + Local Dev + AWS EC2 (No Kubernetes needed yet)

**Domain:** referpeople.in  
**Approach:** Start simple → EC2 + Docker Compose → Later add Kubernetes  

---

## PART 1 — CLEAN YOUR GITHUB REPOSITORY

Do these steps on your own computer (in Terminal / Command Prompt / Git Bash).

### Step 1 — Open Terminal and go to your project folder

```bash
# On Mac / Linux:
cd /Volumes/traininig/BRD/BRD_FINAL

# On Windows (Git Bash):
cd /d/path/to/BRD_FINAL
```

### Step 2 — Check what git sees (verify deletions + new files)

```bash
git status
```

You will see:
- `D` = deleted files (old scripts, old guides) — these will be removed from GitHub
- `??` = new files (ReferPeople guides, new nginx config, brand files) — need to add
- `M` = modified files (.gitignore, Makefile updated)

### Step 3 — Stage ALL changes (deletions + additions)

```bash
git add -A
```

The `-A` flag stages everything: deleted files, new files, and modified files all at once.

### Step 4 — Verify what is staged

```bash
git status
```

Everything should now show in green under "Changes to be committed".

### Step 5 — Commit with a clear message

```bash
git commit -m "refactor: transform BRD LoanCRM to ReferPeople.in multi-service platform

- Remove all old BRD loan CRM guides and temp files
- Remove debug/fix scripts (fix_*.py, fix_*.sh, setup_*.sh)
- Remove kubectl binary and old deploy scripts
- Remove .env (credentials - now in .gitignore)
- Add ReferPeople brand theme (colors.css, colors.js)
- Add nginx config for referpeople.in (4 service pages)
- Add Makefile and start-referpeople.sh
- Add complete transformation guide PDF + markdown
- Update .gitignore to block all .env files"
```

### Step 6 — Push to GitHub

```bash
git push origin main
```

If GitHub asks for username/password, use your GitHub username and a Personal Access Token (not your GitHub password). Create one at: github.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token (check: repo, workflow).

### Step 7 — Create the developer branch

```bash
# Create developer/staging branch from main
git checkout -b develop
git push -u origin develop

# Go back to main for production work
git checkout main
```

### Step 8 — Verify on GitHub

Open: https://github.com/vizz-bob/BRD_FINAL

You should see:
- All old fix/deploy scripts gone
- New ReferPeople guides visible
- Both `main` and `develop` branches in the branch dropdown
- `.env` file NOT visible (it's gitignored)

---

## PART 2 — MANUAL LOCAL STARTUP (Test on your computer first)

### Prerequisites — Install these on your computer

```bash
# 1. Python 3.11+
# Download from: python.org/downloads
python3 --version   # should show 3.11 or higher

# 2. Node.js 20+
# Download from: nodejs.org/en/download
node --version      # should show v20 or higher
npm --version

# 3. PostgreSQL 15
# Mac: brew install postgresql@15
# Windows: postgresql.org/download/windows
# Ubuntu: sudo apt install postgresql-15

# 4. Redis
# Mac: brew install redis
# Windows: Download from github.com/microsoftarchive/redis/releases
# Ubuntu: sudo apt install redis-server
```

### Step 1 — Clone the repo (if not already done)

```bash
git clone https://github.com/vizz-bob/BRD_FINAL.git referpeople-platform
cd referpeople-platform
```

### Step 2 — Create PostgreSQL databases

```bash
# Open PostgreSQL prompt
psql -U postgres

# Run these commands inside psql:
CREATE USER referpeople_user WITH PASSWORD 'ReferPeople@2024';
CREATE DATABASE referpeople_realestate OWNER referpeople_user;
CREATE DATABASE referpeople_loans      OWNER referpeople_user;
CREATE DATABASE referpeople_jobs       OWNER referpeople_user;
CREATE DATABASE referpeople_education  OWNER referpeople_user;
CREATE DATABASE referpeople_auth       OWNER referpeople_user;
CREATE DATABASE referpeople_masteradmin OWNER referpeople_user;

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE referpeople_realestate  TO referpeople_user;
GRANT ALL PRIVILEGES ON DATABASE referpeople_loans       TO referpeople_user;
GRANT ALL PRIVILEGES ON DATABASE referpeople_jobs        TO referpeople_user;
GRANT ALL PRIVILEGES ON DATABASE referpeople_education   TO referpeople_user;
GRANT ALL PRIVILEGES ON DATABASE referpeople_auth        TO referpeople_user;
GRANT ALL PRIVILEGES ON DATABASE referpeople_masteradmin TO referpeople_user;
\q
```

### Step 3 — Create .env files for each backend

For each backend folder, copy the example and edit it:

```bash
# Example for BRD_MasterAdmin_Backend_1.1 (Master Admin backend)
cp BRD_MasterAdmin_Backend_1.1/.env.example BRD_MasterAdmin_Backend_1.1/.env
```

Open the .env file and set these values:

```env
DEBUG=True
SECRET_KEY=local-dev-secret-key-change-for-production
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=referpeople_masteradmin
DB_USER=referpeople_user
DB_PASSWORD=ReferPeople@2024
DB_HOST=127.0.0.1
DB_PORT=5432

REDIS_URL=redis://127.0.0.1:6379/0
```

**Repeat for every backend folder:**
- `BRD_MasterAdmin_Backend_1.1` → DB_NAME=referpeople_masteradmin
- `BRD-MergedTenantMaster-Backend` → DB_NAME=referpeople_auth
- `BRD-website-main-backend` → DB_NAME=referpeople_realestate
- `BRD-TenantAdmin_backend_2.0` → DB_NAME=referpeople_masteradmin
- etc.

### Step 4 — Install Python dependencies for each backend

```bash
# For each backend:
cd BRD_MasterAdmin_Backend_1.1
python3 -m venv venv
source venv/bin/activate          # Mac/Linux
# OR: venv\Scripts\activate       # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Set: superadmin@referpeople.in / SuperAdmin@2024
deactivate
cd ..
```

Repeat for all backend folders.

### Step 5 — Start Redis

```bash
# Mac/Linux:
redis-server &

# Windows: Start Redis from Start Menu or:
redis-server.exe
```

### Step 6 — Start all backends (one terminal each, OR use the script)

**Option A — Use the startup script:**

```bash
chmod +x start-referpeople.sh
./start-referpeople.sh backends
```

**Option B — Start manually (open separate terminal for each):**

```bash
# Terminal 1 — Master Admin Backend (port 8001)
cd BRD_MasterAdmin_Backend_1.1
source venv/bin/activate
python manage.py runserver 0.0.0.0:8001

# Terminal 2 — Website Backend (port 8013)
cd BRD-website-main-backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8013

# (and so on for each backend)
```

### Step 7 — Install frontend dependencies

```bash
# For each frontend folder:
cd BRD-website-main
npm install
cd ..

cd BRD_MasterAdmin_Frontend_1.1
npm install
cd ..

# Repeat for all frontend folders
```

### Step 8 — Create frontend .env files

```bash
# BRD-website-main/.env
VITE_API_BASE_URL=http://localhost:8013/api
VITE_AUTH_URL=http://localhost:8001/api/auth

# BRD_MasterAdmin_Frontend_1.1/.env
VITE_API_BASE_URL=http://localhost:8001/api
VITE_AUTH_URL=http://localhost:8001/api/auth
```

### Step 9 — Start frontends

```bash
# Terminal: Main Website (Real Estate)
cd BRD-website-main
npm run dev -- --port 5173

# Terminal: Master Admin Dashboard
cd BRD_MasterAdmin_Frontend_1.1
npm run dev -- --port 5174
```

### Step 10 — Open in browser

| Service | URL |
|---------|-----|
| Main Website | http://localhost:5173 |
| Master Admin | http://localhost:5174 |
| Tenant Admin | http://localhost:5175 |
| API (backend) | http://localhost:8001/api/ |
| Django Admin | http://localhost:8001/admin/ |

Login: `superadmin@referpeople.in` / `SuperAdmin@2024`

---

## PART 3 — AWS EC2 DEPLOYMENT (Simple — No Kubernetes)

### Architecture: EC2 + Docker Compose + RDS + S3 + Route 53

```
Internet
    |
Route 53 (referpeople.in -> EC2 IP)
    |
EC2 Instance (t3.large, Ubuntu 22.04)
    |--- Nginx (port 80/443) — reverse proxy
    |--- Docker Compose running all containers:
         |--- realestate-frontend    (port 3000)
         |--- loans-frontend         (port 3001)
         |--- jobs-frontend          (port 3002)
         |--- education-frontend     (port 3003)
         |--- masteradmin-frontend   (port 3004)
         |--- realestate-backend     (port 8001)
         |--- loans-backend          (port 8002)
         |--- jobs-backend           (port 8003)
         |--- education-backend      (port 8004)
         |--- auth-backend           (port 8000)
         |--- masteradmin-backend    (port 8005)
         |--- redis                  (port 6379)
    |
RDS PostgreSQL (managed database)
    |
S3 (media files — property images, resumes, etc.)
```

### STEP 1 — Create AWS Account & Set Up IAM User

1. Go to **aws.amazon.com** and create an account
2. Go to **IAM** (Identity and Access Management)
3. Click **Users** → **Create User**
4. Name: `referpeople-deploy`
5. Attach policies:
   - `AmazonEC2FullAccess`
   - `AmazonRDSFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonRoute53FullAccess`
   - `AmazonSESFullAccess`
6. Click **Create User** → **Security Credentials** → **Create Access Key**
7. Save: `Access Key ID` and `Secret Access Key`

### STEP 2 — Launch EC2 Instance

1. Go to **EC2** in AWS Console
2. Click **Launch Instance**
3. Settings:
   - Name: `referpeople-server`
   - OS: **Ubuntu Server 22.04 LTS** (Free tier / t3.large for production)
   - Instance type: `t3.large` (2 vCPU, 8GB RAM) — recommended for all services
   - Key pair: Click **Create new key pair** → name it `referpeople-key` → Download `.pem` file → **SAVE IT SAFELY** (you can't download it again)
   - Security Group: Create new with these rules:
     - SSH: Port 22, Source: My IP (your home/office IP)
     - HTTP: Port 80, Source: Anywhere (0.0.0.0/0)
     - HTTPS: Port 443, Source: Anywhere (0.0.0.0/0)
   - Storage: 30GB (gp3)
4. Click **Launch Instance**
5. Note the **Public IPv4 address** (e.g. 13.232.xxx.xxx)

### STEP 3 — Create RDS PostgreSQL Database

1. Go to **RDS** in AWS Console
2. Click **Create database**
3. Settings:
   - Engine: **PostgreSQL 15.4**
   - Template: **Free tier** (for testing) OR **Production** (for live)
   - DB instance identifier: `referpeople-db`
   - Master username: `referpeople_admin`
   - Master password: `ReferPeople@DB2024!` ← write this down
   - Instance class: `db.t3.micro` (free tier) or `db.t3.medium` (production)
   - Storage: 20GB (auto-scaling enabled)
   - VPC: **Same VPC as your EC2 instance**
   - Public access: **Yes** (for initial setup, disable later)
4. Click **Create database**
5. Wait 5–10 minutes
6. Copy the **Endpoint** (looks like: `referpeople-db.xxxxxxx.ap-south-1.rds.amazonaws.com`)

**Add RDS to EC2 Security Group:**
- Go to your RDS instance → Security Group → Edit inbound rules
- Add: PostgreSQL (port 5432) → Source: EC2 security group ID

### STEP 4 — Create S3 Bucket (for media files)

1. Go to **S3** in AWS Console
2. Click **Create bucket**
3. Settings:
   - Bucket name: `referpeople-media`
   - Region: `ap-south-1` (Mumbai)
   - Uncheck "Block all public access" (for media images)
4. Click **Create bucket**
5. Go to bucket → **Permissions** → **Bucket Policy** → paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::referpeople-media/*"
    }
  ]
}
```

### STEP 5 — Connect to EC2 via SSH

```bash
# On your computer — first fix key permissions (Mac/Linux only):
chmod 400 /path/to/referpeople-key.pem

# Connect:
ssh -i /path/to/referpeople-key.pem ubuntu@YOUR-EC2-IP

# Example:
ssh -i ~/Downloads/referpeople-key.pem ubuntu@13.232.219.91
```

**Windows users:** Use PuTTY or Windows Terminal with the .pem key.

### STEP 6 — Set Up EC2 Server (run on the EC2, not your computer)

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker
docker --version   # should show Docker 24+

# Install Docker Compose
sudo apt install -y docker-compose-plugin
docker compose version   # should show v2.x

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot (for free SSL)
sudo apt install -y certbot python3-certbot-nginx

# Verify everything
docker --version && docker compose version && nginx -v && certbot --version
```

### STEP 7 — Create the project databases on RDS

```bash
# On EC2, install psql client
sudo apt install -y postgresql-client

# Connect to RDS (replace with your RDS endpoint)
psql -h referpeople-db.xxxxxxx.ap-south-1.rds.amazonaws.com \
     -U referpeople_admin \
     -d postgres

# Inside psql, run:
CREATE DATABASE referpeople_realestate;
CREATE DATABASE referpeople_loans;
CREATE DATABASE referpeople_jobs;
CREATE DATABASE referpeople_education;
CREATE DATABASE referpeople_auth;
CREATE DATABASE referpeople_masteradmin;
\q
```

### STEP 8 — Clone your GitHub repo onto EC2

```bash
# On EC2:
cd /home/ubuntu
git clone https://github.com/vizz-bob/BRD_FINAL.git referpeople-platform
cd referpeople-platform
```

### STEP 9 — Create .env file on EC2

```bash
# On EC2:
nano /home/ubuntu/referpeople-platform/.env
```

Paste and fill in your values:

```env
# Django
DEBUG=False
SECRET_KEY=GENERATE-A-RANDOM-50-CHAR-KEY-HERE
ALLOWED_HOSTS=referpeople.in,www.referpeople.in,YOUR-EC2-IP

# Database (use your RDS endpoint)
DB_HOST=referpeople-db.xxxxxxx.ap-south-1.rds.amazonaws.com
DB_PORT=5432
DB_USER=referpeople_admin
DB_PASSWORD=ReferPeople@DB2024!

# Per-service DB names (backends will read these)
MASTERADMIN_DB_NAME=referpeople_masteradmin
AUTH_DB_NAME=referpeople_auth
REALESTATE_DB_NAME=referpeople_realestate
LOANS_DB_NAME=referpeople_loans
JOBS_DB_NAME=referpeople_jobs
EDUCATION_DB_NAME=referpeople_education

# Redis
REDIS_URL=redis://redis:6379/0

# AWS
AWS_REGION=ap-south-1
AWS_S3_BUCKET=referpeople-media
AWS_ACCESS_KEY_ID=YOUR-ACCESS-KEY-ID
AWS_SECRET_ACCESS_KEY=YOUR-SECRET-ACCESS-KEY

# Email (use Gmail SMTP for testing, SES for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@referpeople.in

# CORS
CORS_ALLOWED_ORIGINS=https://referpeople.in,https://www.referpeople.in
```

To generate SECRET_KEY:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

### STEP 10 — Update Nginx config on EC2

```bash
# Copy your nginx config
sudo cp /home/ubuntu/referpeople-platform/nginx/conf.d/referpeople.conf \
        /etc/nginx/sites-available/referpeople.conf

# Update the server_name with your EC2 IP (before SSL is ready)
sudo nano /etc/nginx/sites-available/referpeople.conf
# Change: server_name referpeople.in www.referpeople.in;
# To:     server_name referpeople.in www.referpeople.in YOUR-EC2-IP;

# Enable the site
sudo ln -sf /etc/nginx/sites-available/referpeople.conf \
            /etc/nginx/sites-enabled/referpeople.conf

# Remove default nginx page
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

**Temporary HTTP-only nginx config** (before SSL — put this in referpeople.conf):

```nginx
server {
    listen 80;
    server_name referpeople.in www.referpeople.in YOUR-EC2-IP;
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /api/auth/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /api/realestate/ {
        proxy_pass http://localhost:8001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /loans/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
    }
    location /api/loans/ {
        proxy_pass http://localhost:8002/api/;
        proxy_set_header Host $host;
    }
    location /jobs/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host $host;
    }
    location /api/jobs/ {
        proxy_pass http://localhost:8003/api/;
        proxy_set_header Host $host;
    }
    location /education/ {
        proxy_pass http://localhost:3003/;
        proxy_set_header Host $host;
    }
    location /api/education/ {
        proxy_pass http://localhost:8004/api/;
        proxy_set_header Host $host;
    }
    location /master-admin/ {
        proxy_pass http://localhost:3004/;
        proxy_set_header Host $host;
    }
    location /api/master-admin/ {
        proxy_pass http://localhost:8005/api/;
        proxy_set_header Host $host;
    }
    location /static/ { alias /var/www/static/; }
    location /media/  { alias /var/www/media/; }
}
```

### STEP 11 — Start all services with Docker Compose

```bash
# On EC2:
cd /home/ubuntu/referpeople-platform

# Build all Docker images (first time takes 10-20 minutes)
docker compose build

# Start everything
docker compose up -d

# Check all containers are running
docker compose ps
```

You should see all containers with status `Up`.

### STEP 12 — Run database migrations

```bash
# On EC2:
cd /home/ubuntu/referpeople-platform

docker compose exec masteradmin-backend python manage.py migrate
docker compose exec realestate-backend python manage.py migrate
docker compose exec loans-backend python manage.py migrate
docker compose exec jobs-backend python manage.py migrate
docker compose exec education-backend python manage.py migrate
docker compose exec auth-backend python manage.py migrate
```

### STEP 13 — Create Super Admin account

```bash
docker compose exec auth-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='superadmin@referpeople.in').exists():
    u = User.objects.create_superuser('superadmin@referpeople.in', 'SuperAdmin@2024')
    print('Super Admin created successfully!')
else:
    print('Super Admin already exists.')
"
```

### STEP 14 — Test everything is working

```bash
# On EC2 — test each backend is responding:
curl http://localhost:8000/api/       # Auth
curl http://localhost:8001/api/       # Real Estate
curl http://localhost:8002/api/       # Loans
curl http://localhost:8003/api/       # Jobs
curl http://localhost:8004/api/       # Education

# Test nginx is routing correctly:
curl http://YOUR-EC2-IP/
curl http://YOUR-EC2-IP/loans/
curl http://YOUR-EC2-IP/jobs/
curl http://YOUR-EC2-IP/education/
```

---

## PART 4 — DNS SETUP (Point referpeople.in to EC2)

### If your domain is at GoDaddy / Namecheap / BigRock:

1. Log in to your domain registrar
2. Go to **DNS Management** for `referpeople.in`
3. Delete any existing A records for `@` and `www`
4. Add these DNS records:

| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| A | @ | YOUR-EC2-IP (e.g. 13.232.219.91) | 300 |
| A | www | YOUR-EC2-IP | 300 |
| CNAME | api | referpeople.in | 300 |

5. Save changes
6. Wait 10–30 minutes for DNS to propagate
7. Test: `nslookup referpeople.in` → should return your EC2 IP

### If you want to use Route 53 (optional, more reliable):

1. Go to **Route 53** → **Hosted zones** → **Create hosted zone**
2. Domain name: `referpeople.in`
3. Copy the 4 NS (Name Server) records shown
4. Go to your domain registrar → Update **Nameservers** to these 4 Route 53 NS values
5. Back in Route 53 → Create A record:
   - Record name: (blank, for root)
   - Type: A
   - Value: YOUR-EC2-IP
   - TTL: 300
6. Create another A record:
   - Record name: www
   - Type: A
   - Value: YOUR-EC2-IP

---

## PART 5 — FREE SSL CERTIFICATE (HTTPS)

Once DNS is pointing to your EC2 and propagated:

```bash
# On EC2:

# Get SSL certificate for referpeople.in
sudo certbot --nginx -d referpeople.in -d www.referpeople.in \
  --non-interactive --agree-tos --email admin@referpeople.in

# Certbot will automatically update your nginx config with SSL
# Test HTTPS:
curl https://referpeople.in

# Auto-renewal (certbot adds this automatically, but verify):
sudo certbot renew --dry-run

# Add crontab for renewal (if not already there):
sudo crontab -e
# Add this line:
0 12 * * * certbot renew --quiet --post-hook "nginx -s reload"
```

---

## PART 6 — CI/CD: AUTO-DEPLOY ON EVERY GIT PUSH

This makes it so every time you `git push origin main`, your EC2 automatically pulls and redeploys.

### Set up GitHub Actions Secrets

1. Go to your GitHub repo: https://github.com/vizz-bob/BRD_FINAL
2. Click **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `EC2_HOST` | Your EC2 Public IP (e.g. 13.232.219.91) |
| `EC2_USER` | ubuntu |
| `EC2_SSH_KEY` | Contents of your .pem file (the entire text including -----BEGIN...) |

### The CI/CD workflow is already in `.github/workflows/deploy-developer.yml`

It will:
1. Run on every push to `main`
2. SSH into EC2
3. Pull latest code
4. Rebuild Docker images
5. Restart containers
6. Run migrations automatically

---

## PART 7 — DAY-TO-DAY MANAGEMENT COMMANDS

All run on EC2 via SSH:

```bash
# View all running containers
docker compose ps

# View logs (real-time)
docker compose logs -f

# View logs for specific service
docker compose logs -f realestate-backend
docker compose logs -f auth-backend

# Restart a single service
docker compose restart realestate-backend

# Restart everything
docker compose restart

# Pull latest code and redeploy
git pull origin main
docker compose up -d --build

# Stop everything
docker compose down

# Start everything
docker compose up -d

# Run a Django management command
docker compose exec realestate-backend python manage.py migrate
docker compose exec auth-backend python manage.py createsuperuser

# Open a shell inside a container
docker compose exec realestate-backend bash

# View disk space
df -h

# View memory usage
free -h

# View CPU usage
htop
```

---

## PART 8 — LATER: ADD KUBERNETES (When Ready)

When your traffic grows and you need auto-scaling, move to Kubernetes.  
**You do NOT need to do this at launch. Do it after testing.**

### When should you add Kubernetes?

Add Kubernetes when:
- You have 500+ daily active users
- You need zero-downtime deployments
- You need to auto-scale backends during peak load
- You have a DevOps person or more budget

### Migration path (future — not now):

```
Current:  EC2 + Docker Compose  (simple, cheap ~$50–100/month)
    |
    v
Future:   AWS EKS + Kubernetes  (scalable, ~$300–500/month)
```

### When you're ready, the Kubernetes files are already prepared at:

```
aws-deployment/k8s/
├── namespace.yaml
├── secrets.yaml
├── ingress.yaml
└── (service deployment files)
```

Run the Kubernetes migration when ready:

```bash
# 1. Create EKS cluster
eksctl create cluster --name referpeople-cluster --region ap-south-1 \
  --node-type t3.medium --nodes 3

# 2. Apply all manifests
kubectl apply -f aws-deployment/k8s/

# 3. Verify
kubectl get pods -n referpeople
```

---

## PART 9 — COST ESTIMATE

### AWS EC2 Setup (what you need NOW):

| Service | Type | Monthly Cost |
|---------|------|-------------|
| EC2 Instance | t3.large (2vCPU, 8GB) | ~$60 |
| RDS PostgreSQL | db.t3.micro (Free tier 1yr) | $0 → $25 |
| S3 Storage | 50GB media files | ~$1–2 |
| Route 53 DNS | referpeople.in | ~$0.50 |
| Data Transfer | 50GB/month | ~$4 |
| SSL Certificate | Let's Encrypt | FREE |
| **Total** | | **~$65–90/month** |

### After adding Kubernetes (future):

| Service | Type | Monthly Cost |
|---------|------|-------------|
| EKS Cluster | 3x t3.medium nodes | ~$180 |
| RDS PostgreSQL | db.t3.medium Multi-AZ | ~$80 |
| ALB Load Balancer | | ~$20 |
| ElastiCache Redis | cache.t3.micro | ~$15 |
| S3 + Data Transfer | | ~$10 |
| **Total** | | **~$305/month** |

---

## QUICK REFERENCE — MOST USED COMMANDS

```bash
# === On your computer ===

# Push to GitHub (triggers auto-deploy)
git add -A && git commit -m "your message" && git push origin main

# Connect to EC2
ssh -i ~/referpeople-key.pem ubuntu@YOUR-EC2-IP

# === On EC2 server ===

# Check all services are running
docker compose ps

# See logs
docker compose logs -f

# Redeploy after code change
git pull && docker compose up -d --build

# Create admin user
docker compose exec auth-backend python manage.py createsuperuser

# Run migrations
docker compose exec auth-backend python manage.py migrate

# Restart nginx
sudo systemctl restart nginx

# Renew SSL
sudo certbot renew
```

---

*ReferPeople.in — Deploy Guide v1.0*  
*EC2 + Docker Compose (no Kubernetes required at launch)*  
*Add Kubernetes later when traffic grows*
