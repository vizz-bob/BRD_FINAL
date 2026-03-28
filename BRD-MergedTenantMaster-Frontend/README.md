# TenantMaster Project

This project is a merged version of the `BRD-Master` and `BRD-Tenant` frontend codebases. It features a unified dashboard with a single sidebar incorporating modules from both projects.

## Project Structure

- `src/layout`: Unified `Sidebar.jsx` and `Header.jsx`.
- `src/pages/master`: Original pages from `BRD-Master`.
- `src/pages/tenant`: Original pages from `BRD-Tenant`.
- `src/components/master`: Components used by Master pages.
- `src/components/tenant`: Components used by Tenant pages.
- `src/App.jsx`: Merged routing configuration.
- `src/main.jsx`: Main entry point.

## How to Get Started

1. **Initialize a New React Project**:
   If you haven't already, you can initialize a new Vite project in this directory:
   ```bash
   npm create vite@latest . -- --template react
   ```
   *Note: This might overwrite some files, so it's better to initialize in a separate folder and move the `src` folder there, or be careful.*

2. **Install Dependencies**:
   Both project dependencies have been merged. Install them using:
   ```bash
   npm install @heroicons/react lucide-react react-router-dom axios jwt-decode recharts react-icons
   ```
   For Tailwind CSS support (used in both projects):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Run the Project**:
   ```bash
   npm run dev
   ```

## Key Merged Features

- **Unified Sidebar**: All modules are now accessible through a single sidebar.
- **Master Admin Exclusions**: The first 4 tabs from the Master Admin panel (Home, Organizations, Users, Roles) have been excluded.
- **Shared Authentication**: The `App.jsx` handles common login and navigation logic.
