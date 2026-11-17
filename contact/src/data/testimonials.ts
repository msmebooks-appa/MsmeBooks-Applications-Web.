export interface ClientTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  countryCode: string;
  flag: string;
  sector: 'Retail' | 'Agribusiness' | 'Hospitality' | 'Logistics' | 'Healthcare' | 'Fintech';
  scale: string;
  metric: string;
  metricLabel: string;
  secondaryMetric: string;
  secondaryMetricLabel: string;
  quote: {
    en: string;
    fr: string;
    pt: string;
    es: string;
  };
  modules: string[];
  logoType: 'primemart' | 'rifthighlands' | 'oasis' | 'ubuntu' | 'kigali' | 'sahelpay';
  accentColor: string;
  avatarInitials: string;
}

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'primemart-superstores',
    name: 'Amara Okafor',
    role: 'Managing Director & Co-Founder',
    company: 'PrimeMart Superstores',
    location: 'Lagos & Abuja, Nigeria',
    countryCode: 'NG',
    flag: '🇳🇬',
    sector: 'Retail',
    scale: '8 Supermarket Branches · 64 POS Registers · 120 Staff',
    metric: '18% Leakage Eliminated',
    metricLabel: 'Shrinkage & Variance Recovery',
    secondaryMetric: '14 hrs/week',
    secondaryMetricLabel: 'Reconciliation Time Saved',
    quote: {
      en: 'Before MsmeBooks, branch reconciliation took three exhausting days each weekend across our 8 supermarket branches. With real-time offline-capable POS and unified ledger syncing, our stock reconciliation now takes 15 minutes, and inventory variance dropped to near zero.',
      fr: 'Avant MsmeBooks, la réconciliation financière prenait trois jours entiers chaque week-end pour nos 8 supermarchés. Grâce au point de vente hors-ligne et à la synchronisation automatique des grands livres, nos rapprochements se font en 15 minutes avec zéro perte de stock.',
      pt: 'Antes do MsmeBooks, a reconciliação entre as nossas 8 lojas demorava três dias inteiros a cada fim de semana. Com o POS offline e a sincronização em tempo real na nuvem, a conferência de stock agora demora 15 minutos e as quebras foram praticamente eliminadas.',
      es: 'Antes de MsmeBooks, conciliar nuestras 8 sucursales de supermercados requería tres días enteros cada fin de semana. Con el TPV con soporte sin conexión y la sincronización contable unificada, ahora tardamos 15 minutos y las pérdidas bajaron casi a cero.',
    },
    modules: ['Multi-Branch POS', 'Inventory & Barcoding', 'Unified General Ledger'],
    logoType: 'primemart',
    accentColor: '#70C038',
    avatarInitials: 'AO',
  },
  {
    id: 'rift-highlands-coffee',
    name: 'David Mwangi',
    role: 'Chief Operations Officer',
    company: 'Rift Highlands Coffee Co-op',
    location: 'Nairobi & Eldoret, Kenya',
    countryCode: 'KE',
    flag: '🇰🇪',
    sector: 'Agribusiness',
    scale: '3 Processing Mills · 4,200 Smallholder Farmers',
    metric: 'KES 420M+',
    metricLabel: 'Export Volume Managed',
    secondaryMetric: '100% Tax Compliant',
    secondaryMetricLabel: 'Automated KRA eTIMS Invoicing',
    quote: {
      en: 'Exporting specialty coffee while managing mobile money disbursements to 4,200 farmers used to be an administrative nightmare. MsmeBooks unified our M-Pesa payouts, multi-currency invoicing in USD & EUR, and automated KRA eTIMS tax compliance effortlessly.',
      fr: 'Exporter du café de spécialité tout en gérant les paiements mobiles vers 4 200 caféiculteurs était un casse-tête administratif. MsmeBooks a réuni nos paiements M-Pesa, la facturation multidevise en USD et EUR, et la conformité eTIMS de manière fluide.',
      pt: 'Exportar café especial enquanto geríamos pagamentos móveis a 4.200 pequenos agricultores era caótico. O MsmeBooks integrou pagamentos M-Pesa, faturação multimoeda em USD e EUR e conformidade fiscal automatizada com total rigor.',
      es: 'Exportar café de especialidad gestionando pagos móviles a 4,200 agricultores era un desafío enorme. MsmeBooks unificó nuestros desembolsos M-Pesa, facturación multimoneda en USD y EUR, y cumplimiento fiscal sin complicaciones.',
    },
    modules: ['Multi-Currency Export', 'Mobile Money Payouts', 'KRA eTIMS Tax Engine'],
    logoType: 'rifthighlands',
    accentColor: '#0B3B82',
    avatarInitials: 'DM',
  },
  {
    id: 'oasis-palm-coast',
    name: 'Kwame Mensah',
    role: 'Group General Manager',
    company: 'Oasis Palm Coast Hotels & Resorts',
    location: 'Accra & Cape Coast, Ghana',
    countryCode: 'GH',
    flag: '🇬🇭',
    sector: 'Hospitality',
    scale: '3 Coastal Properties · 140 Rooms & Dining Outlets',
    metric: '0 Downtime',
    metricLabel: 'During Coastal Subsea Outages',
    secondaryMetric: '99.4%',
    secondaryMetricLabel: 'Guest Billing & Folio Accuracy',
    quote: {
      en: 'When subsea fiber cable outages hit the West African coast, other hotels were paralyzed. MsmeBooks\' offline resilience kicked in instantly: front desk room folios, restaurant POS, and guest billing operated smoothly without internet, auto-syncing once satellite links restored.',
      fr: 'Lorsque les pannes de câbles sous-marins ont frappé la côte ouest-africaine, d\'autres établissements étaient à l\'arrêt. La résilience hors-ligne de MsmeBooks a pris le relais instantanément : réservations, bar-restaurant et factures clients ont fonctionné sans interruption.',
      pt: 'Quando houve cortes no cabo submarino na costa da África Ocidental, vários hotéis paralisaram. A resiliência offline do MsmeBooks funcionou de imediato: o balcão, o restaurante e a faturação aos hóspedes operaram normalmente, sincronizando logo que a ligação voltou.',
      es: 'Cuando fallaron los cables submarinos en la costa de África Occidental, otros hoteles quedaron bloqueados. La resiliencia offline de MsmeBooks funcionó de inmediato: recepción, folios y cobros en restaurante continuaron sin fallas.',
    },
    modules: ['Hotel PMS & Folios', 'Offline Restaurant POS', 'Audit Trail Reporting'],
    logoType: 'oasis',
    accentColor: '#0284C7',
    avatarInitials: 'KM',
  },
  {
    id: 'ubuntu-crossborder',
    name: 'Naledi Khumalo',
    role: 'Chief Financial Officer',
    company: 'Ubuntu CrossBorder Freight',
    location: 'Johannesburg & Durban, South Africa',
    countryCode: 'ZA',
    flag: '🇿🇦',
    sector: 'Logistics',
    scale: '75 Long-Haul Fleet Units · 6 SADC African Corridors',
    metric: '24% Cost Savings',
    metricLabel: 'Fleet Operational Waste Cut',
    secondaryMetric: 'Real-Time Audit',
    secondaryMetricLabel: 'Border Fuel & Toll Disbursements',
    quote: {
      en: 'Managing toll fees, diesel cards, and cross-border invoicing across SADC corridors used to require three different software subscriptions. MsmeBooks consolidated trip manifests, multi-currency expenses, and SARS tax filings into one command centre.',
      fr: 'Gérer les péages, les cartes carburant et la facturation transfrontalière à travers les corridors de la SADC nécessitait trois logiciels distincts. MsmeBooks a regroupé nos manifestes de transport, nos dépenses multidevises et nos déclarations SARS dans un seul tableau de bord.',
      pt: 'Gerir portagens, abastecimentos e faturação aduaneira nos corredores da SADC exigia três softwares diferentes. O MsmeBooks consolidou manifestos de carga, despesas multimoeda e conformidade com a SARS num único centro de comando.',
      es: 'Gestionar peajes, combustible y facturación aduanera en los corredores del sur de África requería múltiples programas. MsmeBooks consolidó manifiestos de viaje, gastos multimoneda e informes tributarios en un solo centro de mando.',
    },
    modules: ['Fleet Expense Tracking', 'Cross-Border Invoicing', 'SARS VAT Compliance'],
    logoType: 'ubuntu',
    accentColor: '#D97706',
    avatarInitials: 'NK',
  },
  {
    id: 'kigali-pharmacare',
    name: 'Dr. Jean-Luc Hakizimana',
    role: 'Chief Pharmacist & Managing Director',
    company: 'Kigali PharmaCare Logistics',
    location: 'Kigali, Rwanda & Goma, DRC',
    countryCode: 'RW',
    flag: '🇷🇼',
    sector: 'Healthcare',
    scale: '14 Distribution Warehouses · 280 Hospital Clients',
    metric: '0 Expired Losses',
    metricLabel: 'FEFO Expiry Management',
    secondaryMetric: '100% Traceability',
    secondaryMetricLabel: 'Health Authority Regulatory Audit',
    quote: {
      en: 'In pharmaceutical distribution, batch expiry errors destroy margins and risk lives. MsmeBooks\' automated FEFO (First-Expired, First-Out) inventory alerts, barcode tracking, and electronic billing completely eliminated expired stock write-offs.',
      fr: 'Dans la distribution pharmaceutique, les erreurs de date de péremption détruisent les marges et menacent des vies. Les alertes FEFO automatiques, la traçabilité par code-barres et la facturation électronique de MsmeBooks ont éradiqué les pertes sur médicaments périmés.',
      pt: 'Na distribuição farmacêutica, erros de validade destroem margens e colocam vidas em risco. Os alertas FEFO de inventário, o rastreio por código de barras e a faturação eletrónica do MsmeBooks eliminaram totalmente perdas por produtos expirados.',
      es: 'En la distribución farmacéutica, los errores de caducidad destruyen márgenes y ponen en riesgo vidas. Las alertas automáticas de rotación por fecha, códigos de barras y facturación de MsmeBooks eliminaron por completo las mermas por vencimiento.',
    },
    modules: ['FEFO Batch Tracking', 'Barcode Dispatch', 'Rwanda EBM v2 Billing'],
    logoType: 'kigali',
    accentColor: '#059669',
    avatarInitials: 'JH',
  },
  {
    id: 'sahelpay-fintech',
    name: 'Aïssatou Diallo',
    role: 'Co-Founder & Head of Operations',
    company: 'SahelPay Merchant Network',
    location: 'Dakar, Senegal & Abidjan, Côte d\'Ivoire',
    countryCode: 'SN',
    flag: '🇸🇳',
    sector: 'Fintech',
    scale: '1,800 Active Field Terminals · 2.4M Tx/Month',
    metric: 'SYSCOHADA Ready',
    metricLabel: 'West African Accounting Standard',
    secondaryMetric: '< 5 Seconds',
    secondaryMetricLabel: 'Float & Liquidity Reconciliation',
    quote: {
      en: 'Adapting generic Western accounting software to West African SYSCOHADA standards was a costly bottleneck. MsmeBooks came pre-configured for regional tax rules, mobile money float balances, and bilingual French-English reporting out of the box.',
      fr: 'Adapter des logiciels comptables occidentaux aux normes ouest-africaines SYSCOHADA était un gouffre financier. MsmeBooks était déjà pré-configuré pour la fiscalité régionale, la réconciliation de float mobile money et les rapports bilingues français-anglais.',
      pt: 'Adaptar softwares de contabilidade ocidentais aos regulamentos da África Ocidental era extremamente caro. O MsmeBooks veio pré-configurado para regras fiscais regionais, gestão de liquidez em moeda móvel e relatórios bilingues prontos a usar.',
      es: 'Adaptar software contable tradicional a los estándares SYSCOHADA en África Occidental era muy costoso. MsmeBooks vino preconfigurado para normas tributarias regionales, conciliación de saldos móviles y reportes bilingües.',
    },
    modules: ['SYSCOHADA Standard', 'Float Reconciliation', 'High-Volume API Invoicing'],
    logoType: 'sahelpay',
    accentColor: '#4F46E5',
    avatarInitials: 'AD',
  },
];
