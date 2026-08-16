# AGENTS.md — Librosistemo

> Fonte única de instruções para agentes de código (Claude Code, Codex CLI, Copilot CLI).
> `CLAUDE.md` e `.github/copilot-instructions.md` apenas referenciam este arquivo — edite aqui.

## O que é o projeto

Librosistemo é um sistema **open source e genérico** de gestão de biblioteca (livros, usuários e empréstimos) construído em **Next.js 16 (App Router) + React 19 + TypeScript**, com **SQLite via Prisma 7** como banco de dados (ADR 0007). Busca de livros por ISBN usando a BrasilAPI, com leitura de código de barras pela câmera (html5-qrcode / react-webcam). A landing page pública (`/`) divulga o projeto; o app vive atrás de login (`/login` + `/pages/dashboard/...`).

## Comandos

```bash
yarn dev            # dev server em http://localhost:3000
yarn devloop        # dev server + typecheck em watch + jest em watch (um terminal só)
yarn build          # build de produção
yarn lint           # ESLint (flat config, eslint.config.mjs)
yarn typecheck      # tsc --noEmit
yarn test           # Jest (jsdom + RTL)
yarn testw          # Jest em watch mode
yarn testc          # Jest com cobertura
yarn testcb         # cobertura + regenera badges SVG em ./badges
yarn e2e            # Playwright (exige yarn build antes)
yarn ci             # gate completo: lint + typecheck + testc + build (== CI)

yarn db:migrate     # cria/aplica migration em dev (prisma migrate dev)
yarn db:setup       # migrate deploy + seed (cria admin de ADMIN_USERNAME/ADMIN_PASSWORD)
yarn db:seed        # só o seed
yarn db:studio      # Prisma Studio
yarn db:import-sheets  # importação one-shot da planilha Google antiga (envs GOOGLE_*)
```

- Node `>=24` (`.nvmrc`). Gerenciador de pacotes: **yarn** (yarn.lock).
- CI no GitHub Actions (`.github/workflows/ci.yml`): `yarn ci` + E2E Playwright em todo push/PR para main.
- Docker: `docker compose up --build` (produção local) ou `docker compose --profile dev up dev` (hot reload).

## Arquitetura (resumo — detalhes em docs/architecture/c4/)

Fluxo de dados: **Página (client component) → `src/services/api.ts` (axios, fábrica de CRUD genérica `api.sheet.*`) → API routes (`src/app/api/*`) → `src/services/db/repositories.ts` (coerção de tipos na borda) → Prisma (`src/services/db/prisma.ts`, client gerado em `src/generated/prisma`) → SQLite**.

- `src/proxy.ts`: proxy/middleware do Next — valida o cookie de sessão `app-session` (HMAC-SHA256 via `src/services/session.ts`); sem sessão válida redireciona para `/login`. A landing `/`, `robots.txt` e `sitemap.xml` são públicos.
- `src/app/api/auth/route.ts`: login com senha bcrypt contra a tabela `admins`; emite cookie httpOnly assinado com expiração. `DELETE /api/auth` faz logout.
- `src/app/api/entities/route.ts`: CRUD genérico por query string `?entity=books|users|lends&id=...`, com allowlist de entidades (400 fora dela), instância por request e status HTTP reais.
- Entidades: `Book`, `User`, `Lend` — tipos globais em `src/types/*.d.ts` (ambient declarations, sem import); schema Prisma em `prisma/schema.prisma` (modelo `Admin` adicional para auth).
- Rotas de página ficam sob o prefixo incomum `src/app/pages/dashboard/...` (URLs são `/pages/dashboard/...`).
- Estado: sem lib de estado global; hook `src/hooks/useEntities.ts` busca books/users/lends e expõe estados de loading/filtro/options.
- SEO: só a landing é indexável — `src/app/robots.ts`, `src/app/sitemap.ts`, URL pública em `src/config/site.ts` (`SITE_URL`).

## Convenções de código

- **Prettier** (`.prettierrc.json`): 4 espaços, sem ponto e vírgula, aspas simples, `printWidth: 120`, `trailingComma: none`, `arrowParens: avoid`.
- Imports usam alias `@/*` → `src/*`. Nunca importe de `src/generated/` fora de `src/services/db/`.
- Componentes em `src/components/` (PascalCase, um por arquivo); estilos compartilhados em `src/components/styles.ts`.
- **styled-components é a única solução de estilo (ADR 0008)** — Tailwind foi removido; é proibido reintroduzir classes utilitárias ou dependências Tailwind. Tokens de design (cores, raios) são CSS variables em `src/app/globals.css` — cor nova = token novo.
- Tipos de domínio são declarações ambient em `src/types/*.d.ts` — não adicione `import`/`export` nesses arquivos ou eles deixam de ser globais.
- Textos de UI estão em português hardcoded — mantenha o idioma.
- NUNCA rode comandos git destrutivos (`git restore`, `git checkout --`, `git stash`, `git reset --hard`) — pode haver trabalho paralelo não commitado na working tree.

## Testes

- Jest 30 + Testing Library, ambiente jsdom (rotas de API e services usam docblock `@jest-environment node`), config em `jest.config.ts` (via `next/jest`).
- Todo arquivo novo em `src/` deve ter teste correspondente em `__tests__/` ao lado (`src/<área>/__tests__/<nome>.test.ts[x]`).
- Padrão dos testes de página: mockar `next/navigation`, `@/services/api` e componentes pesados (Scan/Camera). Rotas de API mockam `@/services/db/repositories` (nunca importe o client Prisma gerado em teste).
- E2E com Playwright em `e2e/` (config `playwright.config.ts`, banco descartável `e2e.db`, perfis mobile + desktop).
- Badges de cobertura são commitados em `./badges` — se rodar `yarn testcb`, commite os SVGs atualizados.

## Variáveis de ambiente (env.template)

```
DATABASE_URL        # ex.: file:./dev.db
SESSION_SECRET      # obrigatório em produção (assina o cookie de sessão)
ADMIN_USERNAME      # admin inicial criado pelo seed
ADMIN_PASSWORD
SITE_URL            # URL pública (SEO) — opcional em dev
GOOGLE_*            # somente para yarn db:import-sheets (migração one-shot)
```

Nunca logue nem exponha esses valores; nunca use envs com prefixo `NEXT_PUBLIC_` para segredos.

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

Definições em `.claude/agents/` (Claude Code as carrega automaticamente; para Codex/Copilot, use os mesmos arquivos como prompts de sistema). Áreas: migração/upgrade, segurança, frontend, camada de dados (Prisma/SQLite), testes, documentação, design UI/UX (`uiux-specialist`) e SEO (`seo-specialist`).
