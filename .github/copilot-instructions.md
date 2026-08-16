# Copilot Instructions — Librosistemo

As instruções completas do projeto estão em [`AGENTS.md`](../AGENTS.md) na raiz do repositório — leia-o antes de qualquer alteração. Resumo mínimo:

- Next.js 16 (App Router) + React 19 + TypeScript; Google Sheets como banco via `google-spreadsheet` + service account.
- Comandos: `yarn dev`, `yarn lint`, `yarn test`, `yarn test:build` (gate de qualidade).
- Estilo: Prettier com 4 espaços, sem ponto e vírgula, aspas simples, `printWidth 120`. Alias `@/*` → `src/*`.
- Todo código novo em `src/` exige teste em `__tests__/` ao lado.
- Nunca exponha as variáveis `NEXT_PUBLIC_GOOGLE_*` em código client-side novo (problema de segurança conhecido, em correção).
- Features novas seguem Spec-Driven Development: comece por `docs/specs/`; decisões arquiteturais exigem ADR em `docs/adr/`.
