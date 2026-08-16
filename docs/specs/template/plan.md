# Plan NNN — Título

Derivado de [`spec.md`](./spec.md). Não repita requisitos — referencie os CAs.

## Abordagem técnica

Como os critérios de aceite serão atendidos. Alternativas descartadas e por quê (se houver decisão arquitetural, crie ADR).

## Arquivos afetados

| Arquivo | Mudança |
|---|---|
| `src/...` | ... |

## Contratos a preservar

Interfaces/tipos/mocks que não podem quebrar (ex.: `api.sheet.*`, tipos globais em `src/types/`).

## Estratégia de testes

Quais testes novos, quais existentes mudam, como validar cada CA.

## Sequenciamento e rollback

Ordem das etapas (cada uma com `yarn test:build` verde) e como reverter cada etapa.
