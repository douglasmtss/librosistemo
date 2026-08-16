# Estado Atual do Sistema — Librosistemo

> Fotografia completa do sistema em **2026-08-16** (branch `main`, working tree limpo).
> Complementa os diagramas em [`architecture/c4/`](./architecture/c4/README.md). O plano de correção priorizado está em [`IMPROVEMENT_PLAN.md`](./IMPROVEMENT_PLAN.md).

## 1. Visão geral

Aplicação web de gestão de biblioteca pequena (acervo, leitores, empréstimos), mobile-first, com um único usuário admin. Stack: **Next.js 16.1.1 (App Router) + React 19.2.3 + TypeScript 5.9 (strict)**, **Google Sheets como banco de dados** (lib `google-spreadsheet` 4.1.5 + JWT service account), Tailwind 4 + styled-components 6 coexistindo, Jest 30 + Testing Library. Node fixado em `24.12.0`, gerenciador yarn.

- 143 arquivos em `src/` (64 são testes, ~11.400 linhas de teste).
- Cobertura atual (badges commitadas): statements/lines **66,85%**, functions **88,78%**, branches **94,93%** — sem threshold enforçado.
- Sem CI/CD, sem Docker, sem `.nvmrc`, sem LICENSE. Gate de qualidade é manual (`yarn test:build`).

## 2. Arquitetura em execução

- **Quase tudo é client-side**: dos 19 `page.tsx`/`layout.tsx`, só 2 são Server Components (`src/app/layout.tsx` e `src/app/pages/dashboard/page.tsx`). Não há `fetch` server-side, `revalidate`, streaming, `loading.tsx`, `error.tsx` nem `not-found.tsx`.
- **Rotas** carregam o prefixo literal `/pages` (`src/app/pages/dashboard/...`). Edição de livro fica em `/pages/dashboard/[rowIndex]` (raiz do dashboard), enquanto users/lends têm `[rowIndex]` sob seus subcaminhos — inconsistente.
- **Middleware** `src/proxy.ts` (convenção `proxy.ts` do Next 16): exige o cookie `app-logged` para tudo exceto `api/auth`, `login` e assets. Consequência: **não existe página pública** — até a home `/` exige login.
- **API**: `/api/auth` (login) e `/api/spreadsheet` (CRUD genérico via `?sheet=books|users|lends&id=`).
- **Integração ISBN**: apenas BrasilAPI é usada (chamada do navegador). `services.google` (Google Books) e `src/lib/validateIsbnFromGoogleApiItems.ts` são **código morto** — o README anuncia a Google API indevidamente.
- **`'use server'`** aparece dentro de 5 funções de serviço (`google-spreadsheet.ts`, `spreadsheetToDTO.ts`), transformando-as em Server Actions indevidamente — inclusive uma que retorna objeto não serializável (`GoogleSpreadsheet`).

## 3. Modelo de dados

| Entidade | Campos | Observações |
|---|---|---|
| `Book` | id?, rowIndex?, isbn, title, subtitle, author, description, image (base64!), amount, category, status?, place? | `isbn`/`amount` tipados `number` mas chegam como `string` do Sheets — conversões espalhadas |
| `User` (leitor) | id?, rowIndex?, first_name, last_name, phone | Não é conta de acesso |
| `Lend` | id?, user_id, first_name, last_name, book_id, book_title, created | **Denormalizado** (nome/título copiados); sem data de devolução — devolver = excluir a linha |

- Identidade por coluna `id` (UUID), resolvida a `rowNumber` por varredura linear a cada operação.
- `Row = Record<string, string>` — não há mapeamento tipado real, só casts (`as unknown as Book[]`), 44 ocorrências de `as unknown as` no projeto.
- Capas de livro são **base64 gravado na célula da planilha**, inflando todos os payloads de listagem.
- `google-api-book.d.ts` tem tipos duplicados (`ImageLinks` etc. declarados 2× com divergência).

## 4. Segurança — vulnerabilidades ativas

