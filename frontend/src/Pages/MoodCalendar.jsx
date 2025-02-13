import "./MoodCalendar.css";
import { useState, useEffect } from "react";
import MoodQuiz from "./MoodQuiz";

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MoodCalendar() {
  const [emotions, setEmotions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/primary_emotions")
      .then((response) => response.json())
      .then((data) => setEmotions(data))
      .catch((error) => console.error("Error fetching emotions:", error));
  }, []);

  const handleDayClick = (index, date) => {
    setSelectedDay(date);
    setFlippedIndex(index);
  };

  const handleQuizClose = () => {
    setFlippedIndex(null);
    setSelectedDay(null);
  };

  return (
    <div className="mood-container">
      <div className="days">
        {[...Array(9)].map((_, index) => {
          const day = new Date();
          day.setDate(now.getDate() + index);
          const isFlipped = flippedIndex === index;

          return (
            <div
              key={index}
              className={`day ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleDayClick(index, day)}
            >
              <div className="day-inner">
                <div className="day-front">
                  {`${day.getDate()} ${monthNames[month]}`}
                </div>
                <div className="day-back">
                  {isFlipped && (
                    <MoodQuiz 
                      onClose={handleQuizClose}
                      selectedDate={selectedDay}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}