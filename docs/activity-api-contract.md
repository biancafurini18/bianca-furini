# Acompanhamento das Atividades — integração Databricks

## Estado da entrega
Frontend com base **inteiramente fictícia** em `src/data/activity-demo.json`. Alterações e histórico ficam apenas na memória da sessão e são descartados ao atualizar a página. Nenhum login é simulado como autenticação real. A seleção de perfil é exclusivamente de demonstração. Não conectar essa base a dados reais sem implementar os controles abaixo no FastAPI.

## API na mesma origem
Os pontos de integração ficam em `src/config/integrations.ts` e começam desativados. A demonstração não faz chamadas de produção. Ao conectar, substituir o estado demonstrativo por leituras da API e remover a seleção de perfil de demonstração.

- `GET /api/atividades/me`: ID imutável do usuário autenticado, nome completo, gestor e permissões; validar a identidade fornecida pelo ambiente Databricks. Nunca confiar em IDs, nomes ou permissões enviados pelo navegador.
- `GET /api/atividades/catalogo`: listas canônicas de frentes, macrotemas e atividades, com IDs e relações pai-filho. Recarregar antes de criar; validação definitiva no servidor.
- `GET /api/atividades/lancamentos`: filtrar no servidor por associação do usuário a `responsibleIds`.
- `GET /api/atividades/equipe?responsavelId=...`: exigir permissão de gestor e limitar aos seus subordinados. Totais devem usar esse mesmo escopo e contar iniciativas compartilhadas uma única vez; horas representam o esforço total da iniciativa, não horas por responsável.
- `POST /api/atividades/mutacoes`: `{ mutationId, entryId, expectedVersion, draft, catalog? }`; retornar `202 { jobId, status: "queued" }`. O servidor registra o ator autenticado e deriva os gestores pelos responsáveis; não aceita `actorId` ou `managerIds` como autoridade.
- `GET /api/atividades/mutacoes/{jobId}`: estados queued, processing, applied, conflict, failed; só o solicitante pode consultar. Retornar versão aplicada ou conflito recuperável.
- `GET /api/atividades/lancamentos/{id}/historico`: exigir acesso à iniciativa; devolver ator, data UTC, ação, versão anterior/nova e campos alterados, com paginação.

## Fila, conflitos e auditoria obrigatórios no servidor
Os lançamentos e `draft` incluem `observation` opcional; aceitar ausência ou texto vazio, devolver o valor e incluí-lo nos snapshots de auditoria. O filtro por `themeId` aplica-se ao mesmo escopo autorizado da tabela e do Gantt. O Gantt agrega o intervalo dos lançamentos filtrados por ID canônico de macrotema e expande seus lançamentos de atividades; datas individuais são exibidas somente nos detalhes.
Os lançamentos e `draft` incluem `startDate` e `endDate` obrigatórios, no formato de data civil `YYYY-MM-DD`, sem conversão de fuso horário. Validar datas existentes no calendário e `endDate >= startDate`; atividades de um dia são válidas. Manter `deadline` como prazo independente. Incluir o período nos snapshots antes/depois e retornos da API. O Gantt utiliza exclusivamente os lançamentos já autorizados e filtrados de cada visão, sem endpoint ou acesso adicional.

1. Persistir cada comando em uma fila durável, com unicidade de `mutationId` por solicitante e retentativas idempotentes. Não usar fila em memória de processo.
2. Processar sequencialmente por iniciativa dentro de transação, com verificação `expectedVersion`. Escritas concorrentes não podem sobrescrever silenciosamente outras alterações. Em conflito, conservar o comando com estado `conflict` e exigir revisão/reenvio; não aplicar cegamente uma versão antiga.
3. Na mesma transação, validar catálogo, responsáveis e propriedade, derivar gestores, escrever a iniciativa, incrementar versão, registrar auditoria imutável antes/depois e concluir o comando. Se qualquer etapa falhar, nenhuma alteração parcial pode permanecer.
4. Unicidade canônica por nome normalizado (espaços, caixa e acentos): frente global; macrotema dentro da frente; atividade dentro do macrotema. Criar constraints/índices no armazenamento e reaproveitar IDs existentes; o catálogo compartilhado não deve duplicar nomes quando duas pessoas os cadastram simultaneamente. Vários lançamentos podem referenciar a mesma atividade canônica.
5. Autorização de leitura/escrita no servidor, não apenas na interface. Manter o ator entre os responsáveis ao editar; adição de corresponsáveis deve obedecer a política corporativa. Gestor é somente leitura nesta entrega.
6. Guardar timestamps UTC, identificadores imutáveis, logs protegidos contra edição/exclusão pelo funcionário e política de retenção corporativa. Nome completo é o rótulo, não chave de segurança.

## Regras da demonstração
Fila serial por sessão, verificação de versão, deduplicação normalizada e log antes/depois reproduzem o contrato visualmente, mas não garantem segurança, persistência ou concorrência entre usuários reais. Datas fictícias são de outubro/novembro de 2026. O prazo vencido considera a data local atual, excluindo Concluída e Suspensa.