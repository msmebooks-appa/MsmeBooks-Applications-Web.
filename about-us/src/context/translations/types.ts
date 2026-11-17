export type LanguageCode = 'en' | 'fr' | 'sw';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export interface ProblemComparisonTranslation {
  id: string;
  challenge: string;
  challengeDesc: string;
  solution: string;
  solutionDesc: string;
  impactMetric: string;
}

export interface SolutionTranslation {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  iconName: string;
  keyFeatures: string[];
  businessImpact: string;
  targetUsers: string;
}

export interface RegionalHubTranslation {
  id: string;
  region: string;
  markets: string;
  focus: string;
  currencies: string;
  taxCapabilities: string;
}

export interface IndustryTranslation {
  id: string;
  name: string;
  category: 'commerce' | 'hospitality' | 'services' | 'growth';
  description: string;
  keyCapability: string;
  iconName: string;
}

export interface CoreValueTranslation {
  number: string;
  title: string;
  description: string;
}

export interface CommitmentTranslation {
  num: string;
  title: string;
  sub: string;
  detail: string;
  metric: string;
}

export interface TrustPillarTranslation {
  title: string;
  subtitle: string;
  description: string;
  principles: string[];
}

export interface StoryTranslation {
  id: string;
  name: string;
  category: string;
  country: string;
  flag: string;
  monthlyNgnVolume: number;
  volumeLabel: string;
  businessChallenge: string;
  solutionUsed: string;
  customerOutcome: string;
  quote: string;
  fullNarrative: string;
  keyMetrics: { label: string; value: string }[];
}

export interface FaqTranslation {
  id: string;
  question: string;
  answer: string;
}

export interface Translations {
  // Language Selector
  lang_menu_title: string;
  lang_menu_footer: string;

  // Navigation
  nav_products: string;
  nav_solutions: string;
  nav_industries: string;
  nav_partners: string;
  nav_about: string;
  nav_faq: string;
  nav_book_demo: string;
  nav_get_started: string;
  nav_start_free: string;
  nav_prod_accounting_title: string;
  nav_prod_accounting_desc: string;
  nav_prod_pos_title: string;
  nav_prod_pos_desc: string;
  nav_prod_inventory_title: string;
  nav_prod_inventory_desc: string;
  nav_mobile_network: string;
  nav_mobile_tools: string;
  nav_mobile_industries: string;
  nav_mobile_overview: string;
  nav_mobile_story: string;
  nav_mobile_mission: string;
  nav_mobile_problem: string;
  nav_mobile_capabilities: string;
  nav_mobile_africa: string;
  nav_mobile_partners: string;
  nav_mobile_security: string;
  nav_mobile_faqs: string;
  nav_mobile_trial: string;

  // Hero
  hero_eyebrow: string;
  hero_eyebrow_sub: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_desc: string;
  hero_cta_discover: string;
  hero_cta_start: string;
  hero_trust_allinone: string;
  hero_trust_allinone_sub: string;
  hero_trust_multibranch: string;
  hero_trust_multibranch_sub: string;
  hero_trust_security: string;
  hero_trust_security_sub: string;
  hero_floating_rev: string;
  hero_floating_engine: string;
  hero_floating_connected: string;
  hero_floating_pos: string;
  hero_floating_inventory: string;
  hero_floating_warehouses: string;
  hero_floating_reconciled: string;
  hero_floating_sync: string;
  hero_floating_badge: string;

  // Dynamic Impact Counters Section (below HeroSection)
  counters_eyebrow: string;
  counters_live_badge: string;
  counters_businesses_label: string;
  counters_businesses_sub: string;
  counters_businesses_trend: string;
  counters_countries_label: string;
  counters_countries_sub: string;
  counters_countries_trend: string;
  counters_transactions_label: string;
  counters_transactions_sub: string;
  counters_transactions_trend: string;

  // Story
  story_eyebrow: string;
  story_title_1: string;
  story_title_2: string;
  story_p1: string;
  story_p2_bold: string;
  story_p3: string;
  story_p4: string;
  story_quote: string;
  story_philosophy: string;
  story_tab_exec: string;
  story_tab_commerce: string;
  story_caption_exec: string;
  story_caption_comm: string;
  story_caption_tag_left: string;
  story_caption_tag_right: string;
  story_p1_title: string;
  story_p1_desc: string;
  story_p2_title: string;
  story_p2_desc: string;
  story_p3_title: string;
  story_p3_desc: string;

  // Mission Vision
  mv_eyebrow: string;
  mv_title_1: string;
  mv_title_2: string;
  mv_desc: string;
  mv_mission_badge: string;
  mv_mission_title: string;
  mv_mission_text: string;
  mv_mission_footer: string;
  mv_vision_badge: string;
  mv_vision_title: string;
  mv_vision_text: string;
  mv_vision_footer: string;
  mv_purpose_badge: string;
  mv_purpose_title: string;
  mv_purpose_text: string;
  mv_purpose_footer: string;

  // Problem Solving
  prob_eyebrow: string;
  prob_title_1: string;
  prob_title_2: string;
  prob_desc: string;
  prob_col_challenge: string;
  prob_col_transition: string;
  prob_col_solution: string;
  prob_footer_text: string;
  prob_cta: string;
  prob_items: ProblemComparisonTranslation[];

  // What We Do
  wwd_eyebrow: string;
  wwd_title_1: string;
  wwd_title_2: string;
  wwd_desc: string;
  wwd_btn_explore: string;
  wwd_solutions: SolutionTranslation[];

