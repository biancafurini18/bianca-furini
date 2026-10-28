/**
 * PONTOS DE INTEGRAÇÃO CENTRALIZADOS
 * -----------------------------------
 * Todos os endpoints devem ser caminhos RELATIVOS no padrão /api/...
 * O frontend roda na mesma origem do backend FastAPI (Databricks App).
 *
 * Enquanto `endpoint` estiver vazio (""), a UI mostra o elemento pronto
 * mas sem ação real (nenhum dado fictício é exibido).
 */

export type IntegrationPoint = {
  id: string;
  label: string;
  /** Ex.: "/api/agentes/fatores-de-risco". Vazio = não configurado. */
  endpoint: string;
};

export const isConfigured = (point?: { endpoint: string }) =>
  Boolean(point && point.endpoint.trim().length > 0);

/** Helper único para chamadas de dados (sempre caminho relativo). */
export async function callApi<T = unknown>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`Falha na chamada ${endpoint} (${res.status})`);
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Superintendências                                                   */
/* ------------------------------------------------------------------ */

export type SuperintendenciaId =
  | "resiliencia"
  | "compliance"
  | "riscos-corporativos"
  | "riscos-financeiros";

export type CorDestaque = "turquesa" | "amarelo" | "verde" | "coral";

export type Superintendencia = {
  id: SuperintendenciaId;
  nome: string;
  nomeCurto: string;
  detalhado: boolean;
  cor: CorDestaque;
};

export const superintendencias: Superintendencia[] = [
  {
    id: "resiliencia",
    nome: "Superintendência de Resiliência Corporativa e Controles Integrados",
    nomeCurto: "Resiliência Corporativa e Controles Integrados",
    detalhado: true,
    cor: "turquesa",
  },
  {
    id: "compliance",
    nome: "Superintendência de Compliance",
    nomeCurto: "Compliance",
    detalhado: false,
    cor: "amarelo",
  },
  {
    id: "riscos-corporativos",
    nome: "Superintendência de Riscos Corporativos",
    nomeCurto: "Riscos Corporativos",
    detalhado: false,
    cor: "verde",
  },
  {
    id: "riscos-financeiros",
    nome: "Superintendência de Riscos Financeiros e Modelagem",
    nomeCurto: "Riscos Financeiros e Modelagem",
    detalhado: false,
    cor: "coral",
  },
];

export const getSuperintendencia = (id: string) =>
  superintendencias.find((s) => s.id === id);

/* ------------------------------------------------------------------ */
/* Agentes de IA — Resilia                                             */
/* ------------------------------------------------------------------ */

export type AgentColor = "coral" | "amarelo" | "ocre" | "verde" | "turquesa" | "verdeAgua";

export type AgenteResilia = IntegrationPoint & {
  descricao: string;
  icon: "lock" | "scale" | "share" | "book" | "siren" | "check";
  color: AgentColor;
};

// TODO: inserir endpoint do agente no Databricks (Model Serving / Genie / API REST)
// Formato esperado: "/api/agentes/<slug>"
export const agentesResilia: AgenteResilia[] = [
  {
    id: "fatores-de-risco",
    label: "Fatores de Risco",
    endpoint: "", // TODO: "/api/agentes/fatores-de-risco"
    icon: "lock",
    color: "coral",
    descricao:
      "Eu leio documentos complexos, identifico e decomponho controles, faço o mapeamento automático para COSO e CIS e entrego uma matriz completa — com granularidade, padronização e rapidez.",
  },
  {
    id: "aderencia-regulatoria",
    label: "Aderência Regulatória",
    endpoint: "", // TODO: "/api/agentes/aderencia-regulatoria"
    icon: "scale",
    color: "amarelo",
    descricao:
      "Analiso matrizes de requisitos, localizo e valido evidências nos documentos e avalio a aderência regulatória 304 de ponta a ponta, gerando automaticamente uma matriz completa de conformidade.",
  },
  {
    id: "comunicacao-relevantes-bcb",
    label: "Comunicação Relevantes (BCB)",
    endpoint: "", // TODO: "/api/agentes/comunicacao-relevantes-bcb"
    icon: "share",
    color: "ocre",
    descricao:
      "Analiso documentos técnicos de incidentes, identifico evidências reais e respondo automaticamente formulários regulatórios complexos garantindo aderência às regras da B3 e padronização do processo.",
  },
  {
    id: "revisao-de-documentos",
    label: "Revisão de Documentos",
    endpoint: "", // TODO: "/api/agentes/revisao-de-documentos"
    icon: "book",
    color: "verde",
    descricao:
      "Faço a revisão crítica de documentos e apresentações com visão técnica e analítica, similar à de um Comitê de Auditoria. Identifico pontos de atenção e sugiro melhorias para garantir clareza, coerência, consistência e qualidade das informações.",
  },
  {
    id: "avaliacao-ftr",
    label: "Avaliação FTR",
    endpoint: "", // TODO: "/api/agentes/avaliacao-ftr"
    icon: "siren",
    color: "turquesa",
    descricao:
      "Relaciono as ações previstas no FTR com as evidências apresentadas e estruturo uma avaliação clara, objetiva e alinhada às melhores práticas de Controles Internos e Auditoria.",
  },
  {
    id: "avaliacao-plano-de-acao",
    label: "Avaliação Plano de Ação",
    endpoint: "", // TODO: "/api/agentes/avaliacao-plano-de-acao"
    icon: "check",
    color: "verdeAgua",
    descricao:
      "Relaciono as ações previstas no Plano de Ação com as evidências apresentadas e estruturo uma avaliação clara, objetiva e alinhada às melhores práticas de Controles Internos e Auditoria.",
  },
];

