# 🛰️ OrbitCX UI — Sistema de diseño de la suite

> Los colores, tipografías, componentes y planetas que comparten todos los módulos de **OrbitCX**.

**[Ver la guía visual →](https://matias209.github.io/orbitcx-ui/)**

---

## Por qué existe

La suite tiene cuatro módulos (Nebula, Comet, Mission Control y Constellation) y cada uno vive en su propio repo. Si cada uno tuviera sus propios estilos, con el tiempo terminarían pareciendo cuatro productos distintos. Este repo es la **única fuente** de la estética: se cambia un color acá y cambia en toda la suite.

## Qué incluye

```
orbitcx-ui/
├── index.html      guía visual: paleta, tipografía, componentes y una pantalla de ejemplo
└── v1/
    ├── orbit.css   variables de color (tokens), base y componentes con prefijo ox-
    └── orbit.js    tema claro/oscuro, dibujos de los planetas y menú lateral de la suite
```

- **Tokens:** todos los colores son variables CSS (`--ox-bg`, `--ox-accent`, `--ox-nebula`...). El modo claro solo redefine esas variables.
- **Un color por módulo:** cada módulo pone `data-module="nebula"` en el `<html>` y `--ox-accent` toma su color.
- **Componentes:** botones, badges de estado, tarjetas, indicadores (KPI), tablas, pestañas, formularios y el menú lateral.
- **Planetas:** dibujos SVG propios, que se usan con `<svg><use href="#p-nebula"/></svg>`.

## Cómo lo usa un módulo

```html
<link rel="stylesheet" href="../orbitcx-ui/v1/orbit.css">
<script src="../orbitcx-ui/v1/orbit.js"></script>
```

La ruta es relativa a propósito: en GitHub Pages los repos quedan uno al lado del otro (`matias209.github.io/orbitcx-ui/` y `matias209.github.io/orbitcx-nebula/`), igual que en las carpetas locales. La carpeta `v1/` permite hacer cambios grandes en una `v2/` sin romper los módulos que todavía usan la versión anterior.

Para armar el menú lateral:

```js
OrbitCX.shell({
  module: 'nebula',
  title: 'Nebula',
  org: 'Big Tower · Contact Center',
  nav: [{ icon: '🏠', label: 'Inicio', href: 'index.html' }]
});
```

## Tipografías

- **Space Grotesk** para títulos
- **Inter** para el texto
- **JetBrains Mono** para datos, números e IDs

---

Hecho por **Matías Samuel Díaz** · [Portfolio](https://matias209.github.io/portfolio/)
