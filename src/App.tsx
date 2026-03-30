import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  Clock, 
  BarChart2, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Target,
  Moon,
  Sun,
  AlertCircle,
  Trophy,
  Pencil,
  X,
  Save,
  Download,
  Upload,
  Menu,
  Activity,
  TrendingUp,
  BrainCircuit,
  Zap,
  Crosshair,
  ChevronsUp,
  Info
} from 'lucide-react';

// --- Types & Interfaces ---

interface Topic {
  id: string;
  name: string;
  isCompleted: boolean;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  weight?: 'High' | 'Medium' | 'Low';
  topics: Topic[];
}

interface StudySession {
  id: string;
  subjectId: string;
  topicId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

interface StudyFocusData {
  quote: string;
  tipTitle: string;
  tipBody: string;
}

interface ErrorLog {
  typeA: number; 
  typeB: number; 
  typeC: number; 
  typeD: number; 
  typeE: number; 
  typeF: number; 
  typeG: number; 
  typeH: number; 
}

interface TelemetrySession {
  id: string;
  date: string;
  subjectId: string;
  topicId?: string; // Tópico granular
  totalQuestions: number;
  correctAnswers: number;
  timeMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  fatigue: boolean;
  cognitiveBlock: boolean;
  errors: ErrorLog;
  notes?: string;
}

interface TrainingMission {
  id: string;
  date: string;
  subjectId: string;
  topicId?: string; // Tópico granular
  mode: 'Execution' | 'Interpretation' | 'Speed' | 'Endurance' | 'Content';
  volume: number;
  status: 'Pending' | 'Completed';
  priorityScore: number;
}

// --- Helper Date Function ---
const getLocalToday = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

// --- Translations ---
const TRANSLATIONS = {
  en: {
    dashboard: "Overview",
    subjects: "Subjects",
    calendar: "Schedule",
    telemetry: "Performance",
    training: "Training",
    syllabusCoverage: "Syllabus Coverage",
    topicsMastered: "Topics Mastered",
    sessionsCompleted: "Sessions Completed",
    upcomingSessions: "Upcoming Sessions",
    noUpcoming: "No upcoming sessions scheduled.",
    markDone: "Mark Done",
    studyFocus: "Study Focus",
    quote: "\"Success is the sum of small efforts, repeated day in and day out.\"",
    tipTitle: "Tip for Auditors:",
    tipBody: "Focus on weightage. Tax Law, Accounting, and Portuguese usually carry the highest marks.",
    addDiscipline: "Add Discipline",
    add: "Add",
    noTopics: "No topics yet.",
    addTopicPlaceholder: "Add topic...",
    addTopicBtn: "Add",
    scheduleBlock: "Schedule Study",
    date: "Date",
    startTime: "Start",
    duration: "Mins",
    discipline: "Discipline",
    topic: "Topic",
    selectSubject: "Select Subject",
    selectTopic: "Select Topic",
    addToSchedule: "Add to Schedule",
    agendaFor: "Agenda for",
    sessionsPlanned: "sessions",
    noSessionsDay: "No sessions this day.",
    useForm: "Use form to plan.",
    status: "Status",
    planned: "Planned",
    completed: "Done",
    undo: "Undo",
    done: "Done",
    timeConflict: "Time conflict detected!",
    placeholderSubject: "Subject Name...",
    doneCount: "Done",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    backup: "Backup",
    restore: "Restore",
    restoreSuccess: "Restored successfully!",
    restoreError: "Invalid file format.",
    weight: "Weight/Relevance",
    wHigh: "High",
    wMedium: "Medium",
    wLow: "Low",
    logSession: "Log Session",
    updateLog: "Update Log",
    telemetryOverview: "Telemetry Overview",
    accuracy: "Accuracy",
    avgTime: "Avg Time/Q",
    typeBError: "Type B Error",
    totalQuestions: "Total Qs",
    correct: "Correct",
    time: "Time (min)",
    difficulty: "Difficulty",
    fatigue: "Fatigue Present",
    cognitiveBlock: "Cognitive Block",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    errorClassification: "Error Classification",
    errA: "A - Content",
    errB: "B - Execution",
    errC: "C - Time",
    errD: "D - Interpretation",
    errE: "E - Cognitive Block",
    errF: "F - Fatigue",
    errG: "G - Strategic",
    errH: "H - Review",
    saveLog: "Save Log",
    sumMismatch: "Error breakdown sum must match total errors!",
    insights: "AI Insights",
    noInsights: "Log more sessions to generate actionable insights.",
    recentLogs: "Recent Logs",
    mins: "m",
    engineTitle: "Adaptive Training Engine",
    dailyCapacity: "Daily Target Capacity (Questions)",
    volumeDistribution: "Volume Distribution",
    distEqual: "Equal Split",
    distWeighted: "Weighted by Priority",
    generateMission: "Generate Today's Plan",
    activeMission: "Active Mission",
    missionCompleted: "All Missions Completed!",
    missionCompletedDesc: "You have completed today's adaptive training plan. Great job!",
    mode: "Mode",
    focus: "Focus",
    rule: "Execution Rule",
    startMission: "Execute & Log Mission",
    missionModeExecution: "Execution",
    missionModeInterpretation: "Interpretation",
    missionModeSpeed: "Speed",
    missionModeEndurance: "Endurance",
    missionModeContent: "Content Focus",
    linkedMissionBanner: "🔥 This session is linked to an Active Mission.",
    abandonMission: "Abandon Plan",
    abandonMissionConfirm: "Are you sure you want to abandon and recalculate today's entire plan?",
    scheduleRequired: "You need to schedule your study blocks for today in the Schedule before generating the adaptive plan.",
    goToCalendar: "Go to Schedule",
    sfNoDataQuote: '"What gets measured gets managed." - Peter Drucker',
    sfNoDataTitle: 'Pending Diagnosis:',
    sfNoDataBody: 'Start logging your sessions in the Performance tab. Soon, you will receive directions based on your real data.',
    sfFatigueQuote: '"Rest is part of the training." - Supercompensation Principle',
    sfFatigueTitle: 'Fatigue Alert Detected:',
    sfFatigueBody: 'Your recent sessions show a high rate of fatigue. Reduce your daily load or shorten study blocks to avoid a drop in retention.',
    sfCriticalQuote: '"A chain is only as strong as its weakest link." - Theory of Constraints',
    sfCriticalTitle: 'Critical Attention: ',
    sfCriticalBody: 'This subject has HIGH WEIGHT and your recent accuracy is below 70%. The Training Engine will prioritize this bottleneck.',
    sfTypeBQuote: '"Amateurs practice until they get it right. Professionals practice until they can\'t get it wrong."',
    sfTypeBTitle: 'Execution Focus (Type B Error):',
    sfTypeBBody: 'You are missing questions due to lack of attention on topics you already know. Adjustment: read the prompt twice before looking at alternatives.',
    sfTimeQuote: '"Perfectionism during a test equals lack of time." - Testing Strategy',
    sfTimeTitle: 'Pacing Alert (Speed):',
    sfTimeBody: 'Your recent average time is high. Avoid getting stuck on hard questions. Skip if you don\'t know the resolution path in 30s.',
    sfGoodQuote: '"Consistency is the vehicle to excellence." - Deliberate Practice Principle',
    sfGoodTitle: 'High Performance Consolidated:',
    sfGoodBody: 'Your recent accuracy is excellent. Maintain the maintenance pace and prioritize focusing only on your micro-gaps.',
    sfNeutralQuote: '"Success is the sum of small efforts, repeated day in and day out." - Robert Collier',
    sfNeutralTitle: 'Pace Maintenance:',
    sfNeutralBody: 'Your indicators are balanced. Continue executing the Adaptive Engine Missions to progressively cover gaps.',
    smartFeedback: "Smart Feedback",
    tipWeight: "Subject weight in your exam. The Adaptive Engine uses this to prioritize your training missions.",
    tipCapacity: "Your realistic daily maximum limit. The engine will automatically reduce this if your fatigue rate is high.",
    tipVolumeDist: "Equal: Divides total capacity equally. Weighted: Allocates more questions to critical subjects.",
    tipErrA: "Content: Didn't know the theory or lacked basic knowledge.",
    tipErrB: "Execution: Knew the subject, but missed due to lack of attention or silly calculation error.",
    tipErrC: "Time: Rushed answer or ran out of time.",
    tipErrD: "Interpretation: Misread the prompt (e.g., missed the 'EXCEPT' keyword).",
    tipErrE: "Cognitive Block: Blanked out or got stuck during resolution.",
    tipErrF: "Fatigue: Missed due to mental exhaustion, usually at the end of a block.",
    tipErrG: "Strategic: Wasted too much time on a question you should have skipped.",
    tipErrH: "Review: Marked it right initially, but changed to wrong later.",
    insTypeBTitle: "Execution Focus (Critical Error B)",
    insTypeBDesc: "Your Type B Error (loss of focus on known subjects) surpassed 20%.",
    insTypeBAction: "Apply the Pointing Technique: Read the prompt twice and mentally mark the keyword before scanning the alternatives.",
    insTypeDTitle: "Interpretation Gap (Error D)",
    insTypeDDesc: "Reading errors represent over 20% of your failures.",
    insTypeDAction: "Active Reading: Always highlight absolute/exclusion adverbs (except, always, never) on your first read.",
    insFatigueTitle: "Cognitive Fatigue Detected",
    insFatigueDesc: "Over 30% of your recent sessions report mental exhaustion.",
    insFatigueAction: "Supercompensation: Reduce your blocks by 15 mins. Enforce active breaks away from screens.",
    insTypeATitle: "Base Deficiency (Error A)",
    insTypeADesc: "Type A Error (Lack of theoretical content) is above 30%.",
    insTypeAAction: "Micro-review: Stop mass-solving for this specific topic. Return to your base material (PDFs/Video) to fill the gaps.",
    insTimeTitle: "Inefficient Pacing",
    insTimeDesc: "Your average time exceeds 3 minutes per question.",
    insTimeAction: "Strategic Detachment: Train yourself to skip questions immediately if you can't visualize the resolution path in the first 45 seconds."
  },
  pt: {
    dashboard: "Visão Geral",
    subjects: "Matérias",
    calendar: "Agenda",
    telemetry: "Performance",
    training: "Treino",
    syllabusCoverage: "Cobertura",
    topicsMastered: "Tópicos",
    sessionsCompleted: "Sessões",
    upcomingSessions: "Próximas",
    noUpcoming: "Nenhuma sessão agendada.",
    markDone: "Concluir",
    studyFocus: "Foco",
    quote: "\"O sucesso é a soma de pequenos esforços repetidos dia após dia.\"",
    tipTitle: "Dica:",
    tipBody: "Foque no peso das matérias. Tributário, Contabilidade e Português valem mais.",
    addDiscipline: "Nova Disciplina",
    add: "Adicionar",
    noTopics: "Sem tópicos.",
    addTopicPlaceholder: "Adicionar tópico...",
    addTopicBtn: "Add",
    scheduleBlock: "Agendar",
    date: "Data",
    startTime: "Início",
    duration: "Mins",
    discipline: "Disciplina",
    topic: "Tópico",
    selectSubject: "Selecione",
    selectTopic: "Selecione",
    addToSchedule: "Agendar",
    agendaFor: "Agenda para",
    sessionsPlanned: "sessões",
    noSessionsDay: "Nada agendado.",
    useForm: "Use o formulário.",
    status: "Status",
    planned: "Planejado",
    completed: "Feito",
    undo: "Desfazer",
    done: "Feito",
    timeConflict: "Conflito de horário!",
    placeholderSubject: "Nome da matéria...",
    doneCount: "Feito",
    edit: "Editar",
    cancel: "Cancelar",
    save: "Salvar",
    backup: "Backup",
    restore: "Restaurar",
    restoreSuccess: "Restaurado!",
    restoreError: "Arquivo inválido.",
    weight: "Peso",
    wHigh: "Alto",
    wMedium: "Médio",
    wLow: "Baixo",
    logSession: "Registrar Sessão",
    updateLog: "Atualizar Registro",
    telemetryOverview: "Visão Geral de Telemetria",
    accuracy: "Taxa de Acerto",
    avgTime: "Tempo Médio/Q",
    typeBError: "Erro Tipo B (Crítico)",
    totalQuestions: "Total Questões",
    correct: "Acertos",
    time: "Tempo Total (min)",
    difficulty: "Dificuldade",
    fatigue: "Ocorrência de Fadiga",
    cognitiveBlock: "Bloqueio Mental",
    easy: "Fácil",
    medium: "Média",
    hard: "Difícil",
    errorClassification: "Classificação de Erros",
    errA: "A - Falta de Conteúdo",
    errB: "B - Erro de Execução (Atenção)",
    errC: "C - Erro de Tempo (Pressa)",
    errD: "D - Erro de Interpretação (Leitura)",
    errE: "E - Bloqueio Cognitivo (Travou)",
    errF: "F - Fadiga (Cansaço)",
    errG: "G - Erro Estratégico (Insistência)",
    errH: "H - Erro de Revisão (Mudou gabarito)",
    saveLog: "Salvar Registro",
    sumMismatch: "A soma das categorias deve ser igual ao total de erros!",
    insights: "Recomendações e Alertas",
    noInsights: "Registre mais sessões para gerar prescrições precisas.",
    recentLogs: "Últimos Registros",
    mins: "m",
    engineTitle: "Motor Adaptativo",
    dailyCapacity: "Capacidade Total Diária (Qtd. Questões)",
    volumeDistribution: "Distribuição de Questões",
    distEqual: "Igualitária",
    distWeighted: "Proporcional",
    generateMission: "Gerar Plano de Hoje",
    activeMission: "Missão Ativa",
    missionCompleted: "Plano Diário Concluído!",
    missionCompletedDesc: "Você concluiu todas as missões adaptativas de hoje. Excelente trabalho!",
    mode: "Modo",
    focus: "Intenção",
    rule: "Regra de Execução",
    startMission: "Executar e Registrar",
    missionModeExecution: "Controle de Execução",
    missionModeInterpretation: "Leitura Cautelosa",
    missionModeSpeed: "Choque de Velocidade",
    missionModeEndurance: "Resistência",
    missionModeContent: "Lacunas de Base",
    linkedMissionBanner: "🔥 Esta sessão será vinculada a uma Missão Ativa de hoje.",
    abandonMission: "Abandonar Plano Completo",
    abandonMissionConfirm: "Deseja realmente abandonar todas as missões e recalcular o plano de hoje?",
    scheduleRequired: "Você precisa agendar seus blocos de estudo para hoje na Agenda antes de gerar o plano adaptativo.",
    goToCalendar: "Ir para a Agenda",
    sfNoDataQuote: '"O que não pode ser medido não pode ser gerenciado." - Peter Drucker',
    sfNoDataTitle: 'Diagnóstico Pendente:',
    sfNoDataBody: 'Comece a registrar suas sessões na aba Performance. Em breve, você receberá direcionamentos baseados nos seus dados reais.',
    sfFatigueQuote: '"Descanso faz parte do treino." - Princípio da Supercompensação',
    sfFatigueTitle: 'Alerta de Fadiga Detectado:',
    sfFatigueBody: 'Suas últimas sessões apresentam alto índice de cansaço. Reduza a carga diária ou diminua o tempo dos blocos para evitar queda de retenção.',
    sfCriticalQuote: '"A corrente quebra no elo mais fraco." - Princípio das Restrições',
    sfCriticalTitle: 'Atenção Crítica: ',
    sfCriticalBody: 'Esta disciplina tem PESO ALTO e seu rendimento recente está abaixo de 70%. O Motor de Treino priorizará este gargalo.',
    sfTypeBQuote: '"Amadores treinam até acertar. Profissionais treinam até não conseguirem errar."',
    sfTypeBTitle: 'Foco na Execução (Erro Tipo B):',
    sfTypeBBody: 'Você está errando questões por falta de atenção em assuntos que já domina. Ajuste: leia o enunciado duas vezes antes de olhar as alternativas.',
    sfTimeQuote: '"Perfeccionismo em prova é sinônimo de falta de tempo." - Estratégia de Prova',
    sfTimeTitle: 'Alerta de Ritmo (Velocidade):',
    sfTimeBody: 'Seu tempo médio recente está alto. Evite travar em questões difíceis. Aplique a regra do "Pulo Rápido" se não souber a via de resolução em 30s.',
    sfGoodQuote: '"A consistência é o veículo da excelência." - Prática Deliberada',
    sfGoodTitle: 'Alta Performance Consolidada:',
    sfGoodBody: 'Seu rendimento recente está excelente. Mantenha o ritmo de revisão e priorize focar apenas nas suas micro-lacunas.',
    sfNeutralQuote: '"O sucesso é a soma de pequenos esforços, repetidos dia após dia." - Robert Collier',
    sfNeutralTitle: 'Manutenção de Ritmo:',
    sfNeutralBody: 'Seus indicadores estão equilibrados. Continue executando as Missões do Motor Adaptativo para cobrir lacunas progressivamente.',
    smartFeedback: "Feedback Inteligente",
    tipWeight: "Peso da matéria no edital. O Motor Adaptativo usará isso para priorizar suas missões de treino.",
    tipCapacity: "Seu limite máximo realista para hoje. O motor reduzirá essa carga automaticamente se detectar que sua fadiga está alta.",
    tipVolumeDist: "Igualitária: Divide o total por igual. Proporcional: Aloca mais questões nas matérias mais críticas.",
    tipErrA: "Conteúdo: Não sabia a teoria ou faltou base para resolver.",
    tipErrB: "Execução (Crítico): Sabia a matéria, mas errou por desatenção ou erro de cálculo bobo.",
    tipErrC: "Tempo: Chutou por pressa ou não teve tempo de ler direito.",
    tipErrD: "Interpretação: Leu errado o enunciado (ex: não viu a palavra 'EXCETO').",
    tipErrE: "Bloqueio: Deu 'branco' ou travou completamente na resolução.",
    tipErrF: "Fadiga: Errou por exaustão mental, geralmente no fim da sessão.",
    tipErrG: "Estratégico: Perdeu tempo demais numa questão que deveria ter pulado.",
    tipErrH: "Revisão: Marcou certo na primeira leitura, mas mudou pra errado depois.",
    insTypeBTitle: "Foco na Execução (Erro B Crítico)",
    insTypeBDesc: "Seu Erro Tipo B (desatenção em assunto dominado) ultrapassou 20% dos erros totais.",
    insTypeBAction: "Técnica de Apontamento: Leia o comando da questão 2x e marque mentalmente a palavra-chave antes de olhar as alternativas.",
    insTypeDTitle: "Falha de Interpretação (Erro D)",
    insTypeDDesc: "Erros de leitura representam mais de 20% das suas falhas.",
    insTypeDAction: "Leitura Ativa: Grife/Circule advérbios absolutos (exceto, sempre, nunca, incorreta) logo na primeira leitura.",
    insFatigueTitle: "Fadiga Cognitiva Detectada",
    insFatigueDesc: "Mais de 30% das suas sessões recentes reportam esgotamento mental.",
    insFatigueAction: "Supercompensação: Reduza seus blocos de resolução em 15 min e aplique pausas ativas (sem telas).",
    insTypeATitle: "Deficiência de Base (Erro A)",
    insTypeADesc: "O Erro Tipo A (Falta de conteúdo teórico) está acima de 30%.",
    insTypeAAction: "Micro-revisão: Interrompa a resolução em massa desse tópico. Volte ao material base/PDF para preencher as lacunas teóricas.",
    insTimeTitle: "Pacing Ineficiente (Tempo Alto)",
    insTimeDesc: "O tempo médio superou 3 minutos por questão.",
    insTimeAction: "Desapego Estratégico: Treine pular imediatamente a questão se não visualizar o caminho de resolução nos primeiros 45 segundos."
  }
};

// --- Mock Data / Initial State ---
const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Tax Law', color: 'bg-indigo-500', weight: 'High', topics: [] },
  { id: '2', name: 'Accounting', color: 'bg-rose-500', weight: 'High', topics: [] },
  { id: '3', name: 'Const. Law', color: 'bg-sky-500', weight: 'Medium', topics: [] }
];

