# Deploying payflowafrica.com

The site is fully static: `npm run build` writes plain HTML, CSS and assets to `dist/`, and Cloudflare Pages serves
them. The `payflowafrica.com` zone already uses Cloudflare nameservers (`clint.ns.cloudflare.com`,
`barbara.ns.cloudflare.com`; checked on 7 October 2026), so no registrar changes are needed.

> Nothing in this repository changes DNS. Every DNS step below is done by you in the Cloudflare dashboard.

## 1. Build settings

| Setting | Value |
| --- | --- |
| Framework preset | Astro (or "None"; the values below are what matter) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repository root) |
| Node.js version | `22.16.0`, read from `.node-version` (or set `NODE_VERSION`) |

No environment variables are required. The contact address lives in `src/config/site.ts`. One optional, build-time
variable (Settings → Variables and Secrets → Production; redeploy after changing it):

| Variable | Set it when |
| --- | --- |
| `PUBLIC_EARLY_ACCESS_ENDPOINT` | You have a working JSON endpoint for early-access requests (see README). Until then the form drafts an email to `hello@payflowafrica.com`. |

Before deploying, check locally:

```bash
npm ci
npm run verify
```

## 2. Create the Pages project

### Option A — Git integration (recommended)

1. Commit the project and push it to a GitHub or GitLab repository (`main` branch).
2. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository**.
3. Select the repository and use the build settings above. Add `PUBLIC_EARLY_ACCESS_ENDPOINT` only if you have one.
4. **Save and Deploy.** Each push to `main` deploys to production. Other branches get preview URLs on `*.pages.dev`,
   which `_headers` marks `noindex`.

### Option B — Direct upload from this machine

```bash
npm run build
npx wrangler login
npx wrangler pages project create payflowafrica --production-branch main
npx wrangler pages deploy dist --project-name payflowafrica --branch main
```

With direct upload, `PUBLIC_EARLY_ACCESS_ENDPOINT` comes from your local `.env` at build time, not from the dashboard.

## 3. Connect the domain

In the Pages project → **Custom domains**:

1. **Set up a custom domain** → `payflowafrica.com` → confirm. Because the zone is on Cloudflare, Pages creates the DNS
   record and the TLS certificate automatically.
2. Repeat for `www.payflowafrica.com`.
3. Redirect `www` to the apex: **Rules → Redirect Rules → Create rule** using the "Redirect from WWW to root" template,
   or a rule matching hostname `www.payflowafrica.com` with a dynamic 301 redirect to
   `concat("https://payflowafrica.com", http.request.uri.path)` that preserves the query string.
4. **SSL/TLS → Edge Certificates → Always Use HTTPS: On.**

Don't add the CNAME records by hand before step 1. Cloudflare's docs warn that a CNAME pointing at a Pages project that
the domain isn't associated with returns HTTP 522.

### DNS records required

| Type | Name | Content | Proxy | Created by |
| --- | --- | --- | --- | --- |
| CNAME | `payflowafrica.com` (`@`) | `<project>.pages.dev` | Proxied | Pages, when you add the custom domain (flattened at the apex) |
| CNAME | `www` | `<project>.pages.dev` | Proxied | Pages, when you add the custom domain |

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
- [ ] Optional: verify the domain in Google Search Console (DNS TXT record) and submit `sitemap-index.xml`.
- [ ] Optional: cookieless Cloudflare Web Analytics. If enabled, update the Privacy Notice and the CSP first.

## Troubleshooting

- **Build fails on the Node version:** make sure `.node-version` is committed, or set `NODE_VERSION=22.16.0`.
- **The early-access endpoint isn't used after setting the variable:** it's build-time, so trigger a new deployment.
- **Pages render unstyled on a local Windows build:** if the project folder is reachable through two different paths
  (an app-virtualised AppData folder, for example), Vite can't match pages to their CSS. Build from a normal folder such
  as `D:\PROJECTS\...`. `npm test` fails loudly if this happens.
