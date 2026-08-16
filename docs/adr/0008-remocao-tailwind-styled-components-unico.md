# 0008 — Remoção do Tailwind; styled-components como única solução de estilo (substitui 0004)

- **Status**: Aceito — substitui [0004](./0004-styled-components-e-tailwind.md)
- **Data**: 2026-08-16
- **Decisores**: Douglas Silva (direção), Claude Code (execução)

## Contexto

O ADR 0004 registrava a coexistência de styled-components e Tailwind 4 como dívida, apontando convergência futura. A direção do produto decidiu **abandonar o Tailwind**. Manter os dois sistemas dobra o custo de manutenção (dois vocabulários, `tailwind-merge`, pipeline PostCSS) e o IMPROVEMENT_PLAN Fase 3 já exigia convergência — apenas o sentido da convergência mudou.

## Decisão

Removeremos o Tailwind por completo: dependências (`tailwindcss`, `@tailwindcss/postcss`, `tailwind-merge`), `postcss.config.mjs`, o `@import 'tailwindcss'` e utilitários `@theme` do `globals.css`, e `src/lib/tailwindMerge.ts`. Todo `className` utilitário será convertido para **styled-components**, mantendo o visual atual. Tokens de design (cores, gradientes) viram CSS variables declaradas no `globals.css` e consumidas pelos styled-components. Estilos verdadeiramente globais (reset, body, paginação) permanecem em `globals.css` como CSS puro.

## Consequências

- Melhor: um único sistema de estilo; menos dependências e sem pipeline PostCSS; fim da ambiguidade "em qual sistema escrevo isso?".
- Pior: perde-se a velocidade de prototipagem por classes utilitárias; estilos pontuais exigem criar um styled component.
- Obrigatório a partir deste ADR: **proibido** reintroduzir classes utilitárias ou dependências Tailwind; novos componentes usam styled-components; cores novas entram como CSS variable em `globals.css`.
