import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Livnium Core',
  url: 'https://example.com',
  baseUrl: '/',
  trailingSlash: false,
  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: require.resolve('./sidebars.ts') },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      },
    ],
  ],
  plugins: [
    '@docusaurus/plugin-client-redirects',
    '@docusaurus/plugin-pwa',
  ],
};
export default config;
