# Nails by Valeria

Catálogo estático de diseños de uñas desarrollado con Astro, TypeScript y Tailwind CSS 4. Está escrito en español para Nicaragua, usa la marca **Nails by Valeria — Beauty in every detail.** y queda preparado para publicarse con GitHub y Cloudflare Pages.

## Desarrollo y compilación

Requisitos: Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
npm run check
npm run build
npm run verify:build
npm run preview
```

El sitio compilado queda en `dist/`. `npm run build` genera primero los datos de la galería a partir de las fotografías originales, comprueba Astro y crea el sitio estático. No requiere servidor, base de datos, credenciales ni pasos de compilación especiales en Cloudflare.

## Galería e imágenes

- Las diez fotografías originales, sin modificaciones, se conservan en `public/images/designs/originals/`.
- Sus versiones WebP, comprimidas y sin recortes, están en `public/images/designs/` a tamaño de galería y miniatura móvil.
- `scripts/generate-gallery.mjs` lee las fotografías y `src/data/designs.metadata.json`, valida duplicados y textos alternativos y vuelve a generar `src/data/designs.generated.ts` automáticamente durante cada compilación.
- Para revisar u organizar futuras imágenes se incluye `scripts/prepare-gallery.py`; requiere Pillow solo al preparar fotografías nuevas, nunca al instalar o publicar el sitio.

## Datos del negocio

Los datos conocidos se centralizan en `src/data/business.ts`. La web muestra los servicios de uñas acrílicas y esmaltado, horario de lunes a sábado de 7:00 a. m. a 5:00 p. m. y la ubicación de Rivas, Belén. Presenta **C$350 como precio inicial orientativo**, no como precio fijo de cada servicio.

Los enlaces se generan con el número confirmado de Nicaragua (+505 8624 8657) y mensajes específicos para cada servicio, la cita general y el diseño seleccionado. Instagram permanece oculto hasta que Valeria comparta su perfil.

## Cloudflare Pages y GitHub

1. Sube este proyecto a GitHub.
2. En Cloudflare, crea un proyecto en **Workers & Pages → Create application → Pages → Connect to Git** y elige el repositorio.
3. Configura:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Despliega. La integración sitemap de Astro genera el sitemap cuando Pages proporciona su URL. El sitio la utiliza para canonical, Open Graph y `robots.txt`, sin suponer un dominio.
5. Pages proporciona la URL de producción automáticamente para canonical, metadatos, sitemap y `robots.txt`. Al añadir un dominio propio en el futuro, configura `SITE_URL` con su URL HTTPS real.

No se necesitan compras, registro de dominios ni secretos para una primera publicación en Pages.
