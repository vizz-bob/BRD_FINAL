# ReferPeople.in — Makefile
# Usage: make <command>

.PHONY: help start stop restart build migrate superuser logs clean test

COMPOSE = docker compose
BACKENDS = realestate-backend loans-backend jobs-backend education-backend auth-backend masteradmin-backend
FRONTENDS = realestate-frontend loans-frontend jobs-frontend education-frontend masteradmin-frontend

help:
	@echo ""
	@echo "ReferPeople.in Platform Commands:"
	@echo "=================================="
	@echo "  make start        - Start all services"
	@echo "  make stop         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make build        - Build all Docker images"
	@echo "  make migrate      - Run Django migrations on all backends"
	@echo "  make superuser    - Create Super Admin account"
	@echo "  make logs         - Tail logs from all services"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make test         - Run all tests"
	@echo "  make status       - Show status of all services"
	@echo ""

start:
	@echo "Starting ReferPeople.in platform..."
	$(COMPOSE) up -d
	@echo "Platform started! Visit http://localhost:3000"

stop:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

build:
	$(COMPOSE) build --no-cache

migrate:
	@for service in $(BACKENDS); do \
		echo "Migrating $$service..."; \
		$(COMPOSE) exec $$service python manage.py migrate; \
	done

superuser:
	$(COMPOSE) exec auth-backend python manage.py createsuperuser

logs:
	$(COMPOSE) logs -f --tail=100

logs-backend:
	$(COMPOSE) logs -f --tail=100 $(BACKENDS)

logs-frontend:
	$(COMPOSE) logs -f --tail=100 $(FRONTENDS)

clean:
	$(COMPOSE) down -v --remove-orphans
	docker system prune -f

test:
	@for service in $(BACKENDS); do \
		echo "Testing $$service..."; \
		$(COMPOSE) exec $$service python manage.py test; \
	done

status:
	$(COMPOSE) ps

shell-re:
	$(COMPOSE) exec realestate-backend bash

shell-auth:
	$(COMPOSE) exec auth-backend bash

collectstatic:
	@for service in $(BACKENDS); do \
		$(COMPOSE) exec $$service python manage.py collectstatic --noinput; \
	done
