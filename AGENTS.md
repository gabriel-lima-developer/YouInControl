# Instrucoes para o Codex

Antes de criar commits, siga obrigatoriamente o guia:

- docs/workflows/commit-guidelines.md

Sempre que o usuario pedir para organizar commits, revisar alteracoes nao commitadas ou preparar a branch para push, use esse guia como referencia.

Ao fazer alteracoes no projeto, avalie sempre se alguma decisao tomada durante a implementacao deve ser registrada em ADR.

- Se fizer sentido criar ADR, pergunte ao usuario se ele quer registrar essa decisao.
- Mantenha o padrao estabelecido em docs/adr/README.md.
- Use numeracao e ordenacao coerentes com os ADRs existentes.

## Validacao e build

Ao fazer alteracoes no frontend:

- Rode `npm run build` em `frontend/youincontrol-web`.

Ao fazer alteracoes no backend:

- Rode `dotnet build YouInControl.sln` em `backend/YouInControl`.
- Se houver projeto de testes ou testes relacionados disponiveis, rode tambem `dotnet test YouInControl.sln` em `backend/YouInControl`.

Ao fazer alteracoes que envolvam frontend e backend:

- Execute as validacoes de frontend e de backend.

No resumo final, informe quais comandos de validacao foram executados e quais nao puderam ser executados, incluindo o motivo.
