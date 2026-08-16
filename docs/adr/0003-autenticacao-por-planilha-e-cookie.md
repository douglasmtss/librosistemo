# 0003 — Autenticação via aba `auth` + cookie `app-logged`

- **Status**: Aceito (retroativo) — **substituição planejada** (fase 1 do IMPROVEMENT_PLAN)
- **Data**: 2026-08-16 (registro; decisão original anterior)
- **Decisores**: Douglas Silva

## Contexto

O app precisa restringir o acesso administrativo (cadastro/edição/empréstimos) a uma pessoa (bibliotecário). Não há multiusuário nem perfis; uma solução de identidade completa (OAuth, provedores externos) foi considerada desproporcional.

## Decisão

Login único com credenciais armazenadas na aba `auth` da planilha, verificadas por `/api/auth` (`src/app/api/auth/route.ts`). Após sucesso, o cliente grava o cookie `app-logged`, e o middleware (`src/proxy.ts`) redireciona para `/login` qualquer rota sem esse cookie (exceto `api/auth`, `login` e assets).

## Consequências

- Implementação simples e sem dependências — atendeu o MVP.
- **Fragilidades conhecidas e aceitas à época, hoje classificadas como vulnerabilidades** (ver `docs/CURRENT_STATE.md` §Segurança):
  - senha em texto puro na planilha;
  - o middleware valida apenas a *presença* do cookie — forjável por qualquer cliente;
  - sem expiração de sessão, sem logout server-side;
  - resposta de falha com HTTP 200 e `{status: 401}` no body.
- Direção de substituição (a formalizar em novo ADR quando implementada): cookie httpOnly assinado com expiração + hash de senha; a planilha pode continuar sendo o repositório da credencial.
