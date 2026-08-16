# Arquitetura — Modelo C4

Documentação de arquitetura do Librosistemo seguindo o [modelo C4](https://c4model.com/) (níveis 1–3; o nível 4 — código — é o próprio fonte tipado em `src/`). Diagramas em Mermaid, renderizados pelo GitHub.

| Nível | Documento | Responde |
|---|---|---|
| 1 — Contexto | [01-contexto.md](./01-contexto.md) | Quem usa o sistema e com quais sistemas externos ele fala |
| 2 — Contêineres | [02-conteineres.md](./02-conteineres.md) | Quais peças executáveis/implantáveis existem |
| 3 — Componentes | [03-componentes.md](./03-componentes.md) | Como o app Next.js se organiza internamente |

**Regra de manutenção**: mudou integração, contêiner ou componente relevante → atualize o nível correspondente no mesmo PR (o agente `docs-specialist` ajuda). O estado detalhado do sistema vive em [`docs/CURRENT_STATE.md`](../../CURRENT_STATE.md).
