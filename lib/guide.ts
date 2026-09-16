// Conteúdo do guia de revisão da equipe.
//
// Não é um tour de produto: o público é quem revisa o portal contra o PRD 17,
// não o afiliado. Cada etapa diz o que o PRD pede, o que esta tela entrega e o
// que ainda depende de serviço que não existe. As referências (PD-*, AFP-*)
// apontam para as seções do PRD para conferência.

export type GuideStatus = 'conforme' | 'demo' | 'pendente';

export type GuideStep = {
  /** Tela onde a etapa acontece; o guia navega sozinho entre elas. */
  page: string;
  /** Elemento destacado. Sem seletor, a etapa aparece centralizada. */
  selector?: string;
  title: string;
  body: string;
  bullets?: string[];
  /** Referência no PRD, para quem quiser conferir a fonte. */
  prd: string;
  status?: GuideStatus;
};

export const statusLabels: Record<GuideStatus, string> = {
  conforme: 'Conforme o PRD',
  demo: 'Dado demonstrativo',
  pendente: 'Depende de integração',
};

export const guide: GuideStep[] = [
  {
    page: 'home',
    title: 'Guia de revisão do portal',
    body: 'Este guia é para a equipe, não para o afiliado. Em cada tela ele aponta o que o PRD 17 pede, o que esta implementação entrega e o que ainda depende de serviços que não existem. Os três princípios do PRD valem em tudo que vem a seguir:',
    bullets: [
      'Mesma definição, mesmo número. Cada métrica usa a definição do PRD Admin (Feature 4) e a mesma consulta.',
      'Prévia não é dívida. Período aberto mostra estimativa; só o fechado é obrigação e só o pago é pago.',
      'Identidade separada. O afiliado vive em realm próprio no Kratos, com 2FA obrigatório. Não tem carteira, não negocia, não é player.',
    ],
    prd: 'PRD 17 · v1.0 · Princípios',
  },
  {
    page: 'home',
    selector: '.filterbar',
    title: 'Seletor de período',
    body: 'Hoje, ontem, últimos 7 dias, este mês, mês passado e intervalo personalizado. O período escolhido vale ao mesmo tempo para as métricas de destaque e para a tabela por data.',
    prd: 'PD-02',
    status: 'conforme',
  },
  {
    page: 'home',
    selector: '.metrics-grid',
    title: 'Seis métricas de destaque',
    body: 'Cliques, cadastros, FTDs, qualificados, ativos e comissão estimada — exatamente as seis do PRD, nesta ordem. O ícone de informação em cada tile abre a definição da métrica, que é a mesma do PRD Admin. Os números devem bater com GET /admin/affiliates/{id}/metrics para o mesmo afiliado e período.',
    prd: 'PD-02 · AFP-F2.2',
    status: 'conforme',
  },
  {
    page: 'home',
    selector: '.preview-note',
    title: 'Prévia não é dívida',
    body: 'Com o período aberto, a comissão aparece como estimada e carrega o rótulo "prévia". Essa regra de linguagem se repete no extrato: "estimada" no aberto, "devida" só no fechado, "paga" só quando existe referência de pagamento registrada.',
    prd: 'AFP-F2.1 · PD-06',
    status: 'conforme',
  },
  {
    page: 'home',
    selector: '.right-rail',
    title: 'Código, deal e próximos passos',
    body: 'O bloco lateral reúne o código do afiliado (copiável), o deal vigente em uma frase, o saldo a compensar, o último pagamento e o próximo fechamento. No celular ele desce para baixo das métricas. Os valores aqui são fixtures de lib/affiliate.ts.',
    prd: 'PD-02',
    status: 'demo',
  },
  {
    page: 'reports',
    selector: '.report-controls',
    title: 'Filtros do relatório',
    body: 'Campanha (uma, várias ou todas), intervalo de datas e quebra opcional por tipo de mercado. Ao filtrar por uma campanha, apenas as linhas dela aparecem e os totais são recalculados — vale testar isso contra o cenário AFP-F3.1.',
    prd: 'AFP-F3.1 · PD-03',
    status: 'conforme',
  },
  {
    page: 'reports',
    selector: '.report-table',
    title: 'Tabela por data, com totalizador',
    body: 'Dez colunas por data: cliques, cadastros, FTDs em contagem e em valor, qualificados, ativos, depósitos, volume negociado, NGR e comissão estimada. Não existe dimensão "cliente" — o afiliado vê agregados, nunca indivíduos.',
    prd: 'PD-03 · AFP-F3.2',
    status: 'conforme',
  },
  {
    page: 'reports',
    selector: '[data-guia="export"]',
    title: 'Exportação CSV',
    body: 'Exporta exatamente o recorte filtrado, incluindo todas as páginas e não apenas a que está à vista. Nenhuma linha identifica um cliente individual, e as células são protegidas contra injeção de fórmula.',
    prd: 'AFP-F3.2',
    status: 'conforme',
  },
  {
    page: 'links',
    selector: '.destination-grid',
    title: 'Destino do link',
    body: 'Home, categoria ou mercado específico — este último com busca no catálogo de mercados abertos. O catálogo desta demonstração é fixo; na operação real ele vem do serviço de mercados, que é o único pré-requisito do PRD já marcado como pronto.',
    prd: 'PD-04 · AFP-F4.1',
    status: 'demo',
  },
  {
    page: 'links',
    selector: '[data-guia="link-campanha"]',
    title: 'Campanha é obrigatória',
    body: 'Todo link nasce ligado a uma campanha, com criação inline para não tirar o afiliado da tela. Campanhas desativadas não aparecem nesta lista, mas continuam nos relatórios históricos.',
    prd: 'PD-04 · AFP-F4.3',
    status: 'conforme',
  },
  {
    page: 'links',
    selector: '.link-result',
    title: 'URL gerada',
    body: 'A URL carrega ref, campanha e click_id — valor fixo ou o placeholder {click_id} para o tracker do afiliado. O domínio é ilustrativo até o site B2C ser configurado em NEXT_PUBLIC_B2C_ORIGIN, e a captura do clique depende do adaptador ser implantado no repositório do site.',
    prd: 'AFP-F4.1 · AFP-F0',
    status: 'pendente',
  },
  {
    page: 'campaigns',
    selector: '[data-guia="nova-campanha"]',
    title: 'Nome único por afiliado',
    body: 'Criar e renomear com nome livre, porém único: duplicar é rejeitado sem distinguir maiúsculas de minúsculas. No contrato do backend isso corresponde ao erro 1492, com HTTP 409.',
    prd: 'AFP-F4.2 · código 1492',
    status: 'conforme',
  },
  {
    page: 'campaigns',
    selector: '[data-guia="campanhas-lista"]',
    title: 'Desativar preserva o histórico',
    body: 'A campanha desativada deixa de ser selecionável no gerador de links, mas suas linhas permanecem nos relatórios históricos. A confirmação diz isso antes de desativar, para que a ação não pareça uma exclusão.',
    prd: 'AFP-F4.3',
    status: 'conforme',
  },
  {
    page: 'statements',
    selector: '.statement-list',
    title: 'Cinco estados de período',
    body: 'Aberto (prévia), aguardando fechamento, fechado, pago e pago parcial. Cor e texto mudam juntos, e os estados acompanham o backoffice: o período vira "fechado" quando é aprovado lá, e "pago" quando um pagamento é registrado com referência externa.',
    prd: 'PD-06 · AFP-F5.1',
    status: 'conforme',
  },
  {
    page: 'statements',
    selector: '.statement-detail',
    title: 'Composição e pagamentos',
    body: 'O detalhe abre NGR base, revenue share, CPA, saldo a compensar de entrada, ajustes com categoria e a comissão devida. Cada pagamento traz valor, data, método e referência externa copiável. Quando o saldo de saída é negativo, um texto fixo explica por que a comissão é zero.',
    prd: 'AFP-F5.2',
    status: 'demo',
  },
  {
    page: 'statements',
    selector: '.payout',
    title: 'Pagamento é somente leitura',
    body: 'Os dados de pagamento aparecem mascarados e não existe controle para editá-los — nem aqui, nem no perfil, nem como rota de API. Alterações passam pelo gerente. É o teste adversarial AFP-PT-05.',
    prd: 'AFP-F5.3 · AFP-PT-05',
    status: 'conforme',
  },
  {
    page: 'profile',
    selector: '.identity-card',
    title: 'O que o afiliado não muda',
    body: 'Nome e empresa, código, país, deal vigente, dados de pagamento e os termos aceitos ficam com cadeado, incluindo a versão e a data do aceite. Editável é apenas idioma, contato e preferências de notificação.',
    prd: 'AFP-F6.1 · PD-07',
    status: 'conforme',
  },
  {
    page: 'profile',
    selector: '.security-card',
    title: 'Gerenciar 2FA',
    body: 'A regeneração exige reautenticação antes de mostrar o novo QR e o código de backup. Nesta demonstração o código é 123456 e nada é alterado de verdade — a troca real acontece no Kratos.',
    prd: 'PD-07',
    status: 'demo',
  },
  {
    page: 'home',
    title: 'O que ainda não está aqui',
    body: 'Para fechar a revisão, os pontos que a interface não resolve sozinha:',
    bullets: [
      'Kratos no realm affiliates. O login e o 2FA desta demonstração simulam a interface; não protegem acesso real.',
      'Endpoints do Admin. Métricas, campanhas, destinos e extratos usam fixtures locais. Na integração, o afiliado precisa ser derivado no servidor a partir da identidade autenticada — nunca aceito do cliente.',
      'Captura de clique no site B2C. O adaptador existe em integrations/attribution.ts, mas roda no repositório do site, que não foi fornecido.',
      'Termos e PDFs oficiais. O texto é demonstrativo; AFP-04 e AFP-05 seguem abertos no PRD.',
      'Sem gráficos no MVP, por decisão do próprio PRD: eles entram quando houver 12 meses de dados.',
    ],
    prd: 'README · Pontos pendentes',
    status: 'pendente',
  },
];
