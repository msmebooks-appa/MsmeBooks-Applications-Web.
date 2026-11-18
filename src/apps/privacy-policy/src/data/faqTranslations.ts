import { SupportedLanguage } from './translations';

export interface TranslatedFaq {
  q: string;
  a: string;
}

export const FAQ_TRANSLATIONS: Record<SupportedLanguage, TranslatedFaq[]> = {
  en: [
    {
      q: "Does MsmeBooks sell my personal or business data?",
      a: "No. MsmeBooks does not sell, rent, monetize, or trade your personal information or business records to any third party for commercial gain. Customer data is processed strictly to deliver our cloud accounting, POS, and inventory services."
    },
    {
      q: "How does MsmeBooks protect my financial and business ledgers?",
      a: "We implement defense-in-depth security, including AES-256 encryption for data at rest, TLS 1.3 encryption in transit with perfect forward secrecy, automated snapshots every 4 hours, isolated multi-tenant databases, and role-based access control (RBAC)."
    },
    {
      q: "Who owns the financial data and records I enter into MsmeBooks?",
      a: "You retain 100% sole ownership of your business data. MsmeBooks acts as a Data Processor for your business records and provides unrestricted continuous export tools in CSV, Excel, PDF, and JSON formats at no exit fee."
    },
    {
      q: "Is MsmeBooks compliant with the Nigeria Data Protection Act (NDPA 2023)?",
      a: "Yes. MsmeBooks is fully aligned with the NDPA 2023. We maintain designated Data Protection Officers, perform annual compliance audits, register with the Nigeria Data Protection Commission (NDPC), and support statutory data subject rights."
    },
    {
      q: "How does MsmeBooks handle cross-border data transfers outside Nigeria?",
      a: "All international data transfers comply with Section 41-43 of the NDPA 2023. Transfers to foreign cloud infrastructure occur under Standard Contractual Clauses (SCCs), Binding Corporate Rules, or adequacy decisions ensuring equivalent data protection."
    },
    {
      q: "How long is my business information retained if I cancel my subscription?",
      a: "Upon cancellation, your live account enters a 30-day grace period. After 30 days, personal account credentials are deleted, except where fiscal, tax, and accounting statutory retention laws (such as 6-year mandates under Nigerian tax law) require archived preservation."
    },
    {
      q: "Does MsmeBooks train AI models using my private business transactions?",
      a: "No. Customer ledger entries, invoices, inventory figures, and customer contacts are never used to train public machine learning or foundational AI models. AI features (like receipt scanning and auto-categorization) process data transiently and securely."
    },
    {
      q: "How can I exercise my Data Subject Rights (access, rectification, erasure)?",
      a: "You can submit a formal request via our interactive Privacy Rights Centre, email our Data Protection Officer at dpo@msmebooks.org, or file an in-app request through your account settings. All requests are acknowledged within 72 hours."
    },
    {
      q: "Are my credit card and bank account details stored on your servers?",
      a: "No. MsmeBooks does not store raw credit card numbers or banking PINs. All payment transactions are processed through PCI-DSS Level 1 certified payment partners (such as Paystack and Flutterwave) using cryptographic tokenization."
    },
    {
      q: "What happens in the unlikely event of a data breach?",
      a: "MsmeBooks maintains a 24/7 Security Operations Center. In the event of a verified breach impacting personal data, we will notify the Nigeria Data Protection Commission (NDPC) and affected users within 72 hours with containment measures and guidance."
    },
    {
      q: "How does MsmeBooks ensure privacy compliance across retail POS branches?",
      a: "Our POS architecture enforces role-based access controls (RBAC) so cashiers only access required transaction screens. Customer mobile numbers collected for e-receipts are tokenized and protected from unauthorized export."
    },
    {
      q: "What rights do hotel guests have under the Hospitality PMS module?",
      a: "Hotel guest records entered into the MsmeBooks PMS module are controlled by the hospitality client (the Data Controller). Guests can request data corrections or erasure through the hotel or directly via our privacy desk under NDPA principles."
    },
    {
      q: "Can I manage cookie and analytics tracking on the website?",
      a: "Yes. You can customize cookie preferences at any time through our Cookie Preferences Center in the footer or policy sidebar. We never activate non-essential tracking cookies without your prior consent."
    },
    {
      q: "Are children's records permitted on the MsmeBooks platform?",
      a: "MsmeBooks is strictly a commercial business-to-business (B2B) SaaS platform intended for individuals aged 18 and older. We do not knowingly collect or solicit personal information from minors."
    },
    {
      q: "How can I contact the MsmeBooks Data Protection Officer (DPO)?",
      a: "You can reach our DPO team via email at dpo@msmebooks.org, call our Lagos compliance hotline at +2349158482622, or address postal correspondence to Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigeria."
    }
  ],
  fr: [
    {
      q: "MsmeBooks vend-il mes données personnelles ou professionnelles ?",
      a: "Non. MsmeBooks ne vend, ne loue, ne monétise ni n'échange aucune donnée personnelle ou grand livre d'entreprise à des tiers. Les données clients sont traitées exclusivement pour fournir nos services comptables, caisse POS et gestion de stocks."
    },
    {
      q: "Comment MsmeBooks protège-t-il mes registres financiers et comptables ?",
      a: "Nous déployons une architecture de sécurité en profondeur : chiffrement AES-256 pour les données au repos, protocole TLS 1.3 avec confidentialité persistante en transit, sauvegardes automatisées toutes les 4 heures et bases multi-locataires isolées."
    },
    {
      q: "Qui est propriétaire des données comptables saisies dans MsmeBooks ?",
      a: "Vous conservez 100% de la propriété exclusive de vos données commerciales. MsmeBooks agit en tant que sous-traitant (Data Processor) et met à disposition des outils d'export continu (CSV, Excel, PDF, JSON) sans frais de sortie."
    },
    {
      q: "MsmeBooks est-il conforme à la loi nigériane sur la protection des données (NDPA 2023) ?",
      a: "Oui. MsmeBooks est pleinement conforme à la NDPA 2023. Nous disposons d'un DPO accrédité, effectuons des audits annuels de conformité, sommes déclarés auprès de la NDPC et garantissons tous les droits légaux des personnes concernées."
    },
    {
      q: "Comment MsmeBooks encadre-t-il les transferts de données hors du Nigéria ?",
      a: "Tous les transferts internationaux respectent scrupuleusement les articles 41 à 43 de la NDPA 2023. Ils s'appuient sur des Clauses Contractuelles Types (CCT), des règles d'entreprise contraignantes et des garanties d'adéquation équivalentes."
    },
    {
      q: "Combien de temps mes données sont-elles conservées en cas de résiliation ?",
      a: "Après résiliation, votre compte entre dans une période de grâce de 30 jours. Passé ce délai, vos identifiants sont purgés, à l'exception des obligations légales fiscales (telle que la conservation légale de 6 ans pour les écritures comptables)."
    },
    {
      q: "MsmeBooks entraîne-t-il des modèles d'intelligence artificielle sur mes écritures ?",
      a: "Non. Vos écritures comptables, factures, fiches clients et stocks ne sont jamais utilisées pour entraîner des modèles d'IA publics. Les fonctionnalités d'automatisation (rapprochement, scan de reçus) traitent vos données de manière transitoire et isolée."
    },
    {
      q: "Comment puis-je exercer mes droits d'accès, rectification et effacement ?",
      a: "Vous pouvez initier une demande formelle via notre Centre des Droits, contacter notre DPO à dpo@msmebooks.org ou utiliser les paramètres de votre compte. Toutes les demandes font l'objet d'un accusé de réception sous 72 heures."
    },
    {
      q: "Mes numéros de carte bancaire et coordonnées de compte sont-ils stockés sur vos serveurs ?",
      a: "Non. MsmeBooks ne conserve aucun numéro de carte complet ni code PIN bancaire. Les règlements sont délégués à des passerelles certifiées PCI-DSS Niveau 1 (Paystack, Flutterwave) utilisant une tokenisation cryptographique sécurisée."
    },
    {
      q: "Que se passe-t-il en cas de violation de sécurité ou d'incident ?",
      a: "MsmeBooks maintient un centre de surveillance 24h/24 et 7j/7. En cas de violation avérée impactant vos données personnelles, nous notifions l'autorité NDPC et les utilisateurs concernés dans un délai strict de 72 heures avec des consignes de protection."
    },
    {
      q: "Comment la confidentialité est-elle assurée sur les caisses POS en magasin ?",
      a: "Notre logiciel POS applique des contrôles d'accès stricts (RBAC) pour limiter l'affichage aux seules fonctions d'encaissement. Les numéros des clients collectés pour les tickets électroniques sont pseudonymisés et protégés contre tout export non autorisé."
    },
    {
      q: "Quels sont les droits des clients d'hôtel dans le module hôtelier PMS ?",
      a: "Les fiches clients du module hôtelier sont sous la responsabilité de l'établissement (Responsable de Traitement). Les clients peuvent solliciter la rectification ou l'effacement de leurs fiches auprès de l'hôtel ou de notre bureau de conformité."
    },
    {
      q: "Puis-je gérer les cookies et traceurs sur le site ?",
      a: "Oui. Vous pouvez personnaliser vos choix de traceurs à tout moment via notre panneau de gestion des cookies en bas de page. Aucun cookie facultatif n'est déclenché sans votre autorisation expresse."
    },
    {
      q: "Les données des mineurs sont-elles autorisées sur MsmeBooks ?",
      a: "MsmeBooks est une plateforme B2B exclusivement réservée aux personnes majeures (18 ans et plus). Nous ne collectons intentionnellement aucune donnée auprès d'enfants ou de mineurs."
    },
    {
      q: "Comment puis-je joindre le Délégué à la Protection des Données (DPO) ?",
      a: "Vous pouvez joindre notre équipe DPO par e-mail à dpo@msmebooks.org, par téléphone à Lagos au +2349158482622, ou par voie postale : Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigéria."
    }
  ],
  pt: [
    {
      q: "A MsmeBooks vende meus dados pessoais ou empresariais?",
      a: "Não. A MsmeBooks não vende, aluga, comercializa nem monetiza seus dados pessoais ou livros contábeis com terceiros. As informações dos clientes são processadas exclusivamente para fornecer nossos serviços de contabilidade, PDV e estoque."
    },
    {
      q: "Como a MsmeBooks protege meus livros contábeis e fiscais?",
      a: "Implementamos uma arquitetura de segurança em camadas com criptografia AES-256 para dados em repouso, protocolo TLS 1.3 em trânsito com sigilo antecipado estrito, backups automatizados a cada 4 horas e bancos multi-inquilino estritamente isolados."
    },
    {
      q: "Quem é o proprietário das informações contábeis que insiro na plataforma?",
      a: "Você retém 100% da propriedade exclusiva dos dados da sua empresa. A MsmeBooks atua como Operadora (Data Processor) e oferece exportação irrestrita e contínua em formatos CSV, Excel, PDF e JSON sem taxa de encerramento."
    },
    {
      q: "A MsmeBooks está em conformidade com a Lei de Proteção de Dados da Nigéria (NDPA 2023)?",
      a: "Sim. A MsmeBooks está totalmente alinhada à NDPA 2023 e legislações internacionais correlatas. Possuímos um Encarregado de Proteção de Dados (DPO) dedicado, auditorias anuais e garantimos o exercício integral dos direitos dos titulares."
    },
    {
      q: "Como a MsmeBooks gerencia transferências internacionais de dados fora da Nigéria?",
      a: "Todas as transferências de dados além-fronteiras atendem rigorosamente aos artigos 41 a 43 da NDPA 2023, apoiadas por Cláusulas Contratuais Padrão (SCCs), regras corporativas vinculantes e garantias de equivalência de segurança."
    },
    {
      q: "Por quanto tempo minhas informações financeiras são retidas após o cancelamento?",
      a: "Após o cancelamento, sua conta entra em carência de 30 dias. Passado esse período, as credenciais pessoais são excluídas, exceto registros onde leis fiscais e contábeis exijam guarda legal (como o prazo legal de 6 anos para livros fiscais)."
    },
    {
      q: "A MsmeBooks treina inteligência artificial com os dados das minhas faturas e transações?",
      a: "Não. Lançamentos contábeis, faturas, estoques e listas de clientes nunca são utilizados para alimentar ou treinar modelos públicos de IA. Nossos recursos inteligentes processam registros de forma transitória e isolada."
    },
    {
      q: "Como posso exercer meus direitos de titular de dados (acesso, retificação, exclusão)?",
      a: "Você pode encaminhar sua solicitação pelo nosso Centro de Direitos de Privacidade, pelo e-mail dpo@msmebooks.org ou nas configurações da conta. Todas as solicitações recebem protocolo em até 72 horas úteis."
    },
    {
      q: "Dados de cartão de crédito e contas bancárias ficam gravados em seus servidores?",
      a: "Não. A MsmeBooks não armazena números de cartão nem códigos de segurança. As transações são processadas por provedores certificados PCI-DSS Nível 1 (como Paystack e Flutterwave) por meio de tokenização criptografada."
    },
    {
      q: "O que acontece em caso de incidente de segurança ou vazamento de dados?",
      a: "A MsmeBooks opera monitoramento contínuo 24/7. Na hipótese de incidente comprovado com impacto a dados pessoais, notificaremos a comissão reguladora (NDPC) e os titulares afetados em até 72 horas com orientações de mitigação."
    },
    {
      q: "Como a privacidade é assegurada nos terminais de PDV no comércio varejista?",
      a: "Nossa arquitetura de PDV aplica controle de acesso baseado em função (RBAC), assegurando que operadores de caixa visualizem apenas dados estritamente operacionais. Telefones de clientes para emissão de cupom digital são tokenizados."
    },
    {
      q: "Quais são os direitos dos hóspedes cadastrados no módulo hoteleiro PMS?",
      a: "Os dados de hóspedes no módulo PMS são de controle do estabelecimento cliente (Controlador). Hóspedes podem solicitar correções ou exclusões junto ao hotel ou diretamente ao nosso setor de privacidade."
    },
    {
      q: "Posso gerenciar os cookies e rastreadores analíticos do portal?",
      a: "Sim. Você pode ajustar suas preferências a qualquer momento no Painel de Cookies no rodapé da página. Nenhum cookie não essencial é ativado sem seu consentimento prévio e informado."
    },
    {
      q: "O cadastro de menores de idade é aceito na plataforma MsmeBooks?",
      a: "A MsmeBooks é uma plataforma SaaS exclusivamente comercial (B2B) voltada a usuários com 18 anos ou mais. Não coletamos intencionalmente informações de crianças ou adolescentes."
    },
    {
      q: "Como entrar em contato com o Encarregado de Proteção de Dados (DPO)?",
      a: "Você pode falar com nossa equipe pelo e-mail dpo@msmebooks.org, pelo telefone em Lagos +2349158482622 ou por correspondência para: Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigéria."
    }
  ],
  es: [
    {
      q: "¿MsmeBooks comercializa mis datos personales o empresariales?",
      a: "No. MsmeBooks no vende, alquila ni comercializa su información personal ni sus libros contables con terceros. La información se procesa con el único propósito de suministrar nuestros servicios de contabilidad en la nube, punto de venta y gestión de existencias."
    },
    {
      q: "¿De qué forma protege MsmeBooks mis registros financieros y contables?",
      a: "Implementamos una rigurosa arquitectura de defensa en profundidad: cifrado AES-256 para información en reposo, protocolo TLS 1.3 con confidencialidad hacia adelante en tránsito, copias de seguridad automáticas cada 4 horas y bases de datos multiinquilino aisladas."
    },
    {
      q: "¿Quién posee la titularidad sobre los datos y asientos ingresados en MsmeBooks?",
      a: "Usted conserva el 100% de la propiedad exclusiva sobre la información de su empresa. MsmeBooks actúa como Encargado del Tratamiento (Data Processor) y garantiza la exportación continua en formatos CSV, Excel, PDF y JSON sin tarifas de salida."
    },
    {
      q: "¿Cumple MsmeBooks con la Ley de Protección de Datos de Nigeria (NDPA 2023)?",
      a: "Sí. MsmeBooks se encuentra plenamente alineada con la NDPA 2023 y estándares globales. Mantenemos un Delegado de Protección de Datos (DPO) certificado, auditorías periódicas de cumplimiento y garantizamos el ejercicio de todos los derechos de los interesados."
    },
    {
      q: "¿Cómo gestiona MsmeBooks las transferencias de datos fuera de Nigeria?",
      a: "Toda transferencia internacional de información se rige por los artículos 41 a 43 de la NDPA 2023. Se ejecuta bajo Cláusulas Contractuales Tipo (CCT), normas corporativas vinculantes y decisiones de adecuación con niveles equivalentes de protección."
    },
    {
      q: "¿Cuánto tiempo se conservan mis datos empresariales tras cancelar el servicio?",
      a: "Al cancelar, su suscripción pasa por un período de gracia de 30 días. Transcurrido ese plazo, las credenciales personales son eliminadas, salvo los asientos donde normativas fiscales y tributarias exijan conservación obligatoria (como el período legal de 6 años)."
    },
    {
      q: "¿Entrena MsmeBooks modelos de inteligencia artificial con mis facturas o cuentas?",
      a: "No. Los asientos contables, facturas, clientes y catálogos jamás se utilizan para entrenar modelos de IA públicos. Nuestras utilidades automatizadas (como la lectura de comprobantes y conciliación) tratan los datos de forma transitoria y segura."
    },
    {
      q: "¿Cómo puedo ejercer mis derechos de acceso, rectificación y supresión de datos?",
      a: "Puede tramitar su solicitud mediante nuestro Centro de Derechos de Privacidad, por correo electrónico a dpo@msmebooks.org o desde la configuración de su cuenta. Toda petición recibe confirmación en un máximo de 72 horas."
    },
    {
      q: "¿Guardan en sus servidores mis números de tarjeta de crédito o cuentas bancarias?",
      a: "No. MsmeBooks nunca almacena numeraciones completas de tarjetas ni códigos PIN. Las transacciones se delegan a pasarelas certificadas PCI-DSS Nivel 1 (Paystack, Flutterwave) utilizando tokenización cifrada de última generación."
    },
    {
      q: "¿Qué protocolo se activa ante un posible incidente o brecha de seguridad?",
      a: "MsmeBooks cuenta con vigilancia operativa 24/7. En caso de detectarse una vulneración con afectación a datos personales, se notificará a la autoridad reguladora (NDPC) y a los usuarios perjudicados en un plazo máximo de 72 horas con pautas de mitigación."
    },
    {
      q: "¿Cómo se preserva la confidencialidad en los terminales de TPV en tiendas?",
      a: "El software de punto de venta impone control de acceso granular (RBAC) para restringir la operativa del cajero a lo estrictamente indispensable. Los números de teléfono recabados para tickets digitales se tokenizan contra exportaciones indebidas."
    },
    {
      q: "¿Qué garantías asisten a los huéspedes en el módulo hotelero PMS?",
      a: "Los datos de huéspedes registrados en el PMS son gestionados por el establecimiento hotelero (Responsable del Tratamiento). Los clientes pueden solicitar rectificaciones o cancelaciones ante el hotel o nuestro despacho de privacidad."
    },
    {
      q: "¿Es posible configurar los rastreadores y cookies del portal web?",
      a: "Sí. Puede configurar sus preferencias en cualquier instante desde el Gestor de Cookies ubicado en el pie del sitio web. Ningún rastreador analítico o publicitario se habilita sin su consentimiento explícito."
    },
    {
      q: "¿Se permite el registro de menores de edad en la plataforma de MsmeBooks?",
      a: "MsmeBooks es una herramienta SaaS de carácter empresarial (B2B) orientada exclusivamente a personas mayores de 18 años. No recopilamos conscientemente datos de menores de edad."
    },
    {
      q: "¿Cómo puedo contactar al Delegado de Protección de Datos (DPO)?",
      a: "Puede comunicarse con nuestro equipo de privacidad al correo dpo@msmebooks.org, por teléfono en Lagos al +2349158482622 o mediante correspondencia a: Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigeria."
    }
  ]
};
