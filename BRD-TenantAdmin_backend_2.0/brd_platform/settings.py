"""
Django settings for brd_platform project.
Test / dev settings only — change SECRET_KEY for production.
"""
from pathlib import Path
import os
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "use-at-least-32-characters-long-secret-key!!!!"
DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",

    # Local apps
    "tenants",
    "user",
    "crm",
    "access_control",
    "integrations",
    "lms",
    "los",
    "product",
    "risk_engine",
    "internal",
    "system_settings",
    "finance",
    "branches",
    "businesses",
    "escalation",
    "banking",
    "ticket",
    "engine",
    "disbursement",
    "reporting",
    "subscriptions",
    "documents",
    "frontend_mock",
    "communications",
    "compliance",
    "tenantuser",
    "loan_collections",
    "channel_partners",
    "adminpanel",
    "partners",
    "role",
]


INSTALLED_APPS += ["axes"]



MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",

    # CORS must be here
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",

    # Tenant middleware (your custom)
    "brd_platform.middleware.TenantMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

MIDDLEWARE += ["axes.middleware.AxesMiddleware"]

AXES_ENABLED = True                     # Keep it enabled
AXES_FAILURE_LIMIT = 5                  # Max failed attempts
AXES_COOLOFF_TIME = 1                   # Lockout duration in hours
AXES_LOCKOUT_PARAMETERS = ['username', 'ip_address']  # Track by username + IP  

AXES_EXCLUDE_URLS = [
    r'^/api/token',
]

ROOT_URLCONF = "brd_platform.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "brd_platform.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("DB_ENGINE", "django.db.backends.postgresql"),
        "NAME": os.environ.get("DB_NAME", "loancrm"),
        "USER": os.environ.get("DB_USER", "brdapp"),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
        "OPTIONS": {
            "connect_timeout": 20,
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = 'user.User'


AUTHENTICATION_BACKENDS = [
    "user.backends.EmailBackend",          # your custom backend
    "django.contrib.auth.backends.ModelBackend",
    "axes.backends.AxesBackend",             # always last
]
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
      "DEFAULT_THROTTLE_CLASSES": [
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "5/min",
    },
    
}

# ------------------------------------
# CORS SETTINGS (NEW + FIXED)
# ------------------------------------

CORS_ALLOWED_ORIGINS = [
    "http://65.0.30.83:3001",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
    "http://localhost:5174",
]

# Add missing Vite origin
CORS_ALLOWED_ORIGINS += [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",

]

# Allow cookies / tokens
CORS_ALLOW_CREDENTIALS = True

# CSRF fix for Vite
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "SIGNING_KEY": "one-shared-jwt-secret-for-both-projects-min-32-chars",
}