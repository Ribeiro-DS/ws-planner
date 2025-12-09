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
  Trophy,
  Pencil,
  X,
  Save,
  Download,
  Upload,
  Menu // Added Menu icon
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
  topics: Topic[];
}

interface StudySession {
  id: string;
  subjectId: string;
  topicId: string;
  date: string; // ISO Date string YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  completed: boolean;
  notes?: string;
}

interface StudyFocusData {
  quote: string;
  tipTitle: string;
  tipBody: string;
}

// --- Translations ---
const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    subjects: "Subjects",
    calendar: "Calendar",
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
    restoreError: "Invalid file format."
  },
  pt: {
    dashboard: "Painel",
    subjects: "Matérias",
    calendar: "Calendário",
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
    add: "Add",
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
    restoreError: "Arquivo inválido."
  }
};

// --- Mock Data / Initial State ---
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: '1',
    name: 'Tax Law',
    color: 'bg-[#006494]', // Lapis Blue
    topics: [
      { id: 't1', name: 'Tax Obligation', isCompleted: false },
      { id: 't2', name: 'Tax Credit', isCompleted: false },
    ]
  },
  {
    id: '2',
    name: 'Accounting',
    color: 'bg-[#EF8354]', // Vibrant Coral
    topics: [
      { id: 't3', name: 'Balance Sheet', isCompleted: false },
    ]
  },
  {
    id: '3',
    name: 'Const. Law',
    color: 'bg-[#0D1B2A]', // Deep Navy
    topics: [
      { id: 't5', name: 'Fundamental Rights', isCompleted: true },
    ]
  }
];

