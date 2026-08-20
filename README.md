# Integrity Insights Hub

Contexto e objetivo

Crie o frontend de um aplicativo corporativo interno para a Diretoria de Integridade, Risco e Resiliência da B3. Este frontend será publicado como um Databricks App (o recurso nativo do Databricks para hospedar aplicações web dentro do workspace) — ou seja, este projeto React não deve ter backend próprio (não usar Supabase, Firebase, ou qualquer backend embutido do Lovable). Toda a lógica de dados, agentes de IA e indicadores virá de uma API Python (FastAPI) que eu vou construir separadamente dentro do Databricks App; o frontend deve apenas consumir essa API através de chamadas relativas, no padrão /api/... (mesma origem, sem necessidade de CORS ou de configurar URL base de servidor).

Por isso, é fundamental que nenhuma informação numérica, texto de resultado ou resposta de agente seja inventada: onde ainda não existe uma integração real, o elemento deve aparecer visualmente pronto e profissional, mas como um botão/placeholder sem ação (ou com uma chamada já estruturada para /api/..., comentada, para eu ligar ao backend depois).

Visual: institucional, "high-tech", tema escuro, usando a paleta de cores oficial da B3 (detalhada abaixo).

Estrutura de navegação

1. Tela inicial (Home) — "Diretoria de Integridade, Risco e Resiliência"

Título grande e centralizado. Logo "[B]³" no canto superior direito. Rodapé fixo e discreto com o texto "INFORMAÇÃO INTERNA" em todas as telas do app.

4 cards/botões grandes, um para cada Superintendência, exatamente com estes nomes:

Superintendência de Resiliência Corporativa e Controles Integrados

Superintendência de Compliance

Superintendência de Riscos Corporativos

Superintendência de Riscos Financeiros e Modelagem

Clicar em um card leva à "Área da Superintendência" correspondente.

2. Tela "Área da Superintendência" (template único, reutilizado pelas 4 áreas)

Cabeçalho com o nome da superintendência selecionada e botão "voltar" para a Home.

2 cards grandes de opção:

Agentes de IA

Dashboards / Indicadores

Para Compliance, Riscos Corporativos e Riscos Financeiros e Modelagem: os dois cards levam a uma tela genérica reutilizável "Conteúdo em configuração", com um botão de ação visualmente presente porém desabilitado (tom acinzentado, cursor not-allowed, tooltip "Integração ainda não configurada"). A estrutura deve ser a mesma usada pela Resiliência, só que vazia, pronta para eu preencher o conteúdo depois.

Para Resiliência Corporativa e Controles Integrados: os dois cards levam às telas detalhadas abaixo.

3. Tela "Resilia — Agente de IA" (Agentes de IA da Superintendência de Resiliência)

Layout em duas colunas: à esquerda o texto institucional, à direita uma ilustração/avatar circular representando a "Resilia" (uma figura estilo androide/IA), cercada em anel por ícones (escudo com check, cadeado, nuvem com cadeado, wifi, engrenagem com cadeado) — recrie com ícones de contorno (ex.: lucide-react: ShieldCheck, Lock, Cloud, Wifi, Settings) dispostos ao redor do avatar central, com leve glow nas cores da marca.

Texto:

Título: "Conheça a Resilia"

Descrição: "Agente de inteligência artificial e automação da Superintendência de Resiliência Corporativa e Controles Integrados"

Subtítulo menor: "ResilIA (Resiliência + IA)"

Lista de objetivos, com a primeira palavra de cada item em destaque/negrito:

Simplificar e automatizar processos.

Reduzir horas de atividades operacionais.

Diminuir disfunções entre áreas.

Expandir o uso estruturado de dados e IA.

Abaixo (ou em uma seção/aba "Agentes"), um grid de 6 cards — "Agentes de IA (Habilidades da Resilia)":

Fatores de Risco (ícone de cadeado, tom vermelho) — "Eu leio documentos complexos, identifico e decomponho controles, faço o mapeamento automático para COSO e CIS e entrego uma matriz completa — com granularidade, padronização e rapidez."

