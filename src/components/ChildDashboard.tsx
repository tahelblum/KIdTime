import { useEffect, useState } from 'react';

// הגדרת טיפוס למשימה
interface Task {
    id: number;
    title: string;
    type: 'school' | 'hobby' | 'free' | 'test' | 'study';
    start_time: string;
    end_time: string;
    is_done: boolean;
}

const ChildDashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [childName, setChildName] = useState('');
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:child_app'; // ודאי שזה ה-Base URL הנכון ב-Xano

    useEffect(() => {
        const name = localStorage.getItem('child_name');
        setChildName(name || 'ילד/ה');
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const token = localStorage.getItem('child_token');
        try {
            const response = await fetch(`${API_URL}/my-day`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setTasks(Array.isArray(data) ? data : data.tasks || []);
        } catch (error) {
            console.error("Failed to load tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (taskId: number) => {
        const token = localStorage.getItem('child_token');
        // עדכון מקומי מהיר (Optimistic Update)
        setTasks(tasks.map(t => t.id === taskId ? { ...t, is_done: !t.is_done } : t));

        try {
            await fetch(`${API_URL}/toggle-task`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ task_id: taskId })
            });
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const getTypeStyles = (type: string) => {
        const styles: any = {
            school: { bg: 'bg-blue-100', icon: '📚', border: 'border-blue-300' },
            hobby: { bg: 'bg-green-100', icon: '⚽', border: 'border-green-300' },
            free: { bg: 'bg-yellow-100', icon: '🎮', border: 'border-yellow-300' },
            test: { bg: 'bg-red-100', icon: '📝', border: 'border-red-300' },
            study: { bg: 'bg-purple-100', icon: '📖', border: 'border-purple-300' }
        };
        return styles[type] || styles.school;
    };

    if (loading) return <div className="text-center p-10">טוען את היום שלך... ⏳</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4" dir="rtl">
            <header className="mb-6">
                <h1 className="text-3xl font-extrabold text-slate-800">היי {childName}! 👋</h1>
                <p className="text-slate-500 text-lg">מוכן למשימות של היום?</p>
            </header>

            <div className="space-y-4">
                {tasks.length > 0 ? tasks.map(task => {
                    const style = getTypeStyles(task.type);
                    return (
                        <div 
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`flex items-center p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                                task.is_done ? 'bg-slate-200 border-slate-300 opacity-60' : `${style.bg} ${style.border} shadow-md`
                            }`}
                        >
                            <span className="text-3xl ml-4">{task.is_done ? '✅' : style.icon}</span>
                            <div className="flex-1 text-right">
                                <h3 className={`text-xl font-bold ${task.is_done ? 'line-through' : 'text-slate-800'}`}>
                                    {task.title}
                                </h3>
                                <p className="text-slate-600 font-medium">
                                    {task.start_time} - {task.end_time}
                                </p>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center p-10 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 text-lg italic">אין משימות להיום... זמן חופשי! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildDashboard;
