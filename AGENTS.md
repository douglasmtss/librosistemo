# AGENTS.md — Librosistemo

> Fonte única de instruções para agentes de código (Claude Code, Codex CLI, Copilot CLI).
> `CLAUDE.md` e `.github/copilot-instructions.md` apenas referenciam este arquivo — edite aqui.

## O que é o projeto

Librosistemo é uma aplicação de gestão de biblioteca (livros, usuários e empréstimos) construída em **Next.js 16 (App Router) + React 19 + TypeScript**, que usa **Google Sheets como banco de dados** via service account. Busca de livros por ISBN usando a BrasilAPI (a integração com Google Books existe em `src/services/api.ts` mas é código morto), com leitura de código de barras pela câmera (html5-qrcode / react-webcam).

## Comandos

```bash
yarn dev          # dev server em http://localhost:3000
yarn build        # build de produção
yarn lint         # ESLint (flat config, eslint.config.mjs)
yarn test         # Jest (jsdom + RTL)
yarn testw        # Jest em watch mode
yarn testc        # Jest com cobertura
yarn testcb       # cobertura + regenera badges SVG em ./badges
yarn test:build   # cobertura + badges + build (gate local de qualidade)
```

- Node fixado em `24.12.0` (campo `engines`). Gerenciador de pacotes: **yarn** (yarn.lock).
- Não existe CI configurada (sem `.github/workflows`); `yarn test:build` é o gate manual antes de push.

## Arquitetura (resumo — detalhes em docs/architecture/c4/)

Fluxo de dados: **Página (client component) → `src/services/api.ts` (axios) → API routes (`src/app/api/*`) → `src/services/spreadsheetToDTO.ts` → `google-spreadsheet` + JWT (`src/services/jwtServiceAccountAuth.ts`) → Google Sheets**.

- `src/proxy.ts`: proxy/middleware do Next — redireciona para `/login` se o cookie `app-logged` não existir (proteção apenas de presença, não valida sessão).
- `src/app/api/auth/route.ts`: login comparando username/password em texto puro contra a aba `auth` da planilha.
- `src/app/api/spreadsheet/route.ts`: CRUD genérico por query string `?sheet=books|users|lends&id=...`. ATENÇÃO: usa variável de módulo `spreadsheet` populada apenas no GET — POST/PUT/DELETE dependem de um GET anterior na mesma instância (bug conhecido, ver docs/adr/).
- Entidades: `Book`, `User`, `Lend` — tipos globais em `src/types/*.d.ts` (ambient declarations, sem import).
- Rotas de página ficam sob o prefixo incomum `src/app/pages/dashboard/...` (URLs são `/pages/dashboard/...`).
- Estado: sem lib de estado global; hook `src/hooks/useEntities.ts` busca books/users/lends e expõe estados de loading/filtro/options.

## Convenções de código

- **Prettier** (`.prettierrc.json`): 4 espaços, sem ponto e vírgula, aspas simples, `printWidth: 120`, `trailingComma: none`, `arrowParens: avoid`.
- Imports usam alias `@/*` → `src/*`.
- Componentes em `src/components/` (PascalCase, um por arquivo); estilos compartilhados de styled-components em `src/components/styles.ts`. O projeto mistura **styled-components + Tailwind 4** — siga o padrão do arquivo que estiver editando; não converta um para o outro sem tarefa explícita.
- Tipos de domínio são declarações ambient em `src/types/*.d.ts` — não adicione `import`/`export` nesses arquivos ou eles deixam de ser globais.
- Textos de UI estão em português hardcoded — mantenha o idioma.

## Testes

- Jest 30 + Testing Library, ambiente jsdom, config em `jest.config.ts` (via `next/jest`).
- Todo arquivo novo em `src/` deve ter teste correspondente em `__tests__/` ao lado (`src/<área>/__tests__/<nome>.test.ts[x]`).
- Padrão dos testes de página: mockar `next/navigation`, `@/services/api` e componentes pesados (Scan/Camera).
- Badges de cobertura são commitados em `./badges` — se rodar `yarn testcb`, commite os SVGs atualizados.

## Variáveis de ambiente (env.template)

```
NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL
NEXT_PUBLIC_GOOGLE_PRIVATE_KEY
NEXT_PUBLIC_GOOGLE_SHEET_ID
```

⚠️ O prefixo `NEXT_PUBLIC_` é um problema de segurança conhecido (chave privada exposta ao bundler) — plano de correção em `docs/IMPROVEMENT_PLAN.md`. Nunca logue nem exponha esses valores; nunca crie novos usos client-side deles.

## Documentação — onde ler e onde escrever

| Documento | Propósito |
|---|---|
| `docs/architecture/c4/` | Diagramas C4 (contexto, contêineres, componentes) — atualizar quando a arquitetura mudar |
| `docs/adr/` | Architecture Decision Records — toda decisão arquitetural nova exige um ADR |
| `docs/specs/` | Spec-Driven Development — features novas começam por uma spec (ver `docs/specs/README.md`) |
| `docs/CURRENT_STATE.md` | Fotografia do estado atual do sistema |
| `docs/IMPROVEMENT_PLAN.md` | Plano de melhoria/migração/upgrade priorizado |

Fluxo para mudanças não triviais: **spec → plan → tasks → implementação → testes → atualizar C4/ADR se a arquitetura mudou**.

## Agentes especialistas

Definições em `.claude/agents/` (Claude Code as carrega automaticamente; para Codex/Copilot, use os mesmos arquivos como prompts de sistema). Áreas: migração/upgrade, segurança, frontend, camada de dados (Sheets), testes e documentação.
