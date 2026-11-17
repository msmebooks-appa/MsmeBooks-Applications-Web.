import { SupportedLanguage } from './translations';

export interface TranslatedSection {
  number: number;
  title: string;
  short: string;
  content: string;
  subsections?: {
    letter?: string;
    title: string;
    body: string;
    items?: string[];
  }[];
  highlightNote?: string;
}

export const SECTION_TRANSLATIONS: Partial<Record<SupportedLanguage, Record<number, TranslatedSection>>> = {
  fr: {
    1: {
      number: 1,
      title: "Introduction",
      short: "Introduction",
      content: "MsmeBooks (« nous », « notre » ou « nos ») est une plateforme logicielle en mode SaaS de premier plan dédiée à l'accompagnement des micro, petites et moyennes entreprises (MPME), des cabinets comptables et des commerçants en Afrique et à l'international. Cette Politique de Confidentialité explicite la manière dont MsmeBooks collecte, traite, conserve, communique et protège les données personnelles et les écritures comptables lorsque vous utilisez notre site web (www.msmebooks.org), nos applications cloud, nos caisses point de vente (POS) et nos interfaces de programmation (API).",
      subsections: [
        {
          title: "1.1 Produits et Services Couverts",
          body: "Cette politique s'applique à l'ensemble de l'écosystème MsmeBooks : comptabilité dans le cloud, facturation automatisée, caisse enregistreuse POS, gestion des stocks en temps réel, paie du personnel, module hôtelier PMS et passerelles e-commerce."
        },
        {
          title: "1.2 Relations Juridiques : Responsable vs Sous-traitant",
          body: "Conformément aux normes internationales et à la NDPA 2023 :\n• MsmeBooks en tant que Responsable de Traitement : pour la gestion directe de vos abonnements, de votre compte administrateur et des demandes adressées à notre support technique.\n• MsmeBooks en tant que Sous-traitant : pour l'ensemble des données commerciales (clients, écritures, factures, salaires) enregistrées dans votre espace, dont votre entreprise demeure le seul Responsable de Traitement."
        }
      ]
    },
    2: {
      number: 2,
      title: "Portée et Applicabilité",
      short: "Portée & Applicabilité",
      content: "Cette Politique de Confidentialité régit le traitement des informations de toute personne physique dont les données sont confiées à MsmeBooks ou saisies dans la plateforme par les entreprises abonnées.",
      subsections: [
        {
          title: "2.1 Catégories de Personnes Concernées",
          body: "Sont notamment protégées par les présentes dispositions :",
          items: [
            "Visiteurs du portail web et prospects en phase d'évaluation.",
            "Titulaires de comptes, administrateurs et dirigeants d'entreprises abonnées.",
            "Employés, comptables et caissiers utilisant des profils opérationnels.",
            "Clients finaux de magasins recevant des reçus électroniques ou factures POS.",
            "Fournisseurs et partenaires commerciaux enregistrés dans les livres d'achats.",
            "Voyageurs et clients enregistrés via notre module de réservation hôtelière PMS."
          ]
        }
      ]
    },
    3: {
      number: 3,
      title: "Informations que Nous Collectons",
      short: "Informations Collectées",
      content: "Nous collectons des informations nécessaires à la tenue rigoureuse de vos livres d'affaires, à la gestion fiscale et à la sécurisation des sessions utilisateurs.",
      subsections: [
        {
          title: "3.1 Données de Compte et Profil",
          body: "Nom, prénom, adresse e-mail professionnelle, numéro de téléphone WhatsApp, raison sociale, numéro d'identification fiscale (NIF/TIN) et localisation géographique."
        },
        {
          title: "3.2 Données Financières et Comptables Métier",
          body: "Factures émises, bons de commande, dépenses, inventaires de marchandises, salaires du personnel et rapprochements bancaires saisis sous votre contrôle exclusif."
        }
      ]
    },
    4: {
      number: 4,
      title: "Comment Nous Collectons les Données",
      short: "Modes de Collecte",
      content: "Les données sont recueillies directement par saisie sur nos interfaces, de façon automatisée via les journaux système de connexion et par l'intermédiaire de passerelles certifiées.",
      subsections: [
        {
          title: "4.1 Collecte Directe et Intégrations API",
          body: "Toutes les écritures sont importées de plein gré par vos soins ou synchronisées via nos API autorisées avec vos comptes bancaires et plateformes de paiement."
        }
      ]
    },
    5: {
      number: 5,
      title: "Utilisation des Données",
      short: "Utilisation des Données",
      content: "MsmeBooks utilise les informations collectées dans le but exclusif de délivrer, maintenir et sécuriser les services logiciels souscrits.",
      subsections: [
        {
          title: "5.1 Finalités d'Exploitation Légitimes",
          body: "Calcul automatisé des taxes, émission des bilans et comptes de résultats, génération des tickets de caisse POS, détection des fraudes et support client personnalisé."
        }
      ]
    },
    6: {
      number: 6,
      title: "Bases Légales du Traitement",
      short: "Bases Légales",
      content: "Tout traitement repose sur une base légale formelle prévue par l'article 25 de la NDPA 2023 : exécution contractuelle, respect d'obligations fiscales et légales, intérêts légitimes et consentement explicite de l'utilisateur.",
      subsections: [
        {
          title: "6.1 Tableau des Fondements Légaux",
          body: "Les traitements fiscaux et comptables découlent d'obligations légales strictes ; la gestion de session et la sécurité relèvent de nos obligations contractuelles."
        }
      ]
    },
    7: {
      number: 7,
      title: "Propriété et Contrôle des Données Client",
      short: "Propriété des Données",
      content: "Votre entreprise conserve la propriété pleine et exclusive de 100% de ses données. MsmeBooks ne revendique aucun droit de propriété intellectuelle sur vos grands livres et registres.",
      subsections: [
        {
          title: "7.1 Portabilité et Absence de Verrouillage",
          body: "Vous pouvez exporter à tout moment l'ensemble de votre base comptable aux formats CSV, Excel, PDF ou JSON sans aucun frais de sortie."
        }
      ]
    },
    8: {
      number: 8,
      title: "Partage et Divulgation des Données",
      short: "Partage des Données",
      content: "Nous ne commercialisons aucune donnée. Les informations ne sont transmises qu'à des sous-traitants d'infrastructure vérifiés ou sur réquisition judiciaire légale contraignante.",
      subsections: [
        {
          title: "8.1 Sous-traitants Techniques Agréés",
          body: "Hébergeurs cloud sécurisés, passerelles de paiement conformes PCI-DSS et services d'envoi de courriels transactionnels liés par des accords stricts (DPA)."
        }
      ]
    },
    9: {
      number: 9,
      title: "Sécurité et Protection des Données",
      short: "Sécurité des Données",
      content: "La sécurité repose sur une architecture de défense en profondeur certifiée, protégeant vos comptes contre toute intrusion, altération ou perte accidentelle.",
      subsections: [
        {
          title: "9.1 Mesures Techniques et Cryptographiques",
          body: "Chiffrement AES-256 au repos, protocole TLS 1.3 avec confidentialité persistante en transit, sauvegardes géoredondantes toutes les 4 heures et contrôle d'accès RBAC."
        }
      ]
    },
    10: {
      number: 10,
      title: "Hébergement Cloud et Transferts Internationaux",
      short: "Cloud & Transferts",
      content: "Nos serveurs sont implantés dans des centres de données Tier-III conformes aux exigences de souveraineté et aux standards internationaux de transfert transfrontalier.",
      subsections: [
        {
          title: "10.1 Garanties de Transfert Transfrontalier",
          body: "Tout transfert hors du Nigéria s'opère sous le couvert de Clauses Contractuelles Types (CCT) assurant un niveau de protection équivalent à la NDPA 2023."
        }
      ]
    },
    11: {
      number: 11,
      title: "Conservation et Suppression des Données",
      short: "Conservation & Suppression",
      content: "Les données sont conservées pour la durée strictement requise par les finalités du service et les réglementations fiscales nationales (conservation comptable obligatoire de 6 ans).",
      subsections: [
        {
          title: "11.1 Purge et Délais Légaux",
          body: "À la clôture définitive d'un compte, les identifiants sont effacés sous 30 jours, tandis que les écritures comptables sont archivées en coffre-fort fiscal sécurisé."
        }
      ]
    },
    12: {
      number: 12,
      title: "Cookies et Technologies de Suivi",
      short: "Cookies & Traceurs",
      content: "Nous utilisons des cookies strictement nécessaires pour maintenir votre session active, mémoriser votre devise d'affichage et garantir la sécurité de navigation.",
      subsections: [
        {
          title: "12.1 Panneau de Choix des Traceurs",
          body: "Les cookies non essentiels (mesure d'audience, préférences publicitaires) sont désactivés par défaut et ne s'exécutent qu'avec votre consentement explicite."
        }
      ]
    },
    13: {
      number: 13,
      title: "Droits des Personnes Concernées",
      short: "Vos Droits",
      content: "En tant que titulaire de données, vous disposez de droits garantis par la loi : droit d'accès, de rectification, d'effacement, d'opposition et de portabilité.",
      subsections: [
        {
          title: "13.1 Gratuité des Demandes SAR",
          body: "L'exercice de vos droits d'accès est entièrement gratuit. Toute demande fait l'objet d'un examen par notre Délégué à la Protection des Données sous 72 heures."
        }
      ]
    },
    14: {
      number: 14,
      title: "Conformité à la Loi Nigériane (NDPA 2023)",
      short: "Conformité NDPA Nigéria",
      content: "MsmeBooks se conforme scrupuleusement aux articles 48 et 49 de la NDPA 2023, coopère avec la NDPC et applique des protocoles rigoureux de notification des incidents.",
      subsections: [
        {
          title: "14.1 Plafonds des Sanctions Légales",
          body: "La réglementation nigériane impose un plafond de pénalités jusqu'à 10 000 000 ₦ pour assurer la protection rigoureuse des PME face aux violations de données."
        }
      ]
    },
    15: {
      number: 15,
      title: "Lois Africaines et Internationales (POPIA, GDPR)",
      short: "Lois Africaines & Globales",
      content: "Notre gouvernance intègre harmonieusement les standards africains (POPIA en Afrique du Sud, Kenya DPA, Ghana Data Protection Act) ainsi que le RGPD européen.",
      subsections: [
        {
          title: "15.1 Alignement Régional Panafricain",
          body: "Garantie d'une conformité sans faille pour les entreprises réalisant des opérations commerciales à l'échelle de la Zone de libre-échange continentale africaine (ZLECAf)."
        }
      ]
    },
    16: {
      number: 16,
      title: "Paiements et Données Financières",
      short: "Paiements & Finances",
      content: "La sécurité des paiements par carte et virement repose sur la norme internationale PCI-DSS Niveau 1. Aucun numéro complet de carte n'est enregistré sur nos serveurs.",
      subsections: [
        {
          title: "16.1 Règlements et Tokenisation",
          body: "Toutes les transactions passent par des jetons cryptographiques à usage unique gérés par des opérateurs bancaires certifiés (Paystack, Flutterwave)."
        }
      ]
    },
    17: {
      number: 17,
      title: "Fonctionnalités IA et Traitement Automatisé",
      short: "IA & Traitement Auto",
      content: "Nos algorithmes d'automatisation (scan de factures, catégorisation automatique des dépenses) respectent scrupuleusement la confidentialité de vos chiffres.",
      subsections: [
        {
          title: "17.1 Zéro Entraînement de Modèles Publics",
          body: "Vos comptes ne sont jamais injectés dans des bases d'apprentissage de modèles d'IA publics. Le traitement est transitoire, isolé et sous votre supervision."
        }
      ]
    },
    18: {
      number: 18,
      title: "Confidentialité par Module Sectoriel",
      short: "Modules Sectoriels",
      content: "Dispositions spécifiques pour la vente au détail (POS), l'hôtellerie (PMS), les cabinets médicaux et les entreprises manufacturières utilisant MsmeBooks.",
      subsections: [
        {
          title: "18.1 Isolation Sectorielle des Rôles",
          body: "Les caissiers ne voient que l'encaissement direct ; les réceptionnistes d'hôtel ne visualisent que les séjours sans accès aux bilans généraux de la société."
        }
      ]
    },
    19: {
      number: 19,
      title: "Applications Tiers et Intégrations API",
      short: "Intégrations & APIs",
      content: "Les connexions avec des applications tierces (e-commerce, plateformes bancaires) s'effectuent via des jetons sécurisés OAuth avec journalisation complète des flux.",
      subsections: [
        {
          title: "19.1 Révocation Immédiate des Accès",
          body: "Vous pouvez désactiver à tout moment l'accès accordé à un logiciel tiers directement depuis les paramètres de sécurité de votre compte."
        }
      ]
    },
    20: {
      number: 20,
      title: "Protection de la Vie Privée des Mineurs",
      short: "Protection des Mineurs",
      content: "MsmeBooks est un service strictement destiné aux professionnels et entreprises. Nous ne recueillons aucune donnée relative à des enfants ou des mineurs.",
      subsections: [
        {
          title: "20.1 Contrôle de l'Âge et Vérification",
          body: "L'ouverture d'un compte nécessite d'avoir au moins 18 ans et d'agir pour le compte d'une entité légalement constituée ou d'une activité commerciale enregistrée."
        }
      ]
    },
    21: {
      number: 21,
      title: "Communications Marketing et Préférences",
      short: "Communications Marketing",
      content: "Vous conservez le contrôle total sur les courriels d'information et les newsletters. Un lien de désabonnement en un clic est inclus dans chaque envoi promotionnel.",
      subsections: [
        {
          title: "21.1 Notifications Légales et Opérationnelles",
          body: "Les alertes de sécurité, avis de mise à jour des conditions générales et reçus de paiement continuent d'être délivrés pour assurer la continuité du service."
        }
      ]
    },
    22: {
      number: 22,
      title: "Partenaires Commerciaux et Revendeurs",
      short: "Partenaires & Revendeurs",
      content: "Les experts-comptables et distributeurs partenaires sont soumis à des accords de confidentialité rigoureux interdisant tout accès non délégué à vos livres.",
      subsections: [
        {
          title: "22.1 Ségrégation Multi-Locataire",
          body: "Même lorsqu'un expert gère plusieurs dossiers clients, l'étanchéité cryptographique totale entre chaque entreprise cliente est garantie."
        }
      ]
    },
    23: {
      number: 23,
      title: "Incidents de Sécurité et Violations",
      short: "Gestion des Violations",
      content: "MsmeBooks applique un protocole d'intervention d'urgence certifié. En cas de brèche critique, l'autorité de régulation et les entreprises impactées sont notifiées sous 72h.",
      subsections: [
        {
          title: "23.1 Notification et Remédiation",
          body: "Notre rapport d'incident détaille la nature de l'événement, les catégories de données en jeu et les mesures correctives immédiates déployées."
        }
      ]
    },
    24: {
      number: 24,
      title: "Modifications de la Politique de Confidentialité",
      short: "Mises à Jour",
      content: "Toute mise à jour substantielle fait l'objet d'une notification préalable de 30 jours dans l'application et par courriel avant son entrée en vigueur officielle.",
      subsections: [
        {
          title: "24.1 Archivage et Historique des Versions",
          body: "Toutes les versions antérieures de notre politique de confidentialité demeurent consultables dans nos archives juridiques publiques en ligne."
        }
      ]
    },
    25: {
      number: 25,
      title: "Contact et Délégué à la Protection des Données",
      short: "Contact & DPO",
      content: "Notre Délégué à la Protection des Données (DPO) et notre cellule juridique se tiennent à votre disposition pour toute demande de renseignement ou démarche formelle.",
      subsections: [
        {
          title: "25.1 Coordonnées Officielles du DPO",
          body: "Courriel : dpo@msmebooks.org | Téléphone : +2349158482622 | Adresse : Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigéria."
        }
      ]
    }
  },
  pt: {
    1: {
      number: 1,
      title: "Introdução",
      short: "Introdução",
      content: "A MsmeBooks ('nós', 'nosso' ou 'nossa') é uma plataforma líder pan-africana e global de gestão empresarial no modelo Software como Serviço (SaaS), dedicada a capacitar micro, pequenas e médias empresas (MPMEs), escritórios de contabilidade e operadores de comércio. Esta Política de Privacidade descreve como a MsmeBooks coleta, processa, armazena, compartilha e resguarda dados pessoais e livros comerciais ao utilizar nossos sites (incluindo www.msmebooks.org), sistemas em nuvem, terminais de ponto de venda (PDV) e APIs.",
      subsections: [
        {
          title: "1.1 Soluções e Módulos Abrangidos",
          body: "Esta política rege todos os módulos MsmeBooks: contabilidade em nuvem, livros fiscais, PDV de checkout rápido, gestão de estoques em tempo real, folha de pagamento, sistema de gestão hoteleira (PMS) e emissão de notas."
        },
        {
          title: "1.2 Papéis Jurídicos: Controlador vs Operador de Dados",
          body: "Nos termos da NDPA 2023 e diretrizes de privacidade globais:\n• MsmeBooks como Controladora: no que tange aos dados cadastrais de administradores de conta, faturamento de assinaturas e suporte direto ao usuário.\n• MsmeBooks como Operadora de Dados: para todos os lançamentos contábeis, faturas de vendas, dados de funcionários e hóspedes inseridos no ambiente privado da sua empresa."
        }
      ]
    },
    2: {
      number: 2,
      title: "Escopo e Aplicabilidade",
      short: "Escopo & Aplicabilidade",
      content: "Esta Política de Privacidade aplica-se ao tratamento de informações de todas as pessoas físicas que interagem com a MsmeBooks ou cujos dados são inseridos na plataforma por empresas contratantes.",
      subsections: [
        {
          title: "2.1 Pessoas Físicas Protegidas",
          body: "O escopo contempla expressamente:",
          items: [
            "Visitantes do portal institucional e interessados comerciais.",
            "Titulares de contas corporativas, administradores e diretores financeiros.",
            "Colaboradores, contadores e operadores de caixa com acessos delegados.",
            "Consumidores de lojas no varejo que recebem cupons eletrônicos de PDV.",
            "Fornecedores e parceiros cadastrados nos registros de compras.",
            "Hóspedes e clientes cadastrados no módulo hoteleiro PMS."
          ]
        }
      ]
    },
    3: {
      number: 3,
      title: "Informações que Coletamos",
      short: "Informações Coletadas",
      content: "Coletamos as informações estritamente necessárias para a gestão dos livros contábeis, apuração tributária e segurança cibernética das contas de acesso.",
      subsections: [
        {
          title: "3.1 Dados Cadastrais e de Identificação",
          body: "Nome completo, e-mail comercial, telefone (WhatsApp), CNPJ/NIF corporativo, endereço comercial e credenciais de login autenticadas."
        },
        {
          title: "3.2 Dados Comerciais e Lançamentos Financeiros",
          body: "Notas fiscais, lançamentos de vendas, inventário de mercadorias, dados salariais e conciliações bancárias administradas sob seu exclusivo comando."
        }
      ]
    },
    4: {
      number: 4,
      title: "Como Coletamos Informações",
      short: "Métodos de Coleta",
      content: "Os dados são coletados mediante inserção direta pelos usuários nas telas do sistema, por registros técnicos de auditoria ou integrações via APIs seguras.",
      subsections: [
        {
          title: "4.1 Sincronização e Importação de Arquivos",
          body: "Lançamentos importados por planilhas ou integrados com bancos autorizados mediante credenciais seguras e tokens criptografados."
        }
      ]
    },
    5: {
      number: 5,
      title: "Como Utilizamos as Informações",
      short: "Uso das Informações",
      content: "A MsmeBooks utiliza os dados com a finalidade exclusiva de prestar, monitorar, aprimorar e proteger os serviços de gestão contratados.",
      subsections: [
        {
          title: "5.1 Finalidades Operacionais e Fiscais",
          body: "Cálculo automatizado de tributos, emissão de balanços, geração de cupons em PDV, prevenção contra fraudes e atendimento de suporte técnico."
        }
      ]
    },
    6: {
      number: 6,
      title: "Bases Legais para Processamento",
      short: "Bases Legais",
      content: "Todo processamento fundamenta-se nas bases legais do artigo 25 da NDPA 2023: execução de contrato, cumprimento de obrigações legais fiscais, legítimo interesse e consentimento livre.",
      subsections: [
        {
          title: "6.1 Enquadramento Regulatório",
          body: "A guarda de livros contábeis decorre de lei expressa; a autenticação e a integridade de dados apoiam-se na execução do contrato de serviço."
        }
      ]
    },
    7: {
      number: 7,
      title: "Propriedade e Controle dos Dados do Cliente",
      short: "Propriedade dos Dados",
      content: "Sua empresa é a proprietária exclusiva de 100% dos dados comerciais inseridos. A MsmeBooks não reivindica direitos autorais ou de titularidade sobre seus registros.",
      subsections: [
        {
          title: "7.1 Portabilidade Total e Sem Bloqueios",
          body: "Você tem a garantia de exportar a qualquer momento seus livros contábeis em CSV, Excel, PDF ou JSON sem custos ou multas rescisórias."
        }
      ]
    },
    8: {
      number: 8,
      title: "Compartilhamento e Divulgação de Dados",
      short: "Compartilhamento",
      content: "Não comercializamos nem vendemos dados. As informações são compartilhadas somente com provedores essenciais de infraestrutura ou mediante ordem judicial válida.",
      subsections: [
        {
          title: "8.1 Subprocessadores de Tecnologia Homologados",
          body: "Datacenters certificados, processadores de pagamento PCI-DSS e plataformas de mensageria vinculados por Acordos de Tratamento de Dados (DPA)."
        }
      ]
    },
    9: {
      number: 9,
      title: "Segurança e Proteção de Dados",
      short: "Segurança de Dados",
      content: "Adotamos padrões internacionais de segurança com criptografia AES-256 para dados armazenados e protocolo TLS 1.3 com sigilo antecipado em trânsito.",
      subsections: [
        {
          title: "9.1 Controles Técnicos e Redundância",
          body: "Cópias de segurança a cada 4 horas em regiões geográficas distintas, bancos de dados particionados por cliente e autenticação de dois fatores (2FA)."
        }
      ]
    },
    10: {
      number: 10,
      title: "Hospedagem em Nuvem e Transferências Internacionais",
      short: "Nuvem & Transferências",
      content: "Nossa infraestrutura opera em datacenters Tier-III em conformidade com as exigências dos artigos 41 a 43 da NDPA 2023 para transferências transfronteiriças.",
      subsections: [
        {
          title: "10.1 Cláusulas Contratuais Padrão (SCCs)",
          body: "Asseguramos que qualquer processamento em servidores internacionais conte com garantias jurídicas equivalentes de proteção de dados."
        }
      ]
    },
    11: {
      number: 11,
      title: "Retenção e Exclusão de Dados",
      short: "Retenção & Exclusão",
      content: "Os registros são mantidos pelo período exigido pelas normas comerciais e tributárias (como o prazo legal de guarda de 6 anos para lançamentos fiscais).",
      subsections: [
        {
          title: "11.1 Eliminação Pós-Cancelamento",
          body: "Após cancelamento definitivo, os acessos pessoais são eliminados em 30 dias, preservando-se apenas dados exigidos por órgãos tributários."
        }
      ]
    },
    12: {
      number: 12,
      title: "Cookies e Tecnologias de Rastreamento",
      short: "Cookies & Rastreio",
      content: "Utilizamos cookies necessários para manter a integridade da sessão e guardar preferências de moeda e idioma.",
      subsections: [
        {
          title: "12.1 Gestão de Consentimento",
          body: "Cookies analíticos ou de marketing permanecem inativos até que você os autorize expressamente no painel de preferências."
        }
      ]
    },
    13: {
      number: 13,
      title: "Direitos de Privacidade dos Titulares",
      short: "Seus Direitos",
      content: "Garantimos todos os direitos dos titulares: confirmação de tratamento, acesso, retificação, anonimização, bloqueio, eliminação e portabilidade de dados.",
      subsections: [
        {
          title: "13.1 Gratuidade Estatutária",
          body: "O atendimento aos direitos do titular é gratuito. As solicitações são analisadas pelo Encarregado de Proteção de Dados (DPO) em até 72 horas."
        }
      ]
    },
    14: {
      number: 14,
      title: "Conformidade com a Lei da Nigéria (NDPA 2023)",
      short: "Conformidade NDPA",
      content: "A MsmeBooks cumpre integralmente os requisitos dos artigos 48 e 49 da NDPA 2023, mantendo cadastro ativo na Comissão de Proteção de Dados (NDPC).",
      subsections: [
        {
          title: "14.1 Tetos e Sanções Administrativas",
          body: "A legislação estabelece penalidades de até ₦10.000.000 para assegurar a inviolabilidade dos registros de empresas e cidadãos."
        }
      ]
    },
    15: {
      number: 15,
      title: "Leis de Privacidade Africanas e Internacionais",
      short: "Leis Internacionais",
      content: "Nossa governança abrange leis africanas essenciais (POPIA na África do Sul, Kenya DPA, Ghana Data Protection Act) e o RGPD europeu.",
      subsections: [
        {
          title: "15.1 Facilitação Comercial Pan-Africana",
          body: "Estrutura desenhada para operações de comércio transfronteiriço no contexto da Área de Livre Comércio Continental Africana (AfCFTA)."
        }
      ]
    },
    16: {
      number: 16,
      title: "Processamento de Pagamentos e Dados Financeiros",
      short: "Pagamentos & Finanças",
      content: "As transações de cartões atendem à certificação PCI-DSS Nível 1. A plataforma não armazena dados de cartão de crédito nem senhas bancárias.",
      subsections: [
        {
          title: "16.1 Liquidações e Tokenização Segura",
          body: "Os fluxos financeiros são convertidos em tokens criptografados operados por instituições financeiras credenciadas (Paystack, Flutterwave)."
        }
      ]
    },
    17: {
      number: 17,
      title: "Recursos de IA e Processamento Automatizado",
      short: "Recursos de IA",
      content: "Recursos inteligentes de categorização e leitura de notas processam dados de maneira estritamente privada.",
      subsections: [
        {
          title: "17.1 Vedação de Treinamento em Modelos Públicos",
          body: "Seus dados financeiros jamais são utilizados para treinar inteligências artificiais públicas. O processamento é isolado e temporário."
        }
      ]
    },
    18: {
      number: 18,
      title: "Privacidade Específica por Setor e Módulo",
      short: "Módulos Setoriais",
      content: "Regras setoriais dedicadas para comércio (PDV), hotelaria (PMS), clínicas e serviços corporativos que utilizam a MsmeBooks.",
      subsections: [
        {
          title: "18.1 Níveis de Acesso Granulares",
          body: "Operadores de caixa visualizam unicamente as telas de venda, sem acesso às contas de resultado ou demonstrativos globais da companhia."
        }
      ]
    },
    19: {
      number: 19,
      title: "Aplicações de Terceiros e Integrações de API",
      short: "Integrações & APIs",
      content: "Conexões com plataformas externas ocorrem por protocolo seguro OAuth com registro completo de logs e controle total de permissões.",
      subsections: [
        {
          title: "19.1 Revogação Imediata",
          body: "Você pode revogar a permissão de qualquer aplicativo integrado com um único clique nas configurações de segurança da sua conta."
        }
      ]
    },
    20: {
      number: 20,
      title: "Privacidade de Crianças e Menores",
      short: "Privacidade de Menores",
      content: "A MsmeBooks destina-se exclusivamente ao uso comercial e empresarial por maiores de 18 anos. Não coletamos dados de menores de idade.",
      subsections: [
        {
          title: "20.1 Validação de Maioridade",
          body: "O cadastro na plataforma exige comprovação de capacidade jurídica para representar a entidade comercial."
        }
      ]
    },
    21: {
      number: 21,
      title: "Comunicações de Marketing",
      short: "Comunicações Marketing",
      content: "Você tem a liberdade de cancelar o recebimento de boletins promocionais a qualquer momento pelo link de descadastramento.",
      subsections: [
        {
          title: "21.1 Comunicados Importantes",
          body: "Avisos essenciais de segurança, faturas de mensalidade e alertas sobre alterações de termos continuarão sendo enviados."
        }
      ]
    },
    22: {
      number: 22,
      title: "Parceiros Comerciais e Revendedores",
      short: "Parceiros & Revendedores",
      content: "Contadores e revendedores parceiros operam sob acordos rigorosos de confidencialidade com isolamento total dos clientes gerenciados.",
      subsections: [
        {
          title: "22.1 Barreiras de Acesso Multi-Inquilino",
          body: "Garantia técnica de que nenhum parceiro possa cruzar dados entre empresas clientes distintas."
        }
      ]
    },
    23: {
      number: 23,
      title: "Violações de Dados e Gestão de Incidentes",
      short: "Incidentes de Segurança",
      content: "Em caso de incidente comprovado com risco a dados, notificaremos a autoridade reguladora (NDPC) e os titulares em até 72 horas.",
      subsections: [
        {
          title: "23.1 Relatório e Ações Imediatas",
          body: "A comunicação detalhará o escopo do incidente, dados impactados e medidas técnicas de mitigação adotadas."
        }
      ]
    },
    24: {
      number: 24,
      title: "Alterações nesta Política de Privacidade",
      short: "Atualizações da Política",
      content: "Mudanças relevantes serão informadas com 30 dias de antecedência por e-mail e aviso destacado no painel do sistema.",
      subsections: [
        {
          title: "24.1 Histórico de Versões",
          body: "As versões anteriores desta política permanecem acessíveis publicamente em nosso repositório jurídico para consulta histórica."
        }
      ]
    },
    25: {
      number: 25,
      title: "Contato e Encarregado de Proteção de Dados (DPO)",
      short: "Contato & DPO",
      content: "Nosso Encarregado de Proteção de Dados e o departamento jurídico estão à disposição para responder a dúvidas e solicitações.",
      subsections: [
        {
          title: "25.1 Canais Oficiais de Atendimento",
          body: "E-mail: dpo@msmebooks.org | Telefone: +2349158482622 | Endereço: Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigéria."
        }
      ]
    }
  },
  es: {
    1: {
      number: 1,
      title: "Introducción",
      short: "Introducción",
      content: "MsmeBooks ('nosotros', 'nuestro' o 'nos') es una plataforma SaaS referente a nivel panafricano y global de gestión empresarial diseñada para empoderar a micro, pequeñas y medianas empresas (MIPYMES), despachos contables y comercios minoristas. Esta Política de Privacidad explica cómo MsmeBooks recaba, procesa, custodia, transfiere y salvaguarda los datos personales y asientos contables cuando usted interactúa con nuestros sitios web (como www.msmebooks.org), sistemas en la nube, terminales punto de venta (TPV) y APIs.",
      subsections: [
        {
          title: "1.1 Productos y Módulos Cubiertos",
          body: "Esta política cubre la totalidad del ecosistema MsmeBooks: contabilidad en la nube, libros de IVA/impuestos, TPV de cobro ágil, gestión de existencias en almacén, nóminas, gestión hotelera (PMS) y facturación electrónica."
        },
        {
          title: "1.2 Roles Jurídicos: Responsable vs Encargado del Tratamiento",
          body: "Conforme a la NDPA 2023 y estándares internacionales de privacidad:\n• MsmeBooks como Responsable del Tratamiento: respecto a las credenciales de administración, facturación del servicio y atención al cliente.\n• MsmeBooks como Encargado del Tratamiento: para todos los asientos contables, facturas de clientes, inventarios y nóminas registrados en el entorno privado de su empresa."
        }
      ]
    },
    2: {
      number: 2,
      title: "Alcance y Aplicabilidad",
      short: "Alcance & Aplicabilidad",
      content: "Esta Política de Privacidad regula el tratamiento de información de todas las personas físicas vinculadas con MsmeBooks o cuyos datos son gestionados en la plataforma por empresas abonadas.",
      subsections: [
        {
          title: "2.1 Colectivos Protegidos",
          body: "El alcance ampara expresamente a:",
          items: [
            "Visitantes del portal web e interesados comerciales.",
            "Titulares de cuentas de empresa, administradores y apoderados legales.",
            "Empleados, contables y dependientes de caja con roles autorizados.",
            "Consumidores finales de comercios que reciben tiques o facturas electrónicas.",
            "Proveedores y acreedores inscritos en los libros de gastos.",
            "Huéspedes registrados mediante el módulo hotelero PMS."
          ]
        }
      ]
    },
    3: {
      number: 3,
      title: "Información que Recopilamos",
      short: "Información Recopilada",
      content: "Recabamos la información indispensable para la llevanza ordenada de la contabilidad, obligaciones tributarias y la seguridad operativa de las cuentas.",
      subsections: [
        {
          title: "3.1 Datos de Registro y Cuenta",
          body: "Nombre, apellidos, correo corporativo, teléfono (WhatsApp), NIF/CIF empresarial, dirección fiscal y contraseñas cifradas."
        },
        {
          title: "3.2 Datos Contables y Financieros de Negocio",
          body: "Facturación emitida, albaranes, nóminas de personal, inventarios y conciliaciones bancarias administradas bajo su exclusiva dirección."
        }
      ]
    },
    4: {
      number: 4,
      title: "Cómo Recopilamos la Información",
      short: "Métodos de Recopilación",
      content: "Los datos se obtienen mediante el registro manual en el sistema, registros automáticos de conexión de seguridad o sincronizaciones mediante APIs autorizadas.",
      subsections: [
        {
          title: "4.1 Integraciones Seguras",
          body: "Conexiones de ficheros o pasarelas bancarias vinculadas mediante certificados y credenciales criptográficas seguras."
        }
      ]
    },
    5: {
      number: 5,
      title: "Cómo Utilizamos la Información",
      short: "Uso de la Información",
      content: "MsmeBooks procesa los datos exclusivamente con el fin de proporcionar, supervisar, optimizar y proteger las aplicaciones contratadas.",
      subsections: [
        {
          title: "5.1 Fines Operativos y de Negocio",
          body: "Cálculo automático de liquidaciones tributarias, balances contables, emisión de tiques TPV, prevención de fraudes y soporte técnico."
        }
      ]
    },
    6: {
      number: 6,
      title: "Bases Legales del Tratamiento",
      short: "Bases Legales",
      content: "Todo tratamiento se ampara en las bases del artículo 25 de la NDPA 2023: ejecución contractual, cumplimiento de obligaciones legales tributarias, interés legítimo y consentimiento previo.",
      subsections: [
        {
          title: "6.1 Marco Jurídico Aplicable",
          body: "La conservación de libros contables obedece a mandato de ley fiscal; la gestión de acceso responde al contrato de licencia del software."
        }
      ]
    },
    7: {
      number: 7,
      title: "Propiedad y Control de los Datos del Cliente",
      short: "Propiedad de los Datos",
      content: "Su empresa es la propietaria única y exclusiva del 100% de la información comercial incorporada. MsmeBooks no ostenta ningún derecho sobre sus libros.",
      subsections: [
        {
          title: "7.1 Portabilidad Integral y Sin Penalizaciones",
          body: "Puede exportar en cualquier momento la totalidad de sus libros en formatos CSV, Excel, PDF o JSON sin coste de salida."
        }
      ]
    },
    8: {
      number: 8,
      title: "Compartición y Divulgación de Datos",
      short: "Compartición de Datos",
      content: "No vendemos ni comercializamos información personal. Los datos solo se comunican a proveedores tecnológicos esenciales o ante mandamientos judiciales válidos.",
      subsections: [
        {
          title: "8.1 Subencargados Homologados",
          body: "Centros de datos en la nube certificados, pasarelas de pago PCI-DSS y servicios de mensajería sujetos a Acuerdos de Tratamiento de Datos (DPA)."
        }
      ]
    },
    9: {
      number: 9,
      title: "Seguridad y Protección de Datos",
      short: "Seguridad de Datos",
      content: "Garantizamos defensas de nivel bancario con cifrado AES-256 para información en reposo y TLS 1.3 con estricta confidencialidad hacia adelante en tránsito.",
      subsections: [
        {
          title: "9.1 Controles de Continuidad",
          body: "Copias de seguridad cada 4 horas con redundancia geográfica, particionamiento de bases de datos por cliente y autenticación en dos factores."
        }
      ]
    },
    10: {
      number: 10,
      title: "Alojamiento en la Nube y Transferencias Internacionales",
      short: "Nube & Transferencias",
      content: "Los servidores están situados en centros de datos Tier-III ajustados a los artículos 41 a 43 de la NDPA 2023 sobre transferencias transfronterizas.",
      subsections: [
        {
          title: "10.1 Cláusulas Contractuales Tipo",
          body: "Garantía de un nivel de protección equivalente para cualquier tratamiento efectuado en infraestructura técnica internacional."
        }
      ]
    },
    11: {
      number: 11,
      title: "Retención y Supresión de Datos",
      short: "Retención & Supresión",
      content: "Los datos se conservan por los plazos marcados por la normativa mercantil y tributaria (plazo legal general de custodia de 6 años para libros de cuentas).",
      subsections: [
        {
          title: "11.1 Cancelación y Purgado",
          body: "Tras la baja definitiva, las credenciales personales se destruyen en 30 días, preservando únicamente registros preceptivos ante Hacienda."
        }
      ]
    },
    12: {
      number: 12,
      title: "Cookies y Tecnologías de Rastreo",
      short: "Cookies & Rastreo",
      content: "Empleamos cookies estrictamente técnicas para mantener la sesión abierta y recordar su idioma y divisa elegidos.",
      subsections: [
        {
          title: "12.1 Centro de Consentimiento",
          body: "Las cookies analíticas y publicitarias no se ejecutan hasta contar con su aceptación expresa en el gestor de preferencias."
        }
      ]
    },
    13: {
      number: 13,
      title: "Derechos de los Titulares de Datos",
      short: "Sus Derechos",
      content: "Reconocemos el ejercicio pleno de sus derechos: acceso, rectificación, supresión, limitación del tratamiento, oposición y portabilidad.",
      subsections: [
        {
          title: "13.1 Tramitación Gratuita",
          body: "El ejercicio de los derechos de privacidad es gratuito. Toda solicitud es gestionada por el Delegado de Protección de Datos (DPO) en menos de 72 horas."
        }
      ]
    },
    14: {
      number: 14,
      title: "Cumplimiento de la Ley de Nigeria (NDPA 2023)",
      short: "Cumplimiento NDPA",
      content: "MsmeBooks cumple íntegramente las prescripciones de los artículos 48 y 49 de la NDPA 2023 y colabora activamente con la comisión reguladora NDPC.",
      subsections: [
        {
          title: "14.1 Régimen Sancionador Estatutario",
          body: "La ley impone techos sancionadores de hasta ₦10.000.000 para salvaguardar de manera efectiva la privacidad de empresas y ciudadanos."
        }
      ]
    },
    15: {
      number: 15,
      title: "Leyes de Privacidad Africanas e Internacionales",
      short: "Leyes Internacionales",
      content: "Nuestro marco se alinea con las legislaciones clave de África (POPIA en Sudáfrica, Kenya DPA, Ghana Data Protection Act) y el RGPD comunitario.",
      subsections: [
        {
          title: "15.1 Facilitación del Comercio Panafricano",
          body: "Diseñado para facilitar transacciones transfronterizas fluidas dentro de la Zona de Libre Comercio Continental Africana (AfCFTA)."
        }
      ]
    },
    16: {
      number: 16,
      title: "Procesamiento de Pagos y Datos Financieros",
      short: "Pagos & Finanzas",
      content: "La gestión de tarjetas cuenta con la certificación PCI-DSS Nivel 1. No guardamos números íntegros de tarjetas de crédito ni claves PIN.",
      subsections: [
        {
          title: "16.1 Pasarelas y Tokenización",
          body: "Los cobros se efectúan mediante identificadores cifrados gestionados por entidades de pago supervisadas (Paystack, Flutterwave)."
        }
      ]
    },
    17: {
      number: 17,
      title: "Funciones de IA y Procesamiento Automatizado",
      short: "Funciones de IA",
      content: "Nuestras herramientas de asistencia inteligente (lectura de comprobantes y conciliación) tratan la información de forma estrictamente privada.",
      subsections: [
        {
          title: "17.1 Cero Entrenamiento en Modelos Públicos",
          body: "Sus cuentas y facturas jamás se emplean para entrenar inteligencias artificiales públicas. El tratamiento es aislado y transitorio."
        }
      ]
    },
    18: {
      number: 18,
      title: "Privacidad por Módulos Sectoriales",
      short: "Módulos Sectoriales",
      content: "Reglas específicas adaptadas para comercio minorista (TPV), hoteles (PMS), sanidad y empresas que operan con MsmeBooks.",
      subsections: [
        {
          title: "18.1 Perfiles y Privilegios Restringidos",
          body: "El personal de mostrador solo accede al cobro directo, sin visibilidad sobre el estado de pérdidas y ganancias de la entidad."
        }
      ]
    },
    19: {
      number: 19,
      title: "Aplicaciones de Terceros e Integraciones API",
      short: "Integraciones & APIs",
      content: "La interoperabilidad con aplicaciones externas se realiza bajo el protocolo OAuth con registro detallado de auditoría.",
      subsections: [
        {
          title: "19.1 Revocación Inmediata",
          body: "Puede anular el acceso a cualquier conector externo de manera instantánea desde el panel de seguridad de su cuenta."
        }
      ]
    },
    20: {
      number: 20,
      title: "Privacidad de Menores",
      short: "Privacidad de Menores",
      content: "MsmeBooks es una plataforma empresarial orientada exclusivamente a personas mayores de 18 años. No recopilamos datos de menores de edad.",
      subsections: [
        {
          title: "20.1 Requisito de Capacidad Legal",
          body: "El registro exige capacidad jurídica de contratación en representación de una actividad comercial o societaria legalmente establecida."
        }
      ]
    },
    21: {
      number: 21,
      title: "Comunicaciones de Marketing",
      short: "Comunicaciones Marketing",
      content: "Puede cancelar la suscripción a boletines informativos en cualquier momento haciendo clic en el enlace incluido en cada envío.",
      subsections: [
        {
          title: "21.1 Comunicaciones Imprescindibles",
          body: "Los avisos de seguridad del servicio, facturas y alertas legales se continuarán remitiendo para asegurar la operativa de la cuenta."
        }
      ]
    },
    22: {
      number: 22,
      title: "Socios Comerciales y Distribuidores",
      short: "Socios & Distribuidores",
      content: "Asesores y distribuidores están vinculados por estrictos acuerdos de confidencialidad con aislamiento técnico entre cuentas.",
      subsections: [
        {
          title: "22.1 Aislamiento Multiinquilino",
          body: "Garantía de confidencialidad que impide que un gestor externo pueda cruzar información entre distintas empresas clientes."
        }
      ]
    },
    23: {
      number: 23,
      title: "Violaciones de Datos e Incidentes de Seguridad",
      short: "Incidentes de Seguridad",
      content: "En caso de producirse un incidente con riesgo para los datos, se notificará a la NDPC y a las empresas afectadas en un plazo máximo de 72 horas.",
      subsections: [
        {
          title: "23.1 Notificación Detallada",
          body: "El aviso describirá la naturaleza del suceso, tipología de datos afectados y las medidas técnicas de resolución activadas."
        }
      ]
    },
    24: {
      number: 24,
      title: "Modificaciones a la Política de Privacidad",
      short: "Actualizaciones",
      content: "Cualquier cambio sustancial será informado con 30 días de antelación mediante correo electrónico y alerta en el sistema.",
      subsections: [
        {
          title: "24.1 Historial de Versiones",
          body: "Las versiones precedentes de esta política continúan a disposición del público en nuestro archivo legal para su verificación."
        }
      ]
    },
    25: {
      number: 25,
      title: "Contacto y Delegado de Protección de Datos (DPO)",
      short: "Contacto & DPO",
      content: "Nuestro Delegado de Protección de Datos (DPO) y el gabinete jurídico atienden cualquier consulta o solicitud de derechos.",
      subsections: [
        {
          title: "25.1 Canales Oficiales",
          body: "Correo electrónico: dpo@msmebooks.org | Teléfono: +2349158482622 | Dirección: Plot 14 Commercial Avenue, Victoria Island, Lagos, Nigeria."
        }
      ]
    }
  }
};
