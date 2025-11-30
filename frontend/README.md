# Frontend - LiquiVerde

Este frontend es una aplicación React creada con Vite que consume la API del backend (por defecto en `http://localhost:8000`).

Requisitos:
- Node.js 18+ y npm o yarn

Instalación y ejecución en desarrollo:

```bash
cd frontend
npm install
npm run dev
```

La app abrirá en `http://localhost:5173` por defecto. Asegúrate de que el backend esté corriendo en `http://localhost:8000`.

Endpoints usados:
- `GET /products/{barcode}` — Obtener detalle del producto
- `POST /shopping-list/optimize` — Optimizar lista (payload: { items: [{barcode, quantity}], objective })

Puedes ajustar la variable `VITE_API_BASE` en tu entorno si el backend está en otra URL.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
