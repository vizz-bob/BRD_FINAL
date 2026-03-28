/**
 * API Configuration File
 * 
 * This file centralizes API configuration for easy management across environments.
 * Update API_BASE_URL based on your environment (development, staging, production).
 */

const API_CONFIG = {
  // Development environment
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Production environment
  production: {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://your-api-domain.com/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
  },

  // Staging environment
  staging: {
    API_BASE_URL: 'https://staging-api.your-domain.com/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1500,
  },
};

// Determine current environment
const getEnvironment = () => {
  if (import.meta.env.VITE_APP_ENV) {
    return import.meta.env.VITE_APP_ENV;
  }
  return import.meta.env.MODE || 'development';
};

const CURRENT_ENV = getEnvironment();
const CONFIG = API_CONFIG[CURRENT_ENV] || API_CONFIG.development;

export default CONFIG;
