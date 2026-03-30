#!/bin/bash
set -e

echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "DB not ready - waiting 2s..."
  sleep 2
done
echo "✅ Database is ready!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput 2>/dev/null || true

echo "Starting Gunicorn..."
exec gunicorn \
  --bind 0.0.0.0:8000 \
  --workers 2 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  $(find . -name "wsgi.py" | head -1 | xargs dirname | sed 's|./||' | sed 's|/|.|g').wsgi:application