Aderência Regulatória (ícone de balança, tom amarelo/laranja) — "Analiso matrizes de requisitos, localizo e valido evidências nos documentos e avalio a aderência regulatória 304 de ponta a ponta, gerando automaticamente uma matriz completa de conformidade."

Comunicação Relevantes (BCB) (ícone de rede/compartilhamento, tom laranja) — "Analiso documentos técnicos de incidentes, identifico evidências reais e respondo automaticamente formulários regulatórios complexos garantindo aderência às regras da B3 e padronização do processo."

Revisão de Documentos (ícone de livro, tom verde) — "Faço a revisão crítica de documentos e apresentações com visão técnica e analítica, similar à de um Comitê de Auditoria. Identifico pontos de atenção e sugiro melhorias para garantir clareza, coerência, consistência e qualidade das informações."

Avaliação FTR (ícone de alerta/sirene, tom ciano) — "Relaciono as ações previstas no FTR com as evidências apresentadas e estruturo uma avaliação clara, objetiva e alinhada às melhores práticas de Controles Internos e Auditoria."

Avaliação Plano de Ação (ícone de check circular, tom verde-água) — "Relaciono as ações previstas no Plano de Ação com as evidências apresentadas e estruturo uma avaliação clara, objetiva e alinhada às melhores práticas de Controles Internos e Auditoria."

Cada card tem, no rodapé, um botão "Utilizar agente". Regra obrigatória: nenhum resultado ou dado fictício deve ser exibido ao clicar. O botão deve:

