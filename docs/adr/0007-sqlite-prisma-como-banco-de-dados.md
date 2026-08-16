# 0007 — SQLite via Prisma como banco de dados (substitui 0002)

- **Status**: Aceito — substitui [0002](./0002-google-sheets-como-banco-de-dados.md)
- **Data**: 2026-08-16
- **Decisores**: Douglas Silva (direção), Claude Code (proposta)

## Contexto

O Google Sheets como banco (ADR 0002) impõe: recarga total da planilha por request, ausência de transações e integridade referencial, escrita dependente de estado de módulo (bug B9), limite de cota da API do Google e credenciais de service account expostas ao bundler (`NEXT_PUBLIC_*`). A direção do produto pediu um banco de dados **gratuito**.

Alternativas consideradas:

- **SQLite local (escolhido)** — zero custo, zero credenciais, arquivo no repositório de deploy, transacional. Restrição: exige filesystem persistente (VPS/container/máquina local); não serve para serverless puro.
- **Turso (libSQL) / Neon (Postgres) free tier** — serverless-friendly, mas exigem cadastro, credenciais e dependem da continuidade do free tier de terceiros.
- **Postgres autogerido** — gratuito em software, mas custo operacional de manter um servidor.

ORM: **Prisma** (schema declarativo, migrations, seed, tipagem gerada) contra Drizzle (mais leve, porém mais manual). Prisma foi escolhido porque o time é pequeno e o valor está nas migrations e no tooling; e porque trocar SQLite por Postgres/Turso no futuro é mudança de `datasource` + migration, não de código de aplicação.

## Decisão

Adotaremos **SQLite** como banco de dados, acessado exclusivamente pelas API routes via **Prisma**. O arquivo do banco (`prisma/*.db`) fica fora do git. O acesso a dados fica isolado em `src/services/db/` (client singleton + repositórios por entidade); páginas continuam consumindo `src/services/api.ts` sem mudança de superfície. A migração de dados da planilha é feita por script one-shot (`scripts/import-from-sheets.ts`), mantendo `google-spreadsheet` apenas como devDependency.

A autenticação migra junto (substitui também o [0003](./0003-autenticacao-por-planilha-e-cookie.md)): a aba `auth` vira a tabela `Admin` com senha em **hash bcrypt**, e o cookie `app-logged` de presença vira **cookie de sessão httpOnly assinado (HMAC-SHA256)** com expiração, validado pelo `proxy.ts` via Web Crypto.

## Consequências

- Melhor: latência de dados ordens de magnitude menor; transações e unicidade (ISBN, username) garantidas pelo banco; some a classe inteira de bugs de estado de módulo; somem as credenciais Google do runtime.
- Pior/obrigatório: deploy passa a exigir filesystem persistente (documentar no README); backup deixa de ser "a planilha" e passa a ser cópia do arquivo `.db`; toda mudança de modelo passa por `prisma migrate`.
- Se o hosting virar serverless, a decisão de trocar o datasource (Turso/Neon) deve gerar novo ADR — o código de aplicação já estará pronto para isso.
- O item "cache do Sheets" da Fase 5 do IMPROVEMENT_PLAN morre; ADRs 0002 e 0003 ficam obsoletos.
