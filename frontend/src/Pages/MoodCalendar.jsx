import "./MoodCalendar.css";
import { useState, useEffect, useCallback } from "react";
import MoodQuiz from "./MoodQuiz";
import { useDispatch } from "react-redux";
import EmotionOverview from "./EmotionOverview";
import Journal from "./Journal";

const now = new Date();
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const emotionColors = [
  [1.0, 0.843, 0.0], // Joy (Gold)
  [0.204, 0.596, 0.859], // Sadness (Blue)
  [0.906, 0.298, 0.235], // Anger (Red)
  [0.556, 0.266, 0.678], // Fear (Purple)
  [0.914, 0.118, 0.388], // Love (Pink)
];

const mixColors = (color1, color2, t) => {
  return [
    color1[0] + (color2[0] - color1[0]) * t,
    color1[1] + (color2[1] - color1[1]) * t,
    color1[2] + (color2[2] - color1[2]) * t,
  ];
};

export default function MoodCalendar() {
  const dispatch = useDispatch();
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeComponent, setActiveComponent] = useState('overview'); // 'overview', 'calendar', or 'journal'
  const [time, setTime] = useState(0);
  const [moods, setMoods] = useState({});  // Store moods for different days
  const [mobileView, setMobileView] = useState(false);

  // Check screen size for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let animationFrameId;
    const startTime = performance.now();

    const updateTime = () => {
      const currentTime = performance.now();
      const delta = (currentTime - startTime) / 1000;
      setTime(delta);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const getDayColor = useCallback(
    (index) => {
      const x = index % 3;
      const y = Math.floor(index / 3);
      const moodIndex = Math.sin(time * 0.5 + x * 0.1 + y * 0.1) * 2.5 + 2.5;
      const clamped = Math.min(Math.max(moodIndex, 0), 4);

      const index1 = Math.floor(clamped);
      const index2 = Math.ceil(clamped);
      const t = clamped - index1;

      const color = mixColors(
        emotionColors[index1] || emotionColors[0],
        emotionColors[index2] || emotionColors[4],
        t
      );

      return `rgb(${Math.round(color[0] * 255)}, ${Math.round(
        color[1] * 255
      )}, ${Math.round(color[2] * 255)})`;
    },
    [time]
  );

  const handleDayClick = (index, date) => {
    setSelectedDay(date);
    setActiveComponent('quiz');
    
    // Dispatch the date
    dispatch({ 
      type: 'SET_SELECTED_DATE', 
      payload: date.toISOString().split('T')[0] 
    });
  };
  
  const handleQuizComplete = (mood) => {
    if (selectedDay) {
      setMoods(prev => ({
        ...prev,
        [selectedDay.toISOString()]: mood
      }));
    }
    setActiveComponent('overview');
  };

  const handleQuizClose = () => {
    setActiveComponent('calendar');
    setSelectedDay(null);
  };

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Navigation */}
      <div className="dashboard-nav">
        <button 
          className={`nav-item ${activeComponent === 'overview' ? 'active' : ''}`} 
          onClick={() => handleNavClick('overview')}
        >
          Emotion Overview
        </button>
        <button 
          className={`nav-item ${activeComponent === 'calendar' ? 'active' : ''}`} 
          onClick={() => handleNavClick('calendar')}
        >
          Mood Calendar
        </button>
        <button 
          className={`nav-item ${activeComponent === 'journal' ? 'active' : ''}`} 
          onClick={() => handleNavClick('journal')}
        >
          Journal
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Emotion Overview Section */}
        <div className={`dashboard-section emotion-overview-section ${
          (activeComponent === 'overview' || !mobileView) ? 'visible' : 'hidden'
        }`}>
          <EmotionOverview moods={moods} />
        </div>

        {/* Calendar Section */}
        {(activeComponent === 'calendar' || !mobileView) && (
          <div className="dashboard-section calendar-section">
            <div className="days-grid">
              {[...Array(9)].map((_, index) => {
                const day = new Date();
                day.setDate(now.getDate() + index);
                const dayMonth = day.getMonth();

                return (
                  <div
                    key={index}
                    className="day"
                    onClick={() => handleDayClick(index, day)}
                    style={{ backgroundColor: getDayColor(index) }}
                  >
                    <div className="day-content">
                      {`${day.getDate()} ${monthNames[dayMonth]}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Quiz - Shown when a day is selected */}
        {activeComponent === 'quiz' && selectedDay && (
          <div className="dashboard-section quiz-section">
            <div className="section-header">
              <h3>How do you feel on {selectedDay.getDate()} {monthNames[selectedDay.getMonth()]}?</h3>
              <button className="close-btn" onClick={handleQuizClose}>×</button>
            </div>
            <div className="quiz-container">
              <MoodQuiz
                onComplete={handleQuizComplete}
                onClose={handleQuizClose}
                selectedDate={selectedDay}
              />
            </div>
          </div>
        )}

        {/* Journal Section */}
        {(activeComponent === 'journal' || !mobileView) && (
          <div className="dashboard-section journal-section">
            <Journal />
          </div>
        )}
      </div>
    </div>
  );
}