/* ------------------------------------------------------------------ */
/* Dashboards / Indicadores                                            */
/* ------------------------------------------------------------------ */

export type KpiDefinition = IntegrationPoint & {
  icon: "activity" | "shield" | "alert" | "clock" | "target" | "layers";
};

export type ChartDefinition = IntegrationPoint & {
  tipo: "linha" | "barra" | "pizza";
};

export type DashboardConfig = {
  kpis: KpiDefinition[];
  charts: ChartDefinition[];
};

// TODO: inserir aqui a query/endpoint do Databricks (SQL Warehouse, Genie ou API REST)
// Formato esperado: "/api/dashboards/<superintendencia>/<indicador>"
const dashboardBase = (slug: string): DashboardConfig => ({
  kpis: [
    { id: `${slug}-kpi-1`, label: "Controles avaliados", endpoint: "", icon: "shield" },
    { id: `${slug}-kpi-2`, label: "Aderência regulatória", endpoint: "", icon: "target" },
    { id: `${slug}-kpi-3`, label: "Planos de ação em curso", endpoint: "", icon: "layers" },
    { id: `${slug}-kpi-4`, label: "Pontos de atenção abertos", endpoint: "", icon: "alert" },
    { id: `${slug}-kpi-5`, label: "Horas economizadas", endpoint: "", icon: "clock" },
    { id: `${slug}-kpi-6`, label: "Automações ativas", endpoint: "", icon: "activity" },
  ],
  charts: [
    { id: `${slug}-chart-evolucao`, label: "Evolução mensal", endpoint: "", tipo: "linha" },
    { id: `${slug}-chart-por-area`, label: "Distribuição por área", endpoint: "", tipo: "barra" },
    { id: `${slug}-chart-status`, label: "Status dos itens", endpoint: "", tipo: "pizza" },
  ],
});

export const dashboards: Record<SuperintendenciaId, DashboardConfig> = {
  resiliencia: dashboardBase("resiliencia"),
  compliance: dashboardBase("compliance"),
  "riscos-corporativos": dashboardBase("riscos-corporativos"),
  "riscos-financeiros": dashboardBase("riscos-financeiros"),
};

/** Frontend demonstration only. Enable when the corresponding FastAPI contract is implemented. */
export const activityIntegrations = {
  identity: { id: "activity-me", label: "Identidade e gestor", endpoint: "" }, // /api/atividades/me
  catalog: { id: "activity-catalog", label: "Catálogo canônico", endpoint: "" }, // /api/atividades/catalogo
  entries: { id: "activity-entries", label: "Meus lançamentos", endpoint: "" }, // /api/atividades/lancamentos
  team: { id: "activity-team", label: "Equipe do gestor", endpoint: "" }, // /api/atividades/equipe
  mutations: { id: "activity-mutations", label: "Fila durável de alterações", endpoint: "" }, // /api/atividades/mutacoes
  audit: { id: "activity-audit", label: "Histórico de alterações", endpoint: "" }, // /api/atividades/lancamentos/{id}/historico
} satisfies Record<string, IntegrationPoint>;
