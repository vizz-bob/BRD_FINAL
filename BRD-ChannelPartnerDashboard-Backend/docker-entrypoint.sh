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
