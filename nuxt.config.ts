export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Sakura Order',
      link: [
        { rel: 'manifest', href: '/manifest.json' },
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
