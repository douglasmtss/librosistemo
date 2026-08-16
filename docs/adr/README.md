# Architecture Decision Records (ADR)

Registro das decisões arquiteturais do Librosistemo, no formato de Michael Nygard.

## Regras

- Um ADR por decisão, numeração sequencial: `NNNN-titulo-kebab.md`.
- Crie o ADR **antes** de implementar a decisão (use `template.md`).
- ADR aceito não se edita: para reverter/mudar, crie um novo ADR e marque o antigo como `Substituído por NNNN`.
- Status possíveis: `Proposto`, `Aceito`, `Rejeitado`, `Obsoleto`, `Substituído por NNNN`.

## Índice

| Nº | Título | Status |
|---|---|---|
| [0001](./0001-nextjs-app-router-typescript.md) | Next.js App Router com TypeScript | Aceito (retroativo) |
| [0002](./0002-google-sheets-como-banco-de-dados.md) | Google Sheets como banco de dados | Substituído por 0007 |
| [0003](./0003-autenticacao-por-planilha-e-cookie.md) | Autenticação via aba `auth` + cookie `app-logged` | Substituído por 0007 |
| [0004](./0004-styled-components-e-tailwind.md) | Coexistência styled-components + Tailwind, convergindo para Tailwind | Substituído por 0008 |
| [0005](./0005-jest-rtl-badges-commitadas.md) | Jest + Testing Library com badges de cobertura commitadas | Aceito (retroativo) |
| [0006](./0006-agents-md-fonte-unica-para-cli-de-ia.md) | AGENTS.md como fonte única de instruções para CLIs de IA | Aceito |
| [0007](./0007-sqlite-prisma-como-banco-de-dados.md) | SQLite via Prisma como banco de dados | Aceito |
| [0008](./0008-remocao-tailwind-styled-components-unico.md) | Remoção do Tailwind; styled-components único | Aceito |
| [0009](./0009-devloop-e-ci-github-actions.md) | Devloop local integrado e CI no GitHub Actions | Aceito |

> ADRs marcados "(retroativo)" documentam decisões tomadas antes da adoção do processo de ADR, registradas em 2026-08-16 para dar contexto histórico.
