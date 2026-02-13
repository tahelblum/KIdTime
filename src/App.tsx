// src/App.tsx - TimeKids Full Application v2.0 - Final Clean Build
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChildPairing from './components/ChildPairing';
import ChildDashboard from './components/ChildDashboard';

// --- API & CONSTANTS ---
const AUTH_API = 'https://x8ki-letl-twmt.n7.xano.io/api:wZUcfmuE'; 
const DATA_API = 'https://x8ki-letl-twmt.n7.xano.io/api:mUnseLT0';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* --- נתיבים לילד (עצמאיים לחלוטין) --- */}
        {/* דף הצימוד - לא דורש לוגין הורה */}
        <Route path="/pair" element={<ChildPairing />} />
        
        {/* דאשבורד הילד - מזוהה לפי הטוקן ששמרנו ב-Pairing */}
        <Route path="/child/dashboard" element={<ChildDashboard />} />

        {/* --- נתיבי ההורה (הקוד המקורי שלך) --- */}
        <Route path="/parent" element={
          !token || !user ? (
            <LoginScreen onLogin={handleLogin} />
          ) : !selectedChild ? (
            <ChildSelector user={user} onSelectChild={setSelectedChild} onLogout={handleLogout} />
          ) : (
            <WeeklyView selectedChild={selectedChild} onBack={() => setSelectedChild(null)} onLogout={handleLogout} />
          )
        } />

        {/* ברירת מחדל: מי שנכנס לכתובת הראשית מופנה להורה */}
        <Route path="/" element={<Navigate to="/parent" replace />} />
      </Routes>
    </div>
  );
}

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
  // התחברות
  login: async (email: string, p: string) => {
    const res = await fetch(`${AUTH_API}/auth/login1`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email, password: p }) 
    });
    return res.json();
  },

  // הרשמה
  signup: async (email: string, p: string, name: string, l: string, c: any[]) => {
    const res = await fetch(`${AUTH_API}/auth/signup1`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email, password: p, name, language: l, children: c }) 
    });
    return res.json();
  },

  // משיכת ילדים
  getChildren: async () => {
    const t = localStorage.getItem('token');
    const res = await fetch(`${AUTH_API}/children`, { 
      headers: { 'Authorization': `Bearer ${t}` } 
    });
    return res.json();
  },

  // --- הוספת הפונקציה החסרה שגרמה לשגיאה ---
  addChild: async (data: any) => {
    const t = localStorage.getItem('token');
    const res = await fetch(`${AUTH_API}/children`, { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${t}` 
      }, 
      body: JSON.stringify(data) 
    });
    return res.json();
  },

  // סימון משימה כבוצעה
  toggleTask: async (id: number) => {
    const t = localStorage.getItem('token');
    const res = await fetch(`${AUTH_API}/Toggle_task`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` }, 
      body: JSON.stringify({ task_id: id }) 
    });
    return res.json();
  },

  // משיכת משימות מהקבוצה השנייה
  getTasks: async (childId: number) => {
    const t = localStorage.getItem('token');
    const res = await fetch(`${DATA_API}/${childId}/week`, { 
      headers: { 'Authorization': `Bearer ${t}` } 
    });
    return res.json();
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
          {children.map((c: any) => (
  <button 
    key={c.child_id || c.id} 
    onClick={() => onSelectChild(c)} 
    className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-indigo-500 transition-all flex items-center gap-4 w-full"
  >
    <span className="text-4xl">👦</span>
    <div className={t.dir === 'rtl' ? 'text-right' : 'text-left'}>
      {/* כאן התיקון: בודק כמה אפשרויות לשם המשתנה */}
      <p className="font-bold text-lg text-slate-800">
        {c.name || c.child_name || "ילד ללא שם"}
      </p>
      <p className="text-slate-500 text-sm">
        {c.grade || c.child_grade || ""}
      </p>
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
  
  // הגנה: וודאות שיש שפה מוגדרת כדי למנוע קריסה של Translations
  const currentLang = selectedChild.language || 'he';
  const t = translations[currentLang];

  const load = async () => {
    // חילוץ המזהה - בודק גם child_id וגם id (למקרה של אי התאמה מול Xano)
    const cid = selectedChild.child_id || (selectedChild as any).id;
    
    if (!cid) {
      console.error("Missing child ID in selectedChild:", selectedChild);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const d = await api.getTasks(cid);
      // טיפול בתגובה: Xano יכול להחזיר אובייקט עם שדה task או מערך ישיר
      const tasksArray = d?.task || (Array.isArray(d) ? d : []);
      setTasks(tasksArray);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedChild]);

  const toggle = async (id: number) => {
    try {
      await api.toggleTask(id);
      await load(); // רענון הרשימה לאחר העדכון
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const dayTasks = tasks.filter(tk => tk.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
    
  const progress = dayTasks.length ? (dayTasks.filter(tk => tk.is_done).length / dayTasks.length) * 100 : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t.app.loading}</div>;

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">🔙</button>
          <div className="text-center">
             <h1 className="text-xl font-bold text-slate-800">{selectedChild.name}</h1>
             <p className="text-xs text-slate-500">{selectedChild.grade}</p>
          </div>
          <button onClick={onLogout} className="text-slate-400 text-sm hover:text-red-500 transition-colors">{t.app.logout}</button>
        </div>

        {/* בחירת ימים */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2 no-scrollbar">
          {t.days.map((d: string, i: number) => (
            <button 
              key={i} 
              onClick={() => setSelectedDay(i)} 
              className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                selectedDay === i ? 'bg-indigo-500 text-white shadow-lg scale-105' : 'bg-white text-slate-600 shadow-sm'
              }`}
            >
              <span className="text-[10px] opacity-70 uppercase">{d.substring(0, 3)}</span>
              <span className="font-bold">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* פס התקדמות */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-slate-700">{t.tasks.myProgress}</span>
            <span className="text-indigo-600 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-700 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* רשימת משימות */}
        <div className="space-y-3 pb-20">
          {dayTasks.map(tk => {
            const colors = getTypeColors(tk.type);
            return (
              <button 
                key={tk.id} 
                onClick={() => toggle(tk.id)} 
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                  colors.bg
                } ${colors.border} ${
                  tk.is_done ? 'opacity-40 grayscale-[0.5]' : 'shadow-sm active:scale-95'
                }`}
              >
                <span className="text-3xl">{colors.icon}</span>
                <div className={`flex-1 ${t.dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <p className="text-xs text-slate-500 font-medium">{tk.start_time} - {tk.end_time}</p>
                  <p className={`font-bold text-slate-800 ${tk.is_done ? 'line-through' : ''}`}>
                    {tk.title}
                  </p>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                  tk.is_done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300'
                }`}>
                  {tk.is_done && <span className="text-sm">✓</span>}
                </div>
              </button>
            );
          })}
          
          {dayTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-20">📅</div>
              <p className="text-slate-400 font-medium">{t.tasks.noTasks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
