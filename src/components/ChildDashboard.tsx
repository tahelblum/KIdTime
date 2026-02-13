import React, { useEffect, useState } from 'react';

const ChildDashboard = () => {
    const [childName, setChildName] = useState('');

    useEffect(() => {
        // שליפת השם ששמרנו בשלב הצימוד
        const name = localStorage.getItem('child_name');
        setChildName(name || 'ילד/ה');
    }, []);

    return (
        <div className="min-h-screen bg-white p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">היי ${childName} 👋</h1>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    מחובר
                </div>
            </header>

            <main>
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 text-center">
                    <p className="text-blue-600">כאן יוצגו המשימות והחוגים שלך להיום</p>
                    {/* כאן נבנה בהמשך את ה-API של המשימות */}
                </div>
            </main>
        </div>
    );
};

export default ChildDashboard;
