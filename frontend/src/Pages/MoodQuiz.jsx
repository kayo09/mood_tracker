import React, { useEffect, useState } from "react";
import "./MoodQuiz.css";
import { useSelector } from 'react-redux';


const BASE_URL = "https://moodtracker-production-f63d.up.railway.app/";
const ENDPOINTS = [
  "primary_emotions/",
  "secondary_emotions/",
  "tertiary_emotions/",
];
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#2c3e50" : "white";
};
const addDarkTint = (color) => {
  return `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), ${color}`;
};


const emotionColorScheme = {
  // Primary Emotions
  Joy: { base: "#FFD700", secondary: "#FFE55C", tertiary: "#FFF0A3" },
  Sadness: { base: "#3498db", secondary: "#5DADE2", tertiary: "#85C1E9" },
  Anger: { base: "#e74c3c", secondary: "#EC7063", tertiary: "#F1948A" },
  Fear: { base: "#8e44ad", secondary: "#A569BD", tertiary: "#BB8FCE" },
  Love: { base: "#e91e63", secondary: "#EC407A", tertiary: "#F06292" },

  // Secondary Emotions
  Contentment: "#A3D977",
  Happiness: "#FFC300",
  Excitement: "#FF6B6B",
  Pride: "#4ECDC4",
  Melancholy: "#6C5B7B",
  Disappointment: "#8395A7",
  Grief: "#546E7A",
  Loneliness: "#778B9F",
  Frustration: "#F39C12", // For secondary usage
  Rage: "#C0392B",
  Resentment: "#D35400",
  Indignation: "#E67E22",
  Anxiety: "#8E6E53",
  Insecurity: "#95A5A6",
  Panic: "#7F8C8D",
  Apprehension: "#B79574",
  Affection: "#FF80AB",
  Compassion: "#FFA07A",
  Romance: "#FF4081",
  Connection: "#FF5252",
};

// New tertiary emotion colors mapping
const tertiaryEmotionColors = {
  // For Joy
  Peace: "#E0F7FA",
  Satisfaction: "#B2EBF2",
  Comfort: "#80DEEA",
  Cheerfulness: "#FFF9C4",
  Pleasure: "#FFF59D",
  Optimism: "#FFF176",
  Enthusiasm: "#FFCDD2",
  Thrill: "#EF9A9A",
  Anticipation: "#E57373",
  Confidence: "#C8E6C9",
  Achievement: "#A5D6A7",
  "Self-assurance": "#81C784",

  // For Sadness
  Longing: "#BBDEFB",
  Wistfulness: "#90CAF9",
  Nostalgia: "#64B5F6",
  Regret: "#B3E5FC",
  // Using a different shade for tertiary frustration here:
  "Frustration": "#81D4FA",
  Defeat: "#4FC3F7",
  Loss: "#E1BEE7",
  Heartache: "#CE93D8",
  Sorrow: "#BA68C8",
  Isolation: "#F0F4C3",
  Abandonment: "#E6EE9C",
  Disconnection: "#DCE775",

  // For Anger
  Irritation: "#FFCCBC",
  Annoyance: "#FFAB91",
  Agitation: "#FF8A65",
  Fury: "#FF7043",
  Outrage: "#FF5722",
  Hostility: "#F4511E",
  Bitterness: "#D7CCC8",
  Jealousy: "#BCAAA4",
  Envy: "#A1887F",
  Offense: "#FFECB3",
  Displeasure: "#FFE082",
  Contempt: "#FFD54F",

  // For Fear
  Worry: "#CFD8DC",
  Nervousness: "#B0BEC5",
  Unease: "#90A4AE",
  "Self-doubt": "#FFE0B2",
  Vulnerability: "#FFCC80",
  Inadequacy: "#FFB74D",
  Terror: "#E0E0E0",
  Horror: "#BDBDBD",
  Dread: "#9E9E9E",
  Caution: "#F5F5F5",
  Hesitation: "#EEEEEE",
  Uncertainty: "#E0E0E0",

  // For Love
  Fondness: "#FCE4EC",
  Warmth: "#F8BBD0",
  Tenderness: "#F48FB1",
  Empathy: "#E1BEE7",
  Understanding: "#CE93D8",
  Kindness: "#BA68C8",
  Passion: "#FFCDD2",
  Attraction: "#EF9A9A",
  Desire: "#E57373",
  Bonding: "#F3E5F5",
  Attachment: "#E1BEE7",
  Closeness: "#CE93D8",
};

