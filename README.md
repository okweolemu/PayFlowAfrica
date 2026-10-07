# PayFlow Africa — website

Public website for **PayFlow Africa** ([payflowafrica.com](https://payflowafrica.com)), an early-stage, founder-led
company building payroll and HR technology for African organisations.

The site is deliberately honest about the company's stage: product areas are presented as the platform being built,
product screens are labelled design concepts with sample data, and nothing claims customers, partners, compliance or
availability that doesn't exist yet. See [Content status](#content-status) before changing copy.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Astro 7](https://astro.build) — static output, no client framework |
| Styling | Hand-written CSS with design tokens (`src/styles/tokens.css`) |
| Fonts | Inter (variable, optical sizing), self-hosted via `@fontsource-variable/inter` |
| Icons | Lucide, rendered to inline SVG at build time (`@lucide/astro`) |
| JavaScript | ~5 KB (2 KB gzipped) of inline modules: mobile menu, preview tabs, scroll reveal, early-access form |
| SEO | Per-page meta + Open Graph, canonical URLs, JSON-LD, `robots.txt`, sitemap (`@astrojs/sitemap`) |
| Security | Hash-based Content-Security-Policy (Astro), `_headers` for Cloudflare, no third-party scripts |
| Hosting | Cloudflare Pages (see [DEPLOYMENT.md](DEPLOYMENT.md)) |

## Getting started

Requires Node.js 22.12 or newer (Cloudflare builds with the version in `.node-version`).

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally (CSP is only active here, not in dev) |
| `npm run lint` | `astro check` (types and templates) + ESLint with Astro and strict accessibility rules |
| `npm test` | Builds, then runs `tests/site.test.mjs` against `dist/` (SEO, links, accessibility basics, honest-content guard, security) |
| `npm run verify` | Lint + build + tests — run before every deploy |
| `npm run assets` | Regenerates favicons, app icons, `og-image.png` and the contour pattern in `public/` (Node 23.6+) |

## Configuration

**Contact email.** `hello@payflowafrica.com` (Cloudflare Email Routing) is set once, in `src/config/site.ts`
(`site.contactEmail`). It appears in the contact section, footer, legal pages and structured data, and is where the
early-access form sends requests.

**Early-access endpoint.** One optional, **build-time** environment variable. Copy `.env.example` to `.env` for local
builds, or set it in Cloudflare Pages (changing it requires a redeploy).

| Variable | Purpose |
| --- | --- |
| `PUBLIC_EARLY_ACCESS_ENDPOINT` | `https://` endpoint that accepts early-access requests as JSON |

| Endpoint | Early-access form behaviour |
| --- | --- |
| unset (current) | Opens the visitor's email app with the request pre-filled and addressed to the contact email |
| set | POSTs JSON to the endpoint, with real success and error states |

The build fails fast if the endpoint isn't an `https://` URL. Its origin is added to the CSP `connect-src` and
`form-action` automatically.

### Early-access endpoint contract

`POST <PUBLIC_EARLY_ACCESS_ENDPOINT>` with `Content-Type: application/json`:

```json
{
  "name": "…",
  "email": "…",
  "organisation": "…",
  "role": "Payroll",
  "organisationSize": "50–249 employees",
  "country": "Kenya",
  "message": "…",
  "consent": true,
  "source": "payflowafrica.com"
}
```

Any 2xx response is treated as success; anything else (or a 15-second timeout) shows a retry message. A hidden
honeypot field filters simple bots before anything is sent. Form services that accept JSON (for example Formspree) work
as-is, or the endpoint can be a small Cloudflare Worker that stores requests in D1/KV.

## Project structure

```
src/
  config/site.ts          Site name, metadata, navigation, environment handling
  data/content.ts         Product areas, roadmap, "Built for Africa" principles, value props, about pillars
  data/sample.ts          Fictional sample data for the product concept screens
  data/countries.ts       Country list for the early-access form
  components/
    sections/             One component per homepage section
    mockups/              Product concept screens (app shell + dashboard, employees, pay run, payslip, analytics, rule)
    EarlyAccessForm.astro Form markup, validation and submission logic
    Header / Footer / SEO / Logo …
  layouts/                BaseLayout (head, header, footer) and LegalLayout
  lib/                    Brand mark, contour generator, chart and number helpers
  pages/                  index, privacy, terms, 404, robots.txt
  styles/                 tokens.css, global.css, mockup.css
public/                   Icons, og-image.png, contour pattern, site.webmanifest, _headers
scripts/generate-assets.mjs
tests/site.test.mjs
```

## Editing content

- **Copy for the product areas, principles, value props and about pillars:** `src/data/content.ts`.
- **Section headlines and paragraphs:** the matching file in `src/components/sections/`.
- **Mockup figures:** `src/data/sample.ts`. Keep totals consistent and keep everything fictional.
- **Legal pages:** `src/pages/privacy.astro` and `src/pages/terms.astro`. Update the "Last updated" date when you change them.
- **Brand mark:** `src/lib/brand.ts`, then run `npm run assets`.

## Content status

Treat these as deliberate, not finished:

- **Placeholder:** the early-access endpoint (unset, so the form drafts an email instead), the legal entity name (the
  site says "PayFlow Africa" only), the governing-law clause (omitted from the Terms), and basic Privacy/Terms text that
  has not been reviewed by a lawyer.
- **Conceptual:** every product area, the roadmap, all product screens, the AI capabilities (marked "Exploring"), and the
  sample payroll rule.
- **Sample data:** "Demo Organisation", every person, employee number, amount, currency figure, approval and validation
  count in the mockups.
- **Pending confirmation:** the founder-experience sentence in the About section, the "Our approach to compliance"
  commitment, "Joining is free and carries no obligation", and the logo mark.

The test suite fails the build if common over-claims appear (for example "trusted by", "certified", "compliant with",
"partnered with", or "N customers"). Extend the list in `tests/site.test.mjs` rather than working around it.

## Accessibility, performance and security

- Semantic landmarks, skip link, one `h1` per page, labelled controls, visible focus styles, WAI-ARIA tabs, and a
  mobile menu that closes on Escape.
- `prefers-reduced-motion` disables all animation; content never depends on JavaScript to be visible.
- Product mockups are `aria-hidden`, with visible captions that describe them as concepts.
- Homepage HTML is about 22 KB gzipped, CSS about 12 KB gzipped, and one 73 KB font file. There are no images on the
  page itself.
- CSP blocks inline scripts other than Astro's hashed modules. `_headers` adds HSTS, `nosniff`, frame denial,
  referrer and permissions policies, and `noindex` on `*.pages.dev` preview URLs.
