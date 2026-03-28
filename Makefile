# LoanCRM Platform - Easy Commands
# Usage: make <command>

.PHONY: help build up down logs restart status clean

help:
	@echo "Available commands:"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - View all logs"
	@echo "  make status   - Check service status"
	@echo "  make restart  - Restart all services"
	@echo "  make clean    - Remove all containers and images"

build:
	docker compose build --parallel

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=100

status:
	docker compose ps

restart:
	docker compose down && docker compose up -d

clean:
	docker compose down --rmi all --volumes --remove-orphans

backend-logs:
	docker compose logs -f website-backend masteradmin-backend tenant-backend

frontend-logs:
	docker compose logs -f website-frontend masteradmin-frontend

nginx-logs:
	docker compose logs -f nginx

redis-logs:
	docker compose logs -f redis
