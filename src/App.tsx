// ============================================
// WEEKLY VIEW COMPONENT (מעודכן - תיקון)
// ============================================
function WeeklyView({ 
  token, 
  user,
  selectedChild,
  onBack,
  onLogout 
}: { 
  token: string;
  user: User;
  selectedChild: Child;
  onBack: () => void;
  onLogout: () => void;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [showUploadSchedule, setShowUploadSchedule] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const t = translations[selectedChild.language || user.language];

  useEffect(() => {
    loadTasks();
    loadTests();
  }, [selectedChild]);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks(token, selectedChild.child_id);
      const tasksArray = data && data.task ? data.task : [];
      setTasks(tasksArray);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTests = async () => {
    try {
      const data = await api.getTests(token, selectedChild.child_id);
      setTests(data.tests || []);
    } catch (err) {
      console.error('Error loading tests:', err);
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
    return next ? `${next.title} ${t.dir === 'rtl' ? 'ב-' : 'at '}${next.start_time}` : t.tasks.allDone;
  };

  const getUpcomingTests = () => {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tests.filter(test => {
      const testDate = new Date(test.test_date);
      return testDate >= now && testDate <= oneWeekFromNow;
    });
  };

  const dayStart = 7 * 60;
  const dayEnd = 21 * 60;
  const daySpan = dayEnd - dayStart;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">{t.app.loading}</div>;
  }

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-50 p-4 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {t.dir === 'rtl' ? '→' : '←'}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t.app.title}</h1>
            <p className="text-sm text-slate-500">{selectedChild.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowSettings(true)}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ⚙️
          </button>
          <button 
            onClick={onLogout} 
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            {t.app.logout}
          </button>
        </div>
      </div>

      {/* Upcoming Tests Alert */}
      {getUpcomingTests().length > 0 && (
        <div className="mb-5 bg-gradient-to-l from-orange-500 to-red-500 rounded-2xl p-4 shadow-lg">
          <p className="text-orange-100 text-sm mb-1">⚠️ {t.dir === 'rtl' ? 'מבחנים קרובים' : 'Upcoming Tests'}</p>
          <div className="space-y-1">
            {getUpcomingTests().map(test => (
              <p key={test.test_id} className="text-white font-bold">
                {test.subject} - {new Date(test.test_date).toLocaleDateString(t.dir === 'rtl' ? 'he-IL' : 'en-US')}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Next Task Banner */}
      <div className="mb-5 bg-gradient-to-l from-purple-500 to-indigo-500 rounded-2xl p-4 shadow-lg">
        <p className="text-purple-100 text-sm mb-1">{t.tasks.nextTask}</p>
        <p className="text-white text-2xl font-bold">{getNextTask()}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={() => setShowAddTask(true)}
          className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-1">➕</div>
          <div className="text-xs font-medium text-slate-600">
            {t.dir === 'rtl' ? 'משימה' : 'Task'}
          </div>
        </button>
        <button
          onClick={() => setShowAddTest(true)}
          className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-1">📝</div>
          <div className="text-xs font-medium text-slate-600">
            {t.dir === 'rtl' ? 'מבחן' : 'Test'}
          </div>
        </button>
        <button
          onClick={() => setShowUploadSchedule(true)}
          className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all"
        >
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xs font-medium text-slate-600">
            {t.dir === 'rtl' ? 'מערכת' : 'Schedule'}
          </div>
        </button>
      </div>

      {/* Week Days */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {t.days.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDay(idx)}
            className={`flex-shrink-0 w-16 rounded-xl p-3 transition-all duration-300 ${
              selectedDay === idx 
                ? 'bg-indigo-500 text-white shadow-lg scale-105' 
                : 'bg-white text-slate-600'
            }`}
          >
            <p className="text-xs opacity-70">{t.dir === 'rtl' ? 'יום' : 'Day'}</p>
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
            const colors = getTypeColors(task.type);
            
            // תיקון: שימוש במשתנה CSS במקום computed property
            const positionStyle = t.dir === 'rtl' 
              ? { right: `${startPos}%`, width: `${width}%` }
              : { left: `${startPos}%`, width: `${width}%` };
            
            return (
              <div
                key={idx}
                className={`absolute h-full rounded-full transition-all duration-300 ${colors.barColor} ${task.is_done ? 'opacity-40' : ''}`}
                style={positionStyle}
              />
            );
          })}
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3 mb-4">
        {getDayTasks(selectedDay).map((task) => {
          const colors = getTypeColors(task.type);
          const duration = formatDuration(task.start_time, task.end_time);
          
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full ${t.dir === 'rtl' ? 'text-right' : 'text-left'} rounded-2xl p-4 border-2 transition-all duration-300 ${
                colors.bg
              } ${colors.border} ${
                task.is_done ? 'opacity-50' : 'shadow-md hover:shadow-lg'
              } ${task.is_overridden ? 'border-red-400 border-dashed' : ''}`}
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
                      {task.is_overridden && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          {t.dir === 'rtl' ? 'נדרס' : 'Overridden'}
                        </span>
                      )}
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
          <p className="text-center text-slate-400 py-8">{t.tasks.noTasks}</p>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">{t.tasks.myProgress}</span>
          <span className="text-indigo-600 font-bold">{Math.round(getDayProgress(selectedDay))}%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-l from-green-400 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${getDayProgress(selectedDay)}%` }}
          />
        </div>
        {getDayProgress(selectedDay) === 100 && getDayTasks(selectedDay).length > 0 && (
          <p className="text-center mt-3 text-lg">{t.tasks.congrats}</p>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-sm text-slate-500 flex-wrap">
        <span>📚 {t.tasks.school}</span>
        <span>⭐ {t.tasks.hobby}</span>
        <span>🎮 {t.tasks.free}</span>
        <span>📝 {t.tasks.test}</span>
        <span>📖 {t.tasks.study}</span>
      </div>

      {/* Modals */}
      {showAddTask && (
        <AddTaskModal 
          token={token} 
          selectedChild={selectedChild}
          selectedDay={selectedDay} 
          language={selectedChild.language || user.language}
          onClose={() => setShowAddTask(false)} 
          onAdded={loadTasks} 
        />
      )}
      
      {showAddTest && (
        <AddTestModal
          token={token}
          selectedChild={selectedChild}
          language={selectedChild.language || user.language}
          onClose={() => setShowAddTest(false)}
          onAdded={() => {
            loadTests();
            loadTasks();
          }}
        />
      )}

      {showUploadSchedule && (
        <UploadScheduleModal
          token={token}
          selectedChild={selectedChild}
          language={selectedChild.language || user.language}
          onClose={() => setShowUploadSchedule(false)}
          onUploaded={loadTasks}
        />
      )}

      {showSettings && (
        <SettingsModal
          token={token}
          user={user}
          currentLanguage={selectedChild.language || user.language}
          onClose={() => setShowSettings(false)}
          onLanguageChange={async (newLang) => {
            await api.updateUserLanguage(token, newLang);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
