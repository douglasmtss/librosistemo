# Specs — Spec-Driven Development (SDD)

Toda feature ou mudança não trivial do Librosistemo começa por uma **spec**, antes de qualquer código. O fluxo tem três artefatos por iniciativa, em `docs/specs/NNN-nome-kebab/`:

```
docs/specs/
  template/           # copie esta pasta para começar
    spec.md           # O QUÊ e POR QUÊ — requisitos e critérios de aceite
    plan.md           # COMO — decisões técnicas, arquivos afetados, riscos
    tasks.md          # passos executáveis, pequenos e verificáveis
  001-hardening-seguranca/   # exemplo real (fase 1 do IMPROVEMENT_PLAN)
```

## Fluxo

1. **Spec** (`spec.md`): descreva o problema, o escopo (e o não-escopo) e critérios de aceite verificáveis. Sem detalhes de implementação. Revise/aprove antes de seguir.
2. **Plan** (`plan.md`): derive da spec as decisões técnicas — arquivos a tocar, contratos a preservar, riscos, plano de rollback. Se o plano introduzir decisão arquitetural (lib nova, mudança de padrão), crie o ADR correspondente em `docs/adr/` agora.
3. **Tasks** (`tasks.md`): quebre o plano em tarefas pequenas, cada uma deixando `yarn test:build` verde. Marque com `[x]` conforme conclui.
4. **Implementação**: siga as tasks; ao final, atualize `docs/architecture/c4/` (se a arquitetura mudou), `docs/CURRENT_STATE.md` e marque o item no `docs/IMPROVEMENT_PLAN.md`.

## Regras

- Numeração sequencial de três dígitos; um diretório por iniciativa.
- Critério de aceite bom é **testável**: "POST /api/spreadsheet sem sessão válida retorna 401" (bom) vs "API mais segura" (ruim).
- Spec aprovada não muda silenciosamente — mudanças de escopo são editadas na spec com nota de revisão datada.
- Agentes de IA (Claude/Codex/Copilot) devem receber a spec como contexto ao implementar as tasks.
