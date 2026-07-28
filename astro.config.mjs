import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tixible.com',
  integrations: [sitemap()],
  trailingSlash: 'never',
});
