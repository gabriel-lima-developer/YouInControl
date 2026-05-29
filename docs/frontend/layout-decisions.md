# Decisoes de layout do frontend

## Contexto

A refatoracao visual recente aplicou no frontend real o layout gerado pelo v0 para a experiencia de listas de compras. O objetivo foi elevar a percepcao de qualidade da UI sem alterar contratos da API, regras de negocio ou arquitetura principal da feature.

As telas impactadas foram:

- `/shopping-lists`: listagem de listas de compras.
- `/shopping-lists/:id`: detalhe da lista de compras.

## Objetivo da nova UI

A nova interface prioriza uma experiencia simples, clara e mobile first para gerenciar compras rapidamente. A tela inicial permite criar listas no topo, entender o andamento de cada lista por totalizadores e abrir o detalhe com uma acao evidente. A tela de detalhe facilita adicionar itens, acompanhar progresso, concluir itens e reordenar a lista.

## Padrao visual adotado

- Layout clean, com baixa densidade visual e foco nas acoes principais.
- Mobile first, com largura maxima centralizada em `max-w-2xl`.
- Paleta baseada em preto, branco e vermelho.
- Header preto com identidade `YouInControl` e icone de carrinho.
- Fundo claro e cards brancos para destacar o conteudo.
- Vermelho como cor de destaque para acoes principais, progresso e estados relevantes.
- Bordas arredondadas em formularios, cards, botoes e estados vazios.
- Espacamentos generosos entre secoes para melhorar leitura em telas pequenas.
- Sombras discretas apenas para sugerir profundidade sem deixar a UI pesada.

## Componentes e padroes reutilizaveis

- `AppHeader`: header fixo no topo, identidade visual e navegacao para listas.
- `AppFooter`: rodape com copyright e links do autor.
- `QuickCreateForm`: criacao rapida de listas e itens no topo do fluxo.
- `ShoppingListCard`: card de lista com nome, data, totalizadores, progresso e acoes.
- `SummaryCard`: cards compactos de resumo no detalhe.
- `ProgressSection`: barra de progresso acessivel e reutilizavel.
- `ShoppingListItemRow`: linha/card de item com toggle, edicao inline, exclusao e drag-and-drop.
- Acoes com icones de `lucide-react`, mantendo comandos visuais consistentes.

## Padroes de UX adotados

- Cadastro rapido no topo para reduzir atrito.
- Acoes visiveis e simples para abrir, editar e excluir listas.
- Feedback visual para item concluido com check, vermelho de destaque e texto riscado.
- Barra de progresso para acompanhamento rapido do andamento da lista.
- Totalizadores de total, concluidos e pendentes no detalhe.
- Estados de loading, erro e vazio com linguagem curta e orientada a acao.
- Layout responsivo com foco em celular, mas confortavel em desktop.
- Rodape com informacoes do autor e links externos.

## Logo e identidade visual

A identidade atual usa o texto `YouInControl` no header, com destaque em vermelho para `In`, acompanhado de um icone de carrinho. A marca deve aparecer como sinal claro no primeiro contato da aplicacao, principalmente no header.

O arquivo `public/assets/app-icon.svg` reforca a identidade visual e deve permanecer alinhado com a paleta preto, branco e vermelho.

## Cuidados para futuras telas

- Reutilizar tokens CSS definidos em `src/styles/index.css` em vez de hardcode de cores.
- Preferir componentes existentes antes de criar novas variacoes visuais.
- Manter formularios rapidos quando a tarefa principal for cadastrar algo simples.
- Usar icones para acoes recorrentes, com `aria-label` descritivo.
- Preservar estados de loading, erro e vazio em todo fluxo que consome API.
- Garantir que textos longos quebrem corretamente em telas pequenas.
- Evitar adicionar secoes com aparencia de landing page; o produto e uma ferramenta operacional.

## Pontos que nao devem mudar sem justificativa

- Identidade preto, branco e vermelho.
- Header preto com marca visivel.
- Layout mobile first e centralizado.
- Cards brancos com bordas arredondadas e sombra discreta.
- Formulario rapido no topo das telas principais.
- Feedback visual de item concluido.
- Barra de progresso como sinal de acompanhamento.
- Navegacao direta entre listagem e detalhe.
