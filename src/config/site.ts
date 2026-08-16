// URL pública do site, usada por SEO (robots, sitemap, canonical, Open Graph).
// Configure SITE_URL no ambiente de produção.
export const getSiteUrl = (): string => process.env.SITE_URL ?? 'http://localhost:3000'
