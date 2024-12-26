//AI GEnerated Code
import React, { useState } from "react";
import "../styles/MoodCalendar.css"; // Add this CSS file for styling.

const MoodCalendar = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [moods, setMoods] = useState({}); // Store moods as { "YYYY-MM-DD": { mood: "happy", entry: "Had a great day!" } }
  
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // Current month (0-11)
  
    // Get the first and last days of the month
    const firstDay = new Date(year, month, 1).getDay(); // Day of the week (0-6)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    // Generate array of days for the calendar
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
    // Handle mood and journal entry for a day
    const handleDayClick = (day) => {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const currentMood = moods[dateKey]?.mood || "";
      const currentEntry = moods[dateKey]?.entry || "";
  
      const mood = prompt("Set your mood (e.g., happy, sad, neutral):", currentMood);
      const entry = prompt("Add a journal entry:", currentEntry);
  
      if (mood || entry) {
        setMoods({ ...moods, [dateKey]: { mood, entry } });
      }
    };
  
    // Navigate between months
    const changeMonth = (offset) => {
      const newDate = new Date(year, month + offset, 1);
      setCurrentDate(newDate);
    };
  
    return (
      <div className="mood-calendar">
        <div className="calendar-header">
          <button className="nav-button" onClick={() => changeMonth(-1)}>&lt;</button>
          <h2>{currentDate.toLocaleString("default", { month: "long" })} {year}</h2>
          <button className="nav-button" onClick={() => changeMonth(1)}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-cell empty"></div>
          ))}
  
          {/* Calendar days */}
          {days.map((day) => {
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const moodData = moods[dateKey];
  
            return (
              <div
                key={day}
                className={`calendar-cell ${moodData?.mood || ""}`}
                onClick={() => handleDayClick(day)}
                title={moodData ? `Mood: ${moodData.mood}\nEntry: ${moodData.entry}` : "Click to set mood and journal entry"}
              >
                <div className="day-content">
                  <div className="day-number">{day}</div>
                  {moodData && (
                    <div className="mood-indicator" style={{ backgroundColor: getMoodColor(moodData.mood) }}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Helper function to return mood colors
  const getMoodColor = (mood) => {
    const colors = {
      happy: "#FFD700",
      sad: "#1E90FF",
      neutral: "#B0C4DE",
      excited: "#FF4500",
      calm: "#98FB98",
    };
    return colors[mood] || "#D3D3D3"; // Default color
  };
  
  export default MoodCalendar;
  