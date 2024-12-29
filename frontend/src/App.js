// App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
// import MoodCalendar from './components/MoodCalendar';
import MoodDashboard from './components/MoodDashboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login'); // Tracks the current page: 'register', 'login', 'moodCalendar'

  // Handlers for navigation
  const handleRegisterSuccess = () => setCurrentPage('login');
  const handleLoginSuccess = () => setCurrentPage('moodDashboard');

  return (
    <div>
      <center><h1 style={{color:'#00adb5'}}>Mood Calendar🐮</h1></center>
      {currentPage === 'register' && <RegisterPage onRegisterSuccess={handleRegisterSuccess} />}
      {currentPage === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'moodDashboard' && <MoodDashboard />}
    </div>
  );
};

export default App;
