# 0006 — AGENTS.md como fonte única de instruções para CLIs de IA

- **Status**: Aceito
- **Data**: 2026-08-16
- **Decisores**: Douglas Silva

## Contexto

O projeto é trabalhado com três agentes de código: **Claude Code** (lê `CLAUDE.md`), **Codex CLI** (lê `AGENTS.md`) e **Copilot CLI** (lê `AGENTS.md` e `.github/copilot-instructions.md`). Manter três arquivos de instruções independentes geraria divergência.

## Decisão

- **`AGENTS.md` na raiz é a fonte única** de instruções de projeto (stack, comandos, convenções, arquitetura, fluxo de docs). É o padrão aberto suportado nativamente por Codex e Copilot.
- `CLAUDE.md` importa o `AGENTS.md` via diretiva `@AGENTS.md` e contém apenas notas específicas do Claude Code (agentes em `.claude/agents/`).
- `.github/copilot-instructions.md` é um espelho fino com resumo mínimo + link para o `AGENTS.md`.
- Agentes especialistas ficam em `.claude/agents/*.md` (formato Claude Code); para os outros CLIs, os mesmos arquivos servem de prompt de sistema manual.

## Consequências

- Uma edição atualiza os três CLIs; divergência limitada aos espelhos finos, que quase não têm conteúdo próprio.
- Mudanças de convenção do projeto devem ser feitas no `AGENTS.md` — nunca só no `CLAUDE.md` ou no espelho do Copilot (regra registrada no próprio `AGENTS.md` e no agente `docs-specialist`).
