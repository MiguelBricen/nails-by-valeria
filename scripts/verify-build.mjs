import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const page = readFileSync('dist/index.html', 'utf8');
const notFound = readFileSync('dist/404.html', 'utf8');
const photoCards = [...page.matchAll(/class="design-card"/g)];
const imageRoutes = new Set(
  [...page.matchAll(/\/images\/designs\/design-\d{2}-(?:480|1200)\.webp/g)].map(([route]) => route),
);
const ids = new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
const originals = readdirSync('dist/images/designs/originals').filter((file) => /\.(?:jpe?g|png|webp)$/i.test(file));
const whatsappLinks = [...page.matchAll(/<a\b[^>]*href="(https:\/\/wa\.me\/[^\"]+)"/g)];
const whatsappTexts = whatsappLinks.map(([, href]) => new URL(href.replaceAll('&amp;', '&')).searchParams.get('text'));

assert.equal(photoCards.length, 10, 'La galería debe mostrar las diez fotografías originales.');
assert.equal(originals.length, 10, 'Las diez fotografías originales deben quedar publicadas sin modificarse.');
assert.equal(imageRoutes.size, 20, 'Deben estar presentes ambas versiones WebP de cada fotografía.');
for (const route of imageRoutes) {
  assert.ok(existsSync(`dist${route}`), `No se encontró la imagen publicada: ${route}`);
}

for (const route of [
  'dist/favicon.svg',
  'dist/images/branding/social-preview.png',
  'dist/robots.txt',
]) {
  assert.ok(existsSync(route), `Falta un recurso SEO obligatorio: ${route}`);
}

assert.match(page, /<html lang="es-NI"/);
assert.match(page, /name="description"/);
assert.match(page, /property="og:image"/);
assert.match(page, /application\/ld\+json/);
assert.match(page, /loading="lazy"/);
assert.match(page, /fetchpriority="high"/);
assert.ok(whatsappLinks.length >= 4, 'Deben aparecer los botones comerciales de WhatsApp.');
for (const [, href] of whatsappLinks) {
  const url = new URL(href.replaceAll('&amp;', '&'));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/50586248657');
  assert.ok(url.searchParams.has('text'), 'Cada botón debe tener un mensaje personalizado.');
}
for (const serviceMessage of [
  'Hola Valeria, estoy interesada en el servicio de uñas acrílicas. ¿Podrías brindarme información y disponibilidad?',
  'Hola Valeria, estoy interesada en el servicio de esmaltado. ¿Podrías brindarme información y disponibilidad?',
  'Hola Valeria, estoy interesada en el servicio de semipermanente. ¿Podrías brindarme información y disponibilidad?',
  'Hola Valeria, estoy interesada en el servicio de uñas en Soft Gel. ¿Podrías brindarme información y disponibilidad?',
  'Hola Valeria, estoy interesada en el servicio de nivelación de Rubber. ¿Podrías brindarme información y disponibilidad?',
  'Hola Valeria, estoy interesada en el servicio de manicura y brillo natural. ¿Podrías brindarme información y disponibilidad?',
]) {
  assert.ok(whatsappTexts.includes(serviceMessage), 'Falta el mensaje de WhatsApp configurado para un servicio.');
}
assert.ok(whatsappTexts.includes('Hola Valeria, encontré tu página Nails by Valeria y me gustaría obtener información sobre tus servicios y disponibilidad para una cita.'));
assert.match(page, /Hola Valeria, vi este diseño en tu catálogo y me gustaría consultar su precio y disponibilidad:/);
assert.match(page, /Precios desde C\$350\./);
assert.match(page, /El costo final puede variar según el diseño y el servicio solicitado\./);
assert.match(page, /Rivas, Belén, de la estación de bomberos 200 metros al sur\./);
assert.match(page, /Lunes a sábado/);
assert.match(page, /7:00 a\. m\. a 5:00 p\. m\./);
assert.match(page, /Uñas acrílicas/);
assert.match(page, /Esmaltado/);
assert.match(page, /Semipermanente/);
assert.match(page, /Uñas en Soft Gel/);
assert.match(page, /Nivelación de Rubber/);
assert.match(page, /Manicura y brillo natural/);
assert.doesNotMatch(page, /TRABAJOS DE NAILS BY VALERIA|Galería de Valeria|Diseño \d{2}/);
for (let index = 1; index <= 10; index += 1) {
  assert.ok(page.includes(`>${String(index).padStart(2, '0')}<`), `Falta el número de diseño ${index}.`);
}
assert.doesNotMatch(page, /instagram\.com/);
for (const [, fragment] of page.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.has(fragment), `El enlace interno #${fragment} no tiene destino.`);
}
assert.match(notFound, /Nails by Valeria/);

for (const placeholder of ['Pexels', 'Nacar Studio', 'nail-studio.pages.dev', 'Tu nombre aquí']) {
  assert.ok(!page.includes(placeholder), `Se encontró contenido de demostración: ${placeholder}`);
}

console.log('Verificación correcta: fotografías, WebP, mensajes de WhatsApp, seis servicios, títulos de galería, precio base, ubicación, horario, SEO y página 404.');
