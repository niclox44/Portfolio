# Portafolio de Carlos Nicolás Andicoberry López

Rediseño bilingüe de octubre de 2026, basado en `CV-EN.pdf`. HTML, CSS y JavaScript sin dependencias de ejecución en el navegador. La publicación existente utiliza Cloudflare Workers y los recursos de `dist/`.

## Vista previa

Requiere Node.js 18 o superior. No hace falta ejecutar `npm install`.

```bash
npm run dev
```

Abrir http://127.0.0.1:4173. Para otro puerto: `PORT=4174 npm run dev`.

La vista previa sirve los recursos estáticos. La API de Cloudflare se ejecuta únicamente con el entorno del Worker. La página renovada contacta a través de `mailto:` y LinkedIn; no utiliza la antigua API de recogida de correos.

```bash
npm run check
```

## Contenido y mantenimiento

- `dist/index.html`: contenido español, enlaces y metadatos. Es legible sin JavaScript.
- `dist/app.js`: traducción inglesa, selector de proyectos y demostraciones. La traducción española se toma del HTML. `?lang=en` permite compartir una entrada en inglés; la selección también se guarda localmente.
- `dist/style.css`: diseño adaptable, estados de teclado, movimiento reducido y estilos de impresión.
- `dist/assets/carlos-nicolas.webp`: fotografía optimizada, obtenida de la imagen original del proyecto.
- `dist/CV-Carlos-Nicolas-EN.pdf`: copia del CV facilitado, sin alterar el original.
- `dist/assets/social-preview.svg` y `.png`: imagen para compartir y su fuente editable.
- `dist/proyects.html`: conserva el enlace antiguo y lo dirige a `/#proyectos`.
- `dist/robots.txt` y `dist/sitemap.xml`: descubrimiento de la página por buscadores.
- `scripts/preview.mjs`: servidor de desarrollo local, sin dependencias.
- `src/index.js` y `wrangler.json`: Worker y configuración preexistentes, conservados.

Si cambia el dominio, actualizar canonical, Open Graph, sitemap y robots. Si se actualiza el CV, sustituir el PDF y revisar ambas versiones del contenido.

## Criterios del contenido

Experiencia: Eurotransportcar, julio–septiembre de 2026. Estudios: Universidad de Córdoba desde 2022, finalización prevista en 2026; no se afirma que el título esté completado. Inglés B2 (APTIS). Las habilidades y los tres proyectos principales proceden del CV. Las exploraciones adicionales conservan repositorios del portafolio anterior.

Las demos son explicaciones interactivas y se identifican como tales:

- Blackjack representa una solicitud y respuesta con datos locales; no ejecuta el servidor C++.
- n8n muestra las capas VPS, Docker y aplicación; no contacta con el servidor personal.
- Búsqueda binaria ejecuta un ejemplo didáctico sobre un array ordenado; no se presenta como un ejercicio concreto del repositorio.

No se han añadido porcentajes de dominio, métricas de impacto ni experiencia no documentada.

## Verificación del rediseño

- Revisión visual en escritorio y móvil; anchuras de 320, 390, 768 y 1440 píxeles sin desbordamiento horizontal.
- Selector de proyectos con flechas, Home/End; menú móvil, Escape y estados de foco.
- Demostraciones de carta, despliegue y búsqueda, incluida traducción con estado activo.
- Copia de email, enlaces internos, recursos y descarga del CV.
- Enlaces públicos a cinco repositorios: respuesta HTTP 200.
- Sin errores de JavaScript observados en las interacciones revisadas.
- Foto reducida de aproximadamente 2,1 MB a 63 KB; sin fuentes, analítica ni scripts externos.

El rediseño está preparado en los archivos locales. No se ha desplegado una nueva versión de producción.
