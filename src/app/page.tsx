import type { Metadata } from 'next'
import { LandingPage } from '@/components/LandingPage'
import { configInfo } from '@/config/info'
import { getSiteUrl } from '@/config/site'

const pageTitle = 'Librosistemo — Sistema de gestão de biblioteca open source e gratuito'
const pageDescription =
    'Sistema gratuito e open source para gerenciar sua biblioteca: cadastro de livros por código de barras, empréstimos e leitores, direto do celular.'

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: pageTitle,
    description: pageDescription,
    alternates: {
        canonical: '/'
    },
    openGraph: {
        title: pageTitle,
        description: pageDescription,
        type: 'website',
        locale: 'pt_BR',
        url: '/',
        siteName: configInfo.appName
    },
    twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: pageDescription
    }
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: configInfo.appName,
    description: pageDescription,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL'
    },
    url: getSiteUrl(),
    sameAs: [configInfo.appRepository]
}

export default function Home(): React.JSX.Element {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <LandingPage />
        </>
    )
}
