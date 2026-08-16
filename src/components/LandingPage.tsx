'use client'

import Link from 'next/link'
import styled from 'styled-components'
import { configInfo } from '@/config/info'
import { FaBarcode, FaExchangeAlt, FaUsers, FaMobileAlt, FaDatabase, FaCode, FaGithub } from 'react-icons/fa'

const features = [
    {
        icon: <FaBarcode aria-hidden="true" />,
        title: 'Cadastro por código de barras',
        description: 'Aponte a câmera do celular para o código de barras e o livro é preenchido pelo ISBN.'
    },
    {
        icon: <FaExchangeAlt aria-hidden="true" />,
        title: 'Controle de empréstimos',
        description: 'Registre saídas e devoluções em segundos e saiba sempre com quem está cada livro.'
    },
    {
        icon: <FaUsers aria-hidden="true" />,
        title: 'Gestão de leitores',
        description: 'Cadastre os leitores da sua comunidade e acompanhe o histórico de cada um.'
    },
    {
        icon: <FaMobileAlt aria-hidden="true" />,
        title: 'Funciona no celular',
        description: 'Pensado para ser usado com uma mão, no balcão da biblioteca, sem precisar de computador.'
    },
    {
        icon: <FaDatabase aria-hidden="true" />,
        title: 'Seus dados são seus',
        description: 'Tudo fica em um banco SQLite local — sem mensalidade, sem depender de serviços pagos.'
    },
    {
        icon: <FaCode aria-hidden="true" />,
        title: 'Open source e gratuito',
        description: 'Código aberto no GitHub: use, adapte e contribua livremente com a sua biblioteca.'
    }
]

const steps = [
    {
        title: 'Clone o repositório',
        description: 'Baixe o código do GitHub para o seu computador ou servidor.',
        command: 'git clone https://github.com/dougmotshell/librosistemo.git'
    },
    {
        title: 'Suba a aplicação',
        description: 'Com Docker instalado, um único comando coloca tudo no ar.',
        command: 'docker compose up'
    },
    {
        title: 'Faça o primeiro login',
        description: 'Acesse o sistema no navegador e entre com o usuário inicial descrito no manual.',
        command: null
    }
]

export function LandingPage(): React.JSX.Element {
    return (
        <Page>
            <main>
                <Hero>
                    <HeroInner>
                        <h1>{configInfo.appName}</h1>
                        <Tagline>Gestão de biblioteca simples, gratuita e open source</Tagline>
                        <HeroText>
                            Livros, leitores e empréstimos organizados em um só lugar — feito para bibliotecas
                            comunitárias, escolas e igrejas, direto do celular.
                        </HeroText>
                        <CtaRow>
                            <PrimaryCta href="/login">Entrar no sistema</PrimaryCta>
                            <SecondaryCta href={configInfo.appRepository} target="_blank" rel="noopener noreferrer">
                                <FaGithub aria-hidden="true" /> Ver no GitHub
                            </SecondaryCta>
                        </CtaRow>
                    </HeroInner>
                </Hero>

                <Section aria-labelledby="recursos-titulo">
                    <SectionInner>
                        <h2 id="recursos-titulo">Tudo que uma biblioteca pequena precisa</h2>
                        <FeatureGrid>
                            {features.map(feature => (
                                <FeatureCard key={feature.title}>
                                    <FeatureIcon>{feature.icon}</FeatureIcon>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </FeatureCard>
                            ))}
                        </FeatureGrid>
                    </SectionInner>
                </Section>

                <StepsSection aria-labelledby="como-comecar-titulo">
                    <SectionInner>
                        <h2 id="como-comecar-titulo">Como começar</h2>
                        <StepsList>
                            {steps.map(step => (
                                <li key={step.title}>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                    {step.command && <Command>{step.command}</Command>}
                                </li>
                            ))}
                        </StepsList>
                        <StepsHelp>
                            Precisa de mais detalhes? Consulte o{' '}
                            <ManualLink href={configInfo.appManual} target="_blank" rel="noopener noreferrer">
                                manual de instalação e uso
                            </ManualLink>
                            .
                        </StepsHelp>
                    </SectionInner>
                </StepsSection>
            </main>

            <PageFooter>
                <p>
                    {configInfo.appName} é um projeto open source —{' '}
                    <FooterLink href={configInfo.appRepository} target="_blank" rel="noopener noreferrer">
                        repositório no GitHub
                    </FooterLink>
                </p>
            </PageFooter>
        </Page>
    )
}

