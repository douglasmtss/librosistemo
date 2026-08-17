# Librosistemo

> 🇧🇷 A documentação principal do projeto agora é em português e vive no [README da raiz](../README.md) — visão geral, stack, setup local, Docker, scripts e migração da planilha antiga estão lá.

- 📖 [Manual do usuário](./MANUAL_PT_BR.md)
- 🏗️ [Arquitetura (modelo C4)](./architecture/c4/README.md) · [ADRs](./adr/README.md) · [Specs](./specs/README.md)
- 📸 [Estado atual do sistema](./CURRENT_STATE.md) · [Plano de melhoria](./IMPROVEMENT_PLAN.md)

> Nota histórica: até 2026-08-16 este arquivo descrevia o setup com Google Sheets como banco de dados. Esse modelo foi substituído por SQLite via Prisma ([ADR 0007](./adr/0007-sqlite-prisma-como-banco-de-dados.md)); quem ainda tem dados na planilha antiga pode importá-los com `yarn db:import-sheets` (ver README da raiz).
