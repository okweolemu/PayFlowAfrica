// Checks the built site in dist/ (run `npm run build` first; `npm test` does it for you).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { parse } from 'node-html-parser';

const SITE = 'https://payflowafrica.com';
const dist = new URL('../dist/', import.meta.url);

if (!existsSync(new URL('index.html', dist))) {
  throw new Error('dist/index.html not found. Run `npm run build` before the tests.');
}

const read = (file) => readFileSync(new URL(file, dist), 'utf8');
const exists = (file) => existsSync(new URL(file, dist));

const indexable = [
  { path: '/', file: 'index.html' },
  { path: '/privacy/', file: 'privacy/index.html' },
  { path: '/terms/', file: 'terms/index.html' },
];
const allPages = [...indexable, { path: '/404.html', file: '404.html' }];
const dom = Object.fromEntries(allPages.map(({ file }) => [file, parse(read(file))]));

const meta = (root, key) =>
  root.querySelector(`meta[name="${key}"]`)?.getAttribute('content') ??
  root.querySelector(`meta[property="${key}"]`)?.getAttribute('content');

const isHiddenFromAT = (element) => {
  for (let node = element; node && node.tagName; node = node.parentNode) {
    if (node.getAttribute('aria-hidden') === 'true') return true;
  }
  return false;
};

const visibleText = (root) => {
  const copy = parse(root.toString());
  copy.querySelectorAll('script, style').forEach((node) => node.remove());
  return copy.querySelector('body').text.replace(/\s+/g, ' ');
};

