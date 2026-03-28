#!/usr/bin/env python3
# FILE: scripts/create_docker_compose.py
# Run with: python3 scripts/create_docker_compose.py

content = """version: '3.9'

networks:
  loancrm_network:
    driver: bridge

volumes:
  redis_data:
  static_files:
  media_files:

services:

  # ── INFRASTRUCTURE ──────────────────────────────────────────

  redis:
    image: redis:7-alpine
    container_name: loancrm_redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb
    volumes:
      - redis_data:/data
    networks:
      - loancrm_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:1.25-alpine
