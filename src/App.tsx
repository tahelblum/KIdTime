// src/App.tsx - TimeKids Full Application v2.0 - Final Clean Build
import React, { useState, useEffect } from 'react';

const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:wZUcfmuE';

// --- TRANSLATIONS ---
const translations: any = {
  he: {
    dir: 'rtl',
    app: { title: 'TimeKids', logout: 'יציאה', loading: 'טוען...', settings: 'הגדרות', back: 'חזרה' },
    login: { 
      title: 'כניסה לחשבון', signup: 'יצירת חשבון חדש', email: 'אימייל', password: 'סיסמה', name: 'שם מלא',
      loginBtn: 'כניסה', signupBtn: 'הרשמה', switchToSignup: 'אין לי חשבון - הרשמה', switchToLogin: 'כבר יש לי חשבון - כניסה',
      chooseLanguage: 'בחר שפה', error: 'שגיאה בהתחברות', childName: 'שם הילד/ה', childGrade: 'כיתה',
      childSchool: 'בית ספר', addChild: 'הוסף ילד'
    },
    selectChild: { title: 'בחר ילד', addNewChild: 'הוסף ילד חדש' },
    days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    tasks: { 
      school: 'לימודים', hobby: 'חוגים', free: 'חופשי', test: 'מבחן', study: 'לימוד למבחן',
      nextTask: 'עכשיו צריך:', allDone: 'סיימת הכל! 🎉', noTasks: 'אין משימות ליום זה',
      myProgress: 'ההתקדמות שלי היום', congrats: '🌟 כל הכבוד! סיימת את כל המשימות! 🌟'
    },
    addTask: { title: 'הוספת משימה', saveBtn: 'שמור', cancel: 'ביטול' },
    settings: { title: 'הגדרות', language: 'שפה', profile: 'פרופיל', hebrew: 'עברית', english: 'English' }
  },
  en: {
    dir: 'ltr',
    app: { title: 'TimeKids', logout: 'Logout', loading: 'Loading...', settings: 'Settings', back: 'Back' },
    login: { 
      title: 'Login', signup: 'Create Account', email: 'Email', password: 'Password', name: 'Full Name',
      loginBtn: 'Login', signupBtn: 'Sign Up', switchToSignup: "Don't have an account?", switchToLogin: 'Already have an account?',
      chooseLanguage: 'Language', error: 'Login Error', childName: "Name", childGrade: 'Grade',
      childSchool: 'School', addChild: 'Add Child'
    },
    selectChild: { title: 'Select Child', addNewChild: 'Add Child' },
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    tasks: { 
      school: 'School', hobby: 'Hobby', free: 'Free', test: 'Test', study: 'Study',
      nextTask: 'Next:', allDone: 'All Done!', noTasks: 'No tasks',
      myProgress: 'Progress', congrats: '🌟 Great job! 🌟'
    },
    addTask: { title: 'Add Task', saveBtn: 'Save', cancel: 'Cancel' },
    settings: { title: 'Settings', language: 'Language', profile: 'Profile', hebrew: 'עברית', english: 'English' }
  }
};

// --- TYPES ---
interface Task { id: number; child_id: number; title: string; type: 'school' | 'hobby' | 'free' | 'test' | 'study'; day_of_week: number; start_time: string; end_time: string; is_done: boolean; frequent: boolean; icon: string; }
interface User { user_id: number; name: string; email: string; role: 'parent' | 'child'; language: 'he' | 'en'; }
interface Child { child_id: number; name: string; grade: string; school_name: string; language: 'he' | 'en'; }

