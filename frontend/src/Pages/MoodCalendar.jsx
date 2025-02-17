import "./MoodCalendar.css";
import { useState, useEffect, useCallback } from "react";
import MoodQuiz from "./MoodQuiz";
import { useDispatch } from "react-redux";
import EmotionOverview from "./EmotionOverview";
import Journal from "./Journal";

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const quizContainerStyle = {
  backdropFilter: "blur(70px)",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "10px",
  padding: "22px",
  overflowY: "auto",
  transform: "translateZ(150px)",
  perspective: "1000px",
};

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
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [time, setTime] = useState(0);
  const [moods, setMoods] = useState({});  // Store moods for different days

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
    setFlippedIndex(index);
    
    // Dispatch the date here instead of in render
    dispatch({ 
      type: 'SET_SELECTED_DATE', 
      payload: date.toISOString().split('T')[0] 
    });
  };
  
  const handleQuizClose = (mood) => {
    if (selectedDay) {
      setMoods(prev => ({
        ...prev,
        [selectedDay.toISOString()]: mood
      }));
    }
    // Add a small delay to allow the flip animation to complete
    setTimeout(() => {
      setFlippedIndex(null);
      setSelectedDay(null);
    }, 100);
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
              onClick={() => !isFlipped && handleDayClick(index, day)}
            >
              <div
                className="day-inner"
                style={{ backgroundColor: getDayColor(index) }}
              >
                <div className="day-front">
                  {`${day.getDate()} ${monthNames[month]}`}
                </div>
                <div className="day-back">
                  <div style={quizContainerStyle}>
                    {isFlipped && (
                      <MoodQuiz
                        onClose={handleQuizClose}
                        selectedDate={selectedDay}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="right-container">
      <div className="emotion-overview">
      <EmotionOverview moods={moods} /></div>
      <div className="journal"> 
      <Journal />
      </div>
      </div> 
    </div>
    
  );
}