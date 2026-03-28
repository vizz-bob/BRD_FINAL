# BRD Master Admin Panel

React + Vite application for BRD Master Admin Panel.

## Environment Configuration

To connect to the BRD backend, create a `.env` file in the root directory with the following:

```env
VITE_API_BASE_URL=http://your-brd-backend-url:port
```

For example:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Or for production:
```env
VITE_API_BASE_URL=https://api.brd-backend.com
```

The application will use this URL for all API requests. If not set, it defaults to `http://127.0.0.1:8000`.

## Getting Started

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
