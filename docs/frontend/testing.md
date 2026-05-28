# Testes do frontend

## Estado atual

O frontend ainda nao possui scripts de lint ou testes automatizados no `package.json`. A validacao obrigatoria atual e o build:

```bash
cd frontend/youincontrol-web
npm run build
```

## Estrategia inicial

Quando a estrutura de testes for adicionada, priorizar:

- Componentes de formulario com validacoes.
- Hooks de query e mutation com client mockado.
- Services de API com respostas de sucesso e erro.
- Fluxo basico da feature de lista de compras.

## Cenarios sugeridos

- Criar lista com nome valido.
- Bloquear lista com nome vazio.
- Editar e excluir lista.
- Criar item com descricao e quantidade validas.
- Bloquear item sem descricao.
- Bloquear quantidade vazia, invalida ou menor/igual a zero.
- Concluir e desconcluir item.
- Reordenar item para cima e para baixo.
- Exibir estados de loading, erro e vazio.

## Integracao futura

Para testes de integracao, preferir mocks no nivel HTTP ou um BFF local controlado. Os testes nao devem depender de dados sensiveis nem de ambiente compartilhado.
