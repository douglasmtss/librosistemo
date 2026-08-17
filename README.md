# Librosistemo

![Badge branchs >](./badges/badge-branches.svg)
![Badge functions >](./badges/badge-functions.svg)
![Badge lines >](./badges/badge-lines.svg)
![Badge statements >](./badges/badge-statements.svg)

📚 **Librosistemo** é um sistema **open source e gratuito** de gestão de biblioteca: cadastro de livros (manual, por ISBN ou escaneando o código de barras com a câmera), leitores e empréstimos — pensado para bibliotecas pequenas, direto do celular.

- 🇧🇷 [Manual do usuário](./docs/MANUAL_PT_BR.md)
- 🌐 A busca por ISBN usa a [BrasilAPI](https://brasilapi.com.br)

## ✨ Funcionalidades

- 📚 Cadastro de livros manual (com foto da capa pela câmera), digitando o ISBN, por lista de ISBNs ou escaneando o código de barras.
- 🙋 Cadastro de leitores (usuários da biblioteca).
- 🎁 Registro e controle de empréstimos (status disponível/emprestado por livro).
- 🌐 Landing page pública em `/`; o app administrativo fica atrás de login.

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 (strict) |
| Banco de dados | **SQLite via Prisma 7** (arquivo local, zero credenciais — [ADR 0007](./docs/adr/0007-sqlite-prisma-como-banco-de-dados.md)) |
| Estilo | styled-components 6 + tokens CSS em `src/app/globals.css` ([ADR 0008](./docs/adr/0008-remocao-tailwind-styled-components-unico.md)) |
| Autenticação | bcrypt + cookie de sessão httpOnly assinado (HMAC-SHA256) |
| Testes | Jest 30 + Testing Library (unit) e Playwright (E2E) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |

## 🚀 Rodando localmente

Requisitos: Node `>=24` (há `.nvmrc`) e yarn.

```bash
cp env.template .env   # ajuste SESSION_SECRET, ADMIN_USERNAME e ADMIN_PASSWORD
yarn install
yarn db:setup          # cria o banco SQLite (migrations) e o admin inicial (seed)
yarn dev
```

A aplicação sobe em http://localhost:3000. Entre em `/login` com o `ADMIN_USERNAME`/`ADMIN_PASSWORD` definidos no `.env`.

## 🐳 Rodando com Docker

```bash
docker compose up --build            # produção local em http://localhost:3000
docker compose --profile dev up dev  # dev server com hot reload
```

O banco SQLite fica em um volume nomeado e persiste entre subidas. As variáveis `SESSION_SECRET`, `ADMIN_USERNAME` e `ADMIN_PASSWORD` podem ser passadas pelo ambiente (há defaults de desenvolvimento no `compose.yaml`).

## 📜 Scripts principais

| Script | O que faz |
|---|---|
| `yarn dev` | Dev server em http://localhost:3000 |
| `yarn devloop` | Dev server + typecheck em watch + Jest em watch (um terminal só) |
| `yarn build` / `yarn start` | Build e servidor de produção |
| `yarn lint` / `yarn typecheck` | ESLint / `tsc --noEmit` |
| `yarn test` / `yarn testw` / `yarn testc` | Jest (normal / watch / cobertura) |
| `yarn testcb` | Cobertura + regenera as badges SVG em `./badges` |
| `yarn e2e` | Testes E2E com Playwright (exige `yarn build` antes) |
| `yarn ci` | Gate completo: lint + typecheck + testes com cobertura + build (o mesmo da CI) |
| `yarn db:setup` | `prisma migrate deploy` + seed do admin inicial |
| `yarn db:migrate` | Cria/aplica migration em dev |
| `yarn db:seed` | Só o seed (cria/atualiza o admin) |
| `yarn db:studio` | Prisma Studio (UI do banco) |
| `yarn db:import-sheets` | Importação one-shot da planilha Google antiga |

## 🔁 Migrando da planilha antiga (Google Sheets)

Até 2026-08-16 o Librosistemo usava Google Sheets como banco. Para trazer os dados da planilha para o SQLite:

1. Preencha `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` e `GOOGLE_SHEET_ID` no `.env` (os antigos `NEXT_PUBLIC_GOOGLE_*` também são aceitos).
2. Rode `yarn db:import-sheets` — o script só **lê** a planilha; ela permanece intacta como backup.
3. Valide os dados no app e revogue as credenciais Google.

## 🏗️ Documentação técnica

- [Arquitetura (modelo C4)](./docs/architecture/c4/README.md) · [ADRs](./docs/adr/README.md) · [Specs (SDD)](./docs/specs/README.md)
- [Estado atual](./docs/CURRENT_STATE.md) · [Plano de melhoria](./docs/IMPROVEMENT_PLAN.md)
- Agentes de código de IA: instruções em [`AGENTS.md`](./AGENTS.md) (Claude Code, Codex CLI, Copilot CLI); agentes especialistas em [`.claude/agents/`](./.claude/agents/)

## 🤝 Contribuindo

Issues e pull requests são bem-vindos. Antes de abrir um PR, rode `yarn ci` (o mesmo gate da CI) e, para mudanças não triviais, siga o fluxo de specs em [`docs/specs/README.md`](./docs/specs/README.md).

> A seguir algumas capturas de tela em um dispositivo móvel.

<table>
    <thead></thead>
    <tbody>
        <tr>
            <td>
                <img src="./docs/images/books-list.png" />
            </td>
            <td>
                <img src="./docs/images/admin.png" />
            </td>
        </tr>
        <tr>
            <td>
                <img src="./docs/images/admin-books.png" />
            </td>
            <td>
                <img src="./docs/images/admin-users.png" />
            </td>
        </tr>
        <tr>
            <td>
                <img src="./docs/images/admin-lends.png" />
            </td>
            <td>
                <img src="./docs/images/books-registration.png" />
            </td>
        </tr>
        <tr>
            <td>
                <img src="./docs/images/scanner.gif" />
            </td>
        </tr>
    </tbody>
</table>
