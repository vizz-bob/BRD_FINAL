# STEP-BY-STEP DEPLOYMENT GUIDE
## ReferPeople.in — AWS EC2 + Docker Compose

> **No Kubernetes needed.** Everything runs on one EC2 server using Docker Compose.  
> Total setup time: ~60–90 minutes (first time)

---

# PHASE 1 — PUSH YOUR CODE TO GITHUB

## Do this on YOUR COMPUTER (not EC2)

### Step 1 — Open Terminal and go to your project

**Mac / Linux:**
```bash
cd /Volumes/traininig/BRD/BRD_FINAL
```

**Windows (Git Bash or Command Prompt):**
```bash
cd C:\path\to\BRD_FINAL
```

---

### Step 2 — Stage all changes

```bash
git add -A
```

---

### Step 3 — Commit

```bash
git commit -m "deploy: referpeople.in platform ready for AWS EC2"
```

---

### Step 4 — Push to GitHub

```bash
git push origin main
```

If it asks for a password:
- Username: your GitHub username
- Password: use a **Personal Access Token** (not your GitHub password)
- Create one at: `github.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token`
- Check boxes: `repo` and `workflow`

---

### Step 5 — Create developer branch

```bash
git checkout -b develop
git push -u origin develop
git checkout main
```

Go to `https://github.com/vizz-bob/BRD_FINAL` — you should see both `main` and `develop` branches. ✅

---

---

# PHASE 2 — SET UP AWS

## Step 6 — Create AWS Account

1. Go to **https://aws.amazon.com**
2. Click **Create an AWS Account**
3. Choose region: **Asia Pacific (Mumbai) — ap-south-1**

---

## Step 7 — Create IAM User (for safe access)

1. In AWS Console, search for **IAM**
2. Click **Users** → **Create user**
3. Name: `referpeople-admin`
4. Select **Attach policies directly**
5. Attach these 5 policies:
   - ✅ `AmazonEC2FullAccess`
   - ✅ `AmazonRDSFullAccess`
   - ✅ `AmazonS3FullAccess`
   - ✅ `AmazonRoute53FullAccess`
   - ✅ `AmazonSESFullAccess`
6. Click **Create user**
7. Click on the user → **Security credentials** tab → **Create access key**
8. Select **CLI** → Next → Create
9. **SAVE BOTH:**
   - Access Key ID: `AKIA...`
   - Secret Access Key: `xxx...`
   ⚠️ You cannot see the secret key again after closing this page

---

## Step 8 — Launch EC2 Instance

1. In AWS Console, search for **EC2**
2. Click **Launch instance**
3. Fill in:
   - **Name:** `referpeople-server`
   - **OS Image:** Ubuntu Server 22.04 LTS (64-bit x86)
   - **Instance type:** `t3.large` (2 vCPU, 8 GB RAM) — needed for all 25 containers
   - **Key pair:** Click **Create new key pair**
     - Name: `referpeople-key`
     - Type: RSA
     - Format: `.pem` (Mac/Linux) or `.ppk` (Windows PuTTY)
     - Click **Create key pair** — file downloads automatically
     - ⚠️ **Move this .pem file to a safe folder. You cannot re-download it.**
   - **Network settings** → Click **Edit** → **Add security group rule:**

| Rule | Type | Port | Source |
|------|------|------|--------|
| 1 | SSH | 22 | My IP (auto-fills your current IP) |
| 2 | HTTP | 80 | Anywhere (0.0.0.0/0) |
| 3 | HTTPS | 443 | Anywhere (0.0.0.0/0) |

   - **Storage:** Change to `30 GB` (gp3)

4. Click **Launch instance**
5. Click on the instance ID → wait until **Instance state: Running**
6. Copy the **Public IPv4 address** (e.g. `13.232.xxx.xxx`) — you'll need this

---

## Step 9 — Create RDS PostgreSQL Database

