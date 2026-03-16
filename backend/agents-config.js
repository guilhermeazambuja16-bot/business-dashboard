'use strict';

const agentsConfig = {
  'ceo': {
    id: 'ceo',
    name: 'Claude CEO',
    emoji: '🧠',
    status: 'online',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'strategic',
    systemPrompt: 'You are the CEO agent. Be strategic, concise, and data-driven.',
    responseTemplates: [
      'Baseado nos dados atuais, nossa estratégia deve focar em {topic}. ROI estimado: {roi}%.',
      'Análise executiva: {topic} apresenta oportunidade de crescimento de {growth}% no Q{quarter}.',
      'Decisão estratégica: priorizar {topic}. Impacto esperado: alto. Timeline: {timeline}.',
      'KPIs indicam que {topic} é crítico. Recomendo alocar {percent}% dos recursos.',
      'Visão macro: {topic} alinha com nossos OKRs. Próximo passo: execução imediata.',
    ],
    variables: {
      topic: ['expansão de mercado', 'otimização de processos', 'automação de vendas', 'análise competitiva', 'crescimento de receita'],
      roi: ['23', '45', '67', '89', '34'],
      growth: ['15', '28', '42', '33', '19'],
      quarter: ['1', '2', '3', '4'],
      timeline: ['2 semanas', '1 mês', '45 dias', '3 semanas'],
      percent: ['30', '45', '60', '25', '40'],
    },
    activityTemplates: [
      'CEO revisou relatório estratégico Q{quarter}',
      'CEO definiu OKRs para o próximo ciclo',
      'CEO aprovou orçamento para {topic}',
      'CEO iniciou reunião de planejamento estratégico',
      'CEO analisou métricas de performance dos agentes',
    ],
  },

  'search-specialist': {
    id: 'search-specialist',
    name: 'Search Specialist',
    emoji: '🔍',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'analytical-search',
    systemPrompt: 'You are a Search Specialist. Return formatted results with bullets.',
    responseTemplates: [
      'Resultados encontrados para "{query}":\n• Fonte 1: {result1}\n• Fonte 2: {result2}\n• Fonte 3: {result3}\n\nTotal: {count} resultados relevantes.',
      'Pesquisa concluída:\n• {result1}\n• {result2}\n• {result3}\nConfiabilidade: {confidence}%',
      'Dados coletados sobre "{query}":\n• Tendência: {trend}\n• Volume: {volume}/mês\n• Competição: {competition}',
      'Análise de mercado:\n• {result1}\n• {result2}\n• Oportunidade identificada: {opportunity}',
    ],
    variables: {
      query: ['dashboard templates', 'AI agents market', 'SaaS trends 2025', 'automation tools', 'business intelligence'],
      result1: ['Market size: $4.2B growing at 23% YoY', 'Top competitor: Notion AI com 2M usuários', 'Tendência: low-code platforms dominando'],
      result2: ['Usuários pagantes crescendo 34% trimestral', 'CAC médio: $127, LTV: $890', 'Churn rate médio do setor: 5.2%'],
      result3: ['Oportunidade em SMBs não atendidas', 'Integração com Slack/Teams como diferencial', 'Preço ideal: $29-49/mês por usuário'],
      count: ['127', '89', '234', '156', '312'],
      confidence: ['87', '92', '78', '95', '83'],
      trend: ['crescente', 'estável', 'explosivo', 'emergente'],
      volume: ['45K', '120K', '78K', '230K'],
      competition: ['baixa', 'média', 'alta'],
      opportunity: ['nicho B2B subestimado', 'automação ainda manual', 'integração faltante'],
    },
    activityTemplates: [
      'Search Specialist pesquisou "{query}"',
      'Search Specialist coletou dados de {count} fontes',
      'Search Specialist identificou tendência: {trend}',
      'Search Specialist analisou competidores no segmento {topic}',
      'Search Specialist compilou relatório de mercado',
    ],
  },

  'content-marketer': {
    id: 'content-marketer',
    name: 'Content Marketer',
    emoji: '📝',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'creative-enthusiastic',
    systemPrompt: 'You are a Content Marketer. Be creative, enthusiastic, use emojis.',
    responseTemplates: [
      '✨ Ideia incrível para {platform}! Vamos criar conteúdo sobre {topic} que vai {action}! 🚀\n\nEstrutura sugerida:\n1. Hook poderoso\n2. Valor real para o usuário\n3. CTA irresistível\n\nEngajamento estimado: +{percent}% 📈',
      '🎯 Campanha planejada!\n\nTema: {topic}\nPlataforma: {platform}\nFormato: {format}\nPublicação: {schedule}\n\nEsse conteúdo vai bombar! 💥',
      '📣 Estratégia de conteúdo pronta!\n• Blog post: "{title}"\n• Thread: destacar {topic}\n• Video: tutorial de {duration}\n\nResultado esperado: {reach} impressões 👀',
    ],
    variables: {
      platform: ['LinkedIn', 'Instagram', 'Twitter/X', 'YouTube', 'TikTok'],
      topic: ['produtividade com IA', 'automação de negócios', 'dashboard de agentes', 'growth hacking', 'SaaS trends'],
      action: ['viralizar', 'gerar leads qualificados', 'aumentar autoridade', 'converter visitantes'],
      percent: ['47', '83', '120', '65', '200'],
      format: ['carrossel', 'video curto', 'infográfico', 'thread', 'newsletter'],
      schedule: ['amanhã 9h', 'segunda-feira', 'quinta às 18h', 'domingo 20h'],
      title: ['Como IA está revolucionando negócios', '5 automações que vão mudar sua empresa', 'O futuro dos agentes de IA'],
      duration: ['5 minutos', '2 minutos', '15 minutos'],
      reach: ['50K', '120K', '300K', '80K'],
    },
    activityTemplates: [
      'Content Marketer criou post para {platform} sobre {topic}',
      'Content Marketer planejou calendário editorial do mês',
      'Content Marketer otimizou SEO do blog post "{title}"',
      'Content Marketer lançou campanha no {platform}',
      'Content Marketer analisou métricas de engajamento',
    ],
  },

  'business-analyst': {
    id: 'business-analyst',
    name: 'Business Analyst',
    emoji: '📊',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'analytical',
    systemPrompt: 'You are a Business Analyst. Use numbers, percentages, and data.',
    responseTemplates: [
      'Análise quantitativa de {topic}:\n\nMétricas principais:\n- Taxa de crescimento: {growth}% MoM\n- Margem operacional: {margin}%\n- Eficiência: {efficiency}% vs benchmark\n\nRecomendação: {action} com confiança de {confidence}%.',
      'Relatório de {topic}:\n\nSegmento A: {segA}% do total\nSegmento B: {segB}% do total\nSegmento C: {segC}% do total\n\nVariação vs mês anterior: +{variation}%\nProjeção 90 dias: {projection}',
      'Dashboard de KPIs atualizado:\n• MRR: R${mrr}k (+{growth}%)\n• Churn: {churn}%\n• NPS: {nps}\n• CAC: R${cac}\n\nStatus geral: {status}',
    ],
    variables: {
      topic: ['performance de vendas', 'análise de churn', 'métricas de produto', 'ROI de campanhas', 'eficiência operacional'],
      growth: ['12.4', '28.7', '5.3', '41.2', '18.9'],
      margin: ['34', '28', '45', '19', '52'],
      efficiency: ['87', '92', '76', '95', '83'],
      action: ['escalar investimento', 'reduzir custos operacionais', 'pivotar estratégia', 'manter curso atual'],
      confidence: ['89', '94', '78', '96', '82'],
      segA: ['45', '38', '52', '61'],
      segB: ['32', '41', '28', '24'],
      segC: ['23', '21', '20', '15'],
      variation: ['8.3', '15.7', '3.2', '22.1'],
      projection: ['crescimento sustentado', 'platô esperado', 'aceleração prevista'],
      mrr: ['47', '89', '134', '223'],
      churn: ['2.3', '4.7', '1.8', '3.2'],
      nps: ['67', '72', '45', '89'],
      cac: ['127', '89', '234', '156'],
      status: ['Verde - On track', 'Amarelo - Atenção', 'Verde - Superando metas'],
    },
    activityTemplates: [
      'Business Analyst gerou relatório de {topic}',
      'Business Analyst identificou anomalia: {topic} com variação de {variation}%',
      'Business Analyst atualizou dashboard de KPIs',
      'Business Analyst projetou crescimento de {growth}% para Q{quarter}',
      'Business Analyst comparou performance com benchmarks do setor',
    ],
  },

  'sales-automator': {
    id: 'sales-automator',
    name: 'Sales Automator',
    emoji: '💰',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'persuasive',
    systemPrompt: 'You are a Sales Automator. Focus on conversion, be persuasive.',
    responseTemplates: [
      'Pipeline atualizado! {leads} leads qualificados prontos para conversão.\n\nSequência de follow-up ativada:\n1. Email inicial: enviado ({sent} contatos)\n2. Follow-up 1: agendado para {schedule}\n3. LinkedIn touch: programado\n\nConversão esperada: {conversion}% = R${revenue}k',
      'Oportunidade de vendas identificada!\n\nLead score: {score}/100\nPerfil: {profile}\nDor principal: {pain}\nSolução: {solution}\n\nPróximo passo: {action} — taxa de fechamento estimada: {closeRate}%',
      'Automação de outreach executada:\n• Emails enviados: {sent}\n• Taxa de abertura: {openRate}%\n• Respostas: {replies}\n• Reuniões agendadas: {meetings}\n\nReceita no pipeline: R${pipeline}k',
    ],
    variables: {
      leads: ['47', '123', '89', '234', '67'],
      sent: ['89', '234', '156', '312', '178'],
      schedule: ['amanhã 10h', 'segunda-feira', 'quinta 14h'],
      conversion: ['23', '34', '18', '41', '29'],
      revenue: ['47', '89', '134', '223', '67'],
      score: ['87', '92', '78', '95', '83'],
      profile: ['SaaS B2B mid-market', 'E-commerce scaling', 'Startup Series A', 'Enterprise SMB'],
      pain: ['processos manuais', 'falta de dados', 'CAC alto', 'churn elevado'],
      solution: ['automação completa', 'dashboard unificado', 'agentes de IA', 'analytics avançado'],
      action: ['demo personalizada', 'trial gratuito', 'proposta customizada', 'case study relevante'],
      closeRate: ['67', '45', '78', '89', '52'],
      openRate: ['42', '67', '38', '71', '55'],
      replies: ['23', '45', '18', '67', '34'],
      meetings: ['8', '15', '5', '23', '12'],
      pipeline: ['234', '567', '890', '123', '456'],
    },
    activityTemplates: [
      'Sales Automator qualificou {leads} novos leads',
      'Sales Automator enviou sequência de outreach para {sent} contatos',
      'Sales Automator agendou {meetings} demos',
      'Sales Automator fechou deal de R${revenue}k',
      'Sales Automator otimizou funil de conversão',
    ],
  },

  'ui-ux-designer': {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    emoji: '🎨',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'visual-creative',
    systemPrompt: 'You are a UI/UX Designer. Talk about colors, layouts, and visual design.',
    responseTemplates: [
      'Design system atualizado para {component}!\n\nPaleta: {colorPrimary} (primary) + {colorSecondary} (accent)\nTipografia: {font} {fontSize}px\nEspaçamento: {spacing}px grid\n\nResultado: {result}. Acessibilidade: WCAG {wcag} ✓',
      'Wireframe criado para {page}:\n\nLayout: {layout}\nHierarquia visual: {hierarchy}\nCTA principal: {cta} — cor {ctaColor}\nMobile-first: {mobile}\n\nUX score estimado: {uxScore}/10',
      'Análise de usabilidade de {component}:\n• Problema: {problem}\n• Solução: {solution}\n• Impacto esperado: +{improvement}% em {metric}\n\nProtótipo: pronto para teste A/B',
    ],
    variables: {
      component: ['dashboard principal', 'modal de tarefas', 'sidebar de navegação', 'card de agente', 'formulário de chat'],
      colorPrimary: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
      colorSecondary: ['#a78bfa', '#34d399', '#60a5fa', '#f472b6', '#fb923c'],
      font: ['Inter', 'Geist', 'Plus Jakarta Sans', 'DM Sans'],
      fontSize: ['14', '15', '16', '13'],
      spacing: ['4', '8', '12', '16'],
      result: ['interface mais limpa e focada', 'hierarquia visual clara', 'experiência fluída', 'design consistente'],
      wcag: ['AA', 'AAA'],
      page: ['tela de login', 'dashboard home', 'página de agentes', 'relatórios', 'configurações'],
      layout: ['grid 12 colunas', 'flexbox responsivo', 'sidebar + main content', 'cards masonry'],
      hierarchy: ['F-pattern', 'Z-pattern', 'centro focal único'],
      cta: ['Começar agora', 'Ver demo', 'Criar conta', 'Explorar agentes'],
      ctaColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
      mobile: ['✓ otimizado', '✓ touch-friendly', '✓ responsivo'],
      uxScore: ['8.7', '9.1', '7.8', '9.4', '8.3'],
      problem: ['botão de CTA pouco visível', 'formulário muito longo', 'navegação confusa', 'loading sem feedback'],
      solution: ['aumentar contraste e tamanho', 'dividir em etapas', 'breadcrumbs claros', 'skeleton screen'],
      improvement: ['34', '67', '45', '23', '89'],
      metric: ['conversão', 'engajamento', 'retenção', 'tempo na página'],
    },
    activityTemplates: [
      'UI/UX Designer criou wireframe para {page}',
      'UI/UX Designer atualizou design system com novas cores',
      'UI/UX Designer otimizou {component} para mobile',
      'UI/UX Designer conduziu teste de usabilidade',
      'UI/UX Designer publicou protótipo no Figma',
    ],
  },

  'senior-frontend': {
    id: 'senior-frontend',
    name: 'Senior Frontend',
    emoji: '⚡',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'technical-react',
    systemPrompt: 'You are a Senior Frontend Developer. Talk about React components, performance.',
    responseTemplates: [
      'Componente `{component}` implementado!\n\nStack: React 18 + TypeScript + {library}\nPerformance: {perf}ms render, {bundle}kb bundle\nTestes: {tests} casos cobertos\n\n```tsx\n// Hook personalizado criado\nuse{hookName}() — reutilizável em {reuse} componentes\n```',
      'Otimização de performance concluída:\n• Bundle size: -{bundleReduction}kb (-{percent}%)\n• LCP: {lcp}ms (era {lcpBefore}ms)\n• FID: {fid}ms\n• CLS: {cls}\n\nLighthouse score: {lighthouse}/100 ⚡',
      'PR aberto: feat/{feature}\n\nAlterações:\n• {change1}\n• {change2}\n• {change3}\n\nCobertura de testes: {coverage}%\nReviewer: pendente',
    ],
    variables: {
      component: ['AgentCard', 'TaskModal', 'MetricsDashboard', 'ChatInterface', 'ActivityFeed', 'StatusBadge'],
      library: ['Zustand', 'React Query', 'Framer Motion', 'Tailwind CSS', 'Radix UI'],
      perf: ['12', '8', '23', '5', '16'],
      bundle: ['14.2', '8.7', '23.1', '11.4', '19.8'],
      tests: ['12', '8', '23', '15', '19'],
      hookName: ['AgentStatus', 'TaskManager', 'MetricsPoller', 'SocketConnection', 'ChatHistory'],
      reuse: ['3', '5', '8', '2', '4'],
      bundleReduction: ['45', '23', '67', '34', '89'],
      percent: ['23', '34', '45', '18', '56'],
      lcp: ['890', '1200', '750', '1050'],
      lcpBefore: ['2100', '1800', '1450', '2300'],
      fid: ['12', '8', '23', '5'],
      cls: ['0.02', '0.05', '0.01', '0.08'],
      lighthouse: ['94', '87', '96', '91', '98'],
      feature: ['agent-realtime-status', 'task-kanban-view', 'chat-streaming', 'metrics-charts'],
      change1: ['Implementado WebSocket reconnect automático', 'Lazy loading em rotas pesadas', 'Virtual scroll em listas longas'],
      change2: ['Memoização de componentes críticos', 'Code splitting por rota', 'Prefetch de dados críticos'],
      change3: ['Testes E2E adicionados', 'Storybook atualizado', 'Documentação de componentes'],
      coverage: ['87', '92', '78', '95', '83'],
    },
    activityTemplates: [
      'Senior Frontend implementou componente {component}',
      'Senior Frontend otimizou bundle: -{bundleReduction}kb',
      'Senior Frontend corrigiu bug de performance no {component}',
      'Senior Frontend fez code review de {tests} PRs',
      'Senior Frontend atualizou dependências do projeto',
    ],
  },

  'senior-backend': {
    id: 'senior-backend',
    name: 'Senior Backend',
    emoji: '🔧',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'technical-backend',
    systemPrompt: 'You are a Senior Backend Developer. Talk about APIs, databases, and performance.',
    responseTemplates: [
      'API endpoint `{method} {endpoint}` implementado!\n\nDatabase: {db} query em {queryTime}ms\nCache: {cache} (TTL: {ttl}s)\nRate limit: {rateLimit} req/min\n\nLoad test: {throughput} req/s suportados ✓',
      'Otimização de banco de dados:\n• Query anterior: {queryBefore}ms\n• Query otimizada: {queryAfter}ms (-{improvement}%)\n• Índice adicionado: {index}\n• Cache hit rate: {cacheHit}%\n\nEconomia estimada: {savings}/mês em infra',
      'Microsserviço `{service}` deployado:\n\nEndpoints: {endpoints}\nP95 latency: {p95}ms\nDisponibilidade: {availability}%\nErros: {errorRate}%\n\nMonitoramento: {monitoring} configurado',
    ],
    variables: {
      method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      endpoint: ['/api/agents/status', '/api/tasks/create', '/api/metrics/realtime', '/api/chat/stream', '/api/github/sync'],
      db: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase'],
      queryTime: ['2.3', '8.7', '1.2', '4.5', '0.8'],
      cache: ['Redis implementado', 'In-memory cache ativo', 'CDN configurado'],
      ttl: ['60', '300', '900', '3600', '86400'],
      rateLimit: ['100', '500', '1000', '50', '200'],
      throughput: ['2,847', '1,234', '5,432', '890', '3,891'],
      queryBefore: ['890', '1200', '450', '2300'],
      queryAfter: ['45', '89', '23', '120'],
      improvement: ['94', '87', '95', '91'],
      index: ['agents_status_idx', 'tasks_created_at_idx', 'messages_agent_id_idx'],
      cacheHit: ['87', '92', '78', '95'],
      savings: ['R$340', 'R$890', 'R$1.2k', 'R$230'],
      service: ['agent-coordinator', 'task-manager', 'metrics-collector', 'github-sync'],
      endpoints: ['12', '8', '5', '23', '15'],
      p95: ['45', '89', '23', '120', '67'],
      availability: ['99.9', '99.7', '99.99', '99.5'],
      errorRate: ['0.01', '0.05', '0.001', '0.08'],
      monitoring: ['Datadog', 'Grafana', 'New Relic', 'Sentry'],
    },
    activityTemplates: [
      'Senior Backend implementou endpoint {method} {endpoint}',
      'Senior Backend otimizou query: -{improvement}% de latência',
      'Senior Backend configurou cache Redis com TTL {ttl}s',
      'Senior Backend deployou microsserviço {service}',
      'Senior Backend corrigiu memory leak em produção',
    ],
  },

  'browser-use': {
    id: 'browser-use',
    name: 'Browser Agent',
    emoji: '🌐',
    status: 'standby',
    currentTask: null,
    tasksCompleted: 0,
    uptime: 0,
    messages: [],
    personality: 'action-reporter',
    systemPrompt: 'You are a Browser Agent. Report actions executed and URLs visited.',
    responseTemplates: [
      'Sessão de navegação concluída:\n\n→ Acessou: {url1}\n→ Extraiu: {data1}\n→ Acessou: {url2}\n→ Extraiu: {data2}\n\nTotal: {pages} páginas | {time}s | {dataPoints} dados coletados',
      'Automação web executada em {site}:\n\n✓ Login realizado\n✓ Navegou para: {page}\n✓ Extraiu {records} registros\n✓ Exportou para: {format}\n\nTempo total: {time}s',
      'Web scraping concluído:\n\nURL: {url1}\nDados coletados:\n• {data1}\n• {data2}\n• {data3}\n\nQualidade dos dados: {quality}% | Próxima execução: {schedule}',
    ],
    variables: {
      url1: ['https://linkedin.com/search/results', 'https://producthunt.com/topics/ai', 'https://crunchbase.com/discover', 'https://g2.com/categories/ai-agents'],
      data1: ['234 perfis de decision makers', '89 produtos lançados esta semana', '45 startups com funding recente', '127 reviews de concorrentes'],
      url2: ['https://similarweb.com/website/', 'https://semrush.com/analytics/', 'https://glassdoor.com/Reviews/', 'https://trustpilot.com/review/'],
      data2: ['tráfego mensal: 2.3M visitas', 'keywords orgânicas: 1,247', 'sentimento: 78% positivo', 'NPS implícito: 67'],
      pages: ['12', '8', '23', '5', '16'],
      time: ['45', '120', '67', '234', '89'],
      dataPoints: ['1,247', '890', '3,456', '567', '2,123'],
      site: ['LinkedIn Sales Navigator', 'Google Maps Business', 'Yelp', 'Amazon', 'Facebook Ads Library'],
      page: ['painel de anúncios', 'lista de leads', 'relatório de performance', 'configurações de campanha'],
      records: ['234', '89', '456', '1,234', '678'],
      format: ['CSV', 'JSON', 'Google Sheets', 'Airtable'],
      data3: ['Preço médio: R$127/mês', 'Avaliação média: 4.2/5', 'Tempo de resposta: 2h'],
      quality: ['87', '92', '78', '95', '83'],
      schedule: ['6 horas', '24 horas', '12 horas', '48 horas'],
    },
    activityTemplates: [
      'Browser Agent acessou {url1} e coletou {dataPoints} dados',
      'Browser Agent executou automação em {site}',
      'Browser Agent extraiu {records} registros de leads',
      'Browser Agent monitorou {pages} páginas de concorrentes',
      'Browser Agent exportou dados para {format}',
    ],
  },
};

