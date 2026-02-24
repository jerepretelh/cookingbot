# Chef Bot Pro

Timer de cocina con voz y animaciones, optimizado para Safari/iOS.

## Estructura del proyecto

```
cookingbot/
├── index.html          # HTML principal (limpio)
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind CSS
├── postcss.config.js   # PostCSS (Tailwind + Autoprefixer)
├── src/
│   ├── main.jsx        # Punto de entrada de React
│   ├── App.jsx         # Componente principal con la lógica del timer
│   ├── styles/
│   │   └── index.css   # Estilos globales + Tailwind
│   └── components/
│       ├── SVGIcon.jsx # Iconos SVG reutilizables
│       ├── Header.jsx  # Cabecera con logo y botones
│       ├── Overlay.jsx # Modal de mensajes (voltear, listo, etc.)
│       └── Settings.jsx# Panel de configuración
└── public/             # Assets estáticos (si los hay)
```

## Scripts

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview
```

## Tecnologías

- **React 18** + **Vite** – Framework y bundler
- **Tailwind CSS** – Estilos utility-first
- **canvas-confetti** – Animaciones de celebración
- Web Speech API – Lectura en voz alta de instrucciones
