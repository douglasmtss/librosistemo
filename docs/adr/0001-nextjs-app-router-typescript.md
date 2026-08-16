# 0001 — Next.js App Router com TypeScript

- **Status**: Aceito (retroativo)
- **Data**: 2026-08-16 (registro; decisão original anterior)
- **Decisores**: Douglas Silva

## Contexto

O Librosistemo precisa de uma aplicação web full-stack simples (UI + API) hospedável facilmente, com foco em uso mobile. Uma única codebase para frontend e backend reduz o custo de manutenção de um projeto pessoal.

## Decisão

Usar **Next.js com App Router** (`src/app/`) e **TypeScript estrito** como framework único, com API routes (`src/app/api/*`) fazendo o papel de backend. Estilização base com Tailwind, aliases `@/*` → `src/*`, lint com ESLint flat config + Prettier.

## Consequências

- Frontend e backend no mesmo deploy; API routes servem de camada server-side para esconder credenciais do Google.
- Dívida herdada: as páginas foram criadas sob `src/app/pages/dashboard/...`, então as URLs carregam o prefixo `/pages` (resquício de mentalidade Pages Router). A remoção do prefixo é item do IMPROVEMENT_PLAN.
- As páginas são todas client components que buscam dados via axios — não se aproveitam server components/streaming; otimização futura possível.
- Upgrades de major do Next passam a ser rotina do projeto (ver agente `migration-specialist`).