1. In AWS Console, search for **RDS**
2. Click **Create database**
3. Settings:
   - **Engine:** PostgreSQL
   - **Version:** PostgreSQL 15.4
   - **Template:** Free tier (testing) or Production (live site)
   - **DB instance identifier:** `referpeople-db`
   - **Master username:** `referpeople_admin`
   - **Master password:** `ReferPeople@DB2024!`
   - **Confirm password:** `ReferPeople@DB2024!`
   - **Instance class:** `db.t3.micro` (free tier) or `db.t3.small` (production)
   - **Storage:** 20 GB, enable auto-scaling
   - **Connectivity:** Choose the same VPC as your EC2 instance
   - **Public access:** Yes (needed for initial setup)
   - **VPC security group:** Create new → name: `referpeople-rds-sg`
4. Scroll down → **Additional configuration:**
   - Initial database name: `postgres`
5. Click **Create database**
6. Wait 5–10 minutes until status shows **Available**
7. Click on the database → copy the **Endpoint** — looks like:
   `referpeople-db.abcdefg12345.ap-south-1.rds.amazonaws.com`

**Allow EC2 to connect to RDS:**
1. Go to your EC2 instance → copy its **Security Group ID** (e.g. `sg-0abc123`)
2. Go to your RDS instance → Security → click the VPC security group
3. Click **Edit inbound rules** → **Add rule**
   - Type: PostgreSQL
   - Port: 5432
   - Source: Custom → paste your EC2 security group ID (`sg-0abc123`)
4. Click **Save rules**

---

## Step 10 — Create S3 Bucket (for images and files)

1. In AWS Console, search for **S3**
2. Click **Create bucket**
3. Settings:
   - **Bucket name:** `referpeople-media`
   - **Region:** ap-south-1 (Mumbai)
   - **Block Public Access:** Uncheck **Block all public access** → confirm
4. Click **Create bucket**
5. Click on the bucket → **Permissions** tab → **Bucket policy** → **Edit**
6. Paste this (replace `referpeople-media` if you chose a different name):

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

7. Click **Save changes**

---

---

# PHASE 3 — SET UP EC2 SERVER

## Step 11 — Connect to EC2 via SSH

**On Mac / Linux — open Terminal:**
```bash
# Fix key permissions (required, or SSH will refuse)
chmod 400 ~/Downloads/referpeople-key.pem

# Connect (replace with your EC2 IP)
ssh -i ~/Downloads/referpeople-key.pem ubuntu@13.232.xxx.xxx
```

**On Windows:**
- Download and install **PuTTY** from putty.org
- Open PuTTY → Host: `13.232.xxx.xxx`, Port: `22`
- Go to **Connection → SSH → Auth → Credentials**
- Browse and select your `.ppk` key file
- Click **Open** → login as: `ubuntu`

> ✅ You should see `ubuntu@ip-xxx:~$` — you are now on EC2

---

## Step 12 — Install everything on EC2

**Copy and run this entire block on EC2:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Verify Docker
docker --version

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin
docker compose version

# Install other tools
sudo apt install -y git nginx certbot python3-certbot-nginx postgresql-client

# Start and enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify all installed
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker compose version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Git: $(git --version)"
```

---

## Step 13 — Create all databases on RDS

```bash
# On EC2 — replace the RDS endpoint with yours
psql -h referpeople-db.abcdefg12345.ap-south-1.rds.amazonaws.com \
     -U referpeople_admin \
     -d postgres
```

When it asks for a password, enter: `ReferPeople@DB2024!`

Once inside the `postgres=#` prompt, run ALL of these:

```sql
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
CREATE DATABASE website_db;
```

Then:
```sql
\l
```
You should see all 13 databases listed. Then:
```sql
\q
```

---

## Step 14 — Clone your GitHub repo onto EC2

```bash
# On EC2:
cd /home/ubuntu
git clone https://github.com/vizz-bob/BRD_FINAL.git referpeople
cd referpeople
```

