// childApi.js - ניהול כל התקשורת מול קבוצת ה-API של הילד ב-Xano
const CHILD_BASE_URL = 'https://xxxx-xxxx-xxxx.xano.io/api:child_app'; // ה-Base URL של הקבוצה החדשה

export const childApi = {
  // שלב 1: צימוד המכשיר באמצעות הקוד מהלינק
  pairDevice: async (pairingCode) => {
    const response = await fetch(`${CHILD_BASE_URL}/pair-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pairing_code: pairingCode })
    });
    return response.json(); // מחזיר את ה-Token של הילד
  },

  // שלב 2: משיכת המשימות ליום או שבוע
  // מקבל תאריך (selected_date) וסוג תצוגה (day/week)
  getMyDay: async (token, selectedDate, viewType = 'day') => {
    const response = await fetch(`${CHILD_BASE_URL}/my-day?selected_date=${selectedDate}&view_type=${viewType}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
    });
    return response.json();
  },

  // שלב 3: הוספת משימה או שיבוץ למידה למבחן על ידי הילד
  addTask: async (token, taskData) => {
    const response = await fetch(`${CHILD_BASE_URL}/add-task`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  }
};
