import './MoodCalendar.css';
import { useState, useEffect } from "react";
import MoodQuiz from './MoodQuiz'; // Import the MoodQuiz component

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const startDay = new Date(year, month, 1).getDay();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const emotions = await fetch('http://localhost:8000/primary_emotions').then(response => response.json());

// Emotion to Color Mapping
const emotionColors = {
    Joy: "#FFD700", // Gold
    Sadness: "#3498db", // Blue
    Anger: "#e74c3c", // Red
    Fear: "#8e44ad", // Purple
    Love: "#e91e63", // Pink
};

const getRandomEmotion = () => emotions.length ? emotions[Math.floor(Math.random() * emotions.length)] : "Joy";

export default function MoodCalendar() {
    const [emotions, setEmotions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/primary_emotions")
            .then((response) => response.json())
            .then((data) => setEmotions(data))
            .catch((error) => console.error("Error fetching emotions:", error));
    }, []);

    return (
        <div className="mood-container">
            <div className="days">
                {[...Array(7)].map((_, index) => {
                    const day = new Date();
                    day.setDate(now.getDate() + index);
                    const emotion = getRandomEmotion();
                    return (
                        <div
                            key={index}
                            className="day"
                            style={{ backgroundColor: emotionColors[emotion] || "#ccc" }}
                        >
                            <div className="day-inner">
                                <div className="day-front">
                                    {`${day.getDate()} ${monthNames[month]}`}
                                    <br />
                                    {emotion}
                                </div>
                                <div className="day-back">
                                    <MoodQuiz />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}