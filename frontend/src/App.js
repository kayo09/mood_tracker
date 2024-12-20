import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, BarChart2, Star } from 'lucide-react';

// Mood options
const MOOD_OPTIONS = [
  { value: 'happy', label: 'Happy', color: 'bg-green-500' },
  { value: 'sad', label: 'Sad', color: 'bg-blue-500' },
  { value: 'neutral', label: 'Neutral', color: 'bg-gray-500' },
  { value: 'stressed', label: 'Stressed', color: 'bg-red-500' },
  { value: 'excited', label: 'Excited', color: 'bg-yellow-500' }
];

// Mock API functions (replace with actual API calls)
const mockApiCalls = {
  addEntry: async (date, mood, journal) => {
    console.log('Saving entry:', { date, mood, journal });
    return { success: true };
  },
  getEntries: async (month, year) => {
    console.log('Fetching entries for:', month, year);
    return [
      { date: '2024-01-15', mood: 'happy', journal: 'Great day today!' },
      { date: '2024-01-20', mood: 'stressed', journal: 'Challenging work day' }
    ];
  },
  getAnalysis: async () => {
    return {
      moodDistribution: {
        happy: 40,
        sad: 20,
        neutral: 30,
        stressed: 10
      },
      recommendations: [
        'Practice mindfulness meditation',
        'Take a short walk outside',
        'Connect with a friend'
      ]
    };
  }
};

// Calendar Component
const MoodCalendar = ({ onDaySelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const fetchedEntries = await mockApiCalls.getEntries(
        currentDate.getMonth() + 1, 
        currentDate.getFullYear()
      );
      setEntries(fetchedEntries);
    };
    fetchEntries();
  }, [currentDate]);

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth() + 1, 
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth(), 
      1
    ).getDay();

    return Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
      const fullDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = entries.find(e => e.date === fullDate);
      const moodColor = entry 
        ? MOOD_OPTIONS.find(m => m.value === entry.mood)?.color 
        : 'bg-gray-100';

      return (
        <div 
          key={day} 
          className={`p-2 border text-center cursor-pointer ${moodColor} hover:bg-opacity-75`}
          onClick={() => onDaySelect(fullDate)}
        >
          {day}
        </div>
      );
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
          <ChevronLeft />
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-sm">{day}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

// Mood Entry Modal
const MoodEntryModal = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [mood, setMood] = useState('');
  const [journal, setJournal] = useState('');

  const handleSave = async () => {
    await mockApiCalls.addEntry(selectedDate, mood, journal);
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Log Mood for {selectedDate}</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Mood</label>
          <select 
            value={mood} 
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Mood</option>
            {MOOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Journal Entry</label>
          <textarea 
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="How are you feeling today?"
          />
        </div>

        <div className="flex justify-between">
          <button 
            onClick={onClose} 
            className="bg-gray-200 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const data = await mockApiCalls.getAnalysis();
      setAnalysis(data);
    };
    fetchAnalysis();
  }, []);

  if (!analysis) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-4">
        <BarChart2 className="mr-2" />
        <h2 className="text-xl font-bold">Mood Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Mood Distribution</h3>
          {Object.entries(analysis.moodDistribution).map(([mood, percentage]) => (
            <div key={mood} className="mb-2">
              <div className="flex justify-between">
                <span>{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    MOOD_OPTIONS.find(m => m.value === mood)?.color || 'bg-gray-500'
                  }`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <Star className="mr-2" />
            Recommendations
          </h3>
          <ul className="list-disc pl-5">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="mb-2">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const MoodTrackerApp = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDaySelect = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
          <Calendar className="mr-3" /> Mood Tracker
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MoodCalendar onDaySelect={handleDaySelect} />
          </div>
          <div>
            <Dashboard />
          </div>
        </div>

        <MoodEntryModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          onSave={() => {/* Refresh data if needed */}}
        />
      </div>
    </div>
  );
};

export default MoodTrackerApp;