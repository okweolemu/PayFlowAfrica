import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// The early-access endpoint may live on another origin (e.g. a form service),
// so the CSP has to allow posting to it.
function endpointOrigin(value) {
  if (!value?.trim()) return '';
  try {
    return ` ${new URL(value.trim()).origin}`;
  } catch {
    throw new Error(`PUBLIC_EARLY_ACCESS_ENDPOINT must be an absolute https:// URL (got "${value}").`);
  }
}

const formOrigin = endpointOrigin(env.PUBLIC_EARLY_ACCESS_ENDPOINT);

export default defineConfig({
  site: 'https://payflowafrica.com',
  // No code blocks on the site, and Shiki's inline styles would conflict with the CSP.
  markdown: { syntaxHighlight: false },
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
    }),
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self'${formOrigin}`,
        `form-action 'self'${formOrigin}`,
        "base-uri 'self'",
        "object-src 'none'",
        "manifest-src 'self'",
      ],
      // Inline style attributes carry data-driven sizes in the product mockups.
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
});
