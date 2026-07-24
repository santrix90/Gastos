# Gastos

Registro de gastos diarios, semanales y mensuales. Sin backend ni base de datos: todo se guarda en el `localStorage` del navegador.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Recharts (gráficas) y date-fns (fechas)

## Uso

Requiere Node 22 (ver `.nvmrc`).

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # sirve el build
npm run lint
```

## Funcionalidades

- Añadir, editar y eliminar gastos (importe, categoría, descripción, fecha).
- Vistas diaria / semanal / mensual con navegación entre periodos.
- Total del periodo, desglose por categoría y gráfica de gasto por día.
- Selector de moneda.
- Exportar e importar los datos en JSON como copia de seguridad.

## Despliegue

Es un sitio estático: `npm run build` y sube `dist/` a Vercel, Netlify o GitHub Pages.
