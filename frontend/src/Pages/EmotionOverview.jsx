import { use, useEffect, useState } from "react";
import "./EmotionOverview.css";
import { useSelector } from "react-redux";

const emotionColorScheme = {
  Joy: "#FFD700",
  Sadness: "#3498db",
  Anger: "#e74c3c",
  Fear: "#8e44ad",
  Love: "#e91e63",
};

const EmotionOverview = () => {
  const [sortedEntries, setSortedEntries] = useState([]);
  const token= useSelector((state) => state.user.access_token);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://0.0.0.0:8000/entries",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        const processedEntries = data.map(entry => ({
          date: new Date(entry.created_at),
          emotions: entry.emotion.split('/'),
        }));

        processedEntries.sort((a, b) => b.date - a.date);
        setSortedEntries(processedEntries.slice(0, 5));
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  const getPrimaryColor = (emotions) => {
    const primary = emotions?.[0];
    return emotionColorScheme[primary] || "#ecf0f1";
  };

  return (
    <div className="emotion-overview">
      <h2>Emotional History</h2>
      
      <div className="legend">
        {Object.entries(emotionColorScheme).map(([emotion, color]) => (
          <div key={emotion} className="legend-item">
            <div className="color-box" style={{ backgroundColor: color }} />
            <span>{emotion}</span>
          </div>
        ))}
      </div>

      <div className="entries-grid">
        {sortedEntries.map((entry, index) => {
          const dateString = entry.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={index}
              className="entry-card"
              style={{ backgroundColor: getPrimaryColor(entry.emotions) }}
            >
              <div className="entry-content">
                <div className="entry-date">{dateString}</div>
                <div className="entry-emotions">
                  {entry.emotions.join(" → ")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionOverview;