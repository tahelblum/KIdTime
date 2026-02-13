import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { childApi } from './services/childApi';

const ChildPairing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code'); // שולף את ה-code מה-URL
    
    if (code) {
      handlePairing(code);
    }
  }, []);

  const handlePairing = async (code) => {
    try {
      const data = await childApi.pairDevice(code);
      if (data.authToken) {
        // שמירת הטוקן בזיכרון של הטלפון לתמיד
        localStorage.setItem('child_token', data.authToken);
        localStorage.setItem('child_name', data.child_name);
        
        // מעבר לדאשבורד של הילד
        navigate('/child/dashboard');
      }
    } catch (error) {
      console.error("Pairing failed", error);
    }
  };

  return <div>מתחבר למערכת השעות שלך...</div>;
};