| # | Severidade | Vulnerabilidade | Local |
|---|---|---|---|
| S1 | **Crítica** | `GET /api/spreadsheet?sheet=auth` retorna `{username, password}` do admin em texto puro (parâmetro `sheet` não validado; `get` expõe a aba `auth`) | `api/spreadsheet/route.ts:13-17`, `spreadsheetToDTO.ts:57` |
| S2 | **Crítica** | Sessão forjável: cookie `app-logged=yes` criado no cliente (`document.cookie`), sem HttpOnly/Secure/SameSite/expiração; middleware checa só presença; sem logout real | `login/page.tsx:36`, `proxy.ts:5-9`, `LayoutMenu.tsx:81-89` |
| S3 | Alta | Credenciais da service account com prefixo `NEXT_PUBLIC_` — hoje só código server as importa (cadeia verificada), mas um import acidental em client component publicaria a chave privada | `env.template`, `jwtServiceAccountAuth.ts:4-6` |
| S4 | Alta | Senha em texto puro na planilha; comparação não constante; falha de login responde HTTP 200; campo de senha `type="text"`; `console.log` na rota | `api/auth/route.ts`, `login/page.tsx:76` |
| S5 | Média | Nenhuma validação de payload/query em nenhuma rota; sem CSRF, sem rate limit no login; sem headers de segurança no `next.config.ts` | rotas de API |

Positivo: `.gitignore` cobre `.env`/`*.pem` e nenhum segredo está commitado (verificado). `BASE_URL` usado em `api.ts:6` não está documentado no `env.template`.

## 5. Bugs funcionais conhecidos

| # | Bug | Local |
|---|---|---|
| B1 | `params` acessado sincronamente em 3 de 4 rotas dinâmicas (no Next 16 `params` é Promise) — só `dashboard/[rowIndex]` usa `React.use(params)` | `book-registration/[isbn]`, `lends/[rowIndex]`, `users/[rowIndex]` |
| B2 | **Edita o registro errado**: links de edição usam o índice do slice da página (`0..9`), e a página de edição resolve por índice na lista completa — a partir da página 2 ou com filtro, abre outro registro | `PaginatedBookItems.tsx:67`, `PaginatedUserItems.tsx:59`, `PaginatedLendsItems.tsx:61` |
| B3 | Filtro invertido ao excluir empréstimo: `filter(lend => lend?.id === id)` mantém só o excluído | `lends/[rowIndex]/page.tsx:27` |
| B4 | Busca usa o input do usuário como **regex** — digitar `(`, `[`, `*` lança `SyntaxError` | `books/page.tsx:35`, `users/page.tsx:27`, `lends/page.tsx:42` |
| B5 | Cadastro por lista de ISBN exige `\n` no input — um ISBN único sem Enter nunca habilita o botão | `book-registration/list/page.tsx:11-16` |
| B6 | Excluir 1 empréstimo marca o livro `available` mesmo com outros empréstimos ativos do mesmo título | `lends/page.tsx:27-32`, `lends/[rowIndex]/page.tsx:22-26` |
| B7 | Listeners nunca removidos (função anônima diferente no `removeEventListener`) | `BackToTopButton.tsx:9-11`, `TextElipsis.tsx:34-51` |
| B8 | `useEffect` com `[props]` reseta o formulário de edição a cada render | `BookEditForm.tsx:52-57` |
| B9 | POST/PUT/DELETE de `/api/spreadsheet` dependem de GET prévio na mesma instância (variável de módulo) e não aguardam a escrita (respondem 200 antes de gravar; falha vira unhandled rejection) | `api/spreadsheet/route.ts:6,26,39,51` |
| B10 | Blob URL criada a cada render sem `revokeObjectURL` | `list_isbn/page.tsx:198-205` |
| B11 | Erros de rede viram `undefined` coagido (`as AxiosResponse`) — acessar `response.status` lança `TypeError`; erro do Sheets vira "lista vazia" na UI | `api.ts` (12 métodos), `spreadsheetToDTO.ts:122-153` |

## 6. Qualidade de código