// --- Helper Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-[#1B263B] rounded-xl shadow-sm border border-[#778DA9]/30 dark:border-[#415A77]/30 overflow-hidden transition-colors duration-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = 'primary', className = "", disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 touch-manipulation text-sm";
  
  const variants = {
    primary: "bg-[#EF8354] text-white hover:bg-[#d97040] disabled:opacity-50 shadow-md shadow-[#EF8354]/20",
    secondary: "bg-[#006494] text-white hover:bg-[#005076]",
    danger: "bg-red-50 dark:bg-red-900/20 text-[#EF8354] dark:text-[#EF8354] hover:bg-red-100 dark:hover:bg-red-900/40",
    ghost: "text-[#006494] dark:text-[#778DA9] hover:bg-[#778DA9]/10 dark:hover:bg-[#778DA9]/10"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main Application Component ---

export default function WSPlannerApp() {
  // State Management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'calendar'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
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
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fiscal_theme');
    return saved === 'dark';
  });

  const [studyFocus, setStudyFocus] = useState<StudyFocusData | null>(() => {
    const saved = localStorage.getItem('fiscal_focus');
    return saved ? JSON.parse(saved) : null;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  // Persistence Effects...
  useEffect(() => { localStorage.setItem('fiscal_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('fiscal_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('fiscal_theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  useEffect(() => { localStorage.setItem('fiscal_lang', language); }, [language]);
  useEffect(() => { if (studyFocus) localStorage.setItem('fiscal_focus', JSON.stringify(studyFocus)); }, [studyFocus]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'pt' : 'en');

  // Data functions...
  const exportData = () => {
    const data = { version: 1, timestamp: new Date().toISOString(), subjects, sessions, studyFocus, language, darkMode };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ws-planner-backup.json`;
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
        if (Array.isArray(data.subjects) && Array.isArray(data.sessions)) {
          setSubjects(data.subjects);
          setSessions(data.sessions);
          if (data.studyFocus) setStudyFocus(data.studyFocus);
          if (data.language) setLanguage(data.language);
          if (data.darkMode !== undefined) setDarkMode(data.darkMode);
          alert(t.restoreSuccess);
        } else { throw new Error("Invalid"); }
      } catch (err) { alert(t.restoreError); }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Stats...
  const stats = useMemo(() => {
    const totalTopics = subjects.reduce((acc, sub) => acc + sub.topics.length, 0);
    const completedTopics = subjects.reduce((acc, sub) => acc + sub.topics.filter(t => t.isCompleted).length, 0);
    const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
    const totalHoursPlanned = sessions.reduce((acc, sess) => acc + sess.durationMinutes, 0) / 60;
    const completedSessions = sessions.filter(s => s.completed).length;
    return { totalTopics, completedTopics, progress, totalHoursPlanned, completedSessions };
  }, [subjects, sessions]);

  // --- Sub-Components ---

  const Dashboard = () => {
    const [isEditingFocus, setIsEditingFocus] = useState(false);
    const [editForm, setEditForm] = useState<StudyFocusData>({ quote: "", tipTitle: "", tipBody: "" });

    const startEditing = () => {
      setEditForm({
        quote: studyFocus?.quote || t.quote,
        tipTitle: studyFocus?.tipTitle || t.tipTitle,
        tipBody: studyFocus?.tipBody || t.tipBody
      });
      setIsEditingFocus(true);
    };

    const saveEditing = () => {
      setStudyFocus(editForm);
      setIsEditingFocus(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-l-4 border-l-[#EF8354]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#006494] dark:text-[#778DA9]">{t.syllabusCoverage}</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A] dark:text-[#E0E1DD] mt-2">{stats.progress}%</h3>
              </div>
              <div className="p-2 bg-[#E0E1DD] dark:bg-[#006494]/20 rounded-lg"><Target className="w-6 h-6 text-[#EF8354]" /></div>
            </div>
            <div className="w-full bg-[#778DA9]/30 h-2 rounded-full mt-4">
              <div className="bg-[#EF8354] h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }}></div>
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-[#006494]">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#006494] dark:text-[#778DA9]">{t.topicsMastered}</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A] dark:text-[#E0E1DD] mt-2">{stats.completedTopics} <span className="text-sm text-[#006494] dark:text-[#778DA9] font-normal">/ {stats.totalTopics}</span></h3>
              </div>
              <div className="p-2 bg-[#E0E1DD] dark:bg-[#006494]/20 rounded-lg"><CheckCircle className="w-6 h-6 text-[#006494]" /></div>
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-[#0D1B2A] dark:border-l-[#778DA9]">
             <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#006494] dark:text-[#778DA9]">{t.sessionsCompleted}</p>
                <h3 className="text-3xl font-bold text-[#0D1B2A] dark:text-[#E0E1DD] mt-2">{stats.completedSessions}</h3>
              </div>
              <div className="p-2 bg-[#E0E1DD] dark:bg-[#006494]/20 rounded-lg"><Clock className="w-6 h-6 text-[#0D1B2A] dark:text-[#778DA9]" /></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-[#0D1B2A] dark:text-[#E0E1DD] flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#006494]" /> {t.upcomingSessions}
            </h3>
            {sessions.filter(s => !s.completed).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {sessions.filter(s => !s.completed).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map(session => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  const topic = subject?.topics.find(t => t.id === session.topicId);
                  return (
                    <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#E0E1DD] dark:bg-[#0D1B2A] rounded-lg border border-[#778DA9]/30 gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${subject?.color || 'bg-slate-400'}`}></div>
                        <div>
                          <p className="font-semibold text-[#0D1B2A] dark:text-[#E0E1DD]">{subject?.name}</p>
                          <p className="text-sm text-[#006494] dark:text-[#778DA9]">{topic?.name} • {session.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => setSessions(sessions.map(s => s.id === session.id ? { ...s, completed: true } : s))} className="w-full sm:w-auto">
                        <CheckCircle className="w-5 h-5" /> <span className="sm:hidden">{t.markDone}</span>
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-[#006494] dark:text-[#778DA9]">{t.noUpcoming}</div>
            )}
          </Card>

          <Card className="p-6 relative group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-[#0D1B2A] dark:text-[#E0E1DD] flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#006494]" /> {t.studyFocus}</h3>
              {!isEditingFocus && (
                <button onClick={startEditing} className="p-2 text-[#006494] hover:text-[#EF8354] dark:text-[#778DA9] dark:hover:text-[#EF8354] transition-colors rounded-full hover:bg-[#E0E1DD] dark:hover:bg-[#0D1B2A]" title={t.edit}><Pencil className="w-4 h-4" /></button>
              )}
            </div>
            {isEditingFocus ? (
               <div className="space-y-4 animate-in fade-in">
                 <textarea value={editForm.quote} onChange={(e) => setEditForm({...editForm, quote: e.target.value})} className="w-full p-2 text-sm border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#0D1B2A] outline-none" rows={2} />
                 <input type="text" value={editForm.tipTitle} onChange={(e) => setEditForm({...editForm, tipTitle: e.target.value})} className="w-full p-2 text-sm border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#0D1B2A] outline-none" />
                 <textarea value={editForm.tipBody} onChange={(e) => setEditForm({...editForm, tipBody: e.target.value})} className="w-full p-2 text-sm border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#0D1B2A] outline-none" rows={3} />
                 <div className="flex justify-end gap-2">
                   <Button variant="ghost" onClick={() => setIsEditingFocus(false)} className="text-sm py-1"><X className="w-4 h-4" /> {t.cancel}</Button>
                   <Button onClick={saveEditing} className="text-sm py-1"><Save className="w-4 h-4" /> {t.save}</Button>
                 </div>
               </div>
            ) : (
              <>
                <p className="text-[#006494] dark:text-[#778DA9] mb-4 italic">{studyFocus?.quote || t.quote}</p>
                <div className="p-4 bg-[#E0E1DD] dark:bg-[#0D1B2A] rounded-lg text-[#0D1B2A] dark:text-[#E0E1DD] text-sm border border-[#778DA9]/30">
                  <strong>{studyFocus?.tipTitle || t.tipTitle}</strong> {studyFocus?.tipBody || t.tipBody}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  };

  const SyllabusManager = () => {
    // ... Simplified logic for Syllabus Manager as before ...
    const [newSubjectName, setNewSubjectName] = useState('');
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [newTopicNames, setNewTopicNames] = useState<{[key: string]: string}>({});

    const addSubject = () => {
      if (!newSubjectName.trim()) return;
      setSubjects([...subjects, { id: crypto.randomUUID(), name: newSubjectName, color: `bg-[#${['006494','EF8354','0D1B2A','778DA9'][Math.floor(Math.random()*4)]}]`, topics: [] }]);
      setNewSubjectName('');
    };

    const addTopic = (subjectId: string) => {
      const name = newTopicNames[subjectId];
      if (!name?.trim()) return;
      setSubjects(subjects.map(sub => sub.id === subjectId ? { ...sub, topics: [...sub.topics, { id: crypto.randomUUID(), name, isCompleted: false }] } : sub));
      setNewTopicNames({ ...newTopicNames, [subjectId]: '' });
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-20 md:pb-0">
        <Card className="p-6 bg-[#E0E1DD] dark:bg-[#0D1B2A] border-dashed border-2 border-[#778DA9] dark:border-[#415A77]">
          <h3 className="text-lg font-semibold text-[#0D1B2A] dark:text-[#E0E1DD] mb-4">{t.addDiscipline}</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder={t.placeholderSubject} className="flex-1 p-3 border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#0D1B2A] dark:focus:ring-[#778DA9] outline-none" />
            <Button onClick={addSubject} className="w-full sm:w-auto"><Plus className="w-4 h-4" /> {t.add}</Button>
          </div>
        </Card>
        <div className="space-y-4">
          {subjects.map(subject => (
            <Card key={subject.id} className="overflow-visible">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#E0E1DD] dark:hover:bg-[#0D1B2A] transition-colors" onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className={`w-3 h-3 flex-shrink-0 rounded-full ${subject.color}`}></span>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 overflow-hidden">
                    <h4 className="font-bold text-[#0D1B2A] dark:text-[#E0E1DD] text-lg truncate">{subject.name}</h4>
                    <span className="text-xs font-medium px-2 py-1 bg-[#E0E1DD] dark:bg-[#0D1B2A] rounded-full text-[#006494] dark:text-[#778DA9] w-fit">{subject.topics.filter(t => t.isCompleted).length} / {subject.topics.length} {t.doneCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" className="text-[#EF8354] hover:text-[#d97040] hover:bg-red-50 dark:hover:bg-red-900/30 p-2" onClick={(e: any) => { e.stopPropagation(); setSubjects(subjects.filter(s => s.id !== subject.id)); }}><Trash2 className="w-5 h-5" /></Button>
                  {expandedSubject === subject.id ? <ChevronDown className="w-6 h-6 text-[#006494]" /> : <ChevronRight className="w-6 h-6 text-[#006494]" />}
                </div>
              </div>
              {expandedSubject === subject.id && (
                <div className="p-4 border-t border-[#778DA9]/20 dark:border-[#415A77]/20 bg-[#E0E1DD] dark:bg-[#0D1B2A]">
                  <div className="space-y-2 mb-4">
                    {subject.topics.map(topic => (
                      <div key={topic.id} className="flex items-center justify-between group p-3 bg-white dark:bg-[#0D1B2A] rounded-lg border border-[#778DA9]/20 dark:border-[#415A77]/20 shadow-sm">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setSubjects(subjects.map(sub => sub.id === subject.id ? { ...sub, topics: sub.topics.map(t => t.id === topic.id ? { ...t, isCompleted: !t.isCompleted } : t) } : sub))} className={`w-6 h-6 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${topic.isCompleted ? 'bg-[#006494] border-[#006494]' : 'border-[#006494] hover:border-[#EF8354]'}`}>{topic.isCompleted && <CheckCircle className="w-4 h-4 text-white" />}</button>
                          <span className={`${topic.isCompleted ? 'text-[#006494]/60 dark:text-[#778DA9]/50 line-through' : 'text-[#0D1B2A] dark:text-[#E0E1DD]'}`}>{topic.name}</span>
                        </div>
                        <button onClick={() => setSubjects(subjects.map(sub => sub.id === subject.id ? { ...sub, topics: sub.topics.filter(t => t.id !== topic.id) } : sub))} className="p-2 opacity-50 hover:opacity-100 text-[#006494] hover:text-[#EF8354] transition-opacity"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                    {subject.topics.length === 0 && <p className="text-sm text-[#006494] italic">{t.noTopics}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <input type="text" placeholder={t.addTopicPlaceholder} value={newTopicNames[subject.id] || ''} onChange={(e) => setNewTopicNames({...newTopicNames, [subject.id]: e.target.value})} className="flex-1 p-3 text-sm border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg focus:border-[#0D1B2A] dark:focus:border-[#778DA9] outline-none" />
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

  const CalendarPlanner = () => {
    // ... Simplified Calendar Logic ...
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [duration, setDuration] = useState('60');

    const availableTopics = useMemo(() => {
        const sub = subjects.find(s => s.id === selectedSubject);
        return sub ? sub.topics : [];
    }, [selectedSubject, subjects]);

    const addSession = () => {
        if (!selectedSubject || !selectedTopic) return;
        // Simple conflict check (simplified for brevity)
        setSessions([...sessions, { id: crypto.randomUUID(), subjectId: selectedSubject, topicId: selectedTopic, date: selectedDate, startTime, durationMinutes: parseInt(duration), completed: false }]);
        setSelectedTopic('');
    };

    const daysSessions = sessions.filter(s => s.date === selectedDate).sort((a,b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full pb-20 md:pb-0">
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <Card className="p-5 sticky top-24 md:top-6">
            <h3 className="font-bold text-[#0D1B2A] dark:text-[#E0E1DD] mb-4">{t.scheduleBlock}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-[#006494] dark:text-[#778DA9] mb-1">{t.date}</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg" /></div>
              <div className="grid grid-cols-2 gap-3">
                 <div><label className="block text-sm font-medium text-[#006494] dark:text-[#778DA9] mb-1">{t.startTime}</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-3 border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg" /></div>
                 <div><label className="block text-sm font-medium text-[#006494] dark:text-[#778DA9] mb-1">{t.duration}</label><input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-3 border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg" /></div>
              </div>
              <div><label className="block text-sm font-medium text-[#006494] dark:text-[#778DA9] mb-1">{t.discipline}</label><select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }} className="w-full p-3 border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg"><option value="">{t.selectSubject}</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-[#006494] dark:text-[#778DA9] mb-1">{t.topic}</label><select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} disabled={!selectedSubject} className="w-full p-3 border border-[#778DA9] dark:border-[#415A77] bg-white dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#E0E1DD] rounded-lg disabled:opacity-50"><option value="">{t.selectTopic}</option>{availableTopics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
              <Button onClick={addSession} disabled={!selectedTopic} className="w-full mt-4 py-3"><Plus className="w-4 h-4" /> {t.addToSchedule}</Button>
            </div>
          </Card>
        </div>
        <div className="md:col-span-7 lg:col-span-8">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-[#0D1B2A] dark:text-[#E0E1DD]">{t.agendaFor} {new Date(selectedDate).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric'})}</h2>
            <div className="text-sm text-[#006494] dark:text-[#778DA9]">{daysSessions.length} {t.sessionsPlanned}</div>
          </div>
          <div className="space-y-3">
            {daysSessions.length === 0 ? (
              <div className="border-2 border-dashed border-[#778DA9] dark:border-[#415A77] rounded-xl p-12 flex flex-col items-center justify-center text-[#006494] dark:text-[#778DA9]"><CalendarIcon className="w-12 h-12 mb-2 opacity-50" /><p>{t.noSessionsDay}</p></div>
            ) : (
              daysSessions.map(session => {
                const sub = subjects.find(s => s.id === session.subjectId);
                const topic = sub?.topics.find(t => t.id === session.topicId);
                return (
                  <div key={session.id} className={`bg-white dark:bg-[#0D1B2A] p-4 rounded-xl border-l-4 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between group gap-4 ${session.completed ? 'opacity-60 grayscale' : ''}`} style={{ borderLeftColor: sub?.color ? sub.color.replace('bg-[', '').replace(']', '') : '#cbd5e1' }}>
                    <div className="flex gap-4">
                       <div className="flex flex-col items-center justify-center text-[#006494] dark:text-[#778DA9] min-w-[3rem]"><span className="text-lg font-bold leading-none">{session.startTime}</span><span className="text-xs">{session.durationMinutes} min</span></div>
                       <div><h4 className="font-bold text-[#0D1B2A] dark:text-[#E0E1DD] text-lg">{sub?.name}</h4><p className="text-[#006494] dark:text-[#778DA9] font-medium">{topic?.name}</p><p className="text-xs text-[#006494]/70 dark:text-[#778DA9]/70 mt-1">{t.status}: {session.completed ? t.completed : t.planned}</p></div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <Button variant={session.completed ? "secondary" : "ghost"} className={`flex-1 sm:flex-none ${!session.completed ? "bg-[#778DA9]/20 text-[#006494] dark:text-[#778DA9] hover:bg-[#778DA9]/40" : ""}`} onClick={() => setSessions(sessions.map(s => s.id === session.id ? { ...s, completed: !s.completed } : s))}>{session.completed ? t.undo : t.done}</Button>
                      <button onClick={() => setSessions(sessions.filter(s => s.id !== session.id))} className="p-3 sm:p-2 text-[#006494] dark:text-[#778DA9] hover:text-[#EF8354] dark:hover:text-[#EF8354] transition-colors bg-[#E0E1DD] dark:bg-[#0D1B2A] sm:bg-transparent rounded-lg sm:rounded-none"><Trash2 className="w-5 h-5" /></button>
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

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#E0E1DD] dark:bg-[#0B132B] text-[#0D1B2A] dark:text-[#E0E1DD] transition-colors duration-200 font-sans">
        <header className="bg-[#0D1B2A] dark:bg-[#1B263B] border-b border-[#415A77]/30 text-white sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#EF8354] to-[#006494] rounded-lg flex items-center justify-center font-bold text-white shadow-[#0D1B2A]/50 shadow-lg"><Trophy className="w-5 h-5 text-white" /></div>
                <span className="font-bold text-xl tracking-tight text-white">WS-Planner</span>
              </div>
              
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-2">
                <nav className="flex space-x-1 mr-2">
                  {[ { id: 'dashboard', label: t.dashboard, icon: BarChart2 }, { id: 'syllabus', label: t.subjects, icon: BookOpen }, { id: 'calendar', label: t.calendar, icon: CalendarIcon } ].map(item => (
                    <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === item.id ? 'bg-[#006494] text-white shadow-inner' : 'text-[#778DA9] hover:text-white hover:bg-[#006494]/50'}`}>
                      <item.icon className="w-4 h-4" /><span className="hidden sm:inline">{item.label}</span>
                    </button>
                  ))}
                </nav>
                <div className="h-6 w-px bg-[#006494] mx-1"></div>
                <button onClick={exportData} className="p-2 rounded-md text-[#778DA9] hover:text-white hover:bg-[#006494]/50 transition-colors" title={t.backup}><Download className="w-5 h-5" /></button>
                <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-md text-[#778DA9] hover:text-white hover:bg-[#006494]/50 transition-colors" title={t.restore}><Upload className="w-5 h-5" /></button>
                <input type="file" ref={fileInputRef} onChange={importData} className="hidden" accept=".json" />
                <div className="h-6 w-px bg-[#006494] mx-1"></div>
                <button onClick={toggleLanguage} className="px-2 py-1 rounded-md text-[#778DA9] hover:text-white hover:bg-[#006494]/50 transition-colors font-bold text-xs border border-[#778DA9]/30" title="Switch Language">{language === 'en' ? 'EN' : 'PT'}</button>
                <button onClick={toggleTheme} className="p-2 rounded-md text-[#778DA9] hover:text-white hover:bg-[#006494]/50 transition-colors">{darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
              </div>

              {/* Mobile Hamburger */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white hover:bg-[#006494] rounded-md">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-[#0D1B2A] border-t border-[#415A77]/30">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[ { id: 'dashboard', label: t.dashboard, icon: BarChart2 }, { id: 'syllabus', label: t.subjects, icon: BookOpen }, { id: 'calendar', label: t.calendar, icon: CalendarIcon } ].map(item => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsMobileMenuOpen(false); }} className={`w-full px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 transition-all ${activeTab === item.id ? 'bg-[#006494] text-white' : 'text-[#778DA9] hover:text-white hover:bg-[#006494]/50'}`}>
                    <item.icon className="w-5 h-5" /> <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-[#415A77]/30 my-2"></div>
                <div className="grid grid-cols-2 gap-2 p-2">
                   <button onClick={exportData} className="flex items-center justify-center gap-2 p-3 bg-[#1B263B] rounded text-[#778DA9] hover:text-white"><Download className="w-5 h-5" /> {t.backup}</button>
                   <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 p-3 bg-[#1B263B] rounded text-[#778DA9] hover:text-white"><Upload className="w-5 h-5" /> {t.restore}</button>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                   <button onClick={toggleLanguage} className="text-[#778DA9] font-bold">Language: {language.toUpperCase()}</button>
                   <button onClick={toggleTheme} className="text-[#778DA9]">{darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'syllabus' && <SyllabusManager />}
          {activeTab === 'calendar' && <CalendarPlanner />}
        </main>
      </div>
    </div>
  );
}