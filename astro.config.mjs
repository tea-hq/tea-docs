import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// Bilingual site: English at the default route (`/`, root locale) and
// Simplified Chinese under `/zh/`. Shared page file names across the two
// content directories enable Starlight's language switcher, fallback, and
// translation-parity checks.
export default defineConfig({
  // Org-root GitHub Pages deployment at https://tea-hq.github.io/ — no `base`
  // path prefix. A subpath or custom-domain target would be set at a later
  // review; today the site is served at the organization root.
  site: 'https://tea-hq.github.io',
  integrations: [
    starlight({
      title: 'tea-rs docs',
      defaultLocale: 'root',
      locales: {
        // English docs live in src/content/docs/ and are served at `/`.
        root: { label: 'English', lang: 'en' },
        // Simplified Chinese docs live in src/content/docs/zh/ and are served at /zh/.
        zh: { label: '简体中文', lang: 'zh-CN' },
      },
      sidebar: [
        { label: 'Overview', items: [{ slug: 'overview' }] },
        {
          label: 'Get Started',
          items: [{ autogenerate: { directory: 'get-started' } }],
        },
        {
          label: 'Configuration',
          items: [{ autogenerate: { directory: 'configuration' } }],
        },
        {
          label: 'Safety',
          items: [{ autogenerate: { directory: 'safety' } }],
        },
        {
          label: 'Sessions',
          items: [{ autogenerate: { directory: 'sessions' } }],
        },
        {
          label: 'MCP',
          items: [{ autogenerate: { directory: 'mcp' } }],
        },
        {
          label: 'Automation',
          items: [{ autogenerate: { directory: 'automation' } }],
        },
        {
          label: 'Integration',
          items: [{ autogenerate: { directory: 'integration' } }],
        },
      ],
      plugins: [starlightLinksValidator()],
    }),
  ],
});