const Page = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
    color: var(--color-gray-800);
`

const Hero = styled.section`
    background-color: var(--color-gray-800);
    color: var(--color-white);
    padding: 64px 24px;
`

const HeroInner = styled.div`
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h1 {
        font-size: 40px;
        font-weight: 700;
        line-height: 1.15;
    }
`

const Tagline = styled.p`
    margin-top: 12px;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--color-white);
`

const HeroText = styled.p`
    margin-top: 16px;
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-gray-300);
    max-width: 560px;
`

const CtaRow = styled.div`
    margin-top: 32px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    width: 100%;
`

const PrimaryCta = styled(Link)`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 12px 28px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary-dark);
    color: var(--color-white);
    font-size: 18px;
    font-weight: 600;

    &:hover,
    &:focus-visible {
        background-color: var(--color-primary);
    }
`

const SecondaryCta = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 12px 28px;
    border: 2px solid var(--color-white);
    border-radius: var(--radius-md);
    color: var(--color-white);
    font-size: 18px;
    font-weight: 600;

    &:hover,
    &:focus-visible {
        background-color: var(--color-gray-700);
    }
`

const Section = styled.section`
    padding: 48px 24px;

    h2 {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.3;
        text-align: center;
    }
`

const SectionInner = styled.div`
    max-width: 1080px;
    margin: 0 auto;
`

const FeatureGrid = styled.ul`
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
`

const FeatureCard = styled.li`
    background-color: var(--color-white);
    border: 1px solid var(--color-gray-200);
    border-radius: var(--radius-md);
    padding: 24px;

    h3 {
        margin-top: 12px;
        font-size: 18px;
        font-weight: 600;
    }

    p {
        margin-top: 8px;
        font-size: 15px;
        line-height: 1.6;
        color: var(--color-gray-700);
    }
`

const FeatureIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background-color: var(--color-gray-100);
    color: var(--color-primary-dark);
    font-size: 20px;
`

const StepsSection = styled(Section)`
    background-color: var(--color-white);
    border-top: 1px solid var(--color-gray-200);
`

const StepsList = styled.ol`
    margin-top: 32px;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
    counter-reset: passo;
    display: flex;
    flex-direction: column;
    gap: 24px;

    li {
        counter-increment: passo;
        position: relative;
        padding-left: 56px;

        &::before {
            content: counter(passo);
            position: absolute;
            left: 0;
            top: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: var(--color-primary-dark);
            color: var(--color-white);
            font-size: 18px;
            font-weight: 700;
        }
    }

    h3 {
        font-size: 18px;
        font-weight: 600;
    }

    p {
        margin-top: 4px;
        font-size: 15px;
        line-height: 1.6;
        color: var(--color-gray-700);
    }
`

const Command = styled.code`
    display: block;
    margin-top: 8px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    background-color: var(--color-gray-800);
    color: var(--color-gray-100);
    font-size: 14px;
    overflow-x: auto;
    white-space: nowrap;
`

const StepsHelp = styled.p`
    margin-top: 32px;
    text-align: center;
    font-size: 16px;
    line-height: 1.6;
`

const ManualLink = styled.a`
    display: inline-block;
    padding: 8px 0;
    color: var(--color-primary-dark);
    font-weight: 600;
    text-decoration: underline;
`

const PageFooter = styled.footer`
    margin-top: auto;
    background-color: var(--color-gray-800);
    color: var(--color-gray-100);
    padding: 24px;
    text-align: center;
    font-size: 15px;
    line-height: 1.6;
`

const FooterLink = styled.a`
    display: inline-block;
    padding: 8px 0;
    color: var(--color-white);
    font-weight: 600;
    text-decoration: underline;
`
