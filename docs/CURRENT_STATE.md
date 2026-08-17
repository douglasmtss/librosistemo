# Estado Atual do Sistema — Librosistemo

> Fotografia completa do sistema em **2026-08-16**, após a conclusão da [spec 002](./specs/002-migracao-sqlite-sem-tailwind-devloop/spec.md) (migração Sheets → SQLite, remoção do Tailwind, devloop/CI).
> Complementa os diagramas em [`architecture/c4/`](./architecture/c4/README.md). O plano de correção priorizado está em [`IMPROVEMENT_PLAN.md`](./IMPROVEMENT_PLAN.md).

## 1. Visão geral

Sistema **open source e genérico** de gestão de biblioteca pequena (acervo, leitores, empréstimos), mobile-first, com um único usuário admin. Stack: **Next.js 16.3 (App Router) + React 19.2 + TypeScript 5.9 (strict)**, **SQLite via Prisma 7** (adapter better-sqlite3, ADR 0007), **styled-components 6 como única solução de estilo** (ADR 0008), Jest 30 + Testing Library, Playwright para E2E. Node `>=24` (`.nvmrc`), gerenciador yarn.

- Cobertura atual (badges commitadas): statements/lines **75,57%**, functions **87,25%**, branches **94,13%** — `coverageThreshold` ainda comentado no `jest.config.ts`.
- **CI no GitHub Actions** (`.github/workflows/ci.yml`): `yarn ci` (lint + typecheck + testes com cobertura + build) + job E2E Playwright em todo push/PR para `main` (ADR 0009).
- **Docker**: `Dockerfile` multi-stage (alvos `dev` e `prod`) + `compose.yaml` com banco em volume nomeado.
- Sem LICENSE commitada (pendência da Fase 2 — o produto se anuncia open source).

## 2. Arquitetura em execução

Fluxo de dados: **Página (client component) → `src/services/api.ts` (axios, fábrica de CRUD genérica `api.sheet.*`) → `/api/entities` (`src/app/api/entities/route.ts`) → `src/services/db/repositories.ts` (coerção de tipos na borda) → Prisma (`src/services/db/prisma.ts`, client gerado em `src/generated/prisma`) → SQLite**.

- **Landing page pública** em `/` (`src/app/page.tsx` + `src/components/LandingPage.tsx`): Server Component com metadata completa (Open Graph, Twitter card, canonical) e JSON-LD `SoftwareApplication`. O app administrativo vive atrás de login em `/pages/dashboard/...`.
- **SEO**: só a landing é indexável — `src/app/robots.ts` bloqueia `/pages/`, `/login` e `/api/`; `src/app/sitemap.ts` lista só a home; URL pública vem de `SITE_URL` (`src/config/site.ts`). Identidade do produto centralizada em `src/config/info.ts`.
- **Middleware** `src/proxy.ts`: libera `/` (e `robots.txt`/`sitemap.xml`/assets via matcher); todo o resto exige o cookie de sessão `app-session` com **assinatura HMAC-SHA256 válida e não expirada** (`src/services/session.ts`, Web Crypto — roda no Edge). Sem sessão válida → redirect para `/login`.
- **Autenticação** (`src/app/api/auth/route.ts`): compara senha com **bcrypt** contra a tabela `admins`; sucesso emite cookie httpOnly (`sameSite: lax`, `secure` em produção, TTL 8h); falha responde **401 real**. Logout via `DELETE /api/auth`. Admin inicial criado pelo seed (`prisma/seed.ts`) a partir de `ADMIN_USERNAME`/`ADMIN_PASSWORD`.
- **API de dados** (`/api/entities?entity=books|users|lends&id=...`): allowlist de entidades (`src/enums/entities.ts` — valor fora dela → 400), sem estado de módulo, `await` em todas as escritas, status HTTP reais (201 no create, 404 via código Prisma `P2025`, 500 com log).
- **Rotas de página** ainda carregam o prefixo literal `/pages` (`src/app/pages/dashboard/...`) — migração prevista na Fase 4. Edição de livro em `/pages/dashboard/[rowIndex]` continua inconsistente com users/lends.
- **Integração ISBN**: apenas BrasilAPI, chamada do navegador (`services.brasilapi` em `src/services/api.ts`). O código morto da Google Books API foi removido de `api.ts` na refatoração (os tipos `google-api-book.d.ts` ainda existem sem uso).
- Quase toda a UI continua client-side (páginas `'use client'`, dados buscados no mount via `useEntities`); sem `loading.tsx`/`error.tsx`/`not-found.tsx`.

## 3. Modelo de dados (`prisma/schema.prisma`)

