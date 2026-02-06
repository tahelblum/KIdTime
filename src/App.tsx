// ============================================
// WEEKLY VIEW COMPONENT (מעודכן)
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
            return (
              <div
                key={idx}
                className={`absolute h-full rounded-full transition-all duration-300 ${colors.barColor} ${task.is_done ? 'opacity-40' : ''}`}
                style={{ 
                  [t.dir === 'rtl' ? 'right' : 'left']: `${startPos}%`, 
                  width: `${width}%` 
                }}
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
              className={`w-full text-${t.dir === 'rtl' ? 'right' : 'left'} rounded-2xl p-4 border-2 transition-all duration-300 ${
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

// ============================================
// ADD TASK MODAL (מעודכן)
// ============================================
function AddTaskModal({ 
  token, 
  selectedChild,
  selectedDay, 
  language,
  onClose, 
  onAdded 
}: { 
  token: string;
  selectedChild: Child;
  selectedDay: number;
  language: 'he' | 'en';
  onClose: () => void;
  onAdded: () => void;
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'school' | 'hobby' | 'free' | 'test' | 'study'>('school');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [frequent, setFrequent] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(selectedDay);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createTask(token, selectedChild.child_id, {
        title,
        type,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        event_date: eventDate || undefined,
        frequent: frequent
      });
      await onAdded();
      onClose();
    } catch (err) {
      alert('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir={t.dir} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t.addTask.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.addTask.whichDay}</label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl bg-slate-50"
            >
              {t.days.map((dayName, index) => (
                <option key={index} value={index}>
                  {dayName}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder={t.addTask.taskNamePlaceholder}
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
            <option value="school">📚 {t.tasks.school}</option>
            <option value="hobby">⭐ {t.tasks.hobby}</option>
            <option value="free">🎮 {t.tasks.free}</option>
            <option value="test">📝 {t.tasks.test}</option>
            <option value="study">📖 {t.tasks.study}</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.addTask.dateOptional}</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={frequent}
                  onChange={(e) => setFrequent(e.target.checked)}
                  className="w-4 h-4 text-indigo-500"
                />
                <span className="text-sm text-slate-700">{t.addTask.recurring}</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">{t.addTask.startTime}</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">{t.addTask.endTime}</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 shadow-md"
            >
              {loading ? t.app.loading : t.addTask.saveBtn}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300"
            >
              {t.addTask.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// ADD TEST MODAL (חדש!)
// ============================================
function AddTestModal({
  token,
  selectedChild,
  language,
  onClose,
  onAdded
}: {
  token: string;
  selectedChild: Child;
  language: 'he' | 'en';
  onClose: () => void;
  onAdded: () => void;
}) {
  const [subject, setSubject] = useState('');
  const [testDate, setTestDate] = useState('');
  const [testTime, setTestTime] = useState('08:00');
  const [duration, setDuration] = useState(60);
  const [studyDays, setStudyDays] = useState(7);
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const topicsArray = topics.split('\n').filter(t => t.trim());
      
      await api.createTest(token, {
        child_id: selectedChild.child_id,
        subject,
        test_date: testDate,
        test_time: testTime,
        duration_minutes: duration,
        study_days: studyDays,
        topics: topicsArray
      });
      
      await onAdded();
      onClose();
    } catch (err) {
      alert('Error creating test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir={t.dir} className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t.tests.testTitle}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t.tests.subjectPlaceholder}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.tests.testDate}</label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.tests.testTime}</label>
              <input
                type="time"
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.tests.duration}</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                min="15"
                step="15"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.tests.studyDays}</label>
              <input
                type="number"
                value={studyDays}
                onChange={(e) => setStudyDays(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl"
                min="1"
                max="30"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">{t.tests.topics}</label>
            <textarea
              placeholder={t.tests.topicsPlaceholder}
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl h-32"
              required
            />
          </div>

          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3">
            <p className="text-sm text-indigo-700">
              💡 {t.dir === 'rtl' 
                ? 'המערכת תיצור אוטומטית תכנית לימוד לשבוע הקרוב' 
                : 'The system will automatically create a study plan for the next week'}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600"
            >
              {loading ? t.app.loading : t.tests.createStudyPlan}
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

// ============================================
// UPLOAD SCHEDULE MODAL (חדש!)
// ============================================
function UploadScheduleModal({
  token,
  selectedChild,
  language,
  onClose,
  onUploaded
}: {
  token: string;
  selectedChild: Child;
  language: 'he' | 'en';
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const t = translations[language];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      await api.uploadSchedule(token, selectedChild.child_id, file);
      await onUploaded();
      onClose();
    } catch (err) {
      alert('Error uploading schedule');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir={t.dir} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t.schedule.uploadTitle}</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center">
            <div className="text-5xl mb-3">📤</div>
            <p className="text-sm text-slate-600 mb-4">{t.schedule.uploadInstructions}</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="schedule-upload"
            />
            <label
              htmlFor="schedule-upload"
              className="inline-block bg-indigo-500 text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-indigo-600"
            >
              {t.schedule.uploadBtn}
            </label>
          </div>

          {file && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-700">✓ {file.name}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50"
            >
              {uploading ? t.schedule.uploading : t.schedule.uploadBtn}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
            >
              {t.addTask.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SETTINGS MODAL (חדש!)
// ============================================
function SettingsModal({
  token,
  user,
  currentLanguage,
  onClose,
  onLanguageChange
}: {
  token: string;
  user: User;
  currentLanguage: 'he' | 'en';
  onClose: () => void;
  onLanguageChange: (lang: 'he' | 'en') => void;
}) {
  const t = translations[currentLanguage];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div dir={t.dir} className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{t.settings.title}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.settings.language}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onLanguageChange('he')}
                className={`py-3 rounded-xl font-bold ${
                  currentLanguage === 'he'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                🇮🇱 {t.settings.hebrew}
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`py-3 rounded-xl font-bold ${
                  currentLanguage === 'en'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                🇺🇸 {t.settings.english}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-700 mb-2">{t.settings.profile}</h3>
            <p className="text-sm text-slate-600">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
          >
            {t.app.back}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP (מעודכן)
// ============================================
export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setSelectedChild(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const handleSelectChild = (child: Child) => {
    setSelectedChild(child);
  };

  const handleBackToChildren = () => {
    setSelectedChild(null);
  };

  if (!token || !user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!selectedChild) {
    return (
      <ChildSelector 
        token={token} 
        user={user}
        onSelectChild={handleSelectChild}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <WeeklyView 
      token={token} 
      user={user}
      selectedChild={selectedChild}
      onBack={handleBackToChildren}
      onLogout={handleLogout}
    />
  );
}
```

---

## 🎯 סיכום מה שבניתי:

### ✅ תכונות שהוספתי:

1. **מערכת תרגומים מלאה** - עברית/אנגלית בכל מקום
2. **בחירת שפה בהרשמה** - עם דגלים יפים
3. **הורה + מספר ילדים** - ניהול מלא
4. **מסך בחירת ילד** - עם אפשרות להוסיף
5. **העלאת מערכת שעות** - CSV/Excel
6. **הוספת מבחנים** - עם יצירת תכנית לימוד אוטומטית
7. **התראות על מבחנים** - שבוע מראש
8. **הגדרות** - שינוי שפה בכל עת
9. **משימות "נדרסות"** - סימון ויזואלי

---

## 📝 מה צריך לעשות ב-Xano:

### 1. עדכון Endpoints:
```
POST /auth/signup1
- הוסף שדה: language
- הוסף מערך: children

GET /children
- החזר את כל הילדים של ההורה

POST /children
- הוסף ילד חדש

POST /tests
- צור מבחן + תכנית לימוד אוטומטית

POST /upload_schedule
- קבל קובץ CSV/Excel
- פרס ויצור Tasks

PUT /user/language
- עדכון שפת המשתמש
