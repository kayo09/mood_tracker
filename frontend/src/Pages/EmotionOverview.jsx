import react from 'react';
import { useDispatch } from "react-redux";

const BASE_URL = "http://127.0.0.1:8000/";

const getEntries = async () => {
  const response = await fetch(BASE_URL + 'emotion_counts/', {
    headers: { Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwYXJtYXIua2F5QGljbG91ZC5jb20iLCJleHAiOjE3NDAxMDAwNjh9.kgb2h_f_H3ijbhnZIkCqkyqXLUCcktU8NRTA1mFbvh8"}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch entries');
  
  const data = await response.json();
  console.log(data);
 
  
};

const EmotionOverview = () => {
  const dispatch = useDispatch();
  
  return (
    <div>
      <h1>Emotion Overview</h1>
      {getEntries()}
    </div>
  );
}
export default EmotionOverview;