import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Building,
  FileSpreadsheet,
  Wifi,
  Landmark,
  Users,
  ShieldCheck,
  TrendingUp,
  X,
  RotateCcw,
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingTask {
  id: string;
  day: number;
  titleEn: string;
  titleFr: string;
  titlePt: string;
  titleEs: string;
  descEn: string;
  descFr: string;
  descPt: string;
  descEs: string;
  icon: React.ElementType;
}

const ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: 'step-1',
    day: 1,
    titleEn: 'Configure Company Profile & Tax TIN',
    titleFr: 'Configurer le Profil Entreprise & NIF/TIN',
    titlePt: 'Configurar Perfil da Empresa e NIF/TIN',
    titleEs: 'Configurar Perfil de Empresa y NIF/TIN',
    descEn: 'Upload business logo, legal name, and tax identification for compliant receipts.',
    descFr: 'Téléchargez le logo, la raison sociale et le NIF pour des reçus conformes.',
    descPt: 'Envie o logotipo, razão social e NIF para recibos fiscais válidos.',
    descEs: 'Suba el logotipo comercial, razón social y NIF para recibos conformes.',
    icon: Building,
  },
  {
    id: 'step-2',
    day: 2,
    titleEn: 'Create & Send Your First E-Invoice',
    titleFr: 'Créer & Envoyer Votre 1ère Facture Électronique',
    titlePt: 'Criar e Enviar Sua Primeira Fatura Eletrônica',
    titleEs: 'Crear y Enviar su Primera Factura Electrónica',
    descEn: 'Generate an automatic 7.5% VAT invoice with QR verification code and WhatsApp share.',
    descFr: 'Générez une facture avec TVA 7.5% automatique, code QR et partage WhatsApp.',
    descPt: 'Gere uma fatura com IVA 7.5%, QR Code de validação e compartilhamento WhatsApp.',
    descEs: 'Genere una factura con IVA 7.5% automático, código QR y envío por WhatsApp.',
    icon: FileSpreadsheet,
  },
  {
    id: 'step-3',
    day: 3,
    titleEn: 'Sync Offline POS & Test Offline Mode',
    titleFr: 'Synchroniser le POS & Tester le Mode Hors-Ligne',
    titlePt: 'Sincronizar POS e Testar Modo Offline',
    titleEs: 'Sincronizar POS y Probar Modo Sin Conexión',
    descEn: 'Ring up cash and card sales without internet; observe auto-sync upon reconnection.',
    descFr: 'Enregistrez des ventes sans internet; synchronisation auto dès le retour réseau.',
    descPt: 'Registe vendas sem internet; sincronização automática ao restabelecer a rede.',
    descEs: 'Registre ventas en efectivo sin internet; sincronización automática al conectar.',
    icon: Wifi,
  },
  {
    id: 'step-4',
    day: 4,
    titleEn: 'Connect Corporate Bank Feed',
    titleFr: 'Connecter le Flux Bancaire Entreprise',
    titlePt: 'Conectar Extrato Bancário Corporativo',
    titleEs: 'Conectar Fuente Bancaria Corporativa',
    descEn: 'Auto-import bank transactions with real-time AI ledger reconciliation.',
    descFr: 'Importez automatiquement les relevés bancaires avec rapprochement IA.',
    descPt: 'Importação automática de transações bancárias com reconciliação contábil por IA.',
    descEs: 'Importe transacciones bancarias con conciliación contable por IA.',
    icon: Landmark,
  },
  {
    id: 'step-5',
    day: 5,
    titleEn: 'Invite Your Store Managers & Accountant',
    titleFr: 'Inviter les Responsables de Magasin & Comptable',
    titlePt: 'Convidar Gerentes de Loja e Contador',
    titleEs: 'Invitar a Gerentes de Tienda y Contador',
    descEn: 'Assign granular role-based permissions (Cashier, Store Manager, Auditor).',
    descFr: 'Attribuez des droits d’accès précis (Caissier, Gérant, Expert-comptable).',
    descPt: 'Atribua permissões granulares baseadas em funções (Caixa, Gerente, Auditor).',
    descEs: 'Asigne permisos detallados basados en roles (Cajero, Gerente, Auditor).',
    icon: Users,
  },
  {
    id: 'step-6',
    day: 6,
    titleEn: 'Verify Statutory VAT & Withholding Tax Rules',
    titleFr: 'Vérifier la TVA Statutaire & Retenues à la Source',
    titlePt: 'Verificar Regras de IVA e Retenção na Fonte',
    titleEs: 'Verificar Reglas de IVA y Retención en la Fuente',
    descEn: 'One-click generation of monthly FIRS / NRS compliant withholding tax schedules.',
    descFr: 'Génération en 1 clic des déclarations mensuelles de TVA et retenues à la source.',
    descPt: 'Geração em um clique dos relatórios mensais de retenção e IVA.',
    descEs: 'Generación en un clic de declaraciones mensuales de retenciones e IVA.',
    icon: ShieldCheck,
  },
  {
    id: 'step-7',
    day: 7,
    titleEn: 'Review Live Financial Health & P&L',
    titleFr: 'Consulter la Santé Financière & Compte de Résultat',
    titlePt: 'Analisar Saúde Financeira e DRE em Tempo Real',
    titleEs: 'Analizar Salud Financiera y Estado de Resultados',
    descEn: 'Track net margins, gross profit per branch, and cash flow forecast.',
    descFr: 'Analysez les marges nettes, bénéfice par point de vente et prévisions de trésorerie.',
    descPt: 'Acompanhe margens líquidas, lucro por filial e previsão de fluxo de caixa.',
    descEs: 'Analice márgenes netos, beneficio por sucursal y previsión de flujo de caja.',
    icon: TrendingUp,
  },
];

