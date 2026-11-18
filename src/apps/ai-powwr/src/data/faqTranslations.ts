import { SupportedLocale, LocalizedFaqContent } from '../types/faq';

export const FAQ_TRANSLATIONS: Record<string, Partial<Record<SupportedLocale, LocalizedFaqContent>>> = {
  'faq-what-is-msmebooks': {
    fr: {
      question: 'Qu’est-ce que MsmeBooks ?',
      shortAnswer: 'MsmeBooks est un SaaS moderne tout-en-un basé sur le cloud combinant comptabilité, point de vente (POS), inventaire, paie et gestion d’entreprise conçu spécifiquement pour les PME en Afrique et dans le monde.',
      detailedAnswer: 'MsmeBooks consolide l’enregistrement financier, les ventes multicanaux, le contrôle des stocks en entrepôt, la paie du personnel et la veille commerciale au sein d’une plateforme unifiée.',
      steps: [
        'Créez votre compte gratuit sur www.msmebooks.org.',
        'Configurez le profil de votre entreprise, votre devise et vos paramètres fiscaux.',
        'Importez vos produits, vos services et vos soldes d’ouverture.',
        'Invitez vos collaborateurs avec des droits d’accès sécurisés par rôle.'
      ]
    },
    pt: {
      question: 'O que é o MsmeBooks?',
      shortAnswer: 'O MsmeBooks é uma plataforma SaaS na cloud tudo-em-um que combina contabilidade, ponto de venda (POS), inventário, processamento salarial e gestão empresarial, desenhada para PMEs em África e no mercado internacional.',
      detailedAnswer: 'O MsmeBooks centraliza o registo financeiro, vendas de balcão multiloja, controlo de armazéns, processamento de ordenados e análise de lucros num único sistema integrado e em tempo real.',
      steps: [
        'Crie a sua conta gratuita em www.msmebooks.org.',
        'Configure o perfil da sua empresa, a sua moeda de faturação e as regras fiscais de IVA.',
        'Importe ou adicione o seu catálogo de produtos, serviços e saldos de abertura.',
        'Convide os membros da sua equipa e atribua perfis de segurança e permissões.'
      ]
    },
    es: {
      question: '¿Qué es MsmeBooks?',
      shortAnswer: 'MsmeBooks es una plataforma SaaS en la nube todo en uno que combina contabilidad, punto de venta (POS), inventario, nómina y gestión empresarial, diseñada para pymes en África y el mundo.',
      detailedAnswer: 'MsmeBooks consolida el registro financiero, ventas multicanal, control de almacén, nómina y analítica de negocios en una única plataforma en tiempo real.',
      steps: [
        'Crea tu cuenta gratis en www.msmebooks.org.',
        'Configura el perfil de tu empresa, moneda y parámetros fiscales.',
        'Importa o agrega tus productos, servicios y saldos iniciales.',
        'Invita a miembros de tu equipo con roles y permisos específicos.'
      ]
    },
    ar: {
      question: 'ما هو نظام MsmeBooks؟',
      shortAnswer: 'هو نظام سحابي متكامل (SaaS) لإدارة الحسابات، نقاط البيع (POS)، المخزون، الرواتب، وإدارة الأعمال مصمم خصيصاً للمنشآت الصغيرة والمتوسطة في إفريقيا والعالم.',
      detailedAnswer: 'يقوم MsmeBooks بتوحيد القيود المحاسبية، ومبيعات الكاشير، وإدارة المستودعات، ورواتب الموظفين في دفتر أستاذ واحد وفوري بدلاً من استخدام برامج منفصلة.',
      steps: [
        'أنشئ حسابك المجاني عبر www.msmebooks.org.',
        'اضبط الملف التعريفي لشركتك، العملة، والإعدادات الضريبية.',
        'قم باستيراد أو إضافة الأصناف والخدمات والأرصدة الافتتاحية.',
        'وجّه الدعوة لفريق عملك وحدد الصلاحيات الأمنية لكل مستخدم.'
      ]
    }
  },

  'faq-who-can-use': {
    fr: {
      question: 'Qui peut utiliser MsmeBooks ?',
      shortAnswer: 'MsmeBooks est conçu pour les propriétaires d’entreprises, entrepreneurs individuels, commerçants, gérants d’hôtels, comptables et directeurs d’entreprises en Afrique et à l’international.',
      detailedAnswer: 'Que vous dirigiez une épicerie de quartier, une pharmacie, un hôtel de charme, un supermarché multi-magasins ou un cabinet comptable, MsmeBooks s’adapte à la taille et aux spécificités de votre activité.'
    },
    pt: {
      question: 'Quem pode utilizar o MsmeBooks?',
      shortAnswer: 'O MsmeBooks destina-se a empresários, comerciantes, diretores de hotéis, contabilistas e fundadores de micro, pequenas e médias empresas em toda a África e a nível global.',
      detailedAnswer: 'Quer faça a gestão de um pequeno comércio retalhista, de uma farmácia, de um hotel turístico, de uma rede de supermercados ou de uma firma de auditoria e contabilidade, o sistema adapta-se à escala do seu negócio.'
    },
    es: {
      question: '¿Quién puede usar MsmeBooks?',
      shortAnswer: 'MsmeBooks está diseñado para dueños de negocios, emprendedores, comerciantes, administradores de hoteles, contadores y directores de empresas en todo el mundo.',
      detailedAnswer: 'Ya sea que administres una tienda local, una farmacia, un hotel boutique, un supermercado con varias sucursales o una firma de contabilidad, la plataforma se adapta a tus necesidades.'
    },
    ar: {
      question: 'من يمكنه الاستفادة من نظام MsmeBooks؟',
      shortAnswer: 'صُمم النظام لأصحاب الأنشطة التجارية، رواد الأعمال، تجار التجزئة، مديري الفنادق، المحاسبين والمديرين التنفيذيين في إفريقيا وكافة أنحاء العالم.',
      detailedAnswer: 'سواء كنت تدير متجراً صغيراً، صيدلية، فندقاً سياحياً، سوبرماركت متعدد الفروع أو مكتباً محاسبياً استشارياً، فإن النظام يتكيف بدقة مع حجم عملياتك.'
    }
  },

  'faq-micro-small-businesses': {
    fr: {
      question: 'MsmeBooks est-il adapté aux très petites et petites entreprises ?',
      shortAnswer: 'Oui. MsmeBooks a été pensé avec des flux simplifiés, des forfaits très accessibles et une approche mobile pour permettre aux micro-entreprises de passer facilement du carnet papier au numérique.',
      detailedAnswer: 'Les petites entreprises profitent d’une facturation simple, de reçus mobiles partagés sur WhatsApp et d’un suivi automatisé des pertes et profits sans nécessiter d’expertise comptable préalable.'
    },
    pt: {
      question: 'O MsmeBooks é adequado para micro e pequenas empresas?',
      shortAnswer: 'Sim, perfeitamente. O MsmeBooks foi desenhado com processos intuitivos, preços altamente acessíveis e uma interface pensada para telemóveis, facilitando a transição do papel para o digital.',
      detailedAnswer: 'Os pequenos negócios contam com emissão rápida de faturas e recibos para WhatsApp, cálculo automático de lucros e controlo de caixa sem precisarem de conhecimentos contabilísticos avançados.'
    },
    es: {
      question: '¿Es adecuado MsmeBooks para micro y pequeñas empresas?',
      shortAnswer: 'Sí. MsmeBooks fue diseñado con flujos sencillos, planes accesibles y diseño pensado para móviles, facilitando la transición de cuadernos de papel a registros digitales.',
      detailedAnswer: 'Las pequeñas empresas aprovechan facturación rápida, recibos por WhatsApp y reportes automáticos de pérdidas y ganancias sin requerir conocimientos contables avanzados.'
    },
    ar: {
      question: 'هل النظام مناسب للمشاريع متناهية الصغر والشركات الناشئة؟',
      shortAnswer: 'نعم تماماً. صُمم النظام بواجهات بالغة البساطة، وأسعار اقتصادية، وتوافق كامل مع الهواتف الذكية لمساعدة أصحاب المتاجر على الانتقال من الدفاتر الورقية إلى السجلات الرقمية.',
      detailedAnswer: 'تستفيد المشاريع الصغيرة من إصدار الفواتير الفورية، ومشاركة الإيصالات عبر واتساب، وحساب الأرباح والخسائر تلقائياً دون الحاجة إلى خلفية محاسبية مسبقة.'
    }
  },

  'faq-medium-growing-enterprises': {
    fr: {
      question: 'Les entreprises moyennes et en expansion peuvent-elles utiliser MsmeBooks ?',
      shortAnswer: 'Absolument. MsmeBooks monte facilement en charge avec la gestion multi-entrepôts, la consolidation multi-succursales, la matrice d’approbation des utilisateurs et les API REST.',
      detailedAnswer: 'Les structures disposant de plusieurs points de vente, d’entrepôts logistiques et de nombreux collaborateurs s’appuient sur MsmeBooks Entreprise pour une visibilité consolidée en temps réel.'
    },
    pt: {
      question: 'Empresas de média e grande dimensão podem utilizar o MsmeBooks?',
      shortAnswer: 'Sim, com total segurança. O MsmeBooks suporta múltiplos armazéns, consolidação de contabilidade entre sucursais, fluxos de aprovação de despesas e integração com APIs externas.',
      detailedAnswer: 'Empresas em forte crescimento com várias lojas físicas, centros de distribuição e dezenas de colaboradores utilizam o MsmeBooks Enterprise para uma visão analítica consolidada em tempo real.'
    },
    es: {
      question: '¿Pueden las medianas y grandes empresas usar MsmeBooks?',
      shortAnswer: 'Totalmente. MsmeBooks escala sin fricción con múltiples almacenes, contabilidad consolidada por sucursales, aprobaciones avanzadas de usuarios y conectores API REST.',
      detailedAnswer: 'Compañías en crecimiento con múltiples tiendas, depósitos y equipos numerosos utilizan MsmeBooks Enterprise para mantener control total y auditoría financiera.'
    },
    ar: {
      question: 'هل يمكن للشركات المتوسطة وسريعة النمو الاعتماد على النظام؟',
      shortAnswer: 'بكل تأكيد. يتوسع النظام بسلاسة ليدعم تعدد المستودعات، والربط المحاسبي الموحد بين الفروع، ومصفوفة صلاحيات المستخدمين، والربط البرمجي عبر REST APIs.',
      detailedAnswer: 'تعتمد الشركات ذات الفروع المتعددة ومراكز التوزيع الكبرى على باقة Enterprise للحصول على تقارير مالية مجمعة ومراقبة حركة المخزون في جميع المواقع لحظياً.'
    }
  },

  'faq-cloud-based': {
    fr: {
      question: 'MsmeBooks est-il une plateforme SaaS basée sur le cloud ?',
      shortAnswer: 'Oui. MsmeBooks est 100 % hébergé dans le cloud. Vous n’avez pas besoin de serveurs locaux coûteux, d’installations manuelles ni de sauvegardes complexes.',
      detailedAnswer: 'Connectez-vous en toute sécurité depuis n’importe quel navigateur sur PC, Mac, iPad, tablette Android ou smartphone. Des sauvegardes quotidiennes garantissent la sécurité permanente de vos données.'
    },
    pt: {
      question: 'O MsmeBooks é um software SaaS 100% alojado na cloud?',
      shortAnswer: 'Sim. O MsmeBooks funciona integralmente na cloud. Não necessita de servidores dispendiosos, configurações manuais complexas nem de cópias de segurança manuais.',
      detailedAnswer: 'Inicie sessão com total encriptação a partir de qualquer navegador web em computadores, tablets ou telemóveis. Backups diários contínuos garantem que os seus dados estão sempre protegidos.'
    },
    es: {
      question: '¿Es MsmeBooks una plataforma SaaS 100% en la nube?',
      shortAnswer: 'Sí. MsmeBooks opera totalmente en la nube. No requieres comprar servidores dedicados ni realizar copias de seguridad manuales.',
      detailedAnswer: 'Accede de forma segura desde cualquier navegador web en PC, Mac, tabletas o teléfonos móviles con respaldos automáticos continuos en la nube.'
    },
    ar: {
      question: 'هل نظام MsmeBooks سحابي بالكامل (Cloud SaaS)؟',
      shortAnswer: 'نعم. يعمل النظام سحابياً بنسبة 100% عبر الإنترنت، مما يغنيك عن شراء خوادم باهظة الثمن أو القلق بشأن النسخ الاحتياطي اليدوي.',
      detailedAnswer: 'يمكنك تسجيل الدخول بأمان تام من أي متصفح على أجهزة الكمبيوتر، الأجهزة اللوحية أو الهواتف الذكية مع نسخ احتياطي يومي مشفر تلقائياً.'
    }
  },

  'faq-business-problems-solved': {
    fr: {
      question: 'Quels problèmes d’entreprise MsmeBooks résout-il ?',
      shortAnswer: 'Il élimine les erreurs de calcul manuel, les pertes d’inventaire non tracées, les retards de facturation, les ruptures de caisse et les décisions financières à l’aveugle.',
      detailedAnswer: 'En synchronisant chaque caisse, bon de commande, facture fournisseur et encaissement bancaire, vous n’avez plus à attendre la fin du mois pour connaître votre trésorerie réelle.'
    },
    pt: {
      question: 'Que problemas de negócio o MsmeBooks resolve?',
      shortAnswer: 'Elimina erros de cálculo manuais, quebras de stock não rastreadas, atrasos na cobrança de clientes, discrepâncias no caixa e falta de visibilidade financeira.',
      detailedAnswer: 'Ao ligar cada ponto de venda, encomenda e extrato bancário em tempo real, os gestores sabem exatamente a posição de liquidez e o lucro sem terem de esperar pelo fim do mês.'
    },
    es: {
      question: '¿Qué problemas de negocio resuelve MsmeBooks?',
      shortAnswer: 'Elimina errores de cálculo manual, mermas de inventario no detectadas, retrasos en cobranza, ventas de mostrador desconectadas y falta de visibilidad financiera.',
      detailedAnswer: 'Sincroniza en tiempo real cada terminal de caja, orden de compra y pago bancario, brindando información exacta del flujo de caja sin esperar al cierre de mes.'
    },
    ar: {
      question: 'ما هي المشكلات التشغيلية التي يعالجها النظام؟',
      shortAnswer: 'يقضي على الأخطاء الحسابية اليدوية، وتسربات المخزون غير المبررة، وتأخر تحصيل الفواتير، وفوضى الكاشير، وغياب الرؤية المالية الواضحة.',
      detailedAnswer: 'من خلال مزامنة نقاط البيع، وفواتير الموردين، والمقبوضات البنكية لحظياً، يتمكن أصحاب الأعمال من معرفة السيولة النقدية الحقيقية وصافي الأرباح فورياً.'
    }
  },

  'faq-traditional-accounting-difference': {
    fr: {
      question: 'En quoi MsmeBooks diffère-t-il des logiciels comptables traditionnels ?',
      shortAnswer: 'Les logiciels traditionnels nécessitent des installations lourdes et un jargon complexe. MsmeBooks combine POS, stocks, RH et comptabilité avec l’intégration native des paiements mobiles africains.',
      detailedAnswer: 'Contrairement aux logiciels occidentaux qui adaptent mal les devises africaines et le Mobile Money (M-Pesa, MoMo), MsmeBooks a été conçu dès l’origine pour les réalités du commerce africain et international.'
    },
    pt: {
      question: 'Em que difere o MsmeBooks dos softwares de contabilidade tradicionais?',
      shortAnswer: 'Os sistemas tradicionais exigem instalações de secretária pesadas e módulos caros. O MsmeBooks unifica POS, armazéns, salários e contabilidade com suporte nativo a pagamentos digitais e móveis.',
      detailedAnswer: 'Ao contrário de soluções internacionais rígidas, o MsmeBooks foi arquitetado a pensar nas moedas de África e do mundo (Kwanza, Metical, Naira, Rand, Dólar, Euro) e nos fluxos comerciais reais.'
    },
    es: {
      question: '¿Qué diferencia a MsmeBooks de los sistemas contables tradicionales?',
      shortAnswer: 'Los sistemas tradicionales son rígidos, requieren costosos complementos e instalaciones de escritorio. MsmeBooks integra TPV, inventario, nómina y bancos de forma intuitiva.',
      detailedAnswer: 'Fue diseñado contemplando monedas locales, pagos móviles y fiscalización regional desde su arquitectura base.'
    },
    ar: {
      question: 'ما الذي يميز MsmeBooks عن البرامج المحاسبية التقليدية؟',
      shortAnswer: 'البرامج القديمة تتطلب تثبيتاً معقداً على أجهزة سطح المكتب وتكاليف إضافية لكل وحدة. يجمع MsmeBooks نقاط البيع، المخزون، الرواتب والحسابات في منصة متكاملة وذكية.',
      detailedAnswer: 'بخلاف البرامج الغربية، تم بناء المنظومة من الأساس لتلائم وسائل الدفع الإلكتروني الحديثة، والعملات الإقليمية، واللوائح الضريبية المعتمدة.'
    }
  },

  'faq-how-to-create-account': {
    fr: {
      question: 'Comment créer un compte ?',
      shortAnswer: 'Cliquez sur « Démarrer gratuitement » sur www.msmebooks.org, saisissez le nom de votre entreprise et votre e-mail. Aucune carte bancaire n’est requise.',
      detailedAnswer: 'Votre espace de travail est déployé instantanément. Un assistant de démarrage rapide vous aide à configurer votre profil d’activité, votre devise et votre logo en moins de 2 minutes.',
      steps: [
        'Rendez-vous sur www.msmebooks.org et cliquez sur « Démarrer gratuitement ».',
        'Indiquez votre nom complet, votre e-mail professionnel et un mot de passe sécurisé.',
        'Sélectionnez votre pays principal et votre devise d’exploitation.',
        'Suivez le guide en 3 étapes pour émettre votre première facture.'
      ]
    },
    pt: {
      question: 'Como criar uma nova conta?',
      shortAnswer: 'Clique em "Começar Grátis" em www.msmebooks.org, preencha o nome da sua empresa e o seu e-mail de contacto. Não é necessário cartão de crédito.',
      detailedAnswer: 'A sua conta é ativada em poucos segundos com um assistente guiado para configurar a sua moeda oficial, taxas de imposto e logótipo em menos de 2 minutos.',
      steps: [
        'Aceda ao site www.msmebooks.org e carregue no botão "Começar Grátis".',
        'Introduza o seu nome completo, e-mail de trabalho e crie uma palavra-passe.',
        'Escolha o seu país principal e a moeda operacional.',
        'Conclua o guia de 3 passos para emitir a sua primeira fatura de venda.'
      ]
    },
    es: {
      question: '¿Cómo creo una cuenta en MsmeBooks?',
      shortAnswer: 'Haz clic en "Comenzar Gratis" en www.msmebooks.org, ingresa los datos de tu empresa y confirma tu correo. No se requiere tarjeta de crédito.',
      detailedAnswer: 'Tu espacio de trabajo se activa de inmediato con un asistente que te ayuda a configurar tu catálogo y moneda en menos de 2 minutos.',
      steps: [
        'Ingresa a www.msmebooks.org y pulsa "Comenzar Gratis".',
        'Ingresa tu nombre, correo corporativo y contraseña.',
        'Selecciona tu país y moneda de operación.',
        'Sigue la guía de 3 pasos para emitir tu primer comprobante.'
      ]
    },
    ar: {
      question: 'كيف يمكنني إنشاء حساب جديد؟',
      shortAnswer: 'انقر على زر "ابدأ مجاناً" عبر الموقع www.msmebooks.org، وسجل اسم منشأتك وبريدك الإلكتروني. لا يلزم إدخال بطاقة ائتمانية للبدء.',
      detailedAnswer: 'يتم تجهيز مساحة العمل الخاصة بك فورياً، وسيرشدك معالج الإعداد التفاعلي لضبط نشاطك، عملتك، وشعار شركتك في أقل من دقيقتين.',
      steps: [
        'توجه إلى www.msmebooks.org واضغط على "ابدأ مجاناً".',
        'أدخل اسمك الكامل، والبريد الإلكتروني للعمل، وكلمة مرور قوية.',
        'اختر دولتك الرئيسية وعملتك المعتمدة.',
        'اتبع الخطوات الإرشادية لإصدار أول فاتورة مبيعات لك.'
      ]
    }
  },

  'faq-is-msmebooks-free': {
    fr: {
      question: 'Puis-je commencer à utiliser MsmeBooks gratuitement ?',
      shortAnswer: 'Oui. MsmeBooks propose un Forfait Gratuit pour les micro-entreprises, ainsi qu’un essai complet de 14 jours de notre Forfait Entreprise sans aucune carte de crédit requise.',
      detailedAnswer: 'Le forfait gratuit vous permet de facturer vos clients, d’enregistrer vos dépenses et d’éditer vos états financiers essentiels. Lorsque votre volume augmente, vous pouvez passer au forfait supérieur.'
    },
    pt: {
      question: 'Posso começar a utilizar o MsmeBooks gratuitamente?',
      shortAnswer: 'Sim. O MsmeBooks oferece um Plano Gratuito Vitalício para microempresas e um teste completo de 14 dias do Plano Enterprise, sem exigir qualquer cartão de crédito.',
      detailedAnswer: 'O plano gratuito permite emitir faturas, registar despesas e acompanhar o resumo financeiro diário. Pode fazer upgrade para planos com mais utilizadores e módulos avançados quando desejar.'
    },
    es: {
      question: '¿Puedo empezar a usar MsmeBooks gratis?',
      shortAnswer: 'Sí. Ofrecemos un Plan Gratuito para microempresas y una prueba completa de 14 días del Plan Enterprise sin solicitar tarjeta bancaria.',
      detailedAnswer: 'El plan gratuito te permite emitir facturas, registrar gastos y generar reportes financieros básicos. A medida que tu negocio crece, puedes cambiar de plan fácilmente.'
    },
    ar: {
      question: 'هل يمكنني بدء استخدام النظام مجاناً؟',
      shortAnswer: 'نعم. يوفر MsmeBooks باقة مجانية دائمة للمشاريع متناهية الصغر، بالإضافة إلى فترة تجربة مجانية شاملة لمدة 14 يوماً للباقة الاحترافية دون طلب بطاقة ائتمان.',
      detailedAnswer: 'تتيح لك الباقة المجانية إصدار فواتير العملاء، وقيد المصروفات، وإدارة المخزون الأساسي، وإصدار التقارير المالية الرئيسية، مع إمكانية الترقية متى زاد نشاطك.'
    }
  },

  'faq-pos-without-internet': {
    fr: {
      question: 'Puis-je utiliser le Point de Vente (POS) sans connexion internet ?',
      shortAnswer: 'Oui, le mode hors ligne est totalement pris en charge. En cas de coupure internet ou d’électricité, les caissiers continuent d’encaisser, de scanner et d’imprimer les tickets sans interruption.',
      detailedAnswer: 'Toutes les ventes hors ligne sont enregistrées en toute sécurité dans le cache local du navigateur et synchronisées automatiquement dès que la connexion internet est rétablie.'
    },
    pt: {
      question: 'Posso utilizar o Ponto de Venda (POS) sem ligação à internet?',
      shortAnswer: 'Sim, o modo offline está totalmente incluído. Se houver falha de rede ou de energia, os caixas continuam a registar vendas, ler códigos de barras e imprimir recibos sem paragens.',
      detailedAnswer: 'Todas as transações em modo offline são guardadas em segurança na memória local do navegador e sincronizadas automaticamente com a cloud assim que a ligação for restabelecida.'
    },
    es: {
      question: '¿Puedo utilizar el punto de venta (POS) sin conexión a internet?',
      shortAnswer: 'Sí, el modo offline está integrado. Si se corta internet, tus cajeros pueden continuar cobrando, escaneando códigos de barras e imprimiendo recibos con normalidad.',
      detailedAnswer: 'Las ventas realizadas sin conexión se almacenan de forma segura y se sincronizan automáticamente con la nube en cuanto se restablece la red.'
    },
    ar: {
      question: 'هل تعمل شاشات نقاط البيع (POS) بدون اتصال بالإنترنت؟',
      shortAnswer: 'نعم، يدعم النظام العمل في وضع عدم الاتصال (Offline). إذا انقطع الإنترنت، يواصل الكاشير تسجيل المبيعات، ومسح الباركود، وطباعة الإيصالات بلا أي توقف.',
      detailedAnswer: 'يتم حفظ كافة عمليات البيع مؤقتاً وبأمان تام في المتصفح، ثم تُرفع وتُحدث تلقائياً في السجلات السحابية فور عودة اتصال الإنترنت.'
    }
  },

  'faq-pos-barcode-scanner': {
    fr: {
      question: 'Puis-je connecter un lecteur de code-barres au POS MsmeBooks ?',
      shortAnswer: 'Oui. Le POS MsmeBooks prend en charge les scanners USB, Bluetooth et sans fil (codes 1D et 2D/QR) sans nécessiter de pilote particulier.',
      detailedAnswer: 'Vous pouvez également utiliser la caméra intégrée d’un smartphone ou d’une tablette comme scanner instantané pour équiper vos vendeurs à moindre coût.'
    },
    pt: {
      question: 'Posso ligar um leitor de código de barras ao POS do MsmeBooks?',
      shortAnswer: 'Sim. É compatível com scanners USB, Bluetooth e sem fios padrão (códigos de barras 1D e QR codes 2D) sem necessidade de instalar drivers adicionais.',
      detailedAnswer: 'Também é possível utilizar a câmara de qualquer smartphone ou tablet como leitor ótico instantâneo, permitindo equipar colaboradores de loja sem despesas suplementares.'
    },
    es: {
      question: '¿Puedo conectar un lector de código de barras al POS?',
      shortAnswer: 'Sí. Soporta lectores estándar USB, Bluetooth e inalámbricos para códigos 1D y códigos QR sin necesidad de instalar controladores adicionales.',
      detailedAnswer: 'También puedes utilizar la cámara de cualquier teléfono inteligente o tableta como lector de códigos para tu equipo de ventas.'
    },
    ar: {
      question: 'هل يمكن ربط قارئ الباركود بنقاط البيع؟',
      shortAnswer: 'نعم. يدعم كاشير MsmeBooks كافة أجهزة قراءة الباركود السلكية (USB) واللاسلكية (Bluetooth) للرموز الأحادية وثنائية الأبعاد (QR) بدون برامج تشغيل إضافية.',
      detailedAnswer: 'يمكنك أيضاً استخدام كاميرا الهاتف أو الجهاز اللوحي كقارئ باركود فوري، مما يوفر تكاليف شراء أجهزة خارجية إضافية.'
    }
  },

  'faq-pos-receipt-printers': {
    fr: {
      question: 'MsmeBooks prend-il en charge les imprimantes thermiques de reçus ?',
      shortAnswer: 'Oui. Il est compatible avec toutes les imprimantes thermiques standard de 58 mm et 80 mm ESC/POS via USB, Bluetooth, réseau Ethernet ou Wi-Fi.',
      detailedAnswer: 'Personnalisez vos reçus avec le logo de votre entreprise, l’adresse de la succursale, le numéro fiscal et vos conditions de retour.'
    },
    pt: {
      question: 'O MsmeBooks é compatível com impressoras térmicas de talões e recibos?',
      shortAnswer: 'Sim. Funciona com impressoras térmicas padrão de 58 mm e 80 mm ESC/POS ligadas por cabo USB, Bluetooth, rede Ethernet ou Wi-Fi.',
      detailedAnswer: 'Personalize o desenho dos talões com o logótipo da sua empresa, número de contribuinte (NIF), moradas das lojas e políticas de devolução.'
    },
    es: {
      question: '¿MsmeBooks es compatible con impresoras térmicas de tickets?',
      shortAnswer: 'Sí. Funciona con impresoras térmicas estándar de 58 mm y 80 mm ESC/POS mediante USB, Bluetooth, red local o Wi-Fi.',
      detailedAnswer: 'Personaliza el diseño de los recibos con tu logotipo, datos de contacto, número de registro fiscal y políticas de cambio.'
    },
    ar: {
      question: 'هل يدعم النظام طابعات الإيصالات الحرارية؟',
      shortAnswer: 'نعم. متوافق تماماً مع جميع طابعات الإيصالات الحرارية القياسية مقاس 58 ملم و80 ملم (ESC/POS) عبر USB، بلوتوث، الشبكة المحلية أو الواي فاي.',
      detailedAnswer: 'يمكنك تخصيص ترويسة وتذييل الإيصال بشعار شركتك، والرقم الضريبي، وعناوين الفروع، وشروط الاسترجاع والاستبدال.'
    }
  },

  'faq-hotel-pms-available': {
    fr: {
      question: 'MsmeBooks propose-t-il un système de gestion hôtelière (PMS) ?',
      shortAnswer: 'Oui. MsmeBooks intègre un module hôtelier complet (PMS) pour les hôtels, résidences de tourisme, maisons d’hôtes et appartements meublés.',
      detailedAnswer: 'Ce module gère le planning des chambres, l’enregistrement des arrivées/départs, les folios clients et relie directement les consommations du restaurant ou bar à la note de chambre.'
    },
    pt: {
      question: 'O MsmeBooks disponibiliza um sistema de gestão hoteleira (Hotel PMS)?',
      shortAnswer: 'Sim. O MsmeBooks dispõe de um módulo dedicado de Hotel PMS para hotéis, pousadas, estalagens, resorts e alojamento local.',
      detailedAnswer: 'Gere o mapa de ocupação de quartos, check-in e check-out de hóspedes, folios de cobrança e debita despesas de restaurante ou bar diretamente na fatura do quarto.'
    },
    es: {
      question: '¿MsmeBooks incluye un sistema de gestión para hoteles (PMS)?',
      shortAnswer: 'Sí. Cuenta con un módulo especializado PMS para hoteles, posadas, apartamentos turísticos y hostales.',
      detailedAnswer: 'Administra reservas de habitaciones, check-in y check-out, estados de limpieza y carga consumos de restaurante directamente a la cuenta del huésped.'
    },
    ar: {
      question: 'هل يوفر النظام موديول خاص بإدارة الفنادق والشقق الفندقية (Hotel PMS)؟',
      shortAnswer: 'نعم. يحتوي MsmeBooks على نظام متقدم لإدارة الفنادق والمنتجعات والشقق المفروشة (PMS) يغطي كافة الجوانب التشغيلية والمالية.',
      detailedAnswer: 'يدير النظام حجوزات الغرف، تسكين ومغادرة النزلاء (Check-in/Out)، فواتير الغرف، وربط طلبات المطعم والمقهى مباشرة بحساب إقامة النزيل.'
    }
  },

  'faq-inventory-multiple-warehouses': {
    fr: {
      question: 'Puis-je gérer plusieurs entrepôts et dépôts de stockage ?',
      shortAnswer: 'Oui. MsmeBooks prend en charge un nombre illimité d’entrepôts, réserves de magasins et dépôts logistiques avec valorisation dédiée.',
      detailedAnswer: 'Suivez le stock disponible dans chaque lieu, effectuez des transferts internes entre dépôts avec bons d’expédition et suivez les marchandises en transit.'
    },
    pt: {
      question: 'Posso gerir múltiplos armazéns e pontos de stock?',
      shortAnswer: 'Sim. O MsmeBooks suporta armazéns, entrepostos e lojas ilimitadas com valorização de inventário e controlo de lotes em tempo real.',
      detailedAnswer: 'Acompanhe as quantidades disponíveis em cada armazém, emita guias de transferência internas entre filiais e rastreie artigos em trânsito com rigor financeiro.'
    },
    es: {
      question: '¿Puedo gestionar múltiples almacenes y depósitos?',
      shortAnswer: 'Sí. Permite administrar bodegas y puntos de venta ilimitados con valoraciones de inventario y ubicaciones específicas.',
      detailedAnswer: 'Supervisa existencias en cada sucursal, genera notas de transferencia entre almacenes y controla mercancías en tránsito.'
    },
    ar: {
      question: 'هل يمكن إدارة عدة مستودعات ومراكز تخزين؟',
      shortAnswer: 'نعم. يدعم النظام عدداً غير محدود من المستودعات، والمخازن الفرعية، ونقاط البيع مع تقييم محاسبي مستقل لكل موقع.',
      detailedAnswer: 'يمكنك مراقبة كميات الأصناف المتاحة في كل مستودع، وإجراء سندات التحويل المخزني بين الفروع، وتتبع البضائع قيد النقل والشحن.'
    }
  }
};

/**
 * Returns a localized version of an FAQ.
 * If translations exist for the requested locale, it blends them into the item.
 */
export function getLocalizedFaqData(
  faq: any,
  locale: SupportedLocale
): any {
  if (locale === 'en') {
    return faq;
  }

  // 1. Check embedded translations on the FAQ object
  const embedded = faq.translations?.[locale];
  if (embedded) {
    return {
      ...faq,
      question: embedded.question || faq.question,
      shortAnswer: embedded.shortAnswer || faq.shortAnswer,
      detailedAnswer: embedded.detailedAnswer || faq.detailedAnswer,
      steps: embedded.steps || faq.steps,
    };
  }

  // 2. Check translation registry
  const registered = FAQ_TRANSLATIONS[faq.id]?.[locale];
  if (registered) {
    return {
      ...faq,
      question: registered.question || faq.question,
      shortAnswer: registered.shortAnswer || faq.shortAnswer,
      detailedAnswer: registered.detailedAnswer || faq.detailedAnswer,
      steps: registered.steps || faq.steps,
    };
  }

  return faq;
}
