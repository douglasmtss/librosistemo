import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

import Home, { metadata } from '../page'
import { configInfo } from '@/config/info'

describe('Home (landing page)', () => {
    test('deve renderizar o h1 com o nome do produto', () => {
        render(<Home />)

        expect(screen.getByRole('heading', { level: 1, name: configInfo.appName })).toBeInTheDocument()
    })

    test('deve ter CTA primário apontando para /login', () => {
        render(<Home />)

        const cta = screen.getByRole('link', { name: 'Entrar no sistema' })
        expect(cta).toBeInTheDocument()
        expect(cta).toHaveAttribute('href', '/login')
    })

    test('deve ter link para o repositório no GitHub', () => {
        render(<Home />)

        const githubLink = screen.getByRole('link', { name: /Ver no GitHub/i })
        expect(githubLink).toHaveAttribute('href', configInfo.appRepository)
        expect(githubLink).toHaveAttribute('target', '_blank')
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('deve renderizar a seção de recursos com os cards principais', () => {
        render(<Home />)

        expect(
            screen.getByRole('heading', { level: 2, name: /Tudo que uma biblioteca pequena precisa/i })
        ).toBeInTheDocument()
        expect(screen.getByText('Cadastro por código de barras')).toBeInTheDocument()
        expect(screen.getByText('Controle de empréstimos')).toBeInTheDocument()
        expect(screen.getByText('Gestão de leitores')).toBeInTheDocument()
        expect(screen.getByText('Funciona no celular')).toBeInTheDocument()
        expect(screen.getByText('Seus dados são seus')).toBeInTheDocument()
        expect(screen.getByText('Open source e gratuito')).toBeInTheDocument()
    })

    test('deve renderizar a seção "Como começar" com link para o manual', () => {
        render(<Home />)

        expect(screen.getByRole('heading', { level: 2, name: 'Como começar' })).toBeInTheDocument()

        const manualLink = screen.getByRole('link', { name: /manual de instalação e uso/i })
        expect(manualLink).toHaveAttribute('href', configInfo.appManual)
    })

    test('deve renderizar o JSON-LD SoftwareApplication', () => {
        const { container } = render(<Home />)

        const script = container.querySelector('script[type="application/ld+json"]')
        expect(script).toBeInTheDocument()

        const jsonLd = JSON.parse(script?.textContent ?? '{}')
        expect(jsonLd['@type']).toBe('SoftwareApplication')
        expect(jsonLd.name).toBe(configInfo.appName)
        expect(jsonLd.applicationCategory).toBe('BusinessApplication')
        expect(jsonLd.operatingSystem).toBe('Web')
        expect(jsonLd.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'BRL' })
        expect(jsonLd.sameAs).toContain(configInfo.appRepository)
    })

    test('deve exportar metadata otimizada para SEO', () => {
        expect(metadata.title).toBe('Librosistemo — Sistema de gestão de biblioteca open source e gratuito')
        expect(typeof metadata.description).toBe('string')
        expect((metadata.description as string).length).toBeLessThanOrEqual(160)
        expect(metadata.metadataBase).toBeInstanceOf(URL)
        expect(metadata.alternates?.canonical).toBe('/')
        expect(metadata.openGraph).toMatchObject({ type: 'website', locale: 'pt_BR' })
        expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' })
    })

    test('deve ser um server component (sem "use client")', () => {
        const filePath = path.join(__dirname, '../page.tsx')
        const content = fs.readFileSync(filePath, 'utf-8')

        expect(content).not.toMatch(/^['"]use client['"]/)
    })
})
