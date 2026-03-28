# Django Backend for Finance Dashboard

This directory contains a Django project that provides the backend APIs consumed by the React frontend located in the parent directory.

## Features

* User authentication via token (login/signup endpoints)
* Endpoints matching those used by the frontend (`/api/v1/finance/...`)
* Simple sample data mirroring the frontend's `mockDashboard.js`
* Basic models for disbursements, repayments, reconciliation, tenants, and settings
* Django admin for data inspection

## Setup

1. **Create a virtual environment** and install dependencies:

   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate    # Windows
   pip install -r requirements.txt
   ```

2. **Apply migrations**:

   ```bash
   python manage.py migrate
   ```

3. **Create a superuser** (optional, for admin interface):

   ```bash
   python manage.py createsuperuser
   ```

4. **Run the development server**:

   ```bash
   python manage.py runserver
   ```

5. **Configure frontend** to point at backend server (e.g. proxy or environment variable).

## Notes

* The views currently return static data for demonstration. You can extend them to query the models.
* Authentication uses DRF's token authentication. After signing up or logging in, include the token in the `Authorization: Token <token>` header.
* The admin interface is available at `/admin/`.
* You can populate the database using fixtures or the admin page.

### Serving the React Frontend

If you prefer to serve the React application from Django rather than running two servers:

1. Build the frontend:
   ```bash
   cd ..  # go to project root
   npm install
   npm run build
   ```
2. Copy the contents of `dist` (or `build`) into a directory served by Django, e.g. `backend/static/`.
3. Configure `STATICFILES_DIRS` in `backend/settings.py` and add a catch‑all view to render `index.html`.

For development it's easier to run Vite (`npm run dev`) alongside `python manage.py runserver` with CORS enabled.

Feel free to expand models, serializers, and views as the application grows.
