# =============================================================================
# BRD Loan CRM Platform — Makefile
# Usage: make <command>
# =============================================================================

.PHONY: help deploy build up down restart logs status migrate superusers clean

help:
	@echo ""
	@echo "BRD Loan CRM — Available Commands"
	@echo "═══════════════════════════════════════"
	@echo "  make deploy      → Full deployment (build + up + migrate + superusers)"
	@echo "  make build       → Build all Docker images"
	@echo "  make up          → Start all containers (detached)"
	@echo "  make down        → Stop all containers"
	@echo "  make restart     → Restart all containers"
	@echo "  make logs        → Follow all logs"
	@echo "  make status      → Show container status"
	@echo "  make migrate     → Run Django migrations on all backends"
	@echo "  make superusers  → Create admin and tenant superusers"
	@echo "  make clean       → Stop and remove containers + volumes"
	@echo ""

deploy:
	@chmod +x deploy.sh && ./deploy.sh

build:
	docker compose build --parallel

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f --tail=50

status:
	@echo ""
	@docker compose ps
	@echo ""
	@echo "Running containers: $$(docker ps | grep loancrm | wc -l) / 26"
	@echo ""

migrate:
	@echo "Running migrations on all backends..."
	@for c in loancrm_masteradmin_backend loancrm_tenant_backend loancrm_crm_backend \
	           loancrm_finance_backend loancrm_agents_backend loancrm_channel_backend \
	           loancrm_fraud_backend loancrm_legal_backend loancrm_operations_backend \
	           loancrm_salescrm_backend loancrm_tenantadmin_backend loancrm_valuation_backend; do \
	    echo -n "  $$c: "; \
	    docker exec $$c python manage.py migrate --noinput 2>&1 | tail -1; \
	done

superusers:
	@echo "Creating superusers..."
	@docker exec loancrm_masteradmin_backend python manage.py shell -c \
	  "from django.contrib.auth import get_user_model; U=get_user_model(); \
	   U.objects.create_superuser('admin','Admin@brd.com','Admin@1234') \
	   if not U.objects.filter(email='Admin@brd.com').exists() else print('Admin exists')"
	@docker exec loancrm_tenant_backend python manage.py shell -c \
	  "from django.contrib.auth import get_user_model; U=get_user_model(); \
	   U.objects.create_superuser('tenant','Tenant@brd.com','Tenant@1234') \
	   if not U.objects.filter(email='Tenant@brd.com').exists() else print('Tenant exists')"
	@echo "Done!"

clean:
	docker compose down -v
	docker system prune -f
