import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Journal.css";

// const BASE_URL = "https://moodtracker-production-f63d.up.railway.app/";
const BASE_URL="sqlite://moodtracker.db/";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [primaryEmotions, setPrimaryEmotions] = useState([]);
  const [journalContent, setJournalContent] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const access_token = useSelector((state) => state.user.access_token);

  useEffect(() => {
    fetchPrimaryEmotions();
    fetchJournalEntries();
  }, []);

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const fetchPrimaryEmotions = async () => {
    try {
      const response = await fetch(BASE_URL + "primary_emotions/");
      const data = await response.json();
      setPrimaryEmotions(data);
      if (data.length > 0) setSelectedEmotion(data[0]);
    } catch (err) {
      console.error("Error fetching emotions:", err);
    }
  };

  const fetchJournalEntries = async () => {
    try {
      const response = await fetch(BASE_URL + 'entries/', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch entries');
      
      const data = await response.json();
      const validatedEntries = data.map(entry => ({
        ...entry,
        date_time: isValidDate(entry.date_time) ? entry.date_time : new Date().toISOString()
      }));
      
      setEntries(validatedEntries);
    } catch (err) {
      console.error('Error:', err);
      setEntries([]);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!journalContent.trim()) {
      setError("Journal content cannot be empty");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_URL + "add_entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          emotion: selectedEmotion,
          notes: journalContent,
          date_time: selectedDate.toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to save entry");

      setJournalContent("");
      await fetchJournalEntries();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="journal-container">
      <h2>Journal Entries</h2>

      <form onSubmit={handleSubmit} className="journal-form">
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              newDate.setHours(12, 0, 0); // Set to noon to avoid timezone issues
              setSelectedDate(newDate);
            }}
            required
          />
        </div>

        <div className="form-group">
          <label>Emotion:</label>
          <select
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
            required
          >
            {primaryEmotions.map((emotion) => (
              <option key={emotion} value={emotion}>
                {emotion}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Journal Entry:</label>
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="How are you feeling today?"
            rows="5"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </form>

      <div className="entries-list">
        <h3>Past Entries</h3>
        {entries.length === 0 ? (
          <p>No entries yet. Start journaling!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="journal-entry">
              <div className="entry-header">
                <span className="entry-date">
                  {isValidDate(entry.date_time)
                    ? new Date(entry.date_time).toLocaleDateString()
                    : "Invalid Date"}
                </span>

                <span
                  className="entry-emotion"
                  style={{
                    backgroundColor:
                      emotionColorScheme[entry.emotion]?.base || "#ccc",
                    color: getContrastColor(
                      emotionColorScheme[entry.emotion]?.base || "#ccc"
                    ),
                  }}
                >
                  {entry.emotion}
                </span>
              </div>
              <p className="entry-content">{entry.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Reuse color utilities from MoodQuiz
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#2c3e50" : "white";
};

const emotionColorScheme = {
  Joy: { base: "#FFD700" },
  Sadness: { base: "#3498db" },
  Anger: { base: "#e74c3c" },
  Fear: { base: "#8e44ad" },
  Love: { base: "#e91e63" },
};