---

## Step 15 — Create all .env files (one command)

```bash
# On EC2 — inside /home/ubuntu/referpeople:
nano create-env-files.sh
```

At the top of the file, update these 4 lines with your real values:

```bash
DB_HOST="referpeople-db.abcdefg12345.ap-south-1.rds.amazonaws.com"   # YOUR RDS ENDPOINT
SERVER_IP="13.232.xxx.xxx"                                              # YOUR EC2 IP
AWS_ACCESS_KEY_ID="AKIA..."                                             # YOUR AWS KEY
AWS_SECRET_ACCESS_KEY="xxx..."                                          # YOUR AWS SECRET
```

Press `Ctrl+X` → `Y` → `Enter` to save.

Then run it:
```bash
chmod +x create-env-files.sh
./create-env-files.sh
```

You should see 13 green "Created" lines — one .env per backend. ✅

---

## Step 16 — Update docker-compose.yml with your EC2 IP

```bash
# Replace the old IP with your new EC2 IP
sed -i 's/13.232.219.91/YOUR-EC2-IP/g' docker-compose.yml

# Verify the change
grep "VITE_API_URL" docker-compose.yml | head -3
```

---

## Step 17 — Update Nginx config with your IP

```bash
# Set up nginx config
sudo cp nginx/conf.d/referpeople.conf /etc/nginx/sites-available/referpeople.conf

# Open the file and change the server_name line
sudo nano /etc/nginx/sites-available/referpeople.conf
```

Find this line:
```
server_name referpeople.in www.referpeople.in;
```

Change it to (temporarily, until your domain points here):
```
server_name referpeople.in www.referpeople.in YOUR-EC2-IP;
```

