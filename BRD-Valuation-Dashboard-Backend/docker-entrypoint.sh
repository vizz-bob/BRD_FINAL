#!/bin/bash
set -e
echo "Waiting for database..."
while ! nc -z localhost 5432; do
  echo "DB not ready - waiting 2s..."
  sleep 2
done
echo "Database ready!"
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear 2>/dev/null || true
echo "Starting server..."
exec ""
