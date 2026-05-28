# Guia de commits com Conventional Commits

Use este guia sempre que for solicitado a organizar commits, revisar alterações não commitadas ou preparar uma branch para push.

## Objetivo

Analisar todas as alterações não commitadas da branch atual, entender o propósito de cada mudança, agrupar por intenção técnica e criar commits separados, coerentes e profissionais seguindo o padrão Conventional Commits.

## Regras gerais

* Não fazer push automaticamente.
* Não criar commits antes de analisar todas as alterações.
* Não usar `git add .` para tudo de uma vez, exceto se existir apenas um único grupo lógico de mudanças.
* Não criar commits genéricos como `update`, `changes`, `fix stuff`, `wip` ou similares.
* Escrever a descrição curta e o corpo dos commits em pt-BR.
* Não reescrever commits antigos sem autorização explícita.
* Não usar squash sem autorização explícita.
* Não alterar código desnecessariamente apenas para encaixar commits.
* Não incluir secrets, tokens, senhas, connection strings reais, chaves privadas ou arquivos locais indevidos.

## Processo obrigatório

### 1. Análise inicial

Executar:

```bash
git status
git diff --stat
```

Depois analisar:

```bash
git diff
```

Se existirem arquivos staged, também analisar:

```bash
git diff --cached
```

Considerar:

* arquivos staged;
* arquivos unstaged;
* arquivos untracked;
* arquivos removidos;
* arquivos renomeados.

Antes de commitar, entender o conjunto completo de mudanças.

## 2. Agrupamento das alterações

Agrupar commits por intenção técnica, não apenas por pasta.

Bons exemplos de agrupamento:

* Atualização de framework, SDK, dependências ou build.
* Ajustes de Docker, compose, pipeline ou infraestrutura.
* Reorganização estrutural de API/controllers.
* Implementação de uma funcionalidade específica.
* Implementação ou ajuste de autenticação/autorização.
* Alterações de persistência, entidades, migrations ou repositórios.
* Ajustes de Swagger/OpenAPI.
* Documentação técnica.
* ADRs.
* Testes.
* Correções pontuais.

Evitar misturar no mesmo commit:

* Migração de framework com nova funcionalidade.
* Documentação com alteração de regra de negócio.
* Docker com implementação de endpoints.
* Autenticação com migrations.
* Refatoração estrutural com feature, exceto quando forem inseparáveis.

## 3. Padrão Conventional Commits

Usar o formato:

```text
tipo(escopo): descrição curta
```

Manter `tipo` e `escopo` em inglês conforme o padrão Conventional Commits, mas escrever a descrição curta e o corpo em pt-BR.

Tipos permitidos:

* `feat`: nova funcionalidade.
* `fix`: correção de bug.
* `refactor`: alteração interna sem mudança funcional direta.
* `docs`: documentação.
* `test`: testes.
* `build`: build, Docker, dependências, SDK, csproj, pipeline.
* `chore`: tarefas auxiliares sem impacto funcional direto.
* `ci`: pipelines/workflows.
* `style`: formatação sem alteração lógica.

Escopos comuns:

* `backend`
* `frontend`
* `api`
* `auth`
* `docs`
* `adr`
* `docker`
* `build`
* `swagger`
* `persistence`
* `tests`
* nome da feature alterada

Exemplos:

```text
build(backend): atualiza projetos para .NET 10
refactor(api): reorganiza endpoints em controllers por recurso
feat(auth): adiciona autenticação JWT Bearer
docs(architecture): documenta arquitetura e padrões do projeto
docs(adr): registra decisões arquiteturais iniciais
build(docker): atualiza imagens Docker da aplicação
```

## 4. Corpo do commit

Sempre que a mudança for relevante, usar corpo detalhado.

Formato:

```text
tipo(escopo): descrição curta

- Detalha a primeira mudança importante
- Detalha a segunda mudança importante
- Explica impacto técnico quando necessário
- Menciona validações realizadas, quando aplicável
```

Exemplo:

```text
refactor(api): reorganiza endpoints em controllers por recurso

- Substitui o controller único por controllers específicos por recurso
- Define rotas REST consistentes para os recursos alterados
- Mantém controllers restritos à camada de API
- Preserva a separação de responsabilidades da arquitetura existente
```

## 5. Staging seletivo

Para cada commit:

1. Separar apenas as alterações relacionadas ao grupo lógico.
2. Usar staging seletivo quando necessário:

```bash
git add -p
```

3. Antes de commitar, validar:

```bash
git diff --cached --stat
git diff --cached
```

4. Confirmar que o staging contém apenas arquivos relacionados ao commit.

Se um arquivo tiver mudanças de grupos diferentes, separar com staging parcial.

## 6. Validações antes ou durante os commits

Sempre que aplicável, executar os comandos de validação do projeto.

Para backend .NET:

```bash
dotnet restore
dotnet build
dotnet test
```

Para frontend:

```bash
npm install
npm run build
npm test
```

Somente rodar comandos que fizerem sentido para o projeto atual.

Se algum comando falhar:

* Não ignorar a falha.
* Informar claramente o erro.
* Corrigir se for algo simples e diretamente relacionado às alterações.
* Se exigir decisão maior, documentar como pendência.

## 7. Segurança antes do commit

Antes de commitar, verificar especialmente:

* `appsettings.json`
* `appsettings.Development.json`
* `.env`
* `docker-compose.yml`
* arquivos de pipeline
* arquivos de configuração local
* arquivos com credenciais
* arquivos com tokens
* arquivos com chaves privadas

Se encontrar segredo:

* Não commitar.
* Remover do staging.
* Substituir por variável de ambiente, user-secrets ou placeholder seguro.
* Informar a correção realizada.

## 8. Criação dos commits

Para cada grupo lógico:

```bash
git add <arquivos-relacionados>
git diff --cached --stat
git commit -m "tipo(escopo): descrição curta" -m "- Detalhe relevante 1
- Detalhe relevante 2
- Detalhe relevante 3"
```

Preferir commits pequenos e bem explicados.

## 9. Resultado final esperado

Ao final, apresentar:

* Lista dos commits criados.
* Hash curto de cada commit.
* Mensagem completa de cada commit.
* Resumo dos arquivos incluídos em cada commit.
* Comandos de validação executados.
* Resultado de build/testes.
* Pendências, se existirem.
* Resultado final de:

```bash
git status
```

## 10. Restrições finais

* Não fazer push.
* Não criar tags.
* Não criar release.
* Não alterar histórico antigo.
* Não fazer squash.
* Não commitar arquivos sensíveis.
* Não deixar alterações não commitadas sem explicar.
