import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'

// Só a landing é indexável; o app autenticado e as APIs ficam de fora (ver seo-specialist).
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/pages/', '/login', '/api/']
        },
        sitemap: `${getSiteUrl()}/sitemap.xml`
    }
}
