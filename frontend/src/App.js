// App.js
import React from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MoodCalendar from './components/MoodCalendar';

const App = () => {
  return (
    <div>
      <h1>Welcome to the Mood Tracker</h1>
      {/* <RegisterPage/> */}
      {/* <LoginPage/> */}
      <MoodCalendar/> 
    </div>
  );
};

export default App;
