function readEarlyAccessEndpoint(): string | undefined {
  const endpoint = import.meta.env.PUBLIC_EARLY_ACCESS_ENDPOINT?.trim() || undefined;
  if (endpoint && !endpoint.startsWith('https://')) {
    throw new Error(`PUBLIC_EARLY_ACCESS_ENDPOINT must be an https:// URL: "${endpoint}"`);
  }
  return endpoint;
}

export const site = {
  name: 'PayFlow Africa',
  domain: 'payflowafrica.com',
  title: 'PayFlow Africa | Payroll & HR Technology for Africa',
  description:
    'PayFlow Africa is building modern payroll and HR technology for African organisations, helping teams manage payroll, people and HR operations with greater accuracy and less manual work.',
  summary:
    'PayFlow Africa is building modern payroll and HR technology for organisations across Africa.',
  locale: 'en_GB',
  themeColor: '#0a1a2f',
  /** Public contact address (Cloudflare Email Routing, live since 7 Oct 2026). */
  contactEmail: 'hello@payflowafrica.com',
  /** Optional JSON endpoint for early-access requests; without it the form drafts an email. */
  earlyAccessEndpoint: readEarlyAccessEndpoint(),
};

export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Built for Africa', href: '/#built-for-africa' },
  { label: 'Product preview', href: '/#preview' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Platform', href: '/#platform' },
      { label: 'Built for Africa', href: '/#built-for-africa' },
      { label: 'Product preview', href: '/#preview' },
      { label: 'Early access', href: '/#early-access' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Why PayFlow Africa', href: '/#why' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy/' },
      { label: 'Terms', href: '/terms/' },
    ],
  },
];
