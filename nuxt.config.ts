export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  routeRules: {
    '/dishes/**': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
  },
  app: {
    head: {
      title: 'Sakura Order',
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/icon-512.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap',
        },
      ],
      meta: [
        { name: 'theme-color', content: '#c0392b' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            aka: '#c0392b',
            washi: '#f5f0e8',
            ink: '#1c1410',
            gold: '#b8860b',
            muted: '#7a6a5a',
          },
          fontFamily: {
            serif: ['Cormorant Garamond', 'Georgia', 'serif'],
          },
        },
      },
    },
  },
})