Also change all `listen 443 ssl` to `listen 80` and remove all `ssl_*` lines for now (you'll add SSL after domain is set up).

**Paste this as a clean temporary HTTP-only config:**

```bash
sudo tee /etc/nginx/sites-available/referpeople.conf > /dev/null << 'NGINX'
server {
    listen 80;
    server_name referpeople.in www.referpeople.in YOUR-EC2-IP;
    client_max_body_size 20M;

    location / {
        proxy_pass http://loancrm_website_frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /master-admin/ {
        proxy_pass http://loancrm_masteradmin_frontend:80/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /tenant/ {
        proxy_pass http://loancrm_tenant_frontend:80/;
        proxy_set_header Host $host;
    }
    location /api/master-admin/ {
        proxy_pass http://loancrm_masteradmin_backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /api/ {
        proxy_pass http://loancrm_masteradmin_backend:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /static/ { alias /var/www/static/; }
    location /media/  { alias /var/www/media/; }
}
NGINX

# Enable site and remove default
sudo ln -sf /etc/nginx/sites-available/referpeople.conf /etc/nginx/sites-enabled/referpeople.conf
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## Step 18 — Build all Docker images

```bash
# On EC2, inside /home/ubuntu/referpeople
# This will take 15–30 minutes (downloads all dependencies)
docker compose build
```

Watch the output — it should show each service building successfully.  
If one fails, check the error message and fix that service's Dockerfile or requirements.txt.

---

## Step 19 — Start all containers

```bash
docker compose up -d
```

Check everything started:

```bash
docker compose ps
```

You should see all containers with status **Up**. Example output:
```
NAME                           STATUS
loancrm_redis                  Up (healthy)
loancrm_masteradmin_backend    Up
loancrm_tenant_backend         Up
loancrm_crm_backend            Up
...
loancrm_website_frontend       Up
loancrm_masteradmin_frontend   Up
...
loancrm_nginx                  Up
```

If any show **Exit** or **Restarting**, check the logs:
```bash
docker compose logs loancrm_masteradmin_backend
```

---

## Step 20 — Run database migrations

```bash
# Run migrations for every backend:
docker compose exec masteradmin-backend python manage.py migrate
docker compose exec tenant-backend python manage.py migrate
docker compose exec crm-backend python manage.py migrate
docker compose exec finance-backend python manage.py migrate
docker compose exec agents-backend python manage.py migrate
docker compose exec channel-backend python manage.py migrate
docker compose exec fraud-backend python manage.py migrate
docker compose exec legal-backend python manage.py migrate
docker compose exec operations-backend python manage.py migrate
docker compose exec salescrm-backend python manage.py migrate
docker compose exec tenantadmin-backend python manage.py migrate
docker compose exec valuation-backend python manage.py migrate
```

Each should end with: `Running deferred SQL... OK` ✅

---

## Step 21 — Create Super Admin (Master Admin account)

```bash
docker compose exec masteradmin-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
email = 'admin@referpeople.in'
password = 'Admin@1234'
if not User.objects.filter(email=email).exists():
    u = User.objects.create_superuser(email, password)
    print('SUCCESS: Super Admin created!')
    print('Email:', email)
    print('Password:', password)
else:
    print('Super Admin already exists')
"
```

---

## Step 22 — Test the website

Open your browser and go to:

```
http://YOUR-EC2-IP
```

You should see the **ReferPeople main website**.

Also test:
```
http://YOUR-EC2-IP/master-admin/     → Master Admin panel
http://YOUR-EC2-IP/tenant/           → Tenant dashboard
```

Login with: `admin@referpeople.in` / `Admin@1234`

---

---

# PHASE 4 — POINT YOUR DOMAIN (referpeople.in → EC2)

## Step 23 — Add DNS records at your registrar

Log in to where you bought **referpeople.in** (GoDaddy / Namecheap / BigRock / etc.)

Go to **DNS Management** and add:

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| A | `@` (or blank) | YOUR-EC2-IP | 300 |
| A | `www` | YOUR-EC2-IP | 300 |

Delete any old A records that were pointing elsewhere.

Save changes. DNS takes **10 minutes to 2 hours** to update.

**Check if it's working:**
```bash
# On your computer:
nslookup referpeople.in
# Should return your EC2 IP
```

---

---

# PHASE 5 — ADD FREE SSL (HTTPS)

## Step 24 — Get SSL certificate

Once `referpeople.in` is pointing to your EC2 IP:

```bash
# On EC2:
sudo certbot --nginx -d referpeople.in -d www.referpeople.in \
  --non-interactive --agree-tos --email admin@referpeople.in
```

Certbot will automatically update nginx config with SSL.

Test HTTPS:
```bash
curl https://referpeople.in
```

It should return HTML. ✅

**Auto-renewal** (certbot usually sets this up automatically):
```bash
sudo certbot renew --dry-run
```

---

---

# PHASE 6 — AUTO-DEPLOY (optional but recommended)

## Step 25 — Set up GitHub Secrets for auto-deploy

1. Go to: `https://github.com/vizz-bob/BRD_FINAL/settings/secrets/actions`
2. Click **New repository secret** and add these 3 secrets:

| Secret Name | Value |
|-------------|-------|
| `EC2_HOST` | `13.232.xxx.xxx` (your EC2 IP) |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Open your .pem file in a text editor, copy the ENTIRE contents (including `-----BEGIN RSA PRIVATE KEY-----` lines) |

Now every time you run `git push origin main`, GitHub will automatically SSH into EC2, pull the latest code, rebuild, and restart all containers. 🚀

---

---

# DAILY MANAGEMENT — USEFUL COMMANDS

All run on EC2 (connected via SSH):

```bash
# === See all containers and their status ===
docker compose ps

# === View all logs (live) ===
docker compose logs -f

# === View logs for one specific service ===
docker compose logs -f masteradmin-backend
docker compose logs -f website-frontend

# === Restart one container ===
docker compose restart masteradmin-backend

# === Restart ALL containers ===
docker compose restart

# === Stop everything ===
docker compose down

# === Start everything ===
docker compose up -d

# === Pull latest code + redeploy ===
git pull origin main
docker compose up -d --build

# === Open a shell inside a container ===
docker compose exec masteradmin-backend bash

# === Check disk space ===
df -h

# === Check memory usage ===
free -h

# === See resource usage of containers ===
docker stats
```

---

# TROUBLESHOOTING

## Container shows "Exit" or "Restarting"

```bash
# View the error:
docker compose logs <container-name>

# Most common fix: .env file issue
# Check that the DB_HOST in the .env file matches your RDS endpoint exactly
cat BRD_MasterAdmin_Backend_1.1/.env | grep DB_HOST

# Recreate that container:
docker compose up -d --force-recreate masteradmin-backend
```

## Website shows "502 Bad Gateway"

```bash
# The backend container isn't ready yet. Check:
docker compose ps

# If backend is running, test nginx routing:
docker compose exec nginx nginx -t

# Reload nginx:
docker compose exec nginx nginx -s reload
```

## "Connection refused" to database

```bash
# Check RDS is reachable from EC2:
nc -zv referpeople-db.xxxxx.ap-south-1.rds.amazonaws.com 5432

# If not reachable: check RDS security group allows port 5432 from EC2's security group
```

## Migration fails

```bash
# Check error:
docker compose logs masteradmin-backend

# Most common: database doesn't exist
# Fix: log into RDS and CREATE DATABASE <name>;

# If migration conflict:
docker compose exec masteradmin-backend python manage.py migrate --fake-initial
```

## Forgot admin password

```bash
docker compose exec masteradmin-backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(email='admin@referpeople.in')
u.set_password('NewPassword@123')
u.save()
print('Password changed!')
"
```

---

# COST SUMMARY

| AWS Service | Spec | Monthly Cost |
|-------------|------|-------------|
| EC2 t3.large | 2 vCPU, 8 GB RAM | ~$60 |
| RDS PostgreSQL db.t3.micro | Free tier (1 year) → db.t3.small | $0 → $25 |
| S3 storage | 50 GB media files | ~$1 |
| Data transfer | 100 GB/month | ~$8 |
| Route 53 DNS | 1 hosted zone | $0.50 |
| SSL Certificate | Let's Encrypt | FREE |
| **TOTAL** | | **~$70–95/month** |

---

# SUMMARY — 25 STEPS CHECKLIST

**On your computer:**
- [ ] Step 1–5: Push code to GitHub, create develop branch

**On AWS console:**
- [ ] Step 6: Create AWS account
- [ ] Step 7: Create IAM user, save access keys
- [ ] Step 8: Launch EC2 t3.large, download .pem key
- [ ] Step 9: Create RDS PostgreSQL, save endpoint
- [ ] Step 10: Create S3 bucket

**On EC2 (via SSH):**
- [ ] Step 11: SSH into EC2
- [ ] Step 12: Install Docker, Nginx, Git, certbot
- [ ] Step 13: Create 13 databases on RDS
- [ ] Step 14: Clone GitHub repo
- [ ] Step 15: Run create-env-files.sh
- [ ] Step 16: Update docker-compose.yml with EC2 IP
- [ ] Step 17: Configure Nginx
- [ ] Step 18: `docker compose build`
- [ ] Step 19: `docker compose up -d`
- [ ] Step 20: Run migrations for all backends
- [ ] Step 21: Create Super Admin account
- [ ] Step 22: Test at `http://YOUR-EC2-IP`

**Domain + SSL:**
- [ ] Step 23: Add DNS records at registrar
- [ ] Step 24: Get free SSL with certbot

**Auto-deploy:**
- [ ] Step 25: Set GitHub Secrets for CI/CD

---

*ReferPeople.in — Step-by-Step Deploy Guide*  
*EC2 + Docker Compose — No Kubernetes required*
