# Deploying payflowafrica.com

The site is fully static: `npm run build` writes plain HTML, CSS and assets to `dist/`, and Cloudflare serves them as
a Worker with static assets (configured in `wrangler.jsonc`; there is no Worker code). The code lives at
`github.com/okweolemu/PayFlowAfrica`, and the `payflowafrica.com` zone already uses Cloudflare nameservers.

> Nothing in this repository changes DNS. Every DNS step below is done by you in the Cloudflare dashboard.

## 1. Before deploying

```bash
npm ci
npm run verify
```

No environment variables are required; the contact address lives in `src/config/site.ts`. Node.js `22.16.0` is read
from `.node-version`. The optional `PUBLIC_EARLY_ACCESS_ENDPOINT` is a build-time variable: set it under the Worker's
**Settings → Build → Variables and secrets**, then redeploy.

## 2. Create the Worker from GitHub

Cloudflare dashboard → **Workers & Pages** → **Create application** → import the `okweolemu/PayFlowAfrica` repository,
then fill in **Set up your application**:

| Field | Value |
| --- | --- |
| Project name | `payflowafrica` (must match `name` in `wrangler.jsonc`) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | Leave the default |
| Enable Preview builds | Optional. Preview URLs on `*.workers.dev` are marked `noindex` by `_headers`. |
| Protect with Cloudflare Access | Off (the site is public) |
| Advanced → Root directory | `/` |
| Advanced → API token | Let Cloudflare create a new token |
| Advanced → Variables | None needed |

**Deploy.** The first build gives a `payflowafrica.<your-subdomain>.workers.dev` address. From then on, every push to
`main` deploys automatically.

To deploy from this machine instead, run `npm run build` then `npx wrangler deploy` (it reads `wrangler.jsonc`;
`npx wrangler login` first).

*Alternative: Cloudflare Pages* also works with no config. Use build command `npm run build` and output directory
`dist`, then add both hostnames under the project's **Custom domains**.

## 3. Connect the domain

1. Worker → **Settings → Domains & Routes → Add → Custom Domain** → `payflowafrica.com`. Cloudflare creates the DNS
   record and TLS certificate. A Custom Domain can't be added on a hostname that already has a CNAME record.
2. `www`: under **DNS → Records**, add a proxied **A** record for `www` pointing to `192.0.2.0`. This placeholder
   address is Cloudflare's documented pattern for redirect-only hostnames.
3. **Rules → Redirect Rules → Create rule** from the **Redirect from WWW to root** template, or match hostname
   `www.payflowafrica.com` with a 301 to `concat("https://payflowafrica.com", http.request.uri.path)` and query string
   preserved.
4. **SSL/TLS → Edge Certificates → Always Use HTTPS: On.**

### DNS records required

| Type | Name | Content | Proxy | Created by |
| --- | --- | --- | --- | --- |
| Worker / custom domain | `payflowafrica.com` | the `payflowafrica` Worker | Proxied | Cloudflare, when you add the Custom Domain |
| A | `www` | `192.0.2.0` | Proxied | You (step 2); only used for the redirect |

The zone has no A, AAAA or CNAME records yet, so nothing conflicts. Leave the email records (section 4) as they are.

## 4. Company email (live)

Cloudflare Email Routing is set up. As of 7 October 2026 the zone has MX records for `route1`, `route2` and
`route3.mx.cloudflare.net` and an SPF record (`v=spf1 include:_spf.mx.cloudflare.net ~all`).

| Address | Use |
| --- | --- |
| `hello@payflowafrica.com` | Public contact. Shown on the site and the destination of early-access requests. |
| `gilbert@payflowafrica.com` | Founder's address. Not published on the site. |

Still recommended:

| Type | Name | Content |
| --- | --- | --- |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:hello@payflowafrica.com` (tighten to `p=quarantine` once reports look clean) |

Email Routing only receives and forwards. To send mail *as* these addresses, add a mailbox provider (Google Workspace,
Microsoft 365 or Zoho Mail) or an SMTP sending service, and add the SPF/DKIM records it gives you. Merge its SPF into
the existing record rather than adding a second SPF record.

To change the public address, edit `contactEmail` in `src/config/site.ts` and redeploy.

## 5. After the first deploy

- [ ] `https://payflowafrica.com` loads over HTTPS, and `https://www.payflowafrica.com` redirects to it.
- [ ] `https://payflowafrica.com/robots.txt` and `/sitemap-index.xml` resolve.
- [ ] `curl -I https://payflowafrica.com` shows `strict-transport-security`, `x-content-type-options` and `x-frame-options`.
- [ ] A made-up path returns the branded 404 page.
- [ ] The link preview looks right (LinkedIn Post Inspector or opengraph.xyz).
- [ ] Search engines know about the site (section 6).
- [ ] Optional: cookieless Cloudflare Web Analytics. If enabled, update the Privacy Notice and the CSP first.

## 6. Search and AI visibility

A new domain isn't in any search index until a search engine discovers it, which can take weeks on its own. These
steps make that happen in days. AI assistants answer from the same indexes (Google, Bing) plus their own crawlers, so
they also cover AI search.

1. **Google Search Console** (search.google.com/search-console) → **Add property** → **Domain** → `payflowafrica.com`.
   Verify with the TXT record it gives you (**DNS → Records** in Cloudflare), or accept Search Console's offer to verify
   through Cloudflare automatically. Then:
   - **Sitemaps** → submit `https://payflowafrica.com/sitemap-index.xml`.
   - **URL inspection** → `https://payflowafrica.com/` → **Request indexing**.
2. **Bing Webmaster Tools** (bing.com/webmasters) → **Import from Google Search Console** (or add the site and verify by
   DNS) → submit the same sitemap. Bing's index also serves Copilot, DuckDuckGo, Yahoo and several AI assistants.
3. **Cloudflare → Security → Settings → AI bot policies:** keep **Search** and **Agent** crawlers on **Allow** so AI
   search engines can index the site and assistants can open it when someone asks about PayFlow Africa. **Training** is
   a business choice: allowing it lets future AI models learn about the company. Pages here carry no ads, so
   "block on pages with ads" has no effect.
4. **Profiles that link back.** Create a LinkedIn company page (and any other official profiles) pointing at
   `https://payflowafrica.com`, then list their URLs in `sameAs` in `src/config/site.ts` so search engines connect them.

Built into the site: linked structured data (Organization, WebSite, WebPage and the FAQ), a sitemap, `/llms.txt` (a
plain-text briefing for AI assistants, kept out of search results with `X-Robots-Tag: noindex`), and `data-nosnippet`
on the concept screens so their sample figures never appear in snippets or AI answers. Check progress in Search
Console's **Pages** report; searching `site:payflowafrica.com` shows what Google has indexed.

## Troubleshooting

- **Build fails on the Node version:** make sure `.node-version` is committed, or set `NODE_VERSION=22.16.0`.
- **Deploy step fails on the Worker name:** the dashboard project name and `name` in `wrangler.jsonc` must match
  (`payflowafrica`).
- **The early-access endpoint isn't used after setting the variable:** it's build-time, so trigger a new deployment.
- **Pages render unstyled on a local Windows build:** if the project folder is reachable through two different paths
  (an app-virtualised AppData folder, for example), Vite can't match pages to their CSS. Build from a normal folder such
  as `D:\PROJECTS\...`. `npm test` fails loudly if this happens.
