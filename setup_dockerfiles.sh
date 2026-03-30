#!/bin/bash

# ── BACKEND DOCKERFILE ──────────────────────────────
create_backend_dockerfile() {
  local dir=$1
  cat > "$dir/Dockerfile" << 'EOF'
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev gcc curl netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install gunicorn psycopg2-binary

COPY . .

RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

USER appuser
EXPOSE 8000
ENTRYPOINT ["/docker-entrypoint.sh"]
EOF
}

# ── BACKEND ENTRYPOINT ──────────────────────────────
create_backend_entrypoint() {
  local dir=$1
  cat > "$dir/docker-entrypoint.sh" << 'EOF'
#!/bin/bash
set -e

echo "Waiting for database..."
while ! nc -z $DB_HOST ${DB_PORT:-5432}; do
  echo "DB not ready - waiting 2s..."
  sleep 2
done
echo "Database is ready!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Starting server..."
WSGI_MODULE=$(find . -name "wsgi.py" | head -1 | sed 's|./||' | sed 's|/wsgi.py||' | sed 's|/|.|g')
exec gunicorn \
  --bind 0.0.0.0:8000 \
  --workers 2 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  ${WSGI_MODULE}.wsgi:application
EOF
  chmod +x "$dir/docker-entrypoint.sh"
}

# ── FRONTEND DOCKERFILE ─────────────────────────────
create_frontend_dockerfile() {
  local dir=$1
  cat > "$dir/Dockerfile" << 'EOF'
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
}

# ── FRONTEND NGINX CONFIG ───────────────────────────
create_frontend_nginx() {
  local dir=$1
  cat > "$dir/nginx.conf" << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
}

# ── CREATE FOR ALL BACKENDS ─────────────────────────
BACKENDS=(
  "BRD_MasterAdmin_Backend_1.1"
  "BRD-MergedTenantMaster-Backend"
  "BRD_CRM_1.1_BACKEND"
  "BRD_FINANCE_DASHBOARD_Backend"
  "BRD-AgentsApp-Backend"
  "BRD-ChannelPartnerDashboard-Backend"
  "BRD-FraudTeam-Dashboard-Backend"
  "BRD-LegalDashboard-Backend"
  "BRD-OperationVerification-Backend"
  "BRD-SalesCRM-Dashboard-Backend"
  "BRD-TenantAdmin_backend_2.0"
  "BRD-Valuation-Dashboard-Backend"
  "BRD-website-main-backend"
)

echo "=== CREATING BACKEND DOCKERFILES ==="
for dir in "${BACKENDS[@]}"; do
  if [ -d "$dir" ]; then
    create_backend_dockerfile "$dir"
    create_backend_entrypoint "$dir"
    echo "✅ Backend: $dir"
  else
    echo "❌ MISSING: $dir"
  fi
done

# ── CREATE FOR ALL FRONTENDS ────────────────────────
FRONTENDS=(
  "BRD-website-main"
  "BRD_MasterAdmin_Frontend_1.1"
  "BRD-MergedTenantMaster-Frontend"
  "BRD_CRM-1.1"
  "BRD_FINANCE_DASHBOARD"
  "BRD_SALES_CRM"
  "BRD_TenantAdmin_Frontend_1.1"
  "BRD-ChannelPartner-Dashboard"
  "BRD-FraudTeamDashboard"
  "BRD-LEGAL-dashboard"
  "BRD-Operation-Verification-Dashboard"
  "BRD-ValuationDashboard"
)

echo "=== CREATING FRONTEND DOCKERFILES ==="
for dir in "${FRONTENDS[@]}"; do
  if [ -d "$dir" ]; then
    create_frontend_dockerfile "$dir"
    create_frontend_nginx "$dir"
    echo "✅ Frontend: $dir"
  else
    echo "❌ MISSING: $dir"
  fi
done

echo "=== DONE! ==="