export const OnboardingTracker: React.FC<{ onOpenTrial?: () => void }> = ({ onOpenTrial }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks-onboarding-tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // Safe fallback
    }
    // Default: Step 1 completed for nice initial onboarding state
    return ['step-1'];
  });

  const toggleTask = (taskId: string) => {
    const isDone = completedTaskIds.includes(taskId);
    let next: string[];
    if (isDone) {
      next = completedTaskIds.filter((id) => id !== taskId);
    } else {
      next = [...completedTaskIds, taskId];
      // If reached 100% (7 of 7), celebrate with confetti!
      if (next.length === ONBOARDING_TASKS.length) {
        triggerConfetti(3500);
      }
    }

    setCompletedTaskIds(next);
    try {
      localStorage.setItem('msmebooks-onboarding-tasks', JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const resetTasks = () => {
    setCompletedTaskIds(['step-1']);
    try {
      localStorage.setItem('msmebooks-onboarding-tasks', JSON.stringify(['step-1']));
    } catch {
      // Ignore
    }
  };

  const progressPercent = Math.round((completedTaskIds.length / ONBOARDING_TASKS.length) * 100);

  const getTaskTitle = (t: OnboardingTask) => {
    if (language === 'fr') return t.titleFr;
    if (language === 'pt') return t.titlePt;
    if (language === 'es') return t.titleEs;
    return t.titleEn;
  };

  const getTaskDesc = (t: OnboardingTask) => {
    if (language === 'fr') return t.descFr;
    if (language === 'pt') return t.descPt;
    if (language === 'es') return t.descEs;
    return t.descEn;
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      {/* Collapsed Pill Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#0B192C] dark:bg-[#0D1E36] hover:bg-[#0A4FD5] text-white p-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-xl shadow-blue-900/30 border border-slate-700/80 hover:border-lime-400 transition-all cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-lime-400 flex items-center justify-center font-bold text-xs">
              {progressPercent}%
            </div>
            {progressPercent === 100 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>
          
          <div className="text-left hidden sm:block">
            <div className="text-xs font-black flex items-center gap-1.5 text-white">
              <span>
                {language === 'fr'
                  ? 'Guide des 7 Premiers Jours'
                  : language === 'pt'
                  ? 'Guia dos Primeiros 7 Dias'
                  : language === 'es'
                  ? 'Guía de los Primeros 7 Días'
                  : 'First 7 Days Onboarding'}
              </span>
              <span className="text-[10px] bg-lime-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                {completedTaskIds.length}/7
              </span>
            </div>
            <div className="text-[10px] text-blue-200">
              {progressPercent === 100
                ? '🎉 All 7 Milestones Completed!'
                : `${ONBOARDING_TASKS.length - completedTaskIds.length} tasks remaining`}
            </div>
          </div>

          <ChevronUp className="w-4 h-4 text-blue-300 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      ) : (
        /* Expanded Floating Card */
        <div className="w-80 sm:w-96 bg-white dark:bg-[#0B192C] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
          
          {/* Card Header */}
          <div className="p-4 bg-gradient-to-r from-[#0B192C] to-[#0A4FD5] text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-lime-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide">
                    {language === 'fr'
                      ? 'Plan d’Action des 7 Premiers Jours'
                      : language === 'pt'
                      ? 'Plano de Ação dos Primeiros 7 Dias'
                      : language === 'es'
                      ? 'Plan de Acción de los Primeros 7 Días'
                      : 'First 7 Days Onboarding Plan'}
                  </h4>
                  <p className="text-[10px] text-blue-200">
                    Step-by-step launch roadmap for African SMEs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={resetTasks}
                  title="Reset tasks"
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-bold mb-1">
                <span>{progressPercent}% Completed</span>
                <span className="text-lime-400">{completedTaskIds.length} of 7 Milestones</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="max-h-72 overflow-y-auto p-3 sm:p-4 space-y-2 text-xs">
            {ONBOARDING_TASKS.map((task) => {
              const isDone = completedTaskIds.includes(task.id);
              const Icon = task.icon;

              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 text-slate-600 dark:text-slate-400'
                      : 'bg-slate-50 dark:bg-[#070F1B] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#0A4FD5] dark:hover:border-blue-500'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
                        Day {task.day}
                      </span>
                      <span className={isDone ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-white'}>
                        {getTaskTitle(task)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {getTaskDesc(task)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="p-3 bg-slate-50 dark:bg-[#070F1B] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">
              {progressPercent === 100 ? '🎉 Trial Ready!' : 'Track your progress anytime'}
            </span>
            {onOpenTrial && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenTrial();
                }}
                className="px-3 py-1.5 bg-[#0A4FD5] hover:bg-[#073AA0] text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
              >
                Start Free Trial
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
