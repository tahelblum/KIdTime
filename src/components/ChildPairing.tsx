import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ChildPairing = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('מתחבר למערכת...');

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            handlePairing(code);
        } else {
            setStatus('שגיאה: קוד לא נמצא');
        }
    }, [searchParams]);

    const handlePairing = async (code: string) => { // הוספנו :string כאן
        try {
            const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:child_app/pair-device', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pairing_code: code })
            });

            const data = await response.json();

            if (data.authToken) {
                localStorage.setItem('child_token', data.authToken);
                localStorage.setItem('child_name', data.name);
                setStatus(`היי ${data.name}, הצימוד הצליח!`);
                setTimeout(() => navigate('/child/dashboard'), 2000);
            } else {
                setStatus('הקוד לא תקין או שפג תוקפו.');
            }
        } catch (error) {
            setStatus('שגיאה בתקשורת עם השרת.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <p className="text-lg font-bold">{status}</p>
            </div>
        </div>
    );
};

export default ChildPairing;
