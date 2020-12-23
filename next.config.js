

const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: !!process.env.BUNDLE_ANALYZE
})

module.exports = bundleAnalyzer({
  images: {
    domains: ['cdn.shopify.com', 'cdn.builder.io'],
  },
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      // Rewrites for /search
      {
        source: '/:locale/search',
        destination: '/search',
      },
      {
        source: '/:locale/search/:path*',
        destination: '/search',
      },
      {
        source: '/search/designers/:name',
        destination: '/search',
      },
      {
        source: '/search/designers/:name/:category',
        destination: '/search',
      },
      {
        // This rewrite will also handle `/search/designers`
        source: '/search/:category',
        destination: '/search',
        locale: false
      },
    ]
  },
});
