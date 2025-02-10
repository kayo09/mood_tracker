import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import './MoodDistribution.css';

const moodData = [
  { period: "Jan", Happy: 12, Sad: 4, Neutral: 6, Angry: 2 },
  { period: "Feb", Happy: 10, Sad: 6, Neutral: 5, Angry: 3 },
  { period: "Mar", Happy: 15, Sad: 3, Neutral: 4, Angry: 1 },
  { period: "Apr", Happy: 9, Sad: 5, Neutral: 7, Angry: 2 },
  { period: "May", Happy: 10, Sad: 4, Neutral: 6, Angry: 3 },
  { period: "Jun", Happy: 14, Sad: 3, Neutral: 5, Angry: 1 },
  { period: "Jul", Happy: 12, Sad: 4, Neutral: 6, Angry: 2 },
  { period: "Aug", Happy: 10, Sad: 6, Neutral: 5, Angry: 3 },
  { period: "Sep", Happy: 15, Sad: 3, Neutral: 4, Angry: 1 },
  { period: "Oct", Happy: 9, Sad: 5, Neutral: 7, Angry: 2 },
  { period: "Nov", Happy: 10, Sad: 4, Neutral: 6, Angry: 3 },
  { period: "Dec", Happy: 14, Sad: 3, Neutral: 5, Angry: 1 },
];

export default function MoodDistribution() {
  return (
    <div className="wrapper">
      <div className="mood-distribution">
        <h2>Mood Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(255, 255, 255)" />
            <XAxis dataKey="period" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF" />
            <Tooltip contentStyle={{ backgroundColor: "#FF00FF", border: "1px solid #fff", color: "#FF0FFf" }} />
            <Legend wrapperStyle={{ color: "#fff" }} />
            <Line type="monotone" dataKey="Happy" stroke="#FF00FF" strokeWidth={3} dot={{ stroke: '#FF00FF', strokeWidth: 2, r: 4 }} />
            <Line type="monotone" dataKey="Sad" stroke="#00FFFF" strokeWidth={3} dot={{ stroke: '#00FFFF', strokeWidth: 2, r: 4 }} />
            <Line type="monotone" dataKey="Neutral" stroke="#FFFF00" strokeWidth={3} dot={{ stroke: '#FFFF00', strokeWidth: 2, r: 4 }} />
            <Line type="monotone" dataKey="Angry" stroke="#FF4500" strokeWidth={3} dot={{ stroke: '#FF4500', strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
