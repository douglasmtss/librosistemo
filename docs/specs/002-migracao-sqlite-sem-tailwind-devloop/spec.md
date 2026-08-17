# Spec 002 — Migração para SQLite (Prisma), remoção do Tailwind e devloop

- **Status**: Concluída (2026-08-16)
- **Data**: 2026-08-16
- **Autor**: Claude Code (a pedido de Douglas Silva)
- **ADRs relacionados**: [0007](../../adr/0007-sqlite-prisma-como-banco-de-dados.md), [0008](../../adr/0008-remocao-tailwind-styled-components-unico.md), [0009](../../adr/0009-devloop-e-ci-github-actions.md)

## Problema

1. **Google Sheets como banco** (ADR 0002) é o maior gargalo do sistema: cada request recarrega a planilha inteira, escrita depende de estado de módulo populado por um GET anterior (bug B9), não há transações nem integridade referencial, e exige credenciais Google expostas com prefixo `NEXT_PUBLIC_` (risco S3 crítico).
2. **Dois sistemas de estilo** (styled-components + Tailwind 4, ADR 0004) dobram o custo cognitivo; a decisão do produto agora é abandonar o Tailwind.
3. **Não há CI nem loop de desenvolvimento**: o gate `yarn test:build` é manual e nada roda em watch integrado.
4. Autenticação compara senha em texto puro e o cookie `app-logged` é verificado só por presença (S2/S4) — a reescrita da rota de auth pela migração é a oportunidade de corrigir.

## Escopo

- Substituir o Google Sheets por **SQLite via Prisma** (`prisma/dev.db`, ignorado pelo git): entidades `Book`, `User`, `Lend`, `Admin`.
- Rota de API genérica `/api/entities?entity=books|users|lends&id=...` substituindo `/api/spreadsheet?sheet=...`, com validação da entidade contra allowlist (fecha S1), instância por request (fecha B9), `await` nas escritas e status HTTP corretos.
- `/api/auth` compara senha com **bcrypt** e emite cookie de sessão **httpOnly assinado (HMAC-SHA256)** com expiração; `src/proxy.ts` valida a assinatura via Web Crypto (fecha S2/S4).
- Script de seed (`prisma/seed.ts`) criando o admin inicial; script `scripts/import-from-sheets.ts` para migrar dados reais da planilha (google-spreadsheet vira devDependency usada só por ele).
- Remoção completa do Tailwind: dependências, `postcss.config.mjs`, `@import 'tailwindcss'`, `tailwind-merge`/`tailwindMerge.ts`; todos os `className` utilitários convertidos para styled-components com tokens em CSS variables (`--color-primary` etc.) no `globals.css`.
- Atualização de dependências à última versão estável; remoção das libs mortas (`google-auth-library`, `tailwindcss`, `@tailwindcss/postcss`, `tailwind-merge`, `@types/uuid`); `engines` afrouxado para `>=24` + `.nvmrc`.
- Devloop: `yarn devloop` (concurrently: `next dev` + `tsc --watch` + `jest --watch`), script `typecheck`, e CI GitHub Actions (`lint` → `typecheck` → `testc` → `build`).
- A superfície `api.sheet.*` consumida pelas páginas/hook `useEntities` **não muda** — só a implementação interna de `src/services/api.ts`.
- Documentação: C4, `CURRENT_STATE.md`, `IMPROVEMENT_PLAN.md`, `AGENTS.md`, README e `env.template` atualizados.

Itens incorporados durante a execução (nota de revisão, 2026-08-16):

- **Landing page pública + SEO**: `/` deixa de exigir login e vira página de divulgação (`src/components/LandingPage.tsx`) com metadata Open Graph/Twitter, JSON-LD `SoftwareApplication`, `robots.ts` e `sitemap.ts` (só a landing é indexável); URL pública via `SITE_URL` (`src/config/site.ts`).
- **Genericização do produto**: o Librosistemo deixa de ser o sistema da biblioteca CCEAK e passa a se apresentar como produto open source genérico — identidade centralizada em `src/config/info.ts`.
- **E2E com Playwright**: `e2e/` + `playwright.config.ts` (build de produção, banco descartável `e2e.db`, perfis mobile e desktop), com job próprio na CI.
- **Docker/compose**: `Dockerfile` multi-stage (alvos `dev` e `prod`) + `compose.yaml` com banco SQLite em volume nomeado e `yarn db:setup` na subida.
- **Agentes novos**: `uiux-specialist` e `seo-specialist` em `.claude/agents/`.

## Não-escopo

- Reestruturação de rotas (`/pages/dashboard` → `/dashboard`) — Fase 4.
- Consolidação de formulários/paginação duplicados — Fase 3.
- PWA, a11y, i18n — Fase 4.
- Campo de devolução em `Lend` (mudança de modelo) — mantém o modelo atual na migração; fica para spec própria.
- Deploy/hosting do arquivo SQLite (documentado como restrição no ADR 0007).

## Critérios de aceite

- [x] CA1 — CRUD completo de books/users/lends persiste em SQLite; nenhuma request sai para `sheets.googleapis.com`.
- [x] CA2 — `POST /api/entities` funciona sem GET anterior (sem estado de módulo); escritas retornam 201/200 e erros retornam 4xx/5xx reais.
- [x] CA3 — `?entity=admin` (ou qualquer valor fora da allowlist) retorna 400.
- [x] CA4 — Login com senha correta emite cookie httpOnly assinado com expiração; cookie adulterado ou expirado redireciona para `/login`; senha no banco está com hash bcrypt.
- [x] CA5 — `grep -r tailwind` no código-fonte e `package.json` não retorna nada (exceto docs históricas/ADRs).
- [x] CA6 — Visual preservado: mesmas cores/espaçamentos via styled-components (validação manual).
- [x] CA7 — `yarn devloop` sobe dev server + typecheck + testes em watch; `yarn ci` (lint+typecheck+testc+build) verde localmente e no GitHub Actions.
- [x] CA8 — Suíte Jest inteira verde; testes das rotas de API testam comportamento com Prisma mockado (fim dos testes "arquivo-como-string").
- [x] CA9 — `yarn build` verde com todas as dependências atualizadas.
- [x] CA10 — Landing pública em `/` com metadata completa e JSON-LD; app autenticado e `/login` não indexáveis (`robots.txt` os bloqueia; sitemap lista só a landing).
- [x] CA11 — `docker compose up --build` sobe o app em http://localhost:3000 com banco SQLite persistente em volume nomeado (migrate + seed automáticos na subida).

## Impacto no usuário

- Fluxos de UI idênticos; latência muito menor (sem round-trip ao Google por request).
- **Migração de dados necessária**: rodar `yarn db:import-sheets` uma vez com as credenciais Google antigas para copiar a planilha para o SQLite; depois disso as credenciais Google podem ser revogadas.
- Novo requisito de setup: `yarn db:setup` (migrate + seed) cria o banco e o admin inicial (`ADMIN_USERNAME`/`ADMIN_PASSWORD` do `.env`).

## Riscos e rollback

- **Risco**: perda de dados na importação → o script é somente-leitura na planilha; a planilha permanece intacta como backup até validação manual.
- **Risco**: SQLite não persiste em hosts serverless (Vercel) → documentado no ADR 0007; para serverless, trocar datasource para Turso/Postgres (Prisma torna isso uma mudança de configuração).
- **Risco**: regressão visual na conversão Tailwind→styled-components → conversão arquivo a arquivo com testes por arquivo; revisão visual ao final.
- **Rollback**: reverter o(s) commit(s); a planilha continua íntegra e o código antigo volta a funcionar com as envs antigas.