// --- API ---
const api = {
  login: async (email: string, p: string) => (await fetch(`${API_URL}/auth/login1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: p }) })).json(),
  signup: async (email: string, p: string, name: string, l: string, c: any[]) => (await fetch(`${API_URL}/auth/signup1`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: p, name, language: l, children: c }) })).json(),
  getChildren: async () => {
    const t = localStorage.getItem('token');
    return (await fetch(`${API_URL}/children`, { headers: { 'Authorization': `Bearer ${t}` } })).json();
  },
  addChild: async (data: any) => {
    const t = localStorage.getItem('token');
    return (await fetch(`${API_URL}/children`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` }, body: JSON.stringify(data) })).json();
  },
  getTasks: async (childId: number) => {
    const t = localStorage.getItem('token');
    return (await fetch(`${API_URL}/child/${childId}/week`, { headers: { 'Authorization': `Bearer ${t}` } })).json();
  },
  toggleTask: async (id: number) => {
    const t = localStorage.getItem('token');
    return (await fetch(`${API_URL}/Toggle_task`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` }, body: JSON.stringify({ task_id: id }) })).json();
  }
};

// --- HELPERS ---
const getTypeColors = (type: string) => {
  const c: any = {
    school: { bg: 'bg-blue-100', border: 'border-blue-300', icon: '📚' },
    hobby: { bg: 'bg-green-100', border: 'border-green-300', icon: '⭐' },
    free: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🎮' },
    test: { bg: 'bg-pink-50', border: 'border-pink-200', icon: '📝' },
    study: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '📖' }
  };
  return c[type] || c.school;
};

// --- COMPONENTS ---
function LoginScreen({ onLogin }: { onLogin: (t: string, u: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'he' | 'en'>('he');
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const d = isSignup ? await api.signup(email, password, name, language, []) : await api.login(email, password);
      if (d?.authToken) {
        localStorage.setItem('token', d.authToken);
        onLogin(d.authToken, { ...d.user, language });
      } else setError(t.login.error);
    } catch { setError(t.login.error); } finally { setLoading(false); }
  };

  return (
    <div dir={t.dir} className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">{t.app.title}</h1>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setLanguage('he')} className={`flex-1 py-2 rounded-xl transition-all ${language === 'he' ? 'bg-indigo-500 text-white' : 'bg-slate-100'}`}>🇮🇱 עברית</button>
          <button onClick={() => setLanguage('en')} className={`flex-1 py-2 rounded-xl transition-all ${language === 'en' ? 'bg-indigo-500 text-white' : 'bg-slate-100'}`}>🇺🇸 English</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && <input type="text" placeholder={t.login.name} value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" required />}
          <input type="email" placeholder={t.login.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" required />
          <input type="password" placeholder={t.login.password} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" required />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold">{loading ? t.app.loading : (isSignup ? t.login.signupBtn : t.login.loginBtn)}</button>
        </form>
        <button onClick={() => setIsSignup(!isSignup)} className="w-full mt-4 text-indigo-500 text-sm">{isSignup ? t.login.switchToLogin : t.login.switchToSignup}</button>
      </div>
    </div>
  );
}

function ChildSelector({ user, onSelectChild, onLogout }: { user: User; onSelectChild: (c: Child) => void; onLogout: () => void; }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const t = translations[user.language];

  const load = async () => {
    try {
      const d = await api.getChildren();
      const list = Array.isArray(d) ? d : (d.children || []);
      setChildren(list);
      if (list.length === 0) setShowAdd(true);
    } catch { setChildren([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t.app.loading}</div>;

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{t.app.title}</h1>
          <button onClick={onLogout} className="text-slate-500">{t.app.logout}</button>
        </div>
        <h2 className="text-xl mb-6 font-semibold">{t.selectChild.title}</h2>
        <div className="grid gap-4">
          {children.map(c => (
            <button key={c.child_id} onClick={() => onSelectChild(c)} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-500 transition-all flex items-center gap-4">
              <span className="text-4xl">👦</span>
              <div className="text-right">
                <p className="font-bold text-lg">{c.name}</p>
                <p className="text-slate-500">{c.grade}</p>
              </div>
            </button>
          ))}
          <button onClick={() => setShowAdd(true)} className="border-2 border-dashed border-slate-300 p-6 rounded-2xl text-slate-500 font-bold hover:bg-white transition-all">+ {t.selectChild.addNewChild}</button>
        </div>
      </div>
      {showAdd && <AddChildModal language={user.language} onClose={() => children.length > 0 && setShowAdd(false)} onAdded={load} />}
    </div>
  );
}

function AddChildModal({ language, onClose, onAdded }: { language: 'he' | 'en', onClose: () => void, onAdded: () => void }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.addChild({ name, grade, language });
      onAdded(); onClose();
    } catch { alert('Error'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir={t.dir} className="bg-white rounded-3xl p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6">{t.selectChild.addNewChild}</h2>
        <form onSubmit={submit} className="space-y-4">
          <input placeholder={t.login.childName} value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" required />
          <input placeholder={t.login.childGrade} value={grade} onChange={e => setGrade(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl" required />
          <button disabled={loading} className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold">{loading ? t.app.loading : t.login.addChild}</button>
          <button type="button" onClick={onClose} className="w-full text-slate-500 py-2">{t.addTask.cancel}</button>
        </form>
      </div>
    </div>
  );
}

function WeeklyView({ selectedChild, onBack, onLogout }: { selectedChild: Child; onBack: () => void; onLogout: () => void; }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [loading, setLoading] = useState(true);
  const t = translations[selectedChild.language];

  const load = async () => {
    try {
      const d = await api.getTasks(selectedChild.child_id);
      setTasks(d?.task || []);
    } catch { setTasks([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [selectedChild]);

  const toggle = async (id: number) => {
    await api.toggleTask(id);
    load();
  };

  const dayTasks = tasks.filter(tk => tk.day_of_week === selectedDay).sort((a,b) => a.start_time.localeCompare(b.start_time));
  const progress = dayTasks.length ? (dayTasks.filter(tk => tk.is_done).length / dayTasks.length) * 100 : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t.app.loading}</div>;

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-2xl">🔙</button>
          <h1 className="text-xl font-bold">{selectedChild.name}</h1>
          <button onClick={onLogout} className="text-slate-400 text-sm">{t.app.logout}</button>
        </div>

        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {t.days.map((d: string, i: number) => (
            <button key={i} onClick={() => setSelectedDay(i)} className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${selectedDay === i ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white'}`}>
              <span className="text-[10px] opacity-60">{d[0]}</span>
              <span className="font-bold">{i+1}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">{t.tasks.myProgress}</span>
            <span className="text-indigo-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          {dayTasks.map(tk => {
            const colors = getTypeColors(tk.type);
            return (
              <button key={tk.id} onClick={() => toggle(tk.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${colors.bg} ${colors.border} ${tk.is_done ? 'opacity-50' : ''}`}>
                <span className="text-2xl">{colors.icon}</span>
                <div className="flex-1 text-right">
                  <p className="text-xs text-slate-500">{tk.start_time} - {tk.end_time}</p>
                  <p className={`font-bold ${tk.is_done ? 'line-through' : ''}`}>{tk.title}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${tk.is_done ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`} />
              </button>
            );
          })}
          {dayTasks.length === 0 && <p className="text-center text-slate-400 py-12">{t.tasks.noTasks}</p>}
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---
export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (t: string, u: User) => {
    setToken(t); setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setToken(null); setUser(null); setSelectedChild(null);
    localStorage.clear();
  };

  if (!token || !user) return <LoginScreen onLogin={handleLogin} />;

  return !selectedChild ? (
    <ChildSelector user={user} onSelectChild={setSelectedChild} onLogout={handleLogout} />
  ) : (
    <WeeklyView selectedChild={selectedChild} onBack={() => setSelectedChild(null)} onLogout={handleLogout} />
  );
}
