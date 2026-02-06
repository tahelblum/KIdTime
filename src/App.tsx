typescript// src/App.tsx - TimeKids Full Application v2.0
import React, { useState, useEffect } from 'react';

const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:wZUcfmuE';

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  he: {
    dir: 'rtl',
    app: {
      title: 'TimeKids',
      logout: 'יציאה',
      loading: 'טוען...',
      settings: 'הגדרות',
      back: 'חזרה'
    },
    login: {
      title: 'כניסה לחשבון',
      signup: 'יצירת חשבון חדש',
      email: 'אימייל',
      password: 'סיסמה',
      name: 'שם מלא',
      loginBtn: 'כניסה',
      signupBtn: 'הרשמה',
      switchToSignup: 'אין לי חשבון - הרשמה',
      switchToLogin: 'כבר יש לי חשבון - כניסה',
      chooseLanguage: 'בחר שפה',
      error: 'שגיאה בהתחברות',
      addChildren: 'הוסף ילדים',
      childName: 'שם הילד/ה',
      childGrade: 'כיתה',
      childSchool: 'בית ספר',
      addChild: 'הוסף ילד',
      removeChild: 'הסר',
      continueRegistration: 'המשך להרשמה'
    },
    selectChild: {
      title: 'בחר ילד',
      addNewChild: 'הוסף ילד חדש',
      manageChildren: 'ניהול ילדים'
    },
    days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    tasks: {
      school: 'לימודים',
      hobby: 'חוגים',
      free: 'חופשי',
      test: 'מבחן',
      study: 'לימוד למבחן',
      nextTask: 'עכשיו צריך:',
      allDone: 'סיימת הכל! 🎉',
      noTasks: 'אין משימות ליום זה',
      addTask: '+ הוספת משימה',
      myProgress: 'ההתקדמות שלי היום',
      congrats: '🌟 כל הכבוד! סיימת את כל המשימות! 🌟'
    },
    addTask: {
      title: 'הוספת משימה חדשה',
      whichDay: 'באיזה יום?',
      taskName: 'שם המשימה',
      taskNamePlaceholder: 'למשל: אימון כדורגל',
      date: 'תאריך',
      dateOptional: 'תאריך (אופציונלי)',
      recurring: 'משימה קבועה',
      startTime: 'התחלה',
      endTime: 'סיום',
      saveBtn: 'הוסף משימה',
      saving: 'שומר...',
      cancel: 'ביטול'
    },
    schedule: {
      uploadTitle: 'העלאת מערכת שעות',
      uploadBtn: 'העלה קובץ CSV/Excel',
      uploadInstructions: 'העלה מערכת שעות שנתית בפורמט CSV או Excel',
      uploading: 'מעלה...',
      success: 'מערכת השעות הועלתה בהצלחה!'
    },
    tests: {
      addTest: 'הוסף מבחן',
      testTitle: 'הוספת מבחן חדש',
      subject: 'נושא המבחן',
      subjectPlaceholder: 'למשל: מתמטיקה',
      testDate: 'תאריך המבחן',
      testTime: 'שעת המבחן',
      duration: 'משך (דקות)',
      studyDays: 'כמה ימי לימוד?',
      createStudyPlan: 'צור תכנית לימוד',
      studyPlanCreated: 'נוצרה תכנית לימוד אוטומטית!',
      topics: 'נושאים ללימוד',
      topicsPlaceholder: 'כל נושא בשורה נפרדת',
      materials: 'חומרי לימוד'
    },
    settings: {
      title: 'הגדרות',
      language: 'שפה',
      changeLanguage: 'שנה שפה',
      hebrew: 'עברית',
      english: 'English',
      profile: 'פרופיל',
      children: 'ילדים'
    }
  },
  en: {
    dir: 'ltr',
    app: {
      title: 'TimeKids',
      logout: 'Logout',
      loading: 'Loading...',
      settings: 'Settings',
      back: 'Back'
    },
    login: {
      title: 'Login',
      signup: 'Create New Account',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      loginBtn: 'Login',
      signupBtn: 'Sign Up',
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Login',
      chooseLanguage: 'Choose Language',
      error: 'Login error',
      addChildren: 'Add Children',
      childName: "Child's Name",
      childGrade: 'Grade',
      childSchool: 'School',
      addChild: 'Add Child',
      removeChild: 'Remove',
      continueRegistration: 'Continue Registration'
    },
    selectChild: {
      title: 'Select Child',
      addNewChild: 'Add New Child',
      manageChildren: 'Manage Children'
    },
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    tasks: {
      school: 'School',
      hobby: 'Hobby',
      free: 'Free Time',
      test: 'Test',
      study: 'Study Session',
      nextTask: 'Next up:',
      allDone: 'All done! 🎉',
      noTasks: 'No tasks for this day',
      addTask: '+ Add Task',
      myProgress: 'My Progress Today',
      congrats: '🌟 Awesome! You completed all tasks! 🌟'
    },
    addTask: {
      title: 'Add New Task',
      whichDay: 'Which day?',
      taskName: 'Task Name',
      taskNamePlaceholder: 'e.g., Soccer practice',
      date: 'Date',
      dateOptional: 'Date (optional)',
      recurring: 'Recurring task',
      startTime: 'Start Time',
      endTime: 'End Time',
      saveBtn: 'Add Task',
      saving: 'Saving...',
      cancel: 'Cancel'
    },
    schedule: {
      uploadTitle: 'Upload Schedule',
      uploadBtn: 'Upload CSV/Excel File',
      uploadInstructions: 'Upload annual schedule in CSV or Excel format',
      uploading: 'Uploading...',
      success: 'Schedule uploaded successfully!'
    },
    tests: {
      addTest: 'Add Test',
      testTitle: 'Add New Test',
      subject: 'Subject',
      subjectPlaceholder: 'e.g., Mathematics',
      testDate: 'Test Date',
      testTime: 'Test Time',
      duration: 'Duration (minutes)',
      studyDays: 'Study days needed',
      createStudyPlan: 'Create Study Plan',
      studyPlanCreated: 'Study plan created automatically!',
      topics: 'Topics to Study',
      topicsPlaceholder: 'One topic per line',
      materials: 'Study Materials'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      changeLanguage: 'Change Language',
      hebrew: 'עברית',
      english: 'English',
      profile: 'Profile',
      children: 'Children'
    }
  }
};

