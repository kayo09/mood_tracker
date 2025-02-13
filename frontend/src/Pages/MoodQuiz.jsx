import React, { useEffect, useState } from "react";
import "./MoodQuiz.css";

const BASE_URL = "http://localhost:8000/";
const ENDPOINTS = [
  "primary_emotions",
  "secondary_emotions",
  "tertiary_emotions",
];
const mood = [];
export default function MoodQuiz() {
  const [primaryEmotions, setPrimaryEmotions] = useState([]);
  const [secondaryEmotions, setSecondaryEmotions] = useState([]);
  const [tertiaryEmotions, setTertiaryEmotions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(BASE_URL + ENDPOINTS[0]);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setPrimaryEmotions(data); // Store the fetched emotions
      } catch (error) {
        console.error("Error fetching emotions:", error);
      }
    };
    fetchData();
  }, []);

  const handleTertiaryEmotionClick = (emotion) => {
    mood.push(emotion);
    console.log("Mood:", mood);
    };
  const handleSecondaryEmotionClick = async (emotion) => {
    try {
      mood.push(emotion);
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
      mood.push(emotion);
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
      {primaryEmotions.length > 0
        ? primaryEmotions.map((emotion, index) => (
            <button
              key={index}
              onClick={() => handlePrimaryEmotionClick(emotion)}
            >
              {emotion}
            </button>
          ))
        : ""}
      {secondaryEmotions.length > 0
        ? secondaryEmotions.map((emotion, index) => (
            <button
              key={index}
              onClick={() => handleSecondaryEmotionClick(emotion)}
            >
              {emotion}
            </button> 
          ))
        : ""}
      {tertiaryEmotions.length > 0
        ? tertiaryEmotions.map((emotion, index) => (
            <button key={index} onClick={()=> handleTertiaryEmotionClick(emotion)}>{emotion}</button>
          ))
        : ""}
    {console.log(mood)}
    </div>
  );
}