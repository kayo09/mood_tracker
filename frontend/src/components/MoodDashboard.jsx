import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MoodCalendar from './MoodCalendar';
import MoodTrends from './MoodTrends';

const MoodDashboard = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadEntries = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const response = await axios.get("http://localhost:8000/entries/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };

    loadEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mood Tracker</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <MoodCalendar entries={entries} setEntries={setEntries} />
          </div>

          {/* Trends Section */}
          <MoodTrends entries={entries} />
        </div>
      </div>
    </div>
  );
};

export default MoodDashboard;