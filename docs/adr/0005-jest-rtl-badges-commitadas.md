# 0005 — Jest + Testing Library com badges de cobertura commitadas

- **Status**: Aceito (retroativo)
- **Data**: 2026-08-16 (registro; decisão original anterior)
- **Decisores**: Douglas Silva

## Contexto

O projeto não tem CI. Ainda assim, quer-se visibilidade da cobertura de testes no README e um gate local antes de publicar.

## Decisão

- **Jest 30** (via `next/jest`, ambiente jsdom) + **Testing Library** para todos os testes; arquivos em `__tests__/` ao lado do código testado.
- Cobertura exibida no README por **badges SVG commitadas** em `./badges`, geradas por `jest-coverage-badges` (`yarn testcb`).
- `yarn test:build` (cobertura + badges + build) é o gate manual antes de push.
- Padrões de mock: `next/navigation`, `@/services/api`, componentes de hardware (Scan/Camera) e libs Google sempre mockados.

## Consequências

- Cobertura visível sem infraestrutura; porém depende de disciplina manual (badge desatualiza se `testcb` não rodar).
- Diffs de PR incluem SVGs de badge — ruído aceito.
- Quando CI for adotada (item do IMPROVEMENT_PLAN), reavaliar: badges podem passar a ser geradas pela pipeline, e este ADR será substituído.
