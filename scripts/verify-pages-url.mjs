import assert from 'node:assert/strict';

const deploymentUrl = process.env.CF_PAGES_URL;
assert.ok(deploymentUrl, 'CF_PAGES_URL debe simular la URL asignada por Cloudflare Pages.');

const parsedUrl = new URL(deploymentUrl);
const labels = parsedUrl.hostname.split('.');
if (parsedUrl.hostname.endsWith('.pages.dev') && labels.length > 3) labels.shift();
const expectedSiteUrl = `${parsedUrl.protocol}//${labels.join('.')}`;
const { default: config } = await import(new URL('../astro.config.mjs', import.meta.url));

assert.equal(config.site, expectedSiteUrl, 'La configuración debe usar la URL Pages sin el hash de despliegue.');
console.log('Cloudflare Pages: la URL pública se prepara automáticamente sin fijar un dominio.');
