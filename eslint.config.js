import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', '.cache/', 'node_modules/'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    rules: {
      // Safari/VoiceOver drops list semantics from lists styled with `list-style: none`,
      // so role="list" on those lists is intentional rather than redundant.
      'astro/jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
      // WAI-ARIA tabs pattern: a tab panel without focusable content takes tabindex="0".
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { tags: [], roles: ['tabpanel'] }],
    },
  },
];
