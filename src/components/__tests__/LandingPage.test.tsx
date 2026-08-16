import React from 'react'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'

import { LandingPage } from '../LandingPage'
import { configInfo } from '@/config/info'

describe('LandingPage', () => {
    test('deve renderizar o hero com h1, tagline e CTAs', () => {
        render(<LandingPage />)

        expect(screen.getByRole('heading', { level: 1, name: configInfo.appName })).toBeInTheDocument()
        expect(screen.getByText('Gestão de biblioteca simples, gratuita e open source')).toBeInTheDocument()

        expect(screen.getByRole('link', { name: 'Entrar no sistema' })).toHaveAttribute('href', '/login')
        expect(screen.getByRole('link', { name: /Ver no GitHub/i })).toHaveAttribute('href', configInfo.appRepository)
    })

    test('deve renderizar os seis cards de recursos', () => {
        render(<LandingPage />)

        const featureTitles = [
            'Cadastro por código de barras',
            'Controle de empréstimos',
            'Gestão de leitores',
            'Funciona no celular',
            'Seus dados são seus',
            'Open source e gratuito'
        ]

        featureTitles.forEach(title => {
            expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
        })
    })

    test('deve renderizar os passos de "Como começar" em ordem', () => {
        render(<LandingPage />)

        expect(screen.getByRole('heading', { level: 2, name: 'Como começar' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: 'Clone o repositório' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: 'Suba a aplicação' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { level: 3, name: 'Faça o primeiro login' })).toBeInTheDocument()

        expect(screen.getByText('git clone https://github.com/dougmotshell/librosistemo.git')).toBeInTheDocument()
        expect(screen.getByText('docker compose up')).toBeInTheDocument()
    })

    test('deve ter link para o manual com o endereço do configInfo', () => {
        render(<LandingPage />)

        const manualLink = screen.getByRole('link', { name: /manual de instalação e uso/i })
        expect(manualLink).toHaveAttribute('href', configInfo.appManual)
        expect(manualLink).toHaveAttribute('target', '_blank')
        expect(manualLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('deve renderizar o footer com link para o repositório', () => {
        render(<LandingPage />)

        const footer = screen.getByRole('contentinfo')
        const repoLink = within(footer).getByRole('link', { name: /repositório no GitHub/i })
        expect(repoLink).toHaveAttribute('href', configInfo.appRepository)
    })

    test('links externos devem abrir em nova aba com rel seguro', () => {
        render(<LandingPage />)

        const externalLinks = screen
            .getAllByRole('link')
            .filter(link => link.getAttribute('href')?.startsWith('https://'))

        expect(externalLinks.length).toBeGreaterThanOrEqual(3)
        externalLinks.forEach(link => {
            expect(link).toHaveAttribute('target', '_blank')
            expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })
})
