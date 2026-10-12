import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { africaPrinciples, faqs, productAreas, roadmap } from '../data/content';

// A plain-text briefing for AI assistants and LLM-based search, following the llms.txt convention
// (https://llmstxt.org). Built from the same content as the site, so the two can't drift apart.

/** Typographic punctuation → ASCII, so the file reads correctly whatever charset a client assumes. */
const ascii = (text: string) =>
  text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/·/g, '-')
    .replace(/…/g, '...');

export const GET: APIRoute = ({ site: base }) => {
  const url = (path: string) => new URL(path, base).href;

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is an early-stage, founder-led company. The platform is in active development and is not yet generally available. Product screens on ${site.domain} are design concepts populated with sample data: the organisation, people and figures in them are fictional.`,
    '',
    '## Product areas (in development)',
    '',
    ...productAreas.map(
      ({ title, status, summary }) => `- ${title}${status ? ` (${status.toLowerCase()})` : ''}: ${summary}`,
    ),
    '',
    '## Further along the roadmap',
    '',
    ...roadmap.map((item) => `- ${item}`),
    '',
    '## How the platform is being designed',
    '',
    ...africaPrinciples.map(({ title, text }) => `- ${title}: ${text}`),
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap(({ question, answer }) => [`### ${question}`, '', answer, '']),
    '## Pages',
    '',
    `- [Home](${url('/')}): what ${site.name} is building, product concepts, FAQ and early access`,
    `- [Privacy Notice](${url('/privacy/')}): how the website handles personal information`,
    `- [Terms of Use](${url('/terms/')}): terms for using the website`,
    '',
    '## Contact',
    '',
    `- Email: ${site.contactEmail}`,
    `- Early access: ${url('/#early-access')}`,
    '',
  ];

  return new Response(ascii(lines.join('\n')), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
