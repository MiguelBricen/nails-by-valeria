import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

function getPublicSiteUrl() {
  const configuredUrl = process.env.SITE_URL;
  const deploymentUrl = process.env.CF_PAGES_URL;
  const value = configuredUrl || deploymentUrl;
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return undefined;
    if (!configuredUrl && url.hostname.endsWith('.pages.dev')) {
      const labels = url.hostname.split('.');
      if (labels.length > 3) labels.shift();
      url.hostname = labels.join('.');
    }
    return url.origin;
  } catch {
    return undefined;
  }
}

const site = getPublicSiteUrl();

export default defineConfig({
  ...(site && { site }),
  integrations: [
    ...(site ? [sitemap()] : []),
    {
      name: 'nails-by-valeria-robots',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const sitemapLine = site ? `\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}` : '';
          await writeFile(new URL('./robots.txt', dir), `User-agent: *\nAllow: /${sitemapLine}\n`, 'utf8');
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
