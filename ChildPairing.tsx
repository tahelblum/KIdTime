import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ChildPairing = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('מתחבר למערכת...');

    useEffect(() => {
        // 1. שליפת הקוד מהכתובת (למשל ?code=A1B2)
        const code = searchParams.get('code');
        
        if (code) {
            handlePairing(code);
        } else {
            setStatus('שגיאה: קוד לא נמצא בלינק');
        }
    }, []);

    const handlePairing = async (pairingCode: string) => {
        try {
            // 2. פנייה ל-API הציבורי שיצרנו ב-Xano (תחליפי ל-URL של הקבוצה החדשה)
            const response = await fetch('https://xxxx-xxxx.xano.io/api:child_app/pair-device', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pairing_code: pairingCode })
            });

            const data = await response.json();

            if (data.authToken) {
                // 3. שמירת הטוקן בזיכרון המכשיר - זה מה שמשאיר אותו מחובר
                localStorage.setItem('child_token', data.authToken);
                localStorage.setItem('child_name', data.name); // נניח ש-Xano מחזיר את שם הילד
                
                setStatus(`היי ${data.name}, הצימוד הצליח! מעביר אותך ללו"ז...`);
                
                // 4. מעבר לדאשבורד של הילד אחרי 2 שניות
                setTimeout(() => navigate('/child/dashboard'), 2000);
            } else {
                setStatus('הקוד לא תקין או שפג תוקפו.');
            }
        } catch (error) {
            setStatus('שגיאה בתקשורת עם השרת.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">TimeKids</h1>
                <p className="text-gray-700 text-lg">{status}</p>
                {/* כאן אפשר להוסיף אנימציה קטנה של טעינה */}
            </div>
        </div>
    );
};

export default ChildPairing;