Ter um ponto de integração claramente identificado no código (ex.: comentário // TODO: inserir endpoint do agente no Databricks) para eu inserir depois uma chamada de API ou um link.

Se não houver endpoint configurado, o botão aparece normal (não quebrado), mas sem ação real ao clicar — no máximo um toast "Integração ainda não configurada". Nunca gerar texto de resposta inventado.

4. Tela "Dashboards / Indicadores" (para todas as 4 superintendências, incluindo Resiliência)

Grid de cards de KPI (título, ícone, espaço para valor e variação) e espaços reservados para gráficos (linha, barra, pizza) — todos em estado vazio/placeholder, com um estado visual de "sem dados conectados" (ex.: ícone apagado de gráfico/plug + texto "Conecte a fonte de dados").

Mesma regra dos agentes: cada card/gráfico deve ter no código um ponto claro para eu inserir depois a query/endpoint do Databricks (SQL, Genie ou API REST). Não usar nenhum número ou dado de exemplo.

Design system — paleta oficial B3

Tema escuro, estética corporativa "high-tech": fundo quase preto/azul-marinho profundo, textos claros, acentos dourado/laranja em títulos, azul vivo em botões primários, leve glow e efeito glassmorphism sutil nos cards.

Use estas cores oficiais como tokens/variáveis do design system:

Paleta superior (cores institucionais/primárias):

Azul vivo: #2424C4

Azul marinho escuro: #0C006F

Branco acinzentado: #DCDCDC

Bege/pele claro: #E6B28E

Paleta central (ícones, categorias, indicadores):

Cinza azulado claro: #C4CEDC

Verde: #20A741

Coral/vermelho: #EF5A46

Rosa/lilás: #D78FD3

Amarelo: #FFD100

Paleta inferior (gráficos/indicadores, tons mais profundos):

Turquesa: #45AAB6

Verde escuro: #054020

Marrom: #7A2F00

Vinho/Bordô: #8B0023

Ocre/Dourado escuro: #A06A18

Diretrizes de uso:

Fundo principal: derivado do Azul marinho escuro (#0C006F), escurecido para um quase-preto azulado (algo como #05061A) para reforçar o aspecto "high-tech"/dark mode.

Azul vivo (#2424C4) para botões primários, bordas ativas e destaques de navegação.

Um tom dourado/laranja (dentro da família do Bege/pele claro #E6B28E, podendo ser levemente mais saturado) para títulos de destaque, como "Conheça a Resilia".

Verde (#20A741), Coral (#EF5A46), Amarelo (#FFD100), Turquesa (#45AAB6) e as demais cores centrais/inferiores reservadas para os ícones dos 6 agentes de IA e para status/variação nos dashboards (positivo/negativo/alerta).

Tipografia sem serifa, moderna, com boa hierarquia (bold em títulos e valores, regular no restante).

Ícones em estilo outline/linha fina, com leve glow na cor do card.

Cantos arredondados, sombras suaves, hover states sutis (leve scale + glow), fundo com textura discreta tipo grid/circuito, sem poluir a leitura.

Responsivo, mas desktop-first (uso corporativo em monitor/TV, como nas telas de referência).

Rodapé fixo discreto "INFORMAÇÃO INTERNA" e logo "[B]³" no canto superior direito, presentes em todas as telas.

Stack técnica

React + Vite + Tailwind CSS (padrão do Lovable), como SPA puramente de frontend — sem backend/banco de dados próprio do Lovable.

Componentizar: um componente de card de superintendência, um de card de agente de IA e um de card de indicador/dashboard — reaproveitados nas 4 áreas.

Rotas sugeridas: /, /superintendencia/:id, /superintendencia/:id/agentes, /superintendencia/:id/dashboards.

Criar um arquivo de configuração central (ex.: src/config/integrations.ts) listando todos os pontos de integração (nome do agente/indicador + campo endpoint: string, sempre no formato /api/...), para eu mapear depois no backend sem precisar mexer nos componentes visuais.

Todas as chamadas de dados devem usar fetch/axios com caminho relativo (/api/agentes/fatores-de-risco, /api/dashboards/resiliencia, etc.) — nunca uma URL absoluta de terceiros, já que o app vai rodar na mesma origem do backend dentro do Databricks App.

Não usar dado mockado/fictício em nenhum texto de resultado, valor de indicador ou gráfico. Os únicos textos "fixos" são os estruturais descritos acima (nomes das superintendências, nomes e descrições dos 6 agentes da Resilia), que são reais.

Gerar o projeto de forma que o resultado do build (npm run build) produza uma pasta estática padrão (ex.: dist/ ou build/), pois essa pasta será servida por um backend Python (FastAPI) dentro da estrutura do Databricks App — não é necessário configurar isso no Lovable, apenas manter o projeto como um build Vite/React padrão, sem customizações de servidor.

Como este frontend será hospedado (contexto técnico — não precisa implementar, só ter em mente)

O Databricks Apps é o serviço nativo do Databricks para hospedar aplicativos web dentro do workspace, com autenticação OAuth já integrada (não é necessário gerenciar chave de API no frontend). O padrão mais usado para apps com frontend em React é:

Um backend Python (FastAPI) com um arquivo app.py, que expõe as rotas de API sob /api/* e serve os arquivos estáticos do build do React (gerado pelo Lovable) em /.

Um arquivo app.yaml na raiz do projeto, definindo o comando de execução (ex.: gunicorn com uvicorn.workers.UvicornWorker) e variáveis de ambiente.

Um databricks.yml declarando os recursos que o app pode acessar (SQL Warehouse, Model Serving Endpoints, Genie Space, etc.), que eu configuro depois no workspace.

Deploy feito via CLI (databricks apps deploy) ou pela UI do Databricks, a partir de uma pasta do Workspace ou de um repositório Git.

Ou seja: você (Lovable) só precisa entregar um build de frontend limpo, sem backend embutido, com todas as chamadas de dado apontando para /api/.... Eu ficarei responsável por juntar esse build com o backend FastAPI e publicar como Databricks App.

Observação final

Priorize uma UI robusta, elegante e enterprise-grade, com toda a estrutura de integração pronta para eu plugar depois no backend — mas sem nenhuma informação, métrica ou resposta de agente inventada.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e471312d-4866-4ada-8faa-a6e8230b8399).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