- **Duplicação massiva**: o formulário de livro existe em **4 cópias** (`BookCreateForm`, `BookCreateFormFromList` — 266 linhas cada, 7 linhas de diferença real —, `book-registration/manual/page.tsx`, `BookEditForm`). O trio `Paginated*Items` é estruturalmente idêntico. Os 3 blocos de `api.ts` (~50 linhas cada) diferem só pela entidade. `useEntities` retorna 24 valores e triplica os getters.
- **Código morto**: `UserCreateForm.tsx` (98 linhas, só referenciado pelo próprio teste), `isEmpty.ts`, `validateIsbnFromGoogleApiItems.ts`, `calcImageSize.ts`, `services.google`, `SpreadsheetResponse.getRowById`.
- **Estilo duplicado**: CSS da paginação existe 2× (`components/styles.ts:6-28` e `globals.css:47-68`); cores hardcoded fora do tema (`#0b8ec2`, variante divergente `#0aa8c2`, `#333`). styled-components vive em 6 arquivos (login inteiro em CSS-in-JS). `react-select` traz Emotion — **terceiro** sistema de estilo no bundle.
- 7 supressões de `react-hooks/exhaustive-deps` em produção; typos em identificadores (`origial`, `hanldeClick`, `paginateNagivationButtons.tsx`, `getCodesWithErrrosUrl`) e na UI (`"Nenhum dado foi econtrado"`, `"Data do empéstimo"`, título "Formulário de Edição" nos formulários de criação).
- Formulários sem `onSubmit` real (submit por `onClick` fora do form), sem campos obrigatórios, sem validação de ISBN.

## 7. Testes

- 64 arquivos, ~848 casos. Padrões estabelecidos de mock (`next/navigation`, `@/services/api`, Scan/Camera, libs Google).
- **Lacuna grave**: os testes das rotas de API (`api/__tests__/auth.test.ts`, `spreadsheet.test.ts`) **leem o arquivo-fonte como string** e fazem `toContain('401')` — zero cobertura comportamental (por isso S1/B9 passam). Seis de treze testes de `login.test.tsx` são vacuosos (o nome promete cookie/redirect, a asserção só checa `not.toBeDisabled()`).
- `jest.config.ts`: jsdom global (sem projeto `node` para rotas), `coverageThreshold` comentado, sem `setupFilesAfterEach` central.

## 8. Dependências — riscos

| Item | Problema |
|---|---|
| `clsx` | **Dependência fantasma**: importada em `lib/tailwindMerge.ts:1`, não declarada no `package.json` (resolve por hoisting de `react-toastify`) |
| `tailwind-merge` 2.6 | v2 é para Tailwind **v3**; com Tailwind 4 pode fazer merges incorretos silenciosos |
| `@types/uuid` 9 | Obsoleto/conflitante — uuid 13 embarca os próprios tipos |
| `@types/node` ^20 | Incompatível com `engines.node: 24.12.0` |
| `html5-qrcode` 2.3.8 | Sem manutenção desde ~2023; único fornecedor do scanner |
| `engines.node: 24.12.0` | Pin exato de patch, sem `.nvmrc` |
| `jest-coverage-badges` | Sem releases há anos |
| `google-auth-library` 9 | v10 disponível (major pendente, mas v9 é o par testado do google-spreadsheet 4) |

## 9. Performance

- Planilha inteira (4 abas) recarregada do Google **a cada request** de API, inclusive a cada tentativa de login; sem qualquer cache.
- `updateRow`/`deleteRow` fazem 2× `getRows()` por operação; cadastro em lote (`list_isbn`) posta livro a livro com pausa de 60 s a cada 59 itens (~8 min para 500 livros).
- Paginação e busca 100% client-side, sem debounce; capas base64 inflam o JSON; `AllBooks` varre `lends` por livro a cada render (O(n·m)).

## 10. Acessibilidade, i18n e PWA

- **Zero `aria-*` em todo o `src/`**; 12 `<div onClick>` sem role/teclado (dropdown de filtro, cards, BackButton); `<html lang="en">` com conteúdo 100% PT; `focus:outline-hidden` remove indicador de foco; `<img>` cru sem lazy/fallback de erro.
- Sem i18n — textos PT hardcoded em 16+ arquivos, com fragmentos EN misturados (`"Save"`, `"Succcess"`).
- PWA quebrada: `site.webmanifest` não é reconhecido pelo App Router (nome errado, sem `<link rel="manifest">`, ícones apontando para caminhos inexistentes); sem service worker — o app mobile-first **não é instalável**. Assets de template do Next ainda em `public/`.

## 11. CI/CD e processo

- Sem `.github/workflows`, Dependabot, hooks de git, type-check script (`tsc --noEmit`) ou template de PR. `yarn lint` sem `--max-warnings 0`.
- Badges de cobertura dependem de disciplina manual (`yarn testcb` + commit).
- Branch remota `nextjs-14.2.3-reactjs-18` registra o estado pré-upgrade.