// --- Helper Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-zinc-800/80 transition-colors duration-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = 'primary', className = "", disabled = false, type = "button" }: any) => {
  const baseStyle = "px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 touch-manipulation text-sm";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700 disabled:opacity-50",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40 disabled:opacity-50",
    ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50"
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>{children}</button>;
};

// --- Tooltip Component ---
const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => (
  <div className="relative flex items-center group cursor-help">
    {children}
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-56 p-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-xl shadow-xl z-50 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
    </div>
  </div>
);

// --- Sub-Components ---

const Dashboard = ({ t, stats, sessions, setSessions, subjects, telemetrySessions }: any) => {
  const smartFocus = useMemo(() => {
    if (!telemetrySessions || telemetrySessions.length === 0) {
      return { quote: t.sfNoDataQuote, tipTitle: t.sfNoDataTitle, tipBody: t.sfNoDataBody, color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-zinc-800/50", border: "border-gray-200 dark:border-zinc-700" };
    }

    const recent = telemetrySessions.slice(0, 20);
    let tQ = 0, tC = 0, tTime = 0, errB = 0, fatigueCount = 0, totalErrors = 0;
    const subjectStats: Record<string, { q: number, c: number }> = {};

    recent.forEach((s: TelemetrySession) => {
      tQ += s.totalQuestions; tC += s.correctAnswers; tTime += s.timeMinutes;
      if (s.fatigue) fatigueCount++;
      const errs = s.totalQuestions - s.correctAnswers;
      totalErrors += errs;
      errB += s.errors.typeB;

      if (!subjectStats[s.subjectId]) subjectStats[s.subjectId] = { q: 0, c: 0 };
      subjectStats[s.subjectId].q += s.totalQuestions;
      subjectStats[s.subjectId].c += s.correctAnswers;
    });

    const accuracy = tQ > 0 ? tC / tQ : 0;
    const avgTime = tQ > 0 ? tTime / tQ : 0;
    const errBRate = totalErrors > 0 ? errB / totalErrors : 0;
    const fatigueRate = recent.length > 0 ? fatigueCount / recent.length : 0;

    let criticalSubject = null;
    for (const subId in subjectStats) {
      const stat = subjectStats[subId];
      const sub = subjects.find((s: Subject) => s.id === subId);
      if (sub && sub.weight === 'High' && stat.q >= 15 && (stat.c / stat.q) < 0.7) {
        criticalSubject = sub;
        break;
      }
    }

    if (fatigueRate > 0.3) return { quote: t.sfFatigueQuote, tipTitle: t.sfFatigueTitle, tipBody: t.sfFatigueBody, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-900/30" };
    if (criticalSubject) return { quote: t.sfCriticalQuote, tipTitle: t.sfCriticalTitle + criticalSubject.name, tipBody: t.sfCriticalBody, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/10", border: "border-rose-200 dark:border-rose-900/30" };
    if (errBRate > 0.25) return { quote: t.sfTypeBQuote, tipTitle: t.sfTypeBTitle, tipBody: t.sfTypeBBody, color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-900/30" };
    if (avgTime > 3.5) return { quote: t.sfTimeQuote, tipTitle: t.sfTimeTitle, tipBody: t.sfTimeBody, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-900/30" };
    if (accuracy > 0.8) return { quote: t.sfGoodQuote, tipTitle: t.sfGoodTitle, tipBody: t.sfGoodBody, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-900/30" };

    return { quote: t.sfNeutralQuote, tipTitle: t.sfNeutralTitle, tipBody: t.sfNeutralBody, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/10", border: "border-indigo-200 dark:border-indigo-900/30" };
  }, [telemetrySessions, subjects, t]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.syllabusCoverage}</p>
              <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mt-2 tracking-tight">{stats.progress}%</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"><Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full mt-6">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.topicsMastered}</p>
              <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mt-2 tracking-tight">{stats.completedTopics} <span className="text-base text-gray-400 dark:text-gray-500 font-normal">/ {stats.totalTopics}</span></h3>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl"><CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.sessionsCompleted}</p>
              <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mt-2 tracking-tight">{stats.completedSessions}</h3>
            </div>
            <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 rounded-xl"><Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" /></div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 overflow-hidden">
          <h3 className="font-semibold text-lg mb-5 text-gray-900 dark:text-gray-50 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" /> {t.upcomingSessions}
          </h3>
          {sessions.filter((s: any) => !s.completed).sort((a: any,b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).length > 0 ? (
            <div className="space-y-3">
              {sessions.filter((s: any) => !s.completed).sort((a: any,b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map((session: any) => {
                const subject = subjects.find((s: any) => s.id === session.subjectId);
                const topic = subject?.topics.find((t: any) => t.id === session.topicId);
                return (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-10 rounded-full ${subject?.color || 'bg-gray-300'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{subject?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{topic?.name} • {session.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => setSessions(sessions.map((s: any) => s.id === session.id ? { ...s, completed: true } : s))} className="w-full sm:w-auto hover:text-emerald-600 dark:hover:text-emerald-400">
                      <CheckCircle className="w-5 h-5" /> <span className="sm:hidden">{t.markDone}</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (<div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">{t.noUpcoming}</div>)}
        </Card>
        
        <Card className="p-6 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-5">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 flex items-center gap-2">
               <BrainCircuit className="w-5 h-5 text-indigo-500" /> {t.smartFeedback}
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-5 italic text-sm leading-relaxed">"{smartFocus.quote}"</p>
          <div className={`p-5 rounded-xl border ${smartFocus.bg} ${smartFocus.border} ${smartFocus.color}`}>
             <strong className="block mb-1.5 font-semibold tracking-tight">{smartFocus.tipTitle}</strong> 
             <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed block">{smartFocus.tipBody}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SyllabusManager = ({ t, subjects, setSubjects }: any) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectWeight, setNewSubjectWeight] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [newTopicNames, setNewTopicNames] = useState<{[key: string]: string}>({});

  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectWeight, setEditSubjectWeight] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
    setSubjects([...subjects, { id: crypto.randomUUID(), name: newSubjectName, color: colors[Math.floor(Math.random()*colors.length)], weight: newSubjectWeight, topics: [] }]);
    setNewSubjectName('');
    setNewSubjectWeight('Medium');
  };

  const addTopic = (subjectId: string) => {
    const name = newTopicNames[subjectId];
    if (!name?.trim()) return;
    setSubjects(subjects.map((sub: any) => sub.id === subjectId ? { ...sub, topics: [...sub.topics, { id: crypto.randomUUID(), name, isCompleted: false }] } : sub));
    setNewTopicNames({ ...newTopicNames, [subjectId]: '' });
  };

  const startEditSubject = (e: React.MouseEvent, subject: any) => {
    e.stopPropagation(); 
    setEditingSubjectId(subject.id);
    setEditSubjectName(subject.name);
    setEditSubjectWeight(subject.weight || 'Medium');
  };

  const saveEditSubject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!editSubjectName.trim()) return;
    setSubjects(subjects.map((sub: any) => sub.id === id ? { ...sub, name: editSubjectName, weight: editSubjectWeight } : sub));
    setEditingSubjectId(null);
  };

  const cancelEditSubject = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubjectId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 md:pb-0">
      <Card className="p-6 bg-transparent border-dashed border-2 border-gray-200 dark:border-zinc-800 shadow-none overflow-visible">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">{t.addDiscipline}</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder={t.placeholderSubject} className="w-full sm:flex-1 p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select value={newSubjectWeight} onChange={(e) => setNewSubjectWeight(e.target.value as any)} className="w-full sm:w-auto p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer">
              <option value="High">🔥 {t.wHigh}</option>
              <option value="Medium">🎯 {t.wMedium}</option>
              <option value="Low">🧊 {t.wLow}</option>
            </select>
            <Tooltip text={t.tipWeight}>
              <Info className="w-5 h-5 text-gray-400 hover:text-indigo-500 transition-colors flex-shrink-0" />
            </Tooltip>
          </div>
          <Button onClick={addSubject} className="w-full sm:w-auto"><Plus className="w-4 h-4" /> {t.add}</Button>
        </div>
      </Card>
      <div className="space-y-4">
        {subjects.map((subject: any) => (
          <Card key={subject.id} className="overflow-visible">
            {editingSubjectId === subject.id ? (
              <div className="p-5 flex flex-col sm:flex-row items-center gap-3 bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                <input 
                  type="text" 
                  value={editSubjectName} 
                  onChange={(e) => setEditSubjectName(e.target.value)} 
                  className="w-full sm:flex-1 p-2.5 text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                />
                <select 
                  value={editSubjectWeight} 
                  onChange={(e) => setEditSubjectWeight(e.target.value as any)} 
                  className="w-full sm:w-auto p-2.5 text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                >
                  <option value="High">🔥 {t.wHigh}</option>
                  <option value="Medium">🎯 {t.wMedium}</option>
                  <option value="Low">🧊 {t.wLow}</option>
                </select>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="ghost" onClick={cancelEditSubject} className="flex-1 sm:flex-none p-2.5"><X className="w-4 h-4" /></Button>
                  <Button onClick={(e: any) => saveEditSubject(e, subject.id)} className="flex-1 sm:flex-none p-2.5"><Save className="w-4 h-4" /></Button>
                </div>
              </div>
            ) : (
              <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors" onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <span className={`w-3.5 h-3.5 flex-shrink-0 rounded-full ${subject.color}`}></span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 overflow-hidden">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-50 text-lg truncate">{subject.name}</h4>
                      {subject.weight && (
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wider ${
                          subject.weight === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 
                          subject.weight === 'Medium' ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400' : 
                          'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400'
                        }`}>
                          {subject.weight === 'High' ? t.wHigh : subject.weight === 'Medium' ? t.wMedium : t.wLow}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-gray-600 dark:text-gray-400 w-fit">
                      {subject.topics.filter((t: any) => t.isCompleted).length} / {subject.topics.length} {t.doneCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" className="hover:text-indigo-600 dark:hover:text-indigo-500 p-2" onClick={(e: any) => startEditSubject(e, subject)}><Pencil className="w-5 h-5" /></Button>
                  <Button variant="ghost" className="hover:text-rose-600 dark:hover:text-rose-500 p-2" onClick={(e: any) => { e.stopPropagation(); setSubjects(subjects.filter((s: any) => s.id !== subject.id)); }}><Trash2 className="w-5 h-5" /></Button>
                  <div className="p-2 text-gray-400">
                    {expandedSubject === subject.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>
            )}
            {expandedSubject === subject.id && !editingSubjectId && (
              <div className="p-5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/20">
                <div className="space-y-2 mb-5">
                  {subject.topics.map((topic: any) => (
                    <div key={topic.id} className="flex items-center justify-between group p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                      <div className="flex items-center gap-3.5">
                        <button onClick={() => setSubjects(subjects.map((sub: any) => sub.id === subject.id ? { ...sub, topics: sub.topics.map((t: any) => t.id === topic.id ? { ...t, isCompleted: !t.isCompleted } : t) } : sub))} 
                          className={`w-6 h-6 flex-shrink-0 rounded-md border flex items-center justify-center transition-colors ${topic.isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-zinc-600 hover:border-indigo-400'}`}>
                          {topic.isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <span className={`text-sm ${topic.isCompleted ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-700 dark:text-gray-200'}`}>{topic.name}</span>
                      </div>
                      <button onClick={() => setSubjects(subjects.map((sub: any) => sub.id === subject.id ? { ...sub, topics: sub.topics.filter((t: any) => t.id !== topic.id) } : sub))} className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {subject.topics.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-500 italic px-2">{t.noTopics}</p>}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input type="text" placeholder={t.addTopicPlaceholder} value={newTopicNames[subject.id] || ''} onChange={(e) => setNewTopicNames({...newTopicNames, [subject.id]: e.target.value})} className="flex-1 p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                  <Button variant="secondary" className="w-full sm:w-auto" onClick={() => addTopic(subject.id)}>{t.addTopicBtn}</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

const CalendarPlanner = ({ t, language, subjects, sessions, setSessions }: any) => {
  const [selectedDate, setSelectedDate] = useState(getLocalToday());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [error, setError] = useState<string | null>(null);

  const availableTopics = useMemo(() => {
      const sub = subjects.find((s: any) => s.id === selectedSubject);
      return sub ? sub.topics.filter((t: any) => !t.isCompleted) : [];
  }, [selectedSubject, subjects]);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const addSession = () => {
      setError(null);
      if (!selectedSubject || !selectedTopic) return;
      const newStartMinutes = timeToMinutes(startTime);
      const newEndMinutes = newStartMinutes + parseInt(duration);

      const hasConflict = sessions.some((session: any) => {
        if (session.date !== selectedDate) return false;
        if (session.completed) return false;
        const sessionStart = timeToMinutes(session.startTime);
        const sessionEnd = sessionStart + session.durationMinutes;
        return newStartMinutes < sessionEnd && newEndMinutes > sessionStart;
      });

      if (hasConflict) { setError(t.timeConflict); return; }
      setSessions([...sessions, { id: crypto.randomUUID(), subjectId: selectedSubject, topicId: selectedTopic, date: selectedDate, startTime, durationMinutes: parseInt(duration), completed: false }]);
      setSelectedTopic('');
  };

  const daysSessions = sessions.filter((s: any) => s.date === selectedDate).sort((a: any,b: any) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full pb-20 md:pb-0">
      <div className="md:col-span-5 lg:col-span-4 space-y-6">
        <Card className="p-6 sticky top-24 md:top-6 overflow-visible">
          <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-5">{t.scheduleBlock}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.date}</label>
              <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setError(null); }} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <div>
                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.startTime}</label>
                 <input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); setError(null); }} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
               </div>
               <div>
                 <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.duration}</label>
                 <input type="number" value={duration} onChange={(e) => { setDuration(e.target.value); setError(null); }} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
               </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.discipline}</label>
              <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); setError(null); }} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer">
                <option value="">{t.selectSubject}</option>{subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.topic}</label>
              <select value={selectedTopic} onChange={(e) => { setSelectedTopic(e.target.value); setError(null); }} disabled={!selectedSubject} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all disabled:opacity-50 cursor-pointer">
                <option value="">{t.selectTopic}</option>{availableTopics.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            {error && (<div className="p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span></div>)}
            <Button onClick={addSession} disabled={!selectedTopic} className="w-full mt-6 py-3"><Plus className="w-4 h-4" /> {t.addToSchedule}</Button>
          </div>
        </Card>
      </div>
      <div className="md:col-span-7 lg:col-span-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-zinc-800 pb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {t.agendaFor} {new Date(selectedDate + 'T12:00:00').toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">
            {daysSessions.length} {t.sessionsPlanned}
          </div>
        </div>
        <div className="space-y-4">
          {daysSessions.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-16 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-transparent">
              <CalendarIcon className="w-12 h-12 mb-4 opacity-50" /><p>{t.noSessionsDay}</p>
            </div>
          ) : (
            daysSessions.map((session: any) => {
              const sub = subjects.find((s: any) => s.id === session.subjectId);
              const topic = sub?.topics.find((t: any) => t.id === session.topicId);
              return (
                <div key={session.id} className={`bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between group gap-4 relative overflow-hidden ${session.completed ? 'opacity-60 grayscale' : ''}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${sub?.color || 'bg-gray-300'}`}></div>
                  <div className="flex gap-5 pl-4">
                     <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 min-w-[3rem]">
                       <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{session.startTime}</span>
                       <span className="text-xs font-medium">{session.durationMinutes} min</span>
                     </div>
                     <div className="border-l border-gray-100 dark:border-zinc-800 pl-5">
                       <h4 className="font-semibold text-gray-900 dark:text-gray-50 text-lg">{sub?.name}</h4>
                       <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">{topic?.name}</p>
                       <p className="text-xs font-medium text-gray-400 mt-2 uppercase tracking-wider">{t.status}: {session.completed ? t.completed : t.planned}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button variant={session.completed ? "secondary" : "ghost"} className={`flex-1 sm:flex-none ${!session.completed ? "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400" : ""}`} onClick={() => setSessions(sessions.map((s: any) => s.id === session.id ? { ...s, completed: !s.completed } : s))}>{session.completed ? t.undo : t.done}</Button>
                    <button onClick={() => setSessions(sessions.filter((s: any) => s.id !== session.id))} className="p-2.5 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};

const TelemetryModule = ({ t, subjects, telemetrySessions, setTelemetrySessions, activeMissions, setActiveMissions, telemetryPrefill, setTelemetryPrefill }: any) => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'add'>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMismatch, setErrorMismatch] = useState<string | null>(null);

  const todayStr = getLocalToday();
  const todayPendingMissions = activeMissions.filter((m: any) => m.status === 'Pending' && m.date === todayStr);

  const [form, setForm] = useState({
    date: todayStr,
    subjectId: '',
    topicId: '', 
    totalQs: '',
    correct: '',
    time: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    fatigue: false,
    block: false,
    errA: 0, errB: 0, errC: 0, errD: 0, errE: 0, errF: 0, errG: 0, errH: 0,
    notes: ''
  });

  const resetForm = () => {
    setForm({ date: todayStr, subjectId: '', topicId: '', totalQs: '', correct: '', time: '', difficulty: 'Medium', fatigue: false, block: false, errA: 0, errB: 0, errC: 0, errD: 0, errE: 0, errF: 0, errG: 0, errH: 0, notes: '' });
    setEditingId(null);
    setErrorMismatch(null);
  };

  useEffect(() => {
    if (telemetryPrefill) {
      const linkedMission = todayPendingMissions.find((m: any) => m.subjectId === telemetryPrefill.subjectId && m.topicId === telemetryPrefill.topicId);
      let newTotalQs = '';
      
      if (linkedMission) {
        const loggedToday = telemetrySessions
          .filter((s: TelemetrySession) => s.date === todayStr && s.subjectId === linkedMission.subjectId && (!linkedMission.topicId || s.topicId === linkedMission.topicId))
          .reduce((acc: number, s: TelemetrySession) => acc + s.totalQuestions, 0);
        const remaining = Math.max(0, linkedMission.volume - loggedToday);
        newTotalQs = String(remaining > 0 ? remaining : linkedMission.volume);
      }

      setForm(prev => ({ ...prev, subjectId: telemetryPrefill.subjectId, topicId: telemetryPrefill.topicId || '', totalQs: newTotalQs, date: todayStr }));
      setViewMode('add');
      setTelemetryPrefill(null); 
    }
  }, [telemetryPrefill, todayPendingMissions, telemetrySessions, todayStr, setTelemetryPrefill]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubId = e.target.value;
    let newTotalQs = form.totalQs;
    
    if (!editingId) {
      const linkedMission = todayPendingMissions.find((m: any) => m.subjectId === newSubId);
      if (linkedMission) {
        const loggedToday = telemetrySessions
          .filter((s: TelemetrySession) => s.date === todayStr && s.subjectId === linkedMission.subjectId && (!linkedMission.topicId || s.topicId === linkedMission.topicId))
          .reduce((acc: number, s: TelemetrySession) => acc + s.totalQuestions, 0);
        const remaining = Math.max(0, linkedMission.volume - loggedToday);
        newTotalQs = String(remaining > 0 ? remaining : linkedMission.volume);
      } else {
        newTotalQs = ''; 
      }
    }
    
    setForm({ ...form, subjectId: newSubId, topicId: '', totalQs: newTotalQs }); 
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, topicId: e.target.value });
  };

  const availableTopics = useMemo(() => {
    const sub = subjects.find((s: Subject) => s.id === form.subjectId);
    return sub ? sub.topics : [];
  }, [form.subjectId, subjects]);

  const activeMissionForForm = todayPendingMissions.find((m: any) => m.subjectId === form.subjectId && (!m.topicId || m.topicId === form.topicId));

  const totalErrorsInForm = (parseInt(form.totalQs) || 0) - (parseInt(form.correct) || 0);
  const sumOfCategorizedErrors = form.errA + form.errB + form.errC + form.errD + form.errE + form.errF + form.errG + form.errH;

  const updateMissionState = (currentTelemetry: TelemetrySession[]) => {
    setActiveMissions((prevMissions: TrainingMission[]) => {
      let updated = false;
      const newMissions = prevMissions.map(m => {
        if (m.date !== todayStr) return m;

        const loggedToday = currentTelemetry
          .filter(s => s.date === todayStr && s.subjectId === m.subjectId && (!m.topicId || s.topicId === m.topicId))
          .reduce((acc, s) => acc + s.totalQuestions, 0);

        if (loggedToday >= m.volume && m.status !== 'Completed') {
          updated = true;
          return { ...m, status: 'Completed' };
        } else if (loggedToday < m.volume && m.status === 'Completed') {
          updated = true;
          return { ...m, status: 'Pending' };
        }
        return m;
      });
      return updated ? newMissions : prevMissions;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subjectId || !form.totalQs || !form.correct || !form.time) return;

    if (totalErrorsInForm > 0 && sumOfCategorizedErrors !== totalErrorsInForm) {
      setErrorMismatch(t.sumMismatch);
      return;
    }

    const sessionData: TelemetrySession = {
      id: editingId || crypto.randomUUID(),
      date: form.date,
      subjectId: form.subjectId,
      topicId: form.topicId || undefined,
      totalQuestions: parseInt(form.totalQs),
      correctAnswers: parseInt(form.correct),
      timeMinutes: parseInt(form.time),
      difficulty: form.difficulty,
      fatigue: form.fatigue,
      cognitiveBlock: form.block,
      errors: { typeA: form.errA, typeB: form.errB, typeC: form.errC, typeD: form.errD, typeE: form.errE, typeF: form.errF, typeG: form.errG, typeH: form.errH },
      notes: form.notes
    };

    const updatedTelemetry = editingId 
      ? telemetrySessions.map((s: TelemetrySession) => s.id === editingId ? sessionData : s) 
      : [sessionData, ...telemetrySessions];

    setTelemetrySessions(updatedTelemetry);
    updateMissionState(updatedTelemetry); 

    setViewMode('dashboard');
    resetForm();
  };

  const handleEdit = (log: TelemetrySession) => {
    setEditingId(log.id);
    setForm({
      date: log.date,
      subjectId: log.subjectId,
      topicId: log.topicId || '',
      totalQs: String(log.totalQuestions),
      correct: String(log.correctAnswers),
      time: String(log.timeMinutes),
      difficulty: log.difficulty,
      fatigue: log.fatigue,
      block: log.cognitiveBlock,
      errA: log.errors.typeA, errB: log.errors.typeB, errC: log.errors.typeC, errD: log.errors.typeD, errE: log.errors.typeE, errF: log.errors.typeF, errG: log.errors.typeG, errH: log.errors.typeH,
      notes: log.notes || ''
    });
    setViewMode('add');
  };

  const handleDelete = (id: string) => {
    const updatedTelemetry = telemetrySessions.filter((s: TelemetrySession) => s.id !== id);
    setTelemetrySessions(updatedTelemetry);
    updateMissionState(updatedTelemetry);
  };

  const telemetryStats = useMemo(() => {
    if (telemetrySessions.length === 0) return { accuracy: 0, avgTime: 0, typeBRate: 0, fatigueRate: 0, typeARate: 0, typeDRate: 0 };
    let totalQ = 0, totalC = 0, totalTime = 0, totalErrB = 0, totalErrA = 0, totalErrD = 0, fatigueCount = 0, sumTotalErrors = 0;
    telemetrySessions.forEach((s: TelemetrySession) => {
      totalQ += s.totalQuestions; totalC += s.correctAnswers; totalTime += s.timeMinutes;
      if (s.fatigue) fatigueCount++;
      sumTotalErrors += (s.totalQuestions - s.correctAnswers);
      totalErrB += s.errors.typeB; totalErrA += s.errors.typeA; totalErrD += s.errors.typeD;
    });
    return {
      accuracy: totalQ ? Math.round((totalC / totalQ) * 100) : 0,
      avgTime: totalQ ? (totalTime / totalQ).toFixed(1) : 0,
      typeBRate: sumTotalErrors ? Math.round((totalErrB / sumTotalErrors) * 100) : 0,
      typeARate: sumTotalErrors ? Math.round((totalErrA / sumTotalErrors) * 100) : 0,
      typeDRate: sumTotalErrors ? Math.round((totalErrD / sumTotalErrors) * 100) : 0,
      fatigueRate: Math.round((fatigueCount / telemetrySessions.length) * 100)
    };
  }, [telemetrySessions]);

  const insights = useMemo(() => {
    if (telemetrySessions.length < 2) return [];
    const recs = [];
    if (telemetryStats.typeBRate > 20) {
      recs.push({ title: t.insTypeBTitle, desc: t.insTypeBDesc, action: t.insTypeBAction, color: "border-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-500" });
    }
    if (telemetryStats.typeDRate > 20) {
      recs.push({ title: t.insTypeDTitle, desc: t.insTypeDDesc, action: t.insTypeDAction, color: "border-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", iconColor: "text-indigo-500" });
    }
    if (telemetryStats.fatigueRate > 30) {
      recs.push({ title: t.insFatigueTitle, desc: t.insFatigueDesc, action: t.insFatigueAction, color: "border-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", iconColor: "text-purple-500" });
    }
    if (telemetryStats.typeARate > 30) {
      recs.push({ title: t.insTypeATitle, desc: t.insTypeADesc, action: t.insTypeAAction, color: "border-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", iconColor: "text-rose-500" });
    }
    if (parseFloat(telemetryStats.avgTime as string) > 3) {
      recs.push({ title: t.insTimeTitle, desc: t.insTimeDesc, action: t.insTimeAction, color: "border-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", iconColor: "text-orange-500" });
    }
    return recs;
  }, [telemetryStats, telemetrySessions.length, t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2"><Activity className="w-6 h-6 text-indigo-500" /> {t.telemetryOverview}</h2>
        {viewMode === 'dashboard' ? (
          <Button onClick={() => { resetForm(); setViewMode('add'); }}><Plus className="w-4 h-4" /> {t.logSession}</Button>
        ) : (
          <Button variant="secondary" onClick={() => { resetForm(); setViewMode('dashboard'); }}><ChevronRight className="w-4 h-4 rotate-180" /> Voltar</Button>
        )}
      </div>

      {viewMode === 'add' ? (
        <Card className="p-8 max-w-3xl mx-auto shadow-md overflow-visible">
          
          {activeMissionForForm && !editingId && (
            <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-xl flex items-center gap-3 text-indigo-700 dark:text-indigo-400 animate-in fade-in">
              <Crosshair className="w-6 h-6 flex-shrink-0" />
              <p className="text-sm font-medium">{t.linkedMissionBanner}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.date}</label>
                <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.discipline}</label>
                <select required value={form.subjectId} onChange={handleSubjectChange} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer">
                  <option value="">{t.selectSubject}</option>
                  {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.topic}</label>
                <select value={form.topicId} onChange={handleTopicChange} disabled={!form.subjectId || availableTopics.length === 0} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer disabled:opacity-50">
                  <option value="">Geral / Revisão</option>
                  {availableTopics.map((top: Topic) => <option key={top.id} value={top.id}>{top.name}</option>)}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.totalQuestions}</label>
                <input type="number" min="1" required value={form.totalQs} onChange={e => setForm({...form, totalQs: e.target.value})} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.correct}</label>
                <input type="number" min="0" required value={form.correct} onChange={e => setForm({...form, correct: e.target.value})} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{t.time}</label>
                <input type="number" min="1" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full p-3 text-sm border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
              </div>
            </div>
            
            <div className="flex gap-8 items-center p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/50">
               <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                 <input type="checkbox" checked={form.fatigue} onChange={e => setForm({...form, fatigue: e.target.checked})} className="w-4 h-4 accent-indigo-600 rounded text-indigo-600 focus:ring-indigo-500" />
                 {t.fatigue}
               </label>
               <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                 <input type="checkbox" checked={form.block} onChange={e => setForm({...form, block: e.target.checked})} className="w-4 h-4 accent-indigo-600 rounded text-indigo-600 focus:ring-indigo-500" />
                 {t.cognitiveBlock}
               </label>
            </div>
            
            {totalErrorsInForm > 0 && (
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-8 mt-8 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-50">{t.errorClassification}</h4>
                  <span className={`font-mono text-sm font-semibold px-3 py-1 rounded-full ${sumOfCategorizedErrors === totalErrorsInForm ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                    {sumOfCategorizedErrors} / {totalErrorsInForm} Erros
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-xl">
                  {[ 
                    { key: 'errA', label: t.errA, tip: t.tipErrA }, 
                    { key: 'errB', label: t.errB, tip: t.tipErrB }, 
                    { key: 'errC', label: t.errC, tip: t.tipErrC }, 
                    { key: 'errD', label: t.errD, tip: t.tipErrD }, 
                    { key: 'errE', label: t.errE, tip: t.tipErrE }, 
                    { key: 'errF', label: t.errF, tip: t.tipErrF }, 
                    { key: 'errG', label: t.errG, tip: t.tipErrG }, 
                    { key: 'errH', label: t.errH, tip: t.tipErrH } 
                  ].map(errType => (
                    <div key={errType.key} className="flex items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm overflow-visible">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate cursor-help" title={errType.tip}>{errType.label}</label>
                        <Tooltip text={errType.tip}>
                           <Info className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-500 transition-colors flex-shrink-0" />
                        </Tooltip>
                      </div>
                      <input type="number" min="0" value={(form as any)[errType.key]} onChange={e => setForm({...form, [errType.key]: parseInt(e.target.value) || 0})} className="w-14 p-1.5 text-sm font-mono text-center border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                    </div>
                  ))}
                </div>
                {errorMismatch && <p className="text-rose-500 text-sm mt-3 flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> {errorMismatch}</p>}
              </div>
            )}
            <Button type="submit" className="w-full py-3.5 text-base mt-4">
              <Save className="w-5 h-5" /> {editingId ? t.updateLog : t.saveLog}
            </Button>
          </form>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 overflow-hidden">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.accuracy}</p>
              <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mt-2 tracking-tight">{telemetryStats.accuracy}%</h3>
            </Card>
            <Card className="p-6 overflow-hidden">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500"/> {t.typeBError}</p>
              <h3 className="text-4xl font-semibold text-amber-600 dark:text-amber-500 mt-2 tracking-tight">{telemetryStats.typeBRate}%</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">dos erros totais</p>
            </Card>
            <Card className="p-6 overflow-hidden">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.avgTime}</p>
              <h3 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mt-2 tracking-tight">{telemetryStats.avgTime} <span className="text-xl font-normal text-gray-400">{t.mins}</span></h3>
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-zinc-900 overflow-hidden">
              <h3 className="font-semibold text-lg mb-5 text-gray-900 dark:text-gray-50 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-indigo-500" /> {t.insights}</h3>
              {insights.length > 0 ? (
                <div className="space-y-4">
                   {insights.map((insight: any, idx: number) => (
                      <div key={idx} className={`p-5 rounded-2xl border-l-4 ${insight.color} ${insight.bg} border-t border-r border-b border-t-black/5 border-r-black/5 border-b-black/5 dark:border-white/5 shadow-sm transition-all`}>
                        <h4 className={`font-bold text-sm ${insight.iconColor} mb-1.5`}>{insight.title}</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">{insight.desc}</p>
                        <div className="bg-white/80 dark:bg-black/30 p-3 rounded-xl border border-black/5 dark:border-white/5">
                           <span className="font-bold uppercase tracking-wider opacity-60 text-[10px] block mb-1 text-gray-900 dark:text-white">Ação Recomendada</span>
                           <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{insight.action}</span>
                        </div>
                      </div>
                   ))}
                </div>
              ) : (<p className="text-gray-500 dark:text-gray-400 text-sm">{t.noInsights}</p>)}
            </Card>
            <Card className="p-6 overflow-hidden">
              <h3 className="font-semibold text-lg mb-5 text-gray-900 dark:text-gray-50 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gray-400" /> {t.recentLogs}</h3>
              <div className="space-y-3">
                {telemetrySessions.slice(0,5).map((log: TelemetrySession) => {
                  const subject = subjects.find((s: any) => s.id === log.subjectId);
                  const topic = subject?.topics.find((tp: any) => tp.id === log.topicId);
                  const accuracy = Math.round((log.correctAnswers / log.totalQuestions) * 100);
                  return (
                    <div key={log.id} className="flex flex-col p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100 text-sm block">{subject?.name}</span>
                          {topic && <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block">↳ {topic.name}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-mono">{log.date}</span>
                          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(log)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5"/></button>
                            <button onClick={() => handleDelete(log.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-5 text-xs font-medium text-gray-500 dark:text-gray-400">
                         <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-emerald-500"/> {accuracy}%</span><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-500"/> {(log.timeMinutes / log.totalQuestions).toFixed(1)}m</span>
                         {(log.fatigue || log.cognitiveBlock) && (<span className="text-rose-500 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Alertas</span>)}
                      </div>
                    </div>
                  )
                })}
                {telemetrySessions.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum registro ainda.</p>}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
};

// --- Adaptive Training Engine Component ---
const AdaptiveTrainingModule = ({ t, subjects, sessions, telemetrySessions, activeMissions, setActiveMissions, setGoToTelemetry, setGoToCalendar }: any) => {
  const [dailyCapacity, setDailyCapacity] = useState<number>(() => {
    const saved = localStorage.getItem('fiscal_daily_capacity');
    return saved ? parseInt(saved) : 100;
  });
  const [distributionMode, setDistributionMode] = useState<'equal' | 'weighted'>(() => {
    const saved = localStorage.getItem('fiscal_dist_mode');
    return (saved === 'equal' || saved === 'weighted') ? saved : 'equal';
  });
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  const todayStr = getLocalToday();
  const todayMissions = activeMissions.filter((m: any) => m.date === todayStr);
  const hasPendingMissions = todayMissions.some((m: any) => m.status === 'Pending');
  const allCompleted = todayMissions.length > 0 && todayMissions.every((m: any) => m.status === 'Completed');
  
  const todayScheduledSessions = useMemo(() => {
    return sessions.filter((s: any) => s.date === todayStr && !s.completed);
  }, [sessions, todayStr]);

  useEffect(() => { localStorage.setItem('fiscal_daily_capacity', String(dailyCapacity)); }, [dailyCapacity]);
  useEffect(() => { localStorage.setItem('fiscal_dist_mode', distributionMode); }, [distributionMode]);

  const generateMission = () => {
    if (subjects.length === 0 || todayScheduledSessions.length === 0) return;

    const calculateMetrics = (sessionsData: TelemetrySession[], weightMult: number) => {
      if (sessionsData.length === 0) return { score: 50 * weightMult, mode: 'Content' as const };
      
      let tQ = 0, tC = 0, tTime = 0, errB = 0, errD = 0, errA = 0;
      sessionsData.forEach((s: TelemetrySession) => {
        tQ += s.totalQuestions; tC += s.correctAnswers; tTime += s.timeMinutes;
        errB += s.errors.typeB; errD += s.errors.typeD; errA += s.errors.typeA;
      });

      const totalErr = tQ - tC;
      const rateB = totalErr ? errB / totalErr : 0;
      const rateD = totalErr ? errD / totalErr : 0;
      const rateA = totalErr ? errA / totalErr : 0;
      const avgTime = tQ ? tTime / tQ : 0;

      const timePenalty = Math.max(0, avgTime - 3.0) * 1.2;
      const score = weightMult * ((rateB * 100 * 2.0) + (rateD * 100 * 1.5) + (rateA * 100 * 1.0) + timePenalty);

      let mode: 'Execution' | 'Interpretation' | 'Speed' | 'Endurance' | 'Content' = 'Content';
      if (rateB > 0.25) mode = 'Execution';
      else if (rateD > 0.20) mode = 'Interpretation';
      else if (avgTime > 3.5) mode = 'Speed';
      
      return { score, mode };
    };

    const targets: { subjectId: string, topicId: string }[] = [];
    todayScheduledSessions.forEach((session: any) => {
        const exists = targets.find(t => t.subjectId === session.subjectId && t.topicId === session.topicId);
        if (!exists) {
            targets.push({ subjectId: session.subjectId, topicId: session.topicId });
        }
    });

    const scoredTargets = targets.map(target => {
      const sub = subjects.find((s: Subject) => s.id === target.subjectId);
      const top = sub?.topics.find((t: Topic) => t.id === target.topicId);

      if (!sub) return null;

      let weightMult = 1.0;
      if (sub.weight === 'High') weightMult = 1.5;
      else if (sub.weight === 'Low') weightMult = 0.8;

      const targetSessions = telemetrySessions.filter((s: TelemetrySession) => s.subjectId === target.subjectId && (!target.topicId || s.topicId === target.topicId));
      const metrics = calculateMetrics(targetSessions, weightMult);

      return { sub, topic: top, score: metrics.score, mode: metrics.mode };
    }).filter(Boolean).sort((a: any, b: any) => b.score - a.score);

    const totalTargetScore = scoredTargets.reduce((acc, ts) => acc + (ts?.score || 0), 0);

    let recentFatigueCount = 0;
    const recentSessions = telemetrySessions.slice(0, 10); 
    recentSessions.forEach((s: TelemetrySession) => { if (s.fatigue) recentFatigueCount++; });
    const fatigueRate = recentSessions.length ? recentFatigueCount / recentSessions.length : 0;

    let finalVolume = dailyCapacity;
    if (fatigueRate > 0.3) {
      finalVolume = Math.floor(dailyCapacity * 0.7);
    }
    
    const newMissions: TrainingMission[] = scoredTargets.map((ts: any) => {
      let volumePerSubject = 10;
      if (distributionMode === 'weighted' && totalTargetScore > 0) {
        volumePerSubject = Math.max(10, Math.round((ts.score / totalTargetScore) * finalVolume));
      } else {
        volumePerSubject = Math.max(10, Math.floor(finalVolume / scoredTargets.length));
      }

      return {
        id: crypto.randomUUID(),
        date: todayStr,
        subjectId: ts.sub.id,
        topicId: ts.topic?.id,
        mode: fatigueRate > 0.3 ? 'Endurance' : ts.mode,
        volume: volumePerSubject,
        status: 'Pending',
        priorityScore: ts.score
      };
    });

    setActiveMissions([...newMissions, ...activeMissions]);
  };

  const abandonPlan = () => {
    setActiveMissions(activeMissions.filter((m: any) => m.date !== todayStr));
    setShowAbandonConfirm(false);
  };

  const getModeInfo = (mode: string) => {
    switch (mode) {
      case 'Execution': return { title: t.missionModeExecution, focus: "Evitar erro Tipo B (Atenção/Execução).", rule: "Não revise respostas. Marque e avance.", color: "text-amber-600 border-amber-200 dark:border-amber-500/30" };
      case 'Interpretation': return { title: t.missionModeInterpretation, focus: "Atenção a pegadinhas (Erro Tipo D).", rule: "Leia a pergunta duas vezes. Sublinhe palavras absolutas (sempre, exceto).", color: "text-indigo-600 border-indigo-200 dark:border-indigo-500/30" };
      case 'Speed': return { title: t.missionModeSpeed, focus: "Reduzir o tempo médio (Erro Tipo C).", rule: "Máximo 60s por questão. Se travar >20s, pule imediatamente.", color: "text-rose-600 border-rose-200 dark:border-rose-500/30" };
      case 'Endurance': return { title: t.missionModeEndurance, focus: "Construir resistência contra Fadiga (Erro F).", rule: "Faça blocos menores. Pausa obrigatória de 5 min a cada 15 questões.", color: "text-purple-600 border-purple-200 dark:border-purple-500/30" };
      case 'Content': default: return { title: t.missionModeContent, focus: "Preencher lacunas teóricas (Erro Tipo A).", rule: "Leia atentamente os comentários do professor a cada erro cometido.", color: "text-sky-600 border-sky-200 dark:border-sky-500/30" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-indigo-500" />
          {t.engineTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-6">
          
          {todayScheduledSessions.length === 0 && todayMissions.length === 0 && (
             <div className="p-5 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 rounded-2xl flex flex-col items-center text-center gap-3 animate-in fade-in">
               <CalendarIcon className="w-8 h-8 text-amber-500" />
               <p className="text-amber-800 dark:text-amber-400 text-sm font-medium">{t.scheduleRequired}</p>
               <Button onClick={setGoToCalendar} variant="secondary" className="w-full bg-amber-500 hover:bg-amber-600 text-white border-none mt-2 shadow-amber-500/20">
                 {t.goToCalendar}
               </Button>
             </div>
          )}

          <Card className="p-6 overflow-visible">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t.dailyCapacity}</h3>
              <Tooltip text={t.tipCapacity}>
                <Info className="w-4 h-4 text-gray-400 hover:text-indigo-500 transition-colors" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <input type="range" min="10" max="300" step="10" value={dailyCapacity} onChange={(e) => setDailyCapacity(parseInt(e.target.value))} disabled={todayMissions.length > 0} className="w-full accent-indigo-600 disabled:opacity-50" />
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 w-12 text-right">{dailyCapacity}</span>
            </div>
            
            <div className="flex items-center justify-between mb-3 mt-8">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">{t.volumeDistribution}</h3>
              <Tooltip text={t.tipVolumeDist}>
                <Info className="w-4 h-4 text-gray-400 hover:text-indigo-500 transition-colors" />
              </Tooltip>
            </div>
            <div className="flex gap-3 mb-2">
               <button onClick={() => setDistributionMode('equal')} disabled={todayMissions.length > 0} className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-xl border transition-all ${distributionMode === 'equal' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-800'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                 {t.distEqual}
               </button>
               <button onClick={() => setDistributionMode('weighted')} disabled={todayMissions.length > 0} className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-xl border transition-all ${distributionMode === 'weighted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-800'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                 {t.distWeighted}
               </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800">
               <Button 
                 onClick={generateMission} 
                 disabled={todayMissions.length > 0 || subjects.length === 0 || todayScheduledSessions.length === 0} 
                 className="w-full py-3.5 text-base"
               >
                 <Zap className="w-5 h-5" /> {t.generateMission}
               </Button>
               {subjects.length === 0 && <p className="text-xs text-center text-rose-500 mt-3">Adicione matérias primeiro.</p>}
               
               {todayMissions.length > 0 && !showAbandonConfirm && (
                 <Button variant="ghost" onClick={() => setShowAbandonConfirm(true)} className="w-full py-3 mt-3 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                   <Trash2 className="w-4 h-4" /> {t.abandonMission}
                 </Button>
               )}

               {showAbandonConfirm && (
                 <div className="flex flex-col gap-4 p-5 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 mt-4 animate-in fade-in">
                   <p className="text-sm font-medium text-rose-800 dark:text-rose-300 text-center">{t.abandonMissionConfirm}</p>
                   <div className="flex gap-3">
                     <Button variant="ghost" onClick={() => setShowAbandonConfirm(false)} className="flex-1 bg-white dark:bg-zinc-900">{t.cancel}</Button>
                     <Button variant="danger" onClick={abandonPlan} className="flex-1">Confirmar</Button>
                   </div>
                 </div>
               )}
            </div>
          </Card>
        </div>

        <div className="md:col-span-8">
          {allCompleted ? (
             <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 h-full overflow-hidden">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-800/30 rounded-full flex items-center justify-center mb-6">
                  <Trophy className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">{t.missionCompleted}</h2>
                <p className="text-emerald-600 dark:text-emerald-500/80 mt-3 max-w-sm">{t.missionCompletedDesc}</p>
             </Card>
          ) : todayMissions.length > 0 ? (
             <div className="grid grid-cols-1 gap-6 animate-in zoom-in-95 duration-300">
                {todayMissions.sort((a: any, b: any) => b.priorityScore - a.priorityScore).map((mission: TrainingMission) => {
                   const info = getModeInfo(mission.mode);
                   const isCompleted = mission.status === 'Completed';
                   const targetTopicName = mission.topicId 
                      ? subjects.find((s: any) => s.id === mission.subjectId)?.topics.find((t: any) => t.id === mission.topicId)?.name 
                      : null;

                   return (
                     <Card key={mission.id} className={`shadow-lg overflow-visible transition-all duration-500 ${isCompleted ? 'opacity-60 grayscale' : 'border-t-4 border-t-indigo-500'}`}>
                        <div className="p-6 md:p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'}`}>
                                {isCompleted ? 'Concluída' : t.activeMission}
                              </span>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-4 tracking-tight">{subjects.find((s: any) => s.id === mission.subjectId)?.name}</h2>
                              {targetTopicName && (
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 bg-gray-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-zinc-800 inline-block">
                                  Alvo Específico: <strong className="text-gray-700 dark:text-gray-300">{targetTopicName}</strong>
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-4xl font-black text-gray-900 dark:text-gray-50 tracking-tighter">{mission.volume}</span>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Questões</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                               <div className={`flex-1 p-4 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm ${info.color}`}>
                                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1.5">{t.mode}</h4>
                                  <p className="text-base font-bold">{info.title}</p>
                               </div>
                               <div className={`flex-1 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30`}>
                                  <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-1.5">{t.focus}</h4>
                                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{info.focus}</p>
                               </div>
                            </div>
                            
                            <div className={`p-5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-black/50`}>
                              <h4 className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider mb-2">{t.rule}</h4>
                              <p className="text-gray-900 dark:text-gray-50 font-semibold">{info.rule}</p>
                            </div>
                          </div>

                          {!isCompleted && (
                            <div className="mt-6">
                               <Button onClick={() => setGoToTelemetry({ subjectId: mission.subjectId, topicId: mission.topicId })} className="w-full py-3.5 text-base bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white shadow-md">
                                 <Target className="w-5 h-5" /> {t.startMission}
                               </Button>
                            </div>
                          )}
                        </div>
                     </Card>
                   )
                })}
             </div>
          ) : (
             <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-200 dark:border-zinc-800 h-full bg-transparent shadow-none overflow-hidden">
                <BrainCircuit className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-5" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Aguardando geração do plano...</p>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Main Application Wrapper ---

export default function ElantariApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'calendar' | 'telemetry' | 'training'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [telemetryPrefill, setTelemetryPrefill] = useState<{subjectId: string, topicId?: string} | null>(null);
  
  const [language, setLanguage] = useState<'en' | 'pt'>(() => {
    const saved = localStorage.getItem('fiscal_lang');
    return (saved === 'pt' || saved === 'en') ? saved : 'en';
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('fiscal_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('fiscal_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [telemetrySessions, setTelemetrySessions] = useState<TelemetrySession[]>(() => {
    const saved = localStorage.getItem('fiscal_telemetry');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeMissions, setActiveMissions] = useState<TrainingMission[]>(() => {
    const saved = localStorage.getItem('fiscal_missions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fiscal_theme');
    return saved === 'dark';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => { localStorage.setItem('fiscal_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('fiscal_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('fiscal_telemetry', JSON.stringify(telemetrySessions)); }, [telemetrySessions]);
  useEffect(() => { localStorage.setItem('fiscal_missions', JSON.stringify(activeMissions)); }, [activeMissions]);
  useEffect(() => { localStorage.setItem('fiscal_theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  useEffect(() => { localStorage.setItem('fiscal_lang', language); }, [language]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'pt' : 'en');

  const exportData = () => {
    const data = { version: 2, timestamp: new Date().toISOString(), subjects, sessions, telemetrySessions, activeMissions, language, darkMode };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elantari-backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
          if (Array.isArray(data.sessions)) setSessions(data.sessions);
          if (Array.isArray(data.telemetrySessions)) setTelemetrySessions(data.telemetrySessions);
          if (Array.isArray(data.activeMissions)) setActiveMissions(data.activeMissions);
          if (data.language) setLanguage(data.language);
          if (data.darkMode !== undefined) setDarkMode(data.darkMode);
          alert(t.restoreSuccess);
        } else { throw new Error("Invalid"); }
      } catch (err) { alert(t.restoreError); }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const stats = useMemo(() => {
    const totalTopics = subjects.reduce((acc, sub) => acc + sub.topics.length, 0);
    const completedTopics = subjects.reduce((acc, sub) => acc + sub.topics.filter(t => t.isCompleted).length, 0);
    const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
    const totalHoursPlanned = sessions.reduce((acc, sess) => acc + sess.durationMinutes, 0) / 60;
    const completedSessions = sessions.filter(s => s.completed).length;
    return { totalTopics, completedTopics, progress, totalHoursPlanned, completedSessions };
  }, [subjects, sessions]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans selection:bg-indigo-500/30">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-zinc-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                  <ChevronsUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:inline">Elantari</span>
              </div>
              
              <div className="hidden lg:flex items-center gap-1.5">
                <nav className="flex space-x-1 mr-3">
                  {[ 
                    { id: 'dashboard', label: t.dashboard, icon: BarChart2 }, 
                    { id: 'training', label: t.training, icon: Crosshair },
                    { id: 'telemetry', label: t.telemetry, icon: Activity },
                    { id: 'syllabus', label: t.subjects, icon: BookOpen }, 
                    { id: 'calendar', label: t.calendar, icon: CalendarIcon }
                  ].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === item.id ? 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800/50'}`}>
                      <item.icon className="w-4 h-4" /><span className="hidden xl:inline">{item.label}</span>
                    </button>
                  ))}
                </nav>
                <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800 mx-1"></div>
                <button onClick={exportData} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors" title={t.backup}><Download className="w-4 h-4" /></button>
                <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors" title={t.restore}><Upload className="w-4 h-4" /></button>
                <input type="file" ref={fileInputRef} onChange={importData} className="hidden" accept=".json" />
                <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800 mx-1"></div>
                <button onClick={toggleLanguage} className="px-2.5 py-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors font-bold text-xs border border-transparent" title="Switch Language">{language === 'en' ? 'EN' : 'PT'}</button>
                <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors">{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
              </div>

              <div className="lg:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800 rounded-lg">
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 absolute w-full shadow-2xl z-50">
              <div className="px-4 pt-3 pb-4 space-y-1">
                {[ 
                  { id: 'dashboard', label: t.dashboard, icon: BarChart2 }, 
                  { id: 'training', label: t.training, icon: Crosshair },
                  { id: 'telemetry', label: t.telemetry, icon: Activity },
                  { id: 'syllabus', label: t.subjects, icon: BookOpen }, 
                  { id: 'calendar', label: t.calendar, icon: CalendarIcon }
                ].map(item => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }} className={`w-full px-4 py-3.5 rounded-xl text-base font-medium flex items-center gap-3 transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800/50'}`}>
                    <item.icon className="w-5 h-5" /> <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 dark:border-zinc-800 my-3"></div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={exportData} className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"><Download className="w-4 h-4" /> {t.backup}</button>
                   <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"><Upload className="w-4 h-4" /> {t.restore}</button>
                </div>
                <div className="flex items-center justify-between px-2 pt-4">
                   <button onClick={toggleLanguage} className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Lang: {language}</button>
                   <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 p-2 rounded-full">{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {activeTab === 'dashboard' && <Dashboard t={t} stats={stats} sessions={sessions} setSessions={setSessions} subjects={subjects} telemetrySessions={telemetrySessions} />}
          {activeTab === 'training' && <AdaptiveTrainingModule t={t} subjects={subjects} sessions={sessions} telemetrySessions={telemetrySessions} activeMissions={activeMissions} setActiveMissions={setActiveMissions} setGoToTelemetry={(data: {subjectId: string, topicId?: string}) => { setTelemetryPrefill(data); setActiveTab('telemetry'); }} setGoToCalendar={() => setActiveTab('calendar')} />}
          {activeTab === 'syllabus' && <SyllabusManager t={t} subjects={subjects} setSubjects={setSubjects} />}
          {activeTab === 'calendar' && <CalendarPlanner t={t} language={language} subjects={subjects} sessions={sessions} setSessions={setSessions} />}
          {activeTab === 'telemetry' && <TelemetryModule t={t} subjects={subjects} telemetrySessions={telemetrySessions} setTelemetrySessions={setTelemetrySessions} activeMissions={activeMissions} setActiveMissions={setActiveMissions} telemetryPrefill={telemetryPrefill} setTelemetryPrefill={setTelemetryPrefill} />}
        </main>
      </div>
    </div>
  );
}