# Roadmap do produto

## Contexto

Este roadmap organiza proximos passos do YouInControl apos a refatoracao visual das listas de compras. A lista abaixo e backlog tecnico/produto, nao compromisso fechado de entrega.

## Curto prazo

- Separar visualmente itens pendentes e itens concluidos.
- Adicionar confirmacao antes de excluir lista.
- Adicionar confirmacao antes de excluir item.
- Melhorar mensagens de sucesso e erro.
- Melhorar estados vazios.
- Melhorar loading states.
- Melhorar tratamento de erro no consumo da API.
- Reavaliar exibicao e edicao de `quantity` nos itens.
- Adicionar unidade de medida simples para itens de lista de compras. Concluido no BFF.
- Confirmar se `status` da lista deve voltar a aparecer na UI.

## Medio prazo

- Persistir e aperfeicoar ordenacao dos itens via backend.
- Criar autenticacao entre UI e BFF usando JWT.
- Separar usuarios e dados por conta.
- Adicionar login social com Google.
- Avaliar login social com Facebook.
- Preparar estrutura de perfil do usuario.
- Melhorar endpoints do BFF para entregar dados mais prontos para a UI.
- Criar dashboard inicial simples.

## Longo prazo

- Transformar o frontend em PWA.
- Permitir instalar o site no celular.
- Enviar notificacoes ao usuario.
- Configurar alertas para o usuario verificar se determinado item acabou.
- Usar IA para gerar listas automaticamente com base em pedidos do usuario.
- Usar IA para sugerir itens com base no historico de itens adicionados.
- Usar IA para sugerir receitas com base nos itens marcados como concluidos/comprados.
- Usar IA para identificar marcas de produtos, sugerir marcas comuns para um item e estimar valores medios para ajudar futuramente na nocao de custo da lista.
- Criar sugestoes inteligentes de recorrencia de compras.
- Criar historico de compras.
- Criar categorias inteligentes.

## Dependencias por tema

Depende de autenticacao:

- Separacao de dados por usuario.
- Login social com Google.
- Login social com Facebook.
- Perfil do usuario.
- Historico de compras por conta.
- Sugestoes baseadas em historico individual.

Depende de PWA/notificacoes:

- Instalacao no celular.
- Notificacoes ao usuario.
- Alertas para verificar se determinado item acabou.
- Experiencia offline ou semi-offline futura.

Depende de IA:

- Geracao automatica de listas por pedido do usuario.
- Sugestao de itens com base no historico.
- Sugestao de receitas com base em itens comprados.
- Identificacao e sugestao de marcas de produtos.
- Estimativa de valores medios de produtos.
- Sugestoes inteligentes de recorrencia.
- Categorias inteligentes.

Depende de mudancas no BFF:

- Totalizadores prontos para listagem.
- Resumo consolidado no detalhe.
- Dashboard inicial.
- Autenticacao JWT.
- Separacao de usuarios e contas.
- Persistencia de preferencias, historico, categorias e alertas.

Pode ser feito apenas no frontend:

- Confirmacao antes de excluir lista ou item.
- Melhorias de mensagens.
- Melhorias de estados vazios.
- Melhorias de loading.
- Separacao visual entre pendentes e concluidos usando `isCompleted`.
- Exibicao de `quantity` ja retornada pela API.

## Ideias adiadas

Nao ha ideias descartadas definitivamente neste momento. As iniciativas de IA, PWA, notificacoes, historico e login social ficam adiadas ate que o produto consolide autenticacao, dados por usuario e contratos mais completos no BFF.
