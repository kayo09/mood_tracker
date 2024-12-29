import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

const MoodTrends = ({ entries }) => {
  // Process entries for visualization
  const processMoodData = () => {
    const moodCounts = {};
    entries.forEach(entry => {
      const primaryEmotion = entry.emotion.split(' > ')[0];
      moodCounts[primaryEmotion] = (moodCounts[primaryEmotion] || 0) + 1;
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count
    }));
  };

  // Colors for different moods
  const COLORS = ['#FF8A80', '#82B1FF', '#B39DDB', '#FFCC80', '#A5D6A7'];
  
  const data = processMoodData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Monthly Mood Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Mood Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82B1FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Mood Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((mood, index) => (
            <div 
              key={mood.name}
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${COLORS[index % COLORS.length]}15` }}
            >
              <h4 className="font-medium text-gray-700">{mood.name}</h4>
              <p className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                {mood.value}
              </p>
              <p className="text-sm text-gray-600">entries</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTrends;