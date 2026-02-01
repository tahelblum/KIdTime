// src/App.tsx - TimeKids Full Application
import React, { useState, useEffect } from 'react';

const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:wZUcfmuE';

// Types
interface Task {
  id: number;
  user_id:  number;
  title: string;
  type: 'school' | 'hobby' | 'free' | 'test';
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_done: boolean;
  icon: string;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  role: 'parent' | 'child';
}

const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

const typeColors = {
  school: { bg: 'bg-blue-100', border: 'border-blue-300', icon: '📚', barColor: 'bg-blue-400' },
  hobby: { bg: 'bg-green-100', border: 'border-green-300', icon: '⭐', barColor: 'bg-green-400' },
  free: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🎮', barColor: 'bg-amber-400' },
  test : { bg: 'bg-pink-50', border: 'border-pink-200', icon: '📝', barColor: 'bg-pink-400' },
};

// API Functions
const api = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  
  async signup(email: string, password: string, name: string) {
    const res = await fetch(`${API_URL}/auth/signup1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return res.json();
  },
  
  async getTasks(token: string, day?: number) {
    const url = day !== undefined 
      ? `${API_URL}/day/${day}` 
      : `${API_URL}/week`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  
  async toggleTask(token: string, id: number) {
    const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },
  
  async createTask(token: string, task: Omit<Task, 'id' | 'is_done' | 'icon'>) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    return res.json();
  }
};

// Helper functions
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

// Login Component
function LoginScreen({ onLogin }: { onLogin: (token: string, user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = isSignup 
        ? await api.signup(email, password, name)
        : await api.login(email, password);
      
      if (data.authToken) {
        onLogin(data.authToken, data);
      } else {
        setError('שגיאה בהתחברות');
      }
    } catch (err) {
      setError('שגיאה בהתחברות. נסי שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
          TimeKids
        </h1>
        <p className="text-center text-slate-500 mb-8">
          {isSignup ? 'יצירת חשבון חדש' : 'כניסה לחשבון'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
            required
          />
          
          <input
            type="password"
            placeholder="סיסמה"
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
            {loading ? '...טוען' : isSignup ? 'הרשמה' : 'כניסה'}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-4 text-indigo-500 text-sm"
        >
          {isSignup ? 'כבר יש לי חשבון - כניסה' : 'אין לי חשבון - הרשמה'}
        </button>
      </div>
    </div>
  );
}

// Weekly View Component
function WeeklyView({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks(token);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      await api.toggleTask(token, id);
      await loadTasks();
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const getDayTasks = (day: number) => 
    tasks.filter(t => t.day_of_week === day).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const getDayProgress = (day: number) => {
    const dayTasks = getDayTasks(day);
    if (dayTasks.length === 0) return 0;
    const done = dayTasks.filter(t => t.is_done).length;
    return (done / dayTasks.length) * 100;
  };

  const getNextTask = () => {
    const todayTasks = getDayTasks(selectedDay);
    const next = todayTasks.find(t => !t.is_done);
    return next ? `${next.title} ב-${next.start_time}` : 'סיימת הכל! 🎉';
  };

  const dayStart = 7 * 60;
  const dayEnd = 21 * 60;
  const daySpan = dayEnd - dayStart;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">TimeKids</h1>
        <button onClick={onLogout} className="text-sm text-slate-500 hover:text-slate-700">
          יציאה
        </button>
      </div>

      {/* Next Task Banner */}
      <div className="mb-5 bg-gradient-to-l from-purple-500 to-indigo-500 rounded-2xl p-4 shadow-lg">
        <p className="text-purple-100 text-sm mb-1">עכשיו צריך:</p>
        <p className="text-white text-2xl font-bold">{getNextTask()}</p>
      </div>

      {/* Week Days */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {days.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDay(idx)}
            className={`flex-shrink-0 w-16 rounded-xl p-3 transition-all duration-300 ${
              selectedDay === idx 
                ? 'bg-indigo-500 text-white shadow-lg scale-105' 
                : 'bg-white text-slate-600'
            }`}
          >
            <p className="text-xs opacity-70">יום</p>
            <p className="font-bold text-sm">{day}</p>
            <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedDay === idx ? 'bg-white' : 'bg-indigo-400'
                }`}
                style={{ width: `${getDayProgress(idx)}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-2 px-1">
          <span>07:00</span>
          <span>10:00</span>
          <span>13:00</span>
          <span>16:00</span>
          <span>19:00</span>
        </div>
        
        <div className="relative h-3 bg-slate-100 rounded-full mb-4">
          {getDayTasks(selectedDay).map((task, idx) => {
            const startPos = ((timeToMinutes(task.start_time) - dayStart) / daySpan) * 100;
            const width = ((timeToMinutes(task.end_time) - timeToMinutes(task.start_time)) / daySpan) * 100;
            const colors = typeColors[task.type];
            return (
              <div
                key={idx}
                className={`absolute h-full rounded-full transition-all duration-300 ${colors.barColor} ${task.is_done ? 'opacity-40' : ''}`}
                style={{ right: `${startPos}%`, width: `${width}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3 mb-4">
        {getDayTasks(selectedDay).map((task) => {
          const colors = typeColors[task.type];
          const duration = formatDuration(task.start_time, task.end_time);
          
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full text-right rounded-2xl p-4 border-2 transition-all duration-300 ${
                colors.bg
              } ${colors.border} ${
                task.is_done ? 'opacity-50' : 'shadow-md hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{colors.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-sm font-medium">
                        {task.start_time} - {task.end_time}
                      </span>
                      <span className="text-xs text-slate-400 bg-white/60 px-2 py-0.5 rounded-full">
                        {duration}
                      </span>
                    </div>
                    <p className={`text-lg font-bold text-slate-700 ${task.is_done ? 'line-through' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.is_done 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-300 bg-white'
                }`}>
                  {task.is_done && <span>✓</span>}
                </div>
              </div>
            </button>
          );
        })}
        
        {getDayTasks(selectedDay).length === 0 && (
          <p className="text-center text-slate-400 py-8">אין משימות ליום זה</p>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setShowAddTask(true)}
        className="w-full bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all mb-4"
      >
        + הוספת משימה
      </button>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">ההתקדמות שלי היום</span>
          <span className="text-indigo-600 font-bold">{Math.round(getDayProgress(selectedDay))}%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-l from-green-400 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${getDayProgress(selectedDay)}%` }}
          />
        </div>
        {getDayProgress(selectedDay) === 100 && getDayTasks(selectedDay).length > 0 && (
          <p className="text-center mt-3 text-lg">🌟 כל הכבוד! סיימת את כל המשימות! 🌟</p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-sm text-slate-500">
        <span>📚 לימודים</span>
        <span>⭐ חוגים</span>
        <span>🎮 חופשי</span>
        <span>📝 מבחן</span>
      </div>

      {/* Add Task Modal */}
      {showAddTask && <AddTaskModal token={token} selectedDay={selectedDay} onClose={() => setShowAddTask(false)} onAdded={loadTasks} />}
    </div>
  );
}

// Add Task Modal
function AddTaskModal({ token, selectedDay, onClose, onAdded }: { 
  token: string; 
  selectedDay: number; 
  onClose: () => void;
  onAdded: () => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'school' | 'hobby' | 'free'| 'test'>('school');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createTask(token, {
        title,
        type,
        day_of_week: selectedDay,
        start_time: startTime,
        end_time: endTime
      });
      await onAdded();
      onClose();
    } catch (err) {
      alert('שגיאה ביצירת משימה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir="rtl" className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">הוספת משימה חדשה</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="שם המשימה"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
            required
          />
          
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
          >
            <option value="school">📚 לימודים</option>
            <option value="hobby">⭐ חוג</option>
            <option value="free">🎮 זמן חופשי</option>
            <option value="test">📝 מבחן</option>
          </select>
          
          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl"
              required
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 text-white py-2 rounded-xl font-bold hover:bg-indigo-600"
            >
              {loading ? '...שומר' : 'הוסף'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-xl font-bold hover:bg-slate-300"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [, setUser] = useState<User | null>(null);

  const handleLogin = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('authToken', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <WeeklyView token={token} onLogout={handleLogout} />;
}