// ============================================
// TYPES
// ============================================
interface Task {
  id: number;
  child_id: number;
  title: string;
  type: 'school' | 'hobby' | 'free' | 'test' | 'study';
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_done: boolean;
  frequent: boolean;
  event_date?: string;
  icon: string;
  is_overridden?: boolean;
  original_task_id?: number;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'parent' | 'child';
  language: 'he' | 'en';
  parent_id?: number;
}

interface Child {
  child_id: number;
  parent_user_id: number;
  name: string;
  grade: string;
  school_name: string;
  language: 'he' | 'en';
}

interface Test {
  test_id: number;
  child_id: number;
  subject: string;
  test_date: string;
  test_time: string;
  duration_minutes: number;
  study_days: number;
  topics?: string[];
}

interface StudySession {
  session_id: number;
  test_id: number;
  child_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  topics: string[];
  is_completed: boolean;
  materials: StudyMaterial[];
}

interface StudyMaterial {
  material_id: number;
  session_id: number;
  title: string;
  type: 'link' | 'file' | 'note';
  content: string;
}

// ============================================
// API FUNCTIONS (עדכון לתמיכה במבנה החדש)
// ============================================
const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  
  async signup(email: string, password: string, name: string, language: 'he' | 'en', children: Partial<Child>[]) {
    const res = await fetch(`${API_URL}/auth/signup1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, language, children })
    });
    return res.json();
  },

  async getChildren(token: string) {
    const res = await fetch(`${API_URL}/children`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async addChild(token: string, child: Partial<Child>) {
    const res = await fetch(`${API_URL}/children`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(child)
    });
    return res.json();
  },
  
  async getTasks(token: string, childId: number, day?: number) {
    const url = day !== undefined 
      ? `${API_URL}/child/${childId}/day/${day}` 
      : `${API_URL}/child/${childId}/week`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  
  async toggleTask(token: string, id: number) {
    const res = await fetch(`${API_URL}/Toggle_task`, {
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_id: id }) 
    });
    return res.json();
  },
  
  async createTask(token: string, childId: number, task: Omit<Task, 'id' | 'is_done' | 'child_id' | 'icon'>) {
    const res = await fetch(`${API_URL}/child/${childId}/task`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    return res.json();
  },

  async uploadSchedule(token: string, childId: number, file: File) {
    const formData = new FormData();
    formData.append('schedule', file);
    formData.append('child_id', childId.toString());
    
    const res = await fetch(`${API_URL}/upload_schedule`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  async createTest(token: string, test: Partial<Test>) {
    const res = await fetch(`${API_URL}/tests`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(test)
    });
    return res.json();
  },

  async getTests(token: string, childId: number) {
    const res = await fetch(`${API_URL}/child/${childId}/tests`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async updateUserLanguage(token: string, language: 'he' | 'en') {
    const res = await fetch(`${API_URL}/user/language`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language })
    });
    return res.json();
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const formatDuration = (start: string, end: string) => {
  const diff = timeToMinutes(end) - timeToMinutes(start);
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours === 0) return `${mins} דק׳`;
  if (mins === 0) return `${hours} שע׳`;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
};

const getTypeColors = (type: string) => {
  const colors: Record<string, any> = {
    school: { bg: 'bg-blue-100', border: 'border-blue-300', icon: '📚', barColor: 'bg-blue-400' },
    hobby: { bg: 'bg-green-100', border: 'border-green-300', icon: '⭐', barColor: 'bg-green-400' },
    free: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🎮', barColor: 'bg-amber-400' },
    test: { bg: 'bg-pink-50', border: 'border-pink-200', icon: '📝', barColor: 'bg-pink-400' },
    study: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '📖', barColor: 'bg-purple-400' }
  };
  return colors[type] || colors.school;
};

// ============================================
// LOGIN COMPONENT WITH LANGUAGE SELECTION
// ============================================
function LoginScreen({ onLogin }: { onLogin: (token: string, user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'he' | 'en'>('he');
  const [children, setChildren] = useState<Partial<Child>[]>([]);
  const [showChildrenForm, setShowChildrenForm] = useState(false);

  const t = translations[language];

  const addChild = () => {
    setChildren([...children, { name: '', grade: '', school_name: '', language }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup && !showChildrenForm) {
      setShowChildrenForm(true);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = isSignup 
        ? await api.signup(email, password, name, language, children)
        : await api.login(email, password);
      
      if (data.authToken) {
        onLogin(data.authToken, { ...data, language });
      } else {
        setError(t.login.error);
      }
    } catch (err) {
      setError(t.login.error);
    } finally {
      setLoading(false);
    }
  };

  if (showChildrenForm) {
    return (
      <div dir={t.dir} className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
            {t.login.addChildren}
          </h2>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {children.map((child, index) => (
              <div key={index} className="border-2 border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-700">#{index + 1}</span>
                  <button
                    onClick={() => removeChild(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    {t.login.removeChild}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder={t.login.childName}
                    value={child.name || ''}
                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                    className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder={t.login.childGrade}
                    value={child.grade || ''}
                    onChange={(e) => updateChild(index, 'grade', e.target.value)}
                    className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder={t.login.childSchool}
                    value={child.school_name || ''}
                    onChange={(e) => updateChild(index, 'school_name', e.target.value)}
                    className="col-span-2 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addChild}
            className="w-full mb-4 py-3 border-2 border-indigo-300 border-dashed rounded-xl text-indigo-500 font-bold hover:bg-indigo-50"
          >
            + {t.login.addChild}
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => setShowChildrenForm(false)}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
            >
              {t.app.back}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || children.length === 0}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? t.app.loading : t.login.continueRegistration}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={t.dir} className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
          {t.app.title}
        </h1>
        <p className="text-center text-slate-500 mb-6">
          {isSignup ? t.login.signup : t.login.title}
        </p>

        {/* Language Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t.login.chooseLanguage}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLanguage('he')}
              className={`py-3 rounded-xl font-bold transition-all ${
                language === 'he'
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              🇮🇱 עברית
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`py-3 rounded-xl font-bold transition-all ${
                language === 'en'
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder={t.login.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
              required
            />
          )}
          
          <input
            type="email"
            placeholder={t.login.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
            required
          />
          
          <input
            type="password"
            placeholder={t.login.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-50"
          >
            {loading ? t.app.loading : isSignup ? t.login.signupBtn : t.login.loginBtn}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-4 text-indigo-500 text-sm"
        >
          {isSignup ? t.login.switchToLogin : t.login.switchToSignup}
        </button>
      </div>
    </div>
  );
}

// ============================================
// CHILD SELECTOR COMPONENT
// ============================================
function ChildSelector({ 
  token, 
  user,
  onSelectChild, 
  onLogout 
}: { 
  token: string;
  user: User;
  onSelectChild: (child: Child) => void;
  onLogout: () => void;
}) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);

  const t = translations[user.language];

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await api.getChildren(token);
      setChildren(data.children || []);
    } catch (err) {
      console.error('Error loading children:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t.app.loading}
      </div>
    );
  }

  return (
    <div dir={t.dir} className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">{t.app.title}</h1>
          <button
            onClick={onLogout}
            className="text-white/80 hover:text-white text-sm"
          >
            {t.app.logout}
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
            {t.selectChild.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {children.map((child) => (
              <button
                key={child.child_id}
                onClick={() => onSelectChild(child)}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all"
              >
                <div className="text-5xl mb-3">👦</div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {child.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {child.grade} • {child.school_name}
                </p>
              </button>
            ))}

            <button
              onClick={() => setShowAddChild(true)}
              className="border-2 border-dashed border-indigo-300 rounded-2xl p-6 hover:bg-indigo-50 transition-all"
            >
              <div className="text-5xl mb-3">➕</div>
              <h3 className="text-xl font-bold text-indigo-500">
                {t.selectChild.addNewChild}
              </h3>
            </button>
          </div>
        </div>
      </div>

      {showAddChild && (
        <AddChildModal
          token={token}
          language={user.language}
          onClose={() => setShowAddChild(false)}
          onAdded={loadChildren}
        />
      )}
    </div>
  );
}

// ============================================
// ADD CHILD MODAL
// ============================================
function AddChildModal({
  token,
  language,
  onClose,
  onAdded
}: {
  token: string;
  language: 'he' | 'en';
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [childLanguage, setChildLanguage] = useState<'he' | 'en'>(language);
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addChild(token, {
        name,
        grade,
        school_name: schoolName,
        language: childLanguage
      });
      await onAdded();
      onClose();
    } catch (err) {
      alert('Error adding child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir={t.dir} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t.selectChild.addNewChild}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t.login.childName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
            required
          />
          
          <input
            type="text"
            placeholder={t.login.childGrade}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
            required
          />
          
          <input
            type="text"
            placeholder={t.login.childSchool}
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.login.chooseLanguage}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChildLanguage('he')}
                className={`py-2 rounded-lg ${
                  childLanguage === 'he'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                עברית
              </button>
              <button
                type="button"
                onClick={() => setChildLanguage('en')}
                className={`py-2 rounded-lg ${
                  childLanguage === 'en'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-bold"
            >
              {loading ? t.app.loading : t.login.addChild}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
            >
              {t.addTask.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