| Modelo | Campos | Observações |
|---|---|---|
| `Book` | id (uuid), isbn, title, subtitle, author, description, image (base64!), amount (Int), category, status, place | Defaults no schema; `amount` agora é `Int` de verdade — a coerção string→número acontece uma vez na borda (`repositories.ts`) |
| `User` (leitor) | id, first_name, last_name, phone | Não é conta de acesso |
| `Lend` | id, user_id, first_name, last_name, book_id, book_title, created | **Ainda denormalizado** (nome/título copiados, sem FKs); sem data de devolução — devolver = excluir a linha (Fase 5) |
| `Admin` | id, username (único), passwordHash | Senha só como hash bcrypt |

- Identidade por `id` UUID (chave primária real — fim da varredura linear por `rowNumber`).
- `src/services/db/repositories.ts` faz a coerção de tipos por entidade na fronteira JSON solto → schema tipado; páginas continuam consumindo a superfície `api.sheet.*` inalterada.
- Capas de livro seguem como **base64 na coluna `image`**, inflando payloads de listagem (Fase 5: mover para filesystem/storage).

## 4. Segurança

As quatro vulnerabilidades críticas/altas do levantamento anterior foram **resolvidas em 2026-08-16** (spec 001 + spec 002, commit dfe3395):

| # | Situação | Resolução |
|---|---|---|
| S1 | ~~`?sheet=auth` expunha credenciais~~ | **Resolvido** — allowlist de entidades em `/api/entities`; a tabela `admins` não é alcançável pela API |
| S2 | ~~Cookie `app-logged` forjável criado no cliente~~ | **Resolvido** — cookie httpOnly assinado (HMAC-SHA256) com expiração, validado pelo proxy; logout real |
| S3 | ~~Credenciais Google com `NEXT_PUBLIC_`~~ | **Resolvido** — credenciais Google saíram do runtime (só o script one-shot `db:import-sheets` as usa) |
| S4 | ~~Senha em texto puro, login 200 em falha~~ | **Resolvido** — hash bcrypt, 401 real, `type="password"`, logs de auth removidos |

Pendências ativas:

- **S5 (média)**: nenhuma validação de schema de payload nas rotas (`body` é coagido campo a campo, mas sem rejeição de payload inválido — Zod planejado na Fase 1); sem CSRF token, sem rate limit no login, sem headers de segurança no `next.config.ts`.
- `SESSION_SECRET` tem fallback de desenvolvimento (`src/services/session.ts`) — em produção sem a env o sistema loga erro mas continua assinando com o segredo público do fonte.
- `/api/entities` não exige sessão por si só — a proteção vem do matcher do `proxy.ts` (defesa em camada única).

## 5. Bugs funcionais conhecidos

| # | Situação | Bug | Local |
|---|---|---|---|
| B1 | Pendente | `params` acessado sincronamente em 3 rotas dinâmicas (no Next 16 é Promise) | `book-registration/[isbn]`, `lends/[rowIndex]`, `users/[rowIndex]` |
| B2 | Pendente | **Edita o registro errado**: links de edição usam índice do slice da página — a partir da página 2 ou com filtro, abre outro registro | `PaginatedBookItems`, `PaginatedUserItems`, `PaginatedLendsItems` |
| B3 | Pendente | Filtro invertido ao excluir empréstimo (`filter(lend => lend?.id === id)` mantém só o excluído) | `lends/[rowIndex]/page.tsx` |
| B4 | Pendente | Busca usa input do usuário como **regex** — `(`, `[`, `*` lançam `SyntaxError` | `books/page.tsx`, `users/page.tsx`, `lends/page.tsx` |
| B5 | Pendente | Cadastro por lista exige `\n` no input — ISBN único sem Enter não habilita o botão | `book-registration/list/page.tsx` |
| B6 | Pendente | Excluir 1 empréstimo marca o livro `available` mesmo com outros empréstimos ativos | `lends/page.tsx`, `lends/[rowIndex]/page.tsx` |
| B7 | Pendente | Listeners nunca removidos (função anônima no `removeEventListener`) | `BackToTopButton.tsx`, `TextElipsis.tsx` |
| B8 | Pendente | `useEffect` com `[props]` reseta o formulário de edição a cada render | `BookEditForm.tsx` |
| B9 | **Resolvido** (2026-08-16) | ~~Escritas dependiam de GET prévio (variável de módulo) e não eram aguardadas~~ — eliminado pela migração para Prisma (`/api/entities` sem estado de módulo, `await` em tudo) | — |
| B10 | Pendente | Blob URL criada a cada render sem `revokeObjectURL` | `list_isbn/page.tsx` |
| B11 | Pendente | Erros de rede viram `undefined` coagido (`as AxiosResponse`) no client — acessar `response.status` lança `TypeError`; erro de API vira "lista vazia" na UI | `src/services/api.ts` |

## 6. Qualidade de código

