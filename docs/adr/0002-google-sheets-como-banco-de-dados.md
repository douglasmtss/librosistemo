# 0002 — Google Sheets como banco de dados

- **Status**: Aceito (retroativo) — revisão planejada (fase 3 do IMPROVEMENT_PLAN)
- **Data**: 2026-08-16 (registro; decisão original anterior)
- **Decisores**: Douglas Silva

## Contexto

O sistema gerencia o acervo de uma biblioteca pequena. Requisitos: custo zero de infraestrutura, dados visualizáveis/editáveis por não-programadores, backup trivial. Um banco relacional gerenciado adicionaria custo e operação desproporcionais ao porte do projeto.

## Decisão

Usar **uma planilha Google Sheets como banco de dados**, acessada server-side pela lib `google-spreadsheet` com autenticação JWT de service account (`src/services/jwtServiceAccountAuth.ts`). Abas: `books`, `users`, `lends`, `auth`. A identidade de cada linha é uma coluna `id` (UUID). O mapeamento aba↔DTO fica centralizado em `src/services/spreadsheetToDTO.ts`, exposto por uma rota CRUD genérica (`/api/spreadsheet?sheet=...`).

## Consequências

- Custo zero e edição manual dos dados pela própria planilha — adequado ao porte atual.
- Limitações estruturais aceitas conscientemente: sem transações, sem integridade referencial (empréstimo aponta para ids de livro/usuário sem constraint), sem índices (busca de linha é varredura completa), latência alta (a planilha inteira é lida a cada request) e rate limit da API do Google.
- Sem escapatória de escala: se o acervo/uso crescer, migrar para banco real. O caminho de migração definido é: extrair interface de repositório preservando o contrato de `SpreadsheetResponse`/`api.sheet.*`, implementar novo backend, migrar dados por script (ver `migration-specialist`).
- A aba `auth` guardando credenciais em texto puro é consequência desta decisão e está sendo tratada como vulnerabilidade (ADR 0003, IMPROVEMENT_PLAN fase 1).
