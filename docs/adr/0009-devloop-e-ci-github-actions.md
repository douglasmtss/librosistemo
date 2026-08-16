# 0009 — Devloop local integrado e CI no GitHub Actions

- **Status**: Aceito
- **Data**: 2026-08-16
- **Decisores**: Douglas Silva (direção), Claude Code (proposta)

## Contexto

O único gate de qualidade era `yarn test:build`, manual, lembrado (ou não) antes do push. Não havia CI (`.github/workflows` inexistente) nem um loop de desenvolvimento integrado — dev server, typecheck e testes rodavam em terminais separados por disciplina individual. O IMPROVEMENT_PLAN Fase 2 já pedia GitHub Actions.

## Decisão

1. **Devloop local**: script `yarn devloop` usando `concurrently` para rodar em um único terminal, com saída prefixada e colorida: `next dev`, `tsc --noEmit --watch` e `jest --watch`. Feedback de tipo e de teste é contínuo enquanto se desenvolve.
2. **Script `yarn ci`**: `lint --max-warnings 0` → `typecheck` → `testc` → `build`, a réplica local exata do pipeline.
3. **CI GitHub Actions** (`.github/workflows/ci.yml`): roda `yarn ci` em Node 24 com cache de yarn em todo push/PR para `main`. GitHub Actions é gratuito para repositórios públicos.

## Consequências

- Melhor: quebra de tipo/teste aparece segundos após salvar; a main passa a ter verificação automática; `yarn ci` elimina o "funciona na minha máquina".
- Obrigatório: PRs/pushes com CI vermelho não seguem; novos scripts de qualidade entram no `yarn ci` e no workflow simultaneamente.
- Custo assumido: `devloop` roda três processos (mais CPU/RAM em dev); em máquinas fracas, usar os scripts individuais.