  // Built In Africa
  africa_eyebrow: string;
  africa_title_1: string;
  africa_title_2: string;
  africa_desc: string;
  africa_photo_label: string;
  africa_photo_caption: string;
  africa_vision_tag: string;
  africa_statement: string;
  africa_statement_desc: string;
  africa_hubs_title: string;
  africa_hubs_desc: string;
  africa_active_label: string;
  africa_scope_label: string;
  africa_landscape_label: string;
  africa_compliance_label: string;
  africa_interconnect_label: string;
  africa_latency_label: string;
  africa_hubs: RegionalHubTranslation[];

  // Who We Serve
  serve_eyebrow: string;
  serve_title_1: string;
  serve_title_2: string;
  serve_desc: string;
  serve_filter_all: string;
  serve_filter_commerce: string;
  serve_filter_hospitality: string;
  serve_filter_services: string;
  serve_filter_growth: string;
  serve_key_focus: string;
  serve_btn: string;
  serve_industries: IndustryTranslation[];

  // Core Values
  values_eyebrow: string;
  values_title_1: string;
  values_title_2: string;
  values_desc: string;
  values_footer_label: string;
  values_items: CoreValueTranslation[];

  // People & Thinking
  people_eyebrow: string;
  people_title_1: string;
  people_title_2: string;
  people_p1: string;
  people_p2: string;
  people_pillar1_title: string;
  people_pillar1_desc: string;
  people_pillar2_title: string;
  people_pillar2_desc: string;
  people_pillar3_title: string;
  people_pillar3_desc: string;
  people_photo_tag: string;
  people_photo_caption: string;

  // Partners
  partners_eyebrow: string;
  partners_title_1: string;
  partners_title_2: string;
  partners_desc: string;
  partners_apply_btn: string;
  partners_banner_title: string;
  partners_banner_desc: string;
  partners_cta: string;
  partners_categories: {
    id: string;
    name: string;
    role: string;
    benefit: string;
    iconName: string;
  }[];

  // Commitments
  commit_eyebrow: string;
  commit_title_1: string;
  commit_title_2: string;
  commit_desc: string;
  commit_step_prefix: string;
  commit_items: CommitmentTranslation[];

  // Trust
  trust_eyebrow: string;
  trust_title_1: string;
  trust_title_2: string;
  trust_desc: string;
  trust_pillars: TrustPillarTranslation[];
  trust_banner_text: string;
  trust_link_privacy: string;
  trust_link_terms: string;
  trust_link_security: string;

  // Stories
  stories_eyebrow: string;
  stories_title_1: string;
  stories_title_2: string;
  stories_desc: string;
  stories_note: string;
  stories_badge: string;
  stories_challenge_label: string;
  stories_outcome_label: string;
  stories_btn_read: string;
  stories_explore_btn: string;
  stories_items: StoryTranslation[];

  // FAQs
  faq_eyebrow: string;
  faq_title_1: string;
  faq_title_2: string;
  faq_desc: string;
  faq_help_title: string;
  faq_help_desc: string;
  faq_items: FaqTranslation[];

  // Final CTA
  cta_eyebrow: string;
  cta_title_1: string;
  cta_title_2: string;
  cta_desc: string;
  cta_btn_primary: string;
  cta_btn_secondary: string;
  cta_btn_third: string;
  cta_badge_1: string;
  cta_badge_2: string;
  cta_badge_3: string;

  // Footer & Brand
  footer_desc: string;
  footer_col_company: string;
  footer_col_solutions: string;
  footer_col_resources: string;
  footer_col_legal: string;
  footer_link_about: string;
  footer_link_mission: string;
  footer_link_thinking: string;
  footer_link_partners: string;
  footer_link_stories: string;
  footer_link_contact: string;
  footer_link_accounting: string;
  footer_link_pos: string;
  footer_link_inventory: string;
  footer_link_multibranch: string;
  footer_link_hospitality: string;
  footer_link_analytics: string;
  footer_link_faqs: string;
  footer_link_playbooks: string;
  footer_link_tour: string;
  footer_link_prompt: string;
  footer_link_docs: string;
  footer_link_privacy: string;
  footer_link_terms: string;
  footer_link_refund: string;
  footer_link_security: string;
  footer_link_governance: string;
  footer_copyright: string;
  closing_statement: string;
  back_to_top: string;

  // Chat Widget
  chat_agent_online: string;
  chat_open_title: string;
  chat_button_label: string;
  chat_button_close: string;
  chat_title: string;
  chat_tab_live: string;
  chat_tab_channels: string;
  chat_hours_tag: string;
  chat_input_placeholder: string;
  chat_welcome_msg: string;
  chat_instant_channels: string;
  chat_phone_label: string;
  chat_email_label: string;
  chat_operating_hours_title: string;
  chat_operating_hours_text: string;
  chat_enterprise_note: string;
  chat_return_to_chat: string;
  chat_faq_hint: string;
  chat_secure_connection: string;
  chat_q1: string;
  chat_q2: string;
  chat_q3: string;
  chat_simulated_reply: string;

  // Connection Status
  conn_online: string;
  conn_offline: string;
  conn_sync_active: string;
  conn_local_active: string;
  conn_offline_banner: string;
  conn_test_toggle: string;
  conn_reconnect: string;
  conn_status_title: string;
  conn_network_desc: string;
  conn_fast_cdn: string;
  conn_auto_sync: string;

  // Left Scroll Nav
  scroll_nav_title: string;
  scroll_nav_current: string;
  scroll_nav_hint: string;
  scroll_nav_top: string;
  scroll_nav_bottom: string;
  scroll_nav_read: string;
}
