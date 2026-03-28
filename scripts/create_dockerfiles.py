#!/usr/bin/env python3
# FILE: scripts/create_dockerfiles.py
# Run with: python3 scripts/create_dockerfiles.py

import os

# ── Backend services: folder name → port ─────────────────────
BACKENDS = {
    "BRD-website-main-backend": "8000",
    "BRD_MasterAdmin_Backend_1.1": "8001",
    "BRD-MergedTenantMaster-Backend": "8002",
    "BRD_CRM_1.1_BACKEND": "8003",
    "BRD_FINANCE_DASHBOARD_Backend": "8004",
    "BRD-AgentsApp-Backend": "8005",
    "BRD-ChannelPartnerDashboard-Backend": "8006",
    "BRD-FraudTeam-Dashboard-Backend": "8007",
    "BRD-LegalDashboard-Backend": "8008",
    "BRD-OperationVerification-Backend": "8009",
    "BRD-SalesCRM-Dashboard-Backend": "8010",
    "BRD-TenantAdmin_backend_2.0": "8011",
    "BRD-Valuation-Dashboard-Backend": "8012",
}

# ── Frontend apps ─────────────────────────────────────────────
FRONTENDS = [
    "BRD-website-main",
    "BRD_MasterAdmin_Frontend_1.1",
    "BRD-MergedTenantMaster-Frontend",
    "BRD_CRM-1.1",
    "BRD_FINANCE_DASHBOARD",
    "BRD_SALES_CRM",
    "BRD_TenantAdmin_Frontend_1.1",
    "BRD-ChannelPartner-Dashboard",
    "BRD-FraudTeamDashboard",
    "BRD-LEGAL-dashboard",
    "BRD-Operation-Verification-Dashboard",
    "BRD-ValuationDashboard",
]


def create_backend_dockerfile(folder, port):
    content = f"""# Service: {folder} | Port: {port}
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PIP_NO_CACHE_DIR=1 \\
    PYTHONPATH=/app

WORKDIR /app

RUN apt-get update && apt-get install -y \\
    libpq-dev gcc curl netcat-traditional \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \\
    pip install -r requirements.txt && \\
    pip install gunicorn psycopg2-binary

COPY . .

RUN adduser --disabled-password --gecos '' appuser && \\
    chown -R appuser:appuser /app

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER appuser

EXPOSE {port}

HEALTHCHECK --interval=30s --timeout=10s \\
    --start-period=60s --retries=3 \\
    CMD curl -f http://localhost:{port}/api/health/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["gunicorn", "config.wsgi:application", \\
     "--bind", "0.0.0.0:{port}", \\
     "--workers", "3", \\
     "--timeout", "120", \\
     "--access-logfile", "-", \\
     "--error-logfile", "-"]
"""
    return content


def create_entrypoint(port):
    content = """#!/bin/bash
set -e

echo "Waiting for database..."
while ! nc -z ${DB_HOST:-localhost} ${DB_PORT:-5432}; do
  echo "DB not ready - retrying in 2s..."
  sleep 2
done
echo "Database is ready!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear 2>/dev/null || true

echo "Starting server..."
exec "$@"
"""
    return content


def create_frontend_dockerfile(folder):
    content = f"""# Frontend: {folder}
# Multi-stage build: Node build + Nginx serve

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

ARG REACT_APP_API_URL=http://13.232.219.91/api
ARG REACT_APP_ENV=production

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

COPY . .
RUN npm run build

FROM nginx:1.25-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
    CMD wget -q -O /dev/null http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
"""
    return content


def create_frontend_nginx():
    content = """server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
"""
    return content


def create_env_example(folder, port):
    content = f"""# Environment file for {folder}
# Copy to .env and fill real values

DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/dbname
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=YourPassword123!

SECRET_KEY=your-50-character-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=13.232.219.91,yourdomain.com,localhost
SERVICE_PORT={port}

AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=loancrm-media-production
AWS_REGION=ap-south-1

REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1

CORS_ALLOWED_ORIGINS=http://13.232.219.91,https://yourdomain.com
"""
    return content


# ── MAIN: Create all files ────────────────────────────────────
print("=" * 60)
print("Creating Dockerfiles for ALL services")
print("=" * 60)

# Create backend Dockerfiles
print("\n📦 BACKEND SERVICES:")
for folder, port in BACKENDS.items():
    if os.path.isdir(folder):
        # Dockerfile
        with open(f"{folder}/Dockerfile", "w") as f:
            f.write(create_backend_dockerfile(folder, port))

        # Entrypoint
        with open(f"{folder}/docker-entrypoint.sh", "w") as f:
            f.write(create_entrypoint(port))
        os.chmod(f"{folder}/docker-entrypoint.sh", 0o755)

        # .env.example
        with open(f"{folder}/.env.example", "w") as f:
            f.write(create_env_example(folder, port))

        print(f"  ✅ {folder} → Port {port}")
    else:
        print(f"  ⚠️  {folder} NOT FOUND - skipping")

# Create frontend Dockerfiles
print("\n🎨 FRONTEND APPS:")
for folder in FRONTENDS:
    if os.path.isdir(folder):
        # Dockerfile
        with open(f"{folder}/Dockerfile", "w") as f:
            f.write(create_frontend_dockerfile(folder))

        # nginx.conf
        with open(f"{folder}/nginx.conf", "w") as f:
            f.write(create_frontend_nginx())

        print(f"  ✅ {folder}")
    else:
        print(f"  ⚠️  {folder} NOT FOUND - skipping")

print("\n" + "=" * 60)
print("✅ ALL FILES CREATED SUCCESSFULLY!")
print("=" * 60)
print("\nNext step: python3 scripts/create_docker_compose.py")
