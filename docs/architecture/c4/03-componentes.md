# C4 — Nível 3: Componentes (dentro do deploy Next.js)

```mermaid
flowchart TB
    subgraph UI["Web UI (client)"]
        pages["Páginas<br/>src/app/pages/dashboard/**<br/>(books, users, lends, book-registration/*)"]
        publicpages["Páginas públicas<br/>src/app/page.tsx (acervo), /login"]
        comps["Componentes<br/>src/components/*<br/>(formulários, Paginated*, BookModal, Scan, Camera...)"]
        hooks["Hooks<br/>useEntities, useToastify,<br/>getBookAmountAndAvailable"]
        libs["Utilitários<br/>src/lib/* (isbn, imagem, paginação,<br/>tailwindMerge, registry SSR)"]
        apiclient["Cliente HTTP<br/>src/services/api.ts (axios)<br/>api.sheet.*, api.auth, services.google/brasilapi"]
    end

    subgraph Server["Server (Next)"]
        proxy["Middleware<br/>src/proxy.ts"]
        authroute["/api/auth<br/>src/app/api/auth/route.ts"]
        crudroute["/api/spreadsheet<br/>src/app/api/spreadsheet/route.ts"]
        dto["spreadsheetToDTO.ts<br/>get/add/update/delete por aba"]
        gs["google-spreadsheet.ts<br/>abre o doc"]
        jwt["jwtServiceAccountAuth.ts<br/>JWT service account"]
    end

    types["Tipos globais (ambient)<br/>src/types/*.d.ts — Book, User, Lend..."]
    enums["Enum Sheet<br/>src/enums/sheets.ts"]

    pages --> comps --> hooks
    pages --> hooks --> apiclient
    comps --> libs
    publicpages --> apiclient
    apiclient -->|"POST /api/auth"| authroute
    apiclient -->|"GET/POST/PUT/DELETE<br/>?sheet=&id="| crudroute
    authroute --> dto
    crudroute --> dto
    dto --> gs --> jwt
    apiclient -.->|"busca ISBN direto"| ext["Google Books / BrasilAPI"]

    types -.-> pages & apiclient & dto
    enums -.-> apiclient & crudroute & dto
```

## Responsabilidades

| Componente | Responsabilidade | Observações |
|---|---|---|
| Páginas dashboard | Fluxos admin: listar/criar/editar books, users, lends; 4 modos de cadastro de livro (manual, digitação de ISBN, lista, scanner) | Todas `'use client'`; URLs com prefixo `/pages` (dívida — ADR 0001) |
| `useEntities` | Busca e mantém estado de books/users/lends + filtros/options | Retorna 24 valores; sempre busca no mount; candidato a refactor |
| `src/services/api.ts` | Superfície client de CRUD por entidade + integrações ISBN | CRUD triplicado por entidade (duplicação conhecida) |
| `/api/spreadsheet` | CRUD genérico por query `?sheet=` | Bug de variável de módulo (spec 001, CA6); sem validação |
| `/api/auth` | Login contra aba `auth` | Texto puro, HTTP 200 em falha (spec 001) |
| `spreadsheetToDTO.ts` | Traduz abas ↔ DTOs; resolve `id` (UUID) → `rowNumber` | Lê a planilha inteira por operação; fallback silencioso em erro |
| `jwtServiceAccountAuth.ts` | Credenciais + JWT Google | Usa env vars `NEXT_PUBLIC_*` (spec 001, CA1) |
| Tipos ambient | `Book`, `User`, `Lend`, `Option`, DTOs de APIs externas | Sem import/export — adicionar um `import` quebra o escopo global |

## Componentes de UI notáveis

- **Formulários**: `BookCreateForm`, `BookCreateFormFromList` (quase duplicados), `BookEditForm`, `UserCreateForm`, `UserEditForm`.
- **Listagem/paginação**: `PaginatedBooks`, `PaginatedBookItems`, `PaginatedUserItems`, `PaginatedLendsItems` (trio quase idêntico), `AllBooks`, `Gallery`.
- **Hardware**: `Scan` (html5-qrcode, leitura de código de barras), `Camera`/`SelectPhoto` (react-webcam, foto de capa) — sempre mockados em teste.
- **Suporte**: `Loading`, `Empty`, `BookModal`, `DeleteModal`, `LayoutMenu`, `BackToTopButton`.