export default function MoodQuiz({ onClose, selectedDate }) {
  const [primaryEmotions, setPrimaryEmotions] = useState([]);
  const [secondaryEmotions, setSecondaryEmotions] = useState([]);
  const [tertiaryEmotions, setTertiaryEmotions] = useState([]);
  const [mood, setMood] = useState([]);
  const access_token = useSelector((state) => state.user.access_token);


  const buttonBaseStyle = {
    borderRadius: "15px",
    padding: "12px 20px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    opacity: "0.9",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(BASE_URL + ENDPOINTS[0]);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPrimaryEmotions(data);
      } catch (error) {
        console.error("Error fetching emotions:", error);
      }
    };
    fetchData();
  }, []);

  const handleTertiaryEmotionClick = (emotion) => {
    setMood((prevMood) => {
      const newMood = [...prevMood, emotion];
      setTimeout(() => {
        (async () => {
          try {
            const response = await fetch(BASE_URL + "add_entry", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify({
                emotion: newMood.join("/"),
                notes: selectedDate.toISOString(), 
                date_time: selectedDate.toISOString(),
              }),
            });
            if (!response.ok) throw new Error("Failed to save entry");
            onClose(newMood);
          } catch (error) {
            console.error("Error saving entry:", error);
          }
        })();
      }, 100);
      return newMood;
    });
  };
  
  const handleSecondaryEmotionClick = async (emotion) => {
    try {
      setMood((prevMood) => [...prevMood, emotion]); 
      const response = await fetch(BASE_URL + ENDPOINTS[2] + `/${emotion}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setTertiaryEmotions(data);
      setSecondaryEmotions([]); // Clear secondary emotions
    } catch (error) {
      console.error("Error fetching emotions:", error);
    }
  };

  const handlePrimaryEmotionClick = async (emotion) => {
    try {
      setMood(prevMood => [...prevMood, emotion]); // Use state instead of global array
      const response = await fetch(BASE_URL + ENDPOINTS[1] + `/${emotion}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSecondaryEmotions(data);
      setPrimaryEmotions([]); // Clear primary emotions
    } catch (error) {
      console.error("Error fetching emotions:", error);
    }
  };

  return (
    <div className="quiz">
      {primaryEmotions.length > 0 &&
        primaryEmotions.map((emotion, index) => (
          <button
            key={index}
            data-level="primary"
            onClick={() => handlePrimaryEmotionClick(emotion)}
            style={{
              ...buttonBaseStyle,
              background: emotionColorScheme[emotion].base,
              backgroundImage: addDarkTint(emotionColorScheme[emotion].base),
            }}
          >
            {emotion}
          </button>
        ))}
      {secondaryEmotions.length > 0 &&
        secondaryEmotions.map((emotion, index) => (
          <button
            key={index}
            data-level="secondary"
            onClick={() => handleSecondaryEmotionClick(emotion)}
            style={{
              ...buttonBaseStyle,
              backgroundImage: addDarkTint(emotionColorScheme[emotion]),
              background: emotionColorScheme[emotion] || "#ccc",
              color: getContrastColor(emotionColorScheme[emotion] || "#ccc"),
            }}
          >
            {emotion}
          </button>
        ))}
      {tertiaryEmotions.length > 0 &&
        tertiaryEmotions.map((emotion, index) => (
          <button
            key={index}
            data-level="tertiary"
            onClick={() => handleTertiaryEmotionClick(emotion)}
            style={{
              ...buttonBaseStyle,
              backgroundImage: addDarkTint(tertiaryEmotionColors[emotion]), 
              background: tertiaryEmotionColors[emotion] || "#ccc",
              color: getContrastColor(tertiaryEmotionColors[emotion] || "#ccc"),
            }}
          >
            {emotion}
          </button>
        ))}
      <button 
        onClick={() => onClose(mood)}
        style={{
          ...buttonBaseStyle,
          backgroundColor: "#34495e",
          color: "white",
          marginTop: "20px",
        }}
      >
        Close
      </button>
    </div>
  );
}
