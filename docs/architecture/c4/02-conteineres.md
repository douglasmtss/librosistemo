# C4 — Nível 2: Contêineres

Um único deploy Next.js concentra três responsabilidades executáveis: a UI (client components no navegador), as API routes (server) e o middleware de acesso.

```mermaid
C4Container
    title Librosistemo — Diagrama de Contêineres

    Person(admin, "Bibliotecário (admin)")

    System_Boundary(libro, "Librosistemo (deploy Next.js 16)") {
        Container(spa, "Web UI", "React 19 client components", "Páginas em src/app/pages/dashboard/*; formulários, scanner de ISBN (html5-qrcode), câmera (react-webcam); estado local via hooks")
        Container(mw, "Middleware", "src/proxy.ts (proxy Next)", "Redireciona para /login se o cookie app-logged não existir")
        Container(api, "API Routes", "Next.js route handlers", "/api/auth (login) e /api/spreadsheet (CRUD genérico por ?sheet=)")
    }

    System_Ext(sheets, "Google Sheets", "Abas: books, users, lends, auth")
    System_Ext(brasilapi, "BrasilAPI")

    Rel(admin, mw, "Toda requisição de página passa pelo", "HTTPS")
    Rel(mw, spa, "Libera se cookie presente")
    Rel(spa, api, "CRUD e login", "axios, JSON (src/services/api.ts)")
    Rel(spa, brasilapi, "Busca ISBN direto do navegador", "HTTPS")
    Rel(api, sheets, "google-spreadsheet + JWT service account", "Sheets API")
```

## Decisões e restrições por contêiner

| Contêiner | Tecnologia | Pontos relevantes |
|---|---|---|
| Web UI | React 19, styled-components + Tailwind 4 (ADR 0004) | Todas as páginas são client components; dados buscados no mount via `useEntities` |
| Middleware | `src/proxy.ts` | Protege tudo exceto `api/auth`, `login` e assets; **valida só a presença do cookie** (vulnerabilidade — spec 001) |
| API Routes | `src/app/api/*` | Única camada que toca as credenciais Google; CRUD genérico sem validação de payload (spec 001) |
| "Banco" | Google Sheets (ADR 0002) | Sem transações/integridade referencial; leitura completa por request |

## Fluxo típico (cadastro de livro por ISBN)

1. Admin escaneia/digita ISBN → UI consulta a BrasilAPI direto do navegador (`services.brasilapi` em `src/services/api.ts`).
2. UI checa duplicidade (`src/lib/checkIfBookAlreadyExists.ts`).
3. UI faz `POST /api/spreadsheet?sheet=books` → route handler grava linha na aba `books` com `id` UUID.

> A integração com Google Books (`services.google`) e o validador `src/lib/validateIsbnFromGoogleApiItems.ts` existem no código mas não são usados por nenhuma página (código morto).