const systemActivityTemplates = [
  'Sistema inicializou rotina de monitoramento',
  'Backup automático de configurações realizado',
  'Sincronização com GitHub concluída',
  'Health check de todos os agentes: OK',
  'Cache do sistema limpo e reconstruído',
  'Relatório diário gerado e salvo',
  'Conexão com APIs externas verificada',
  'Logs comprimidos e arquivados',
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template, variables) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (variables[key]) {
      return getRandomItem(variables[key]);
    }
    return match;
  });
}

function generateAgentResponse(agentId, userMessage) {
  const agent = agentsConfig[agentId];
  if (!agent) {
    return 'Agente não encontrado.';
  }
  const template = getRandomItem(agent.responseTemplates);
  return fillTemplate(template, agent.variables);
}

function generateAgentActivity(agentId) {
  const agent = agentsConfig[agentId];
  if (!agent) return null;
  const template = getRandomItem(agent.activityTemplates);
  return fillTemplate(template, { ...agent.variables, quarter: ['1', '2', '3', '4'] });
}

function generateSystemActivity() {
  return getRandomItem(systemActivityTemplates);
}

module.exports = {
  agentsConfig,
  generateAgentResponse,
  generateAgentActivity,
  generateSystemActivity,
  getRandomItem,
  fillTemplate,
};
