import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const outputDirectory = process.argv[2];
const siteUrl = process.env.SITE_URL?.replace(/\/$/, '');

assert.ok(outputDirectory, 'Indica el directorio de salida de Astro.');
assert.ok(siteUrl, 'SITE_URL debe contener el dominio usado para la compilación.');

const page = readFileSync(path.join(outputDirectory, 'index.html'), 'utf8');
const robots = readFileSync(path.join(outputDirectory, 'robots.txt'), 'utf8');

assert.ok(existsSync(path.join(outputDirectory, 'sitemap-index.xml')), 'Falta el índice del sitemap.');
assert.ok(page.includes(`href="${siteUrl}/"`), 'La URL canónica debe usar SITE_URL.');
assert.ok(
  robots.includes(`Sitemap: ${siteUrl}/sitemap-index.xml`),
  'robots.txt debe apuntar al sitemap del mismo dominio.',
);

console.log('Verificación correcta: sitemap, URL canónica y robots.txt usan SITE_URL.');