/** Maps a site-relative href to the built file that would serve it. */
function fileFor(pathname) {
  if (pathname === '/' || pathname === '') return 'index.html';
  const clean = pathname.replace(/^\//, '');
  if (clean.endsWith('/')) return `${clean}index.html`;
  return exists(clean) ? clean : `${clean}/index.html`;
}

describe('SEO metadata', () => {
  const titles = new Set();

  for (const { path, file } of indexable) {
    test(`${path} has complete, consistent metadata`, () => {
      const root = dom[file];
      const canonical = `${SITE}${path}`;

      assert.equal(root.querySelector('html').getAttribute('lang'), 'en-GB');
      assert.ok(meta(root, 'viewport'), 'viewport meta');

      const title = root.querySelector('title')?.text.trim();
      assert.ok(title?.includes('PayFlow Africa'), `title: ${title}`);
      assert.ok(!titles.has(title), `duplicate title: ${title}`);
      titles.add(title);

      const description = meta(root, 'description');
      assert.ok(description && description.length >= 50 && description.length <= 200, `description length: ${description?.length}`);

      assert.equal(root.querySelector('link[rel="canonical"]')?.getAttribute('href'), canonical);
      assert.equal(meta(root, 'og:url'), canonical);
      assert.equal(meta(root, 'og:type'), 'website');
      assert.ok(meta(root, 'og:title'));
      assert.ok(meta(root, 'og:description'));
      assert.equal(meta(root, 'og:image'), `${SITE}/og-image.png`);
      assert.equal(meta(root, 'twitter:card'), 'summary_large_image');

      assert.equal(root.querySelectorAll('h1').length, 1, 'exactly one h1');
    });
  }

  for (const { path, file } of allPages) {
    test(`${path} links its stylesheets and they exist`, () => {
      const sheets = dom[file].querySelectorAll('link[rel="stylesheet"]').map((link) => link.getAttribute('href'));
      assert.ok(sheets.length > 0, 'no stylesheet linked — the page would render unstyled');
      for (const href of sheets) assert.ok(exists(href.replace(/^\//, '')), `${href} missing from dist`);
    });
  }

  test('the home page uses the agreed title and description', () => {
    const root = dom['index.html'];
    assert.equal(root.querySelector('title').text, 'PayFlow Africa | Payroll & HR Technology for Africa');
    assert.match(meta(root, 'description'), /^PayFlow Africa is building modern payroll and HR technology/);
  });

  test('the 404 page is not indexable', () => {
    const root = dom['404.html'];
    assert.equal(meta(root, 'robots'), 'noindex');
    assert.equal(root.querySelector('link[rel="canonical"]'), null);
  });

  test('structured data describes the organisation', () => {
    const json = dom['index.html'].querySelector('script[type="application/ld+json"]')?.text;
    const data = JSON.parse(json);
    assert.equal(data['@type'], 'Organization');
    assert.equal(data.url, `${SITE}/`);
  });
});

describe('Crawling and assets', () => {
  test('robots.txt allows crawling and points at the sitemap', () => {
    const robots = read('robots.txt');
    assert.match(robots, /^User-agent: \*$/m);
    assert.match(robots, /^Allow: \/$/m);
    assert.match(robots, new RegExp(`^Sitemap: ${SITE}/sitemap-index.xml$`, 'm'));
  });

  test('the sitemap lists every public page and nothing else', () => {
    assert.ok(exists('sitemap-index.xml'));
    const urls = [...read('sitemap-0.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert.deepEqual(urls.sort(), indexable.map(({ path }) => `${SITE}${path}`).sort());
  });

  test('icons, manifest and social image exist', () => {
    for (const file of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'site.webmanifest', 'og-image.png']) {
      assert.ok(exists(file), `${file} missing`);
    }
    const manifest = JSON.parse(read('site.webmanifest'));
    for (const icon of manifest.icons) assert.ok(exists(icon.src.slice(1)), `${icon.src} missing`);
  });

  test('the social image is 1200 × 630', () => {
    const png = readFileSync(new URL('og-image.png', dist));
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  });
});

describe('Links', () => {
  for (const { path, file } of allPages) {
    test(`${path}: internal links and fragments resolve`, () => {
      for (const anchor of dom[file].querySelectorAll('a[href]')) {
        const href = anchor.getAttribute('href');
        if (href.startsWith('mailto:')) continue;
        assert.ok(!href.startsWith('http:'), `insecure link: ${href}`);
        if (href.startsWith('https:')) continue;

        const url = new URL(href, `${SITE}${path}`);
        const targetFile = fileFor(url.pathname);
        assert.ok(exists(targetFile), `${href} → missing ${targetFile}`);
        if (url.hash) {
          const id = decodeURIComponent(url.hash.slice(1));
          const target = dom[targetFile] ?? parse(read(targetFile));
          assert.ok(target.getElementById(id), `${href} → no #${id}`);
        }
      }
    });
  }
});

describe('Accessibility basics', () => {
  for (const { path, file } of allPages) {
    test(`${path}: landmarks, names and references`, () => {
      const root = dom[file];

      assert.equal(root.querySelectorAll('main').length, 1, 'one main landmark');
      assert.equal(root.querySelector('a.skip-link')?.getAttribute('href'), '#main');

      const ids = root.querySelectorAll('[id]').map((element) => element.id);
      assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.filter((id, i) => ids.indexOf(id) !== i)}`);

      for (const attr of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
        for (const element of root.querySelectorAll(`[${attr}]`)) {
          for (const ref of element.getAttribute(attr).split(/\s+/)) {
            assert.ok(root.getElementById(ref), `${attr}="${ref}" points nowhere`);
          }
        }
      }

      for (const image of root.querySelectorAll('img')) {
        assert.ok(image.hasAttribute('alt'), `img without alt: ${image.toString().slice(0, 80)}`);
      }

      for (const svg of root.querySelectorAll('svg')) {
        const labelled = svg.getAttribute('role') === 'img' && (svg.getAttribute('aria-label') || svg.querySelector('title'));
        assert.ok(labelled || isHiddenFromAT(svg), `svg exposed without a name: ${svg.toString().slice(0, 80)}`);
      }

      for (const control of root.querySelectorAll('input, select, textarea')) {
        if (control.getAttribute('type') === 'hidden') continue;
        const labelled =
          root.querySelector(`label[for="${control.id}"]`) ||
          control.getAttribute('aria-label') ||
          control.getAttribute('aria-labelledby');
        assert.ok(labelled, `form control without a label: ${control.toString().slice(0, 80)}`);
      }

      for (const button of root.querySelectorAll('button')) {
        assert.ok(button.text.trim() || button.getAttribute('aria-label'), 'button without an accessible name');
      }

      let previous = 0;
      for (const heading of root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
        if (isHiddenFromAT(heading)) continue;
        const level = Number(heading.tagName[1]);
        assert.ok(level <= previous + 1, `heading level jumps from h${previous} to h${level}: "${heading.text.trim()}"`);
        previous = level;
      }
    });
  }
});

describe('Honest content', () => {
  const overclaims = [
    /trusted by/i,
    /\bour (customers|clients)\b/i,
    /\b(customers|clients) (love|trust|say)\b/i,
    /testimonial/i,
    /award[- ]winning/i,
    /\bcertified\b/i,
    /\bISO\s?27001\b/i,
    /\bSOC\s?2\b/i,
    /GDPR[- ]compliant/i,
    /fully compliant/i,
    /compliant with/i,
    /in partnership with/i,
    /partnered with/i,
    /backed by/i,
    /funded by/i,
    /\bused by\b/i,
    /market[- ]leading/i,
    /leading provider/i,
    /now available/i,
    /deployed (at|in|across|by)\b/i,
    /government contract/i,
    /\b\d[\d,.]*\+?\s*(customers|clients|users|companies|businesses|organisations|organizations|countries)\b/i,
    /lorem ipsum/i,
    /\bTODO\b|\bTBD\b/,
  ];

  for (const { path, file } of allPages) {
    test(`${path} makes no unsupported claims`, () => {
      const text = visibleText(dom[file]);
      for (const pattern of overclaims) {
        const match = text.match(pattern);
        assert.equal(match, null, `"${match?.[0]}" found: …${text.slice(Math.max(0, (match?.index ?? 0) - 60), (match?.index ?? 0) + 60)}…`);
      }
    });
  }

  test('every product mockup is hidden from assistive tech and captioned as a concept', () => {
    const root = dom['index.html'];
    const mockups = root.querySelectorAll('.m-app');
    assert.ok(mockups.length >= 7, `expected the hero, rule and five preview mockups, found ${mockups.length}`);
    for (const mockup of mockups) {
      assert.equal(mockup.getAttribute('aria-hidden'), 'true');
      let figure = mockup.parentNode;
      while (figure && figure.tagName !== 'FIGURE') figure = figure.parentNode;
      assert.ok(figure, 'mockup is not inside a <figure>');
      assert.match(figure.querySelector('figcaption')?.text ?? '', /concept/i);
    }
  });

  test('the hero states the product is in development', () => {
    assert.match(visibleText(dom['index.html']), /In development/);
  });
});

describe('Contact and early-access configuration', () => {
  const root = dom['index.html'];
  const contact = root.getElementById('contact');
  const form = root.querySelector('form[data-early-access]');
  const addressOf = (anchor) => anchor.getAttribute('href').slice('mailto:'.length).split('?')[0];
  const contactLink = contact.querySelector('a[href^="mailto:"]');

  test('a payflowafrica.com address is published in the contact section, footer and structured data', () => {
    assert.ok(contactLink, 'contact section has no email link');
    const address = addressOf(contactLink);
    assert.match(address, /^[^\s@]+@payflowafrica\.com$/);
    assert.ok(root.querySelector(`footer a[href="mailto:${address}"]`), 'footer is missing the contact address');
    const data = JSON.parse(root.querySelector('script[type="application/ld+json"]').text);
    assert.equal(data.email, address);
  });

  test('only one contact address is used across the site', () => {
    const addresses = new Set(
      Object.values(dom).flatMap((page) => page.querySelectorAll('a[href^="mailto:"]').map(addressOf)),
    );
    assert.equal(addresses.size, 1, `addresses found: ${[...addresses]}`);
  });

  test('the early-access form can deliver requests', () => {
    assert.ok(form, 'early-access form missing');
    const mode = form.getAttribute('data-mode');
    assert.ok(['endpoint', 'email'].includes(mode), `unexpected mode: ${mode}`);
    if (mode === 'endpoint') assert.match(form.getAttribute('data-endpoint'), /^https:\/\//);
    if (mode === 'email') assert.equal(form.getAttribute('data-email'), addressOf(contactLink));
    assert.ok(root.querySelector('#ea-consent[required]'), 'consent checkbox is required');
  });
});

describe('Security', () => {
  for (const { path, file } of allPages) {
    test(`${path}: no third-party scripts, inline handlers or unsafe CSP`, () => {
      const root = dom[file];
      for (const script of root.querySelectorAll('script[src]')) {
        assert.ok(script.getAttribute('src').startsWith('/'), `external script: ${script.getAttribute('src')}`);
      }
      for (const element of root.querySelectorAll('*')) {
        const handler = Object.keys(element.attributes).find((name) => /^on[a-z]+$/i.test(name));
        assert.equal(handler, undefined, `inline handler ${handler} on <${element.tagName}>`);
      }
      const csp = root.querySelector('meta[http-equiv="content-security-policy"]')?.getAttribute('content');
      assert.ok(csp, 'CSP meta tag present');
      const scriptSrc = csp.match(/script-src([^;]*)/)?.[1] ?? '';
      assert.ok(!scriptSrc.includes("'unsafe-inline'"), "script-src must not allow 'unsafe-inline'");
      assert.match(csp, /object-src 'none'/);
    });
  }

  test('_headers sets baseline security headers', () => {
    const headers = read('_headers');
    for (const name of ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) {
      assert.match(headers, new RegExp(`^\\s+${name}:`, 'm'), `${name} missing`);
    }
    assert.match(headers, /pages\.dev\/\*\n\s+X-Robots-Tag: noindex/);
    assert.match(headers, /workers\.dev\/\*\n\s+X-Robots-Tag: noindex/);
  });

  test('the Workers config serves dist/ with the branded 404 page', () => {
    const jsonc = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
    const config = JSON.parse(jsonc.replace(/^\s*\/\/.*$/gm, ''));
    assert.equal(config.name, 'payflowafrica');
    assert.equal(config.assets.directory, './dist');
    assert.equal(config.assets.not_found_handling, '404-page');
    assert.equal(config.main, undefined, 'static site: no Worker script expected');
  });
});
