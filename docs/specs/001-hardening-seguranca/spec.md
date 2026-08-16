# Spec 001 — Hardening de segurança (segredos, sessão e API)

- **Status**: Aprovada
- **Data**: 2026-08-16
- **Autor**: Douglas Silva (com Claude Code)
- **ADRs relacionados**: [0003](../../adr/0003-autenticacao-por-planilha-e-cookie.md) (será substituído ao concluir)

## Problema

O estado atual tem cinco vulnerabilidades documentadas em `docs/CURRENT_STATE.md`:

1. **CRÍTICO — divulgação das credenciais de admin**: `GET /api/spreadsheet?sheet=auth` retorna `{username, password}` em texto puro, porque o parâmetro `sheet` não é validado contra o enum e `spreadsheet.get` inclui a chave `auth` (`src/app/api/spreadsheet/route.ts:13-17`, `src/services/spreadsheetToDTO.ts:57`). Combinado com o item 2, é acesso não autenticado às credenciais.
2. Sessão forjável: o cookie `app-logged=yes` é criado **no cliente** via `document.cookie` (`src/app/login/page.tsx:36`), sem HttpOnly/Secure/SameSite/expiração; `src/proxy.ts` valida só a *presença* — qualquer valor passa. Não há logout real (o link "Sair" só navega, o cookie fica).
3. Credenciais da service account Google com prefixo `NEXT_PUBLIC_` (`env.template`, `src/services/jwtServiceAccountAuth.ts:4-6`) — opt-in de exposição ao bundle client; um único import acidental em client component publica a chave privada.
4. Login com senha em texto puro (aba `auth` da planilha), comparação não constante, resposta de falha com HTTP 200 (`{status:401}` só no body), campo de senha renderizado como `type="text"` (`src/app/login/page.tsx:76`) e `console.log` na rota.
5. `/api/spreadsheet` sem validação de payload/parâmetros, com bug de variável de módulo (POST/PUT/DELETE dependem de GET prévio na mesma instância) e mutações sem `await` (respondem 200 antes de gravar).

## Escopo

- Renomear as env vars para versões server-only e remover qualquer caminho de exposição.
- Sessão real: cookie httpOnly, assinado, com expiração, emitido pelo `/api/auth`; middleware valida a assinatura, não a presença.
- Senha armazenada como hash (bcrypt ou scrypt) na aba `auth`; comparação segura; respostas com status HTTP corretos (401 real).
- `/api/spreadsheet`: instanciar o acesso à planilha em cada handler (remover variável de módulo); validar `sheet` contra o enum e o body contra schema por entidade; retornar 400/401/500 apropriados.
- Remover logs que possam vazar dados de auth.

## Não-escopo

- Multiusuário, perfis/permissões, OAuth ou provedor de identidade externo.
- Migração da fonte de dados (continua Google Sheets).
- Rate limiting e CSRF token (registrar como follow-up no IMPROVEMENT_PLAN).

## Critérios de aceite

- [ ] CA1 — `grep -r "NEXT_PUBLIC_GOOGLE" src/` não retorna nada; `env.template` documenta os novos nomes; app funciona com eles.
- [ ] CA2 — Requisição a qualquer rota protegida com cookie `app-logged` forjado (valor arbitrário) recebe redirect para `/login` (página) ou 401 (API).
- [ ] CA3 — Cookie de sessão é `httpOnly`, `secure` em produção, `sameSite=lax` e expira (≤ 7 dias).
- [ ] CA4 — Login com credencial errada retorna HTTP 401 (status real); com credencial certa, HTTP 200 + cookie setado pelo servidor.
- [ ] CA5 — A senha na planilha é um hash; login continua funcionando após migração da credencial.
- [ ] CA6 — POST em `/api/spreadsheet` funciona em instância fria (sem GET prévio) — teste cobrindo o cenário.
- [ ] CA7 — POST/PUT com body inválido (campo obrigatório ausente, `sheet` fora do enum) retorna 400 sem gravar nada.
- [ ] CA8 — Nenhum `console.log` em rotas de auth; suíte completa (`yarn test:build`) verde.
- [ ] CA9 — `GET /api/spreadsheet?sheet=auth` (e qualquer valor fora do enum `Sheet`) retorna 400; a aba `auth` nunca é serializável por nenhuma rota — teste cobrindo o cenário.
- [ ] CA10 — Campo de senha do login usa `type="password"`; logout remove a sessão server-side (cookie invalidado).
- [ ] CA11 — POST/PUT/DELETE em `/api/spreadsheet` aguardam (`await`) a escrita e retornam 500 em falha real, nunca 200.

## Impacto no usuário

Fluxo de login idêntico na UI. Passo único de migração: substituir a senha em texto puro na aba `auth` pelo hash (script/instrução no manual). Sessões passam a expirar — novo login após 7 dias.

## Riscos e rollback

- Risco: lock-out do admin se o hash for gerado errado → manter instrução de regenerar hash no manual; rollback = restaurar senha antiga na planilha e voltar o commit.
- Risco: middleware assinado quebrar assets/rotas públicas → cobrir o `matcher` com testes antes de trocar a validação.
