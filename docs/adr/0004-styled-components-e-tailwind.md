# 0004 — Coexistência styled-components + Tailwind, convergindo para Tailwind

- **Status**: Aceito
- **Data**: 2026-08-16
- **Decisores**: Douglas Silva

## Contexto

O projeto usa **styled-components 6** (com registry SSR em `src/lib/registry.tsx` e estilos compartilhados em `src/components/styles.ts`) e **Tailwind 4** (via `@tailwindcss/postcss`, com `tailwind-merge` em `src/lib/tailwindMerge.ts`) ao mesmo tempo. Dois sistemas de estilo aumentam bundle, carga cognitiva e inconsistência visual. Reescrever tudo de uma vez custaria mais do que o benefício imediato.

## Decisão

1. **Código novo usa Tailwind** (classes utilitárias + `tailwind-merge` quando compor classes condicionalmente).
2. **Código existente em styled-components não é reescrito preventivamente** — apenas quando o arquivo for substancialmente alterado por outra razão.
3. styled-components fica congelado: não criar novos styled-components nem ampliar `src/components/styles.ts`.
4. Quando o último styled-component for removido, retirar a lib, o registry SSR e o `compiler.styledComponents` do `next.config.ts` (novo ADR marcará este como concluído).

## Consequências

- Convergência gradual sem big-bang; PRs de feature não crescem com reescritas de estilo.
- Durante a transição o bundle carrega os dois sistemas — custo aceito temporariamente.
- Revisões de código devem barrar novos styled-components (responsabilidade do `frontend-specialist`).