- **Duplicação remanescente**: o formulário de livro ainda existe em 4 cópias (`BookCreateForm`, `BookCreateFormFromList`, `book-registration/manual/page.tsx`, `BookEditForm`); o trio `Paginated*Items` segue estruturalmente idêntico; `useEntities` (`src/hooks/useEntities.ts`) ainda retorna **24 valores**. Consolidação é a Fase 3. Ponto positivo novo: `api.ts` virou fábrica genérica (`createEntityCrud`) — a triplicação do CRUD client morreu.
- **Estilo**: styled-components é a única solução (Tailwind removido — ADR 0008); tokens de design (cores, raios) são CSS variables em `src/app/globals.css`; estilos de formulário compartilhados em `src/components/formStyles.ts`. `react-select` ainda traz Emotion como segundo sistema de estilo no bundle.
- **Código morto restante**: `UserCreateForm.tsx` (só referenciado pelo próprio teste), `isEmpty.ts`, `calcImageSize.ts`, tipos `google-api-book.d.ts`. Removidos na refatoração: `services.google`, `validateIsbnFromGoogleApiItems.ts`, `tailwindMerge.ts`, `spreadsheetToDTO.ts`, `jwtServiceAccountAuth.ts`.
- Typos de identificadores e UI persistem (`paginateNagivationButtons.tsx`, `"Nenhum dado foi econtrado"` etc.); supressões de `exhaustive-deps` persistem; formulários seguem sem `onSubmit` real nem validação de ISBN.

## 7. Testes

- **Jest**: 65 arquivos, **796 casos**, todos verdes na CI. Rotas de API e services de servidor usam docblock `@jest-environment node` e mockam `@/services/db/repositories` — os antigos testes "arquivo-como-string" foram substituídos por testes comportamentais reais (auth com bcrypt, sessão, allowlist, status HTTP, coerção dos repositórios).
- **E2E (Playwright)**: `e2e/auth.spec.ts` — 4 cenários (redirect sem sessão, login inválido, login válido, cookie adulterado) × 2 perfis (Pixel 7 e Desktop Chrome) = **8 execuções**. Roda contra build de produção com banco descartável `e2e.db` (`playwright.config.ts`).
- Badges de cobertura commitadas em `./badges` (regeneradas por `yarn testcb`).
- Dívidas: `coverageThreshold` comentado; parte dos testes de `login.test.tsx` segue com asserções fracas (Fase 3).

## 8. Dependências — riscos

| Item | Situação |
|---|---|
| `html5-qrcode` 2.3.8 | **Pendente** — sem manutenção desde ~2023; único fornecedor do scanner (avaliar substituto na Fase 2, via ADR) |
| `jest-coverage-badges` | Sem releases há anos |
| `react-select` | Traz Emotion (sistema de estilo paralelo) — avaliar remoção na Fase 3 |
| `google-spreadsheet` / `google-auth-library` | Agora **devDependencies**, usadas só por `scripts/import-from-sheets.ts` |
| ~~Tailwind, `tailwind-merge`, `clsx` fantasma, `@types/uuid`, `@types/node` desatualizado~~ | **Resolvidos** em 2026-08-16 — removidos/atualizados (ADR 0008, spec 002) |

## 9. Performance

- A classe inteira de problemas do Sheets morreu: sem recarga de planilha por request, escritas transacionais locais, login sem round-trip ao Google.
- Restam: paginação e busca 100% client-side sem debounce; capas base64 inflando o JSON de listagem; cadastro em lote de ISBN pausa 60 s a cada lote (`ISBN_LOOKUP_DELAY_MS` — rate limit da BrasilAPI); `AllBooks` varre `lends` por livro a cada render.

## 10. Acessibilidade, i18n e PWA

- `<html lang="pt-BR">` corrigido (`src/app/layout.tsx`); a landing nova usa `aria-hidden` em ícones decorativos e links com `rel="noopener noreferrer"`.
- No app autenticado seguem as dívidas da Fase 4: `<div onClick>` sem role/teclado, formulários sem labels adequados, `<img>` cru sem lazy/fallback.
- Sem i18n — textos PT hardcoded (convenção assumida em `AGENTS.md`).
- PWA segue pendente: `src/app/site.webmanifest` não segue a convenção `manifest.webmanifest` do App Router; sem service worker — app não instalável (Fase 4).

## 11. CI/CD e processo

- **GitHub Actions** ativo: jobs `quality` (`yarn ci`) e `e2e` (build + Playwright chromium, relatório publicado como artifact em falha) em push/PR para `main`.
- `yarn devloop` dá o loop local integrado (dev server + `tsc --watch` + `jest --watch`).
- Pendentes: `coverageThreshold`, Dependabot/Renovate, template de PR, LICENSE (Fase 2).
- Branch remota `nextjs-14.2.3-reactjs-18` registra o estado pré-upgrade; a planilha Google antiga permanece como backup histórico dos dados até a validação final da importação.
