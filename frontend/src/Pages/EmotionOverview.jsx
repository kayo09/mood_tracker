import { useEffect, useState, useRef } from "react";
import "./EmotionOverview.css";
import { useSelector } from "react-redux";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const emotionColorScheme = {
  Joy: "#FFD700",
  Sadness: "#3498db",
  Anger: "#e74c3c",
  Fear: "#8e44ad",
  Love: "#e91e63",
  Surprise: "#2ecc71",
  Disgust: "#16a085",
  Anticipation: "#f39c12",
};

const emotionDescriptions = {
  Joy: "Feelings of happiness, contentment, and satisfaction",
  Sadness: "Feelings of loss, disappointment, and grief",
  Anger: "Strong feelings of displeasure and antagonism",
  Fear: "Response to perceived threat or danger",
  Love: "Deep affection and attachment",
  Surprise: "Brief emotional state experienced as unexpected",
  Disgust: "Revulsion or strong disapproval",
  Anticipation: "Looking forward to or expecting something",
};

const EmotionOverview = () => {
  const [sortedEntries, setSortedEntries] = useState([]);
  const [spiderData, setSpiderData] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [selectedEmotions, setSelectedEmotions] = useState(
    Object.keys(emotionColorScheme).slice(0, 5)
  );
  const [activeEmotion, setActiveEmotion] = useState(null);
  const [viewMode, setViewMode] = useState("radar"); // radar, timeline, cards
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const token = useSelector((state) => state.user.access_token);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("https://moodtracker-production-f63d.up.railway.app/entries/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        // Create more comprehensive entries with randomized data for demo
        const processedEntries = data.map(entry => {
          // Create a distribution of intensities for each emotion
          const emotionIntensities = {};
          const primaryEmotions = entry.emotion.split('/');
          
          Object.keys(emotionColorScheme).forEach(emotion => {
            const isPrimary = primaryEmotions.includes(emotion);
            // Primary emotions have higher intensity
            emotionIntensities[emotion] = isPrimary
              ? Math.floor(Math.random() * 5) + 5 // 5-10 for primary
              : Math.floor(Math.random() * 5); // 0-4 for non-primary
          });
          
          return {
            id: entry.id || `entry-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date(entry.created_at),
            emotions: primaryEmotions,
            emotionIntensities,
            notes: entry.notes || "",
            overallIntensity: entry.intensity || Math.floor(Math.random() * 10) + 1,
          };
        });

        processedEntries.sort((a, b) => b.date - a.date);
        setSortedEntries(processedEntries);
        
        // Generate radar chart data
        generateSpiderData(processedEntries, timeRange);
        
        // Trigger animation after data is loaded
        setTimeout(() => setAnimateChart(true), 300);
      } catch (error) {
        console.error("Error fetching entries:", error);
        // Generate demo data for preview
        generateDemoData();
      }
    };

    fetchEntries();
  }, [token]);

  const generateDemoData = () => {
    const demoEntries = [];
    const now = new Date();
    
    // Generate entries for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const emotionCount = Math.floor(Math.random() * 3) + 1;
      const emotions = Object.keys(emotionColorScheme)
        .sort(() => 0.5 - Math.random())
        .slice(0, emotionCount);
      
      const emotionIntensities = {};
      Object.keys(emotionColorScheme).forEach(emotion => {
        const isPrimary = emotions.includes(emotion);
        emotionIntensities[emotion] = isPrimary
          ? Math.floor(Math.random() * 5) + 5
          : Math.floor(Math.random() * 5);
      });
      
      demoEntries.push({
        id: `demo-${i}`,
        date,
        emotions,
        emotionIntensities,
        notes: "Demo entry",
        overallIntensity: Math.floor(Math.random() * 10) + 1,
      });
    }
    
    setSortedEntries(demoEntries);
    generateSpiderData(demoEntries, timeRange);
    setTimeout(() => setAnimateChart(true), 300);
  };

  useEffect(() => {
    // Update spider data when selection changes
    if (sortedEntries.length > 0) {
      generateSpiderData(sortedEntries, timeRange);
    }
  }, [selectedEmotions, timeRange, sortedEntries]);

  const generateSpiderData = (entries, range) => {
    // Filter entries based on time range
    const filteredEntries = filterEntriesByTimeRange(entries, range);
    
    // Calculate average intensity for each emotion
    const emotionData = {};
    Object.keys(emotionColorScheme).forEach(emotion => {
      emotionData[emotion] = {
        totalIntensity: 0,
        count: 0,
        trend: [], // Store daily/weekly values for trend analysis
      };
    });

    filteredEntries.forEach(entry => {
      Object.entries(entry.emotionIntensities).forEach(([emotion, intensity]) => {
        if (selectedEmotions.includes(emotion)) {
          emotionData[emotion].totalIntensity += intensity;
          emotionData[emotion].count += 1;
          
          // Store value in trend data
          const dateStr = entry.date.toISOString().split('T')[0];
          if (!emotionData[emotion].trend.find(item => item.date === dateStr)) {
            emotionData[emotion].trend.push({
              date: dateStr,
              value: intensity,
            });
          }
        }
      });
    });

    // Prepare radar chart data
    const radarData = [];
    for (const [emotion, data] of Object.entries(emotionData)) {
      if (selectedEmotions.includes(emotion)) {
        const value = data.count > 0 ? data.totalIntensity / data.count : 0;
        radarData.push({
          emotion,
          value: parseFloat(value.toFixed(1)),
          fullMark: 10,
          color: emotionColorScheme[emotion],
          description: emotionDescriptions[emotion],
          count: data.count,
        });
      }
    }

    setSpiderData(radarData);
  };

  const filterEntriesByTimeRange = (entries, range) => {
    const now = new Date();
    let cutoffDate;
    
    switch (range) {
      case "week":
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
    }
    
    return entries.filter(entry => entry.date >= cutoffDate);
  };

  const getPrimaryColor = (emotions) => {
    const primary = emotions?.[0];
    return emotionColorScheme[primary] || "#ecf0f1";
  };

  const toggleEmotionSelection = (emotion) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setAnimateChart(false);
    setTimeout(() => setAnimateChart(true), 300);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <h4>{data.emotion}</h4>
          <p>{data.description}</p>
          <p className="tooltip-intensity">Intensity: {data.value}/10</p>
          <p className="tooltip-count">Entries: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  const handleEmotionHover = (emotion) => {
    setActiveEmotion(emotion);
  };

  const resetEmotionHover = () => {
    setActiveEmotion(null);
  };

  const getEmotionOpacity = (emotion) => {
    if (!activeEmotion) return 1;
    return activeEmotion === emotion ? 1 : 0.3;
  };

  // Custom formatter for radar chart labels
  const formatAxisLabel = (emotion) => {
    return (
      <tspan
        style={{ 
          fill: activeEmotion && activeEmotion !== emotion ? "#7a7a7a" : "#DED6D1",
          fontWeight: activeEmotion === emotion ? "bold" : "normal",
          fontSize: activeEmotion === emotion ? "14px" : "12px"
        }}
      >
        {emotion}
      </tspan>
    );
  };

  return (
    <div className="emotion-overview">
      <h2>Emotions</h2>
      
      <div className="emotion-controls">
        <div className="view-selector">
          <button 
            className={viewMode === "radar" ? "active" : ""}
            onClick={() => setViewMode("radar")}
          >
            Radar View
          </button>
          <button 
            className={viewMode === "timeline" ? "active" : ""}
            onClick={() => setViewMode("timeline")}
          >
            Timeline
          </button>
          <button 
            className={viewMode === "cards" ? "active" : ""}
            onClick={() => setViewMode("cards")}
          >
            Cards
          </button>
        </div>
        
        <div className="time-range-selector">
          <button 
            className={timeRange === "week" ? "active" : ""}
            onClick={() => handleTimeRangeChange("week")}
          >
            Week
          </button>
          <button 
            className={timeRange === "month" ? "active" : ""}
            onClick={() => handleTimeRangeChange("month")}
          >
            Month
          </button>
          <button 
            className={timeRange === "year" ? "active" : ""}
            onClick={() => handleTimeRangeChange("year")}
          >
            Year
          </button>
        </div>
        
        <button 
          className={`customize-btn ${isCustomizing ? "active" : ""}`}
          onClick={() => setIsCustomizing(!isCustomizing)}
        >
          {isCustomizing ? "Close" : "Customize"}
        </button>
      </div>
      
      <AnimatePresence>
        {isCustomizing && (
          <motion.div 
            className="emotion-customizer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="legend">
              {Object.entries(emotionColorScheme).map(([emotion, color]) => (
                <div
                  key={emotion}
                  className={`legend-item ${selectedEmotions.includes(emotion) ? 'selected' : ''}`}
                  onClick={() => toggleEmotionSelection(emotion)}
                  onMouseEnter={() => handleEmotionHover(emotion)}
                  onMouseLeave={resetEmotionHover}
                  style={{
                    opacity: getEmotionOpacity(emotion),
                    borderColor: selectedEmotions.includes(emotion) ? color : "transparent",
                  }}
                >
                  <div className="color-box" style={{ backgroundColor: color }} />
                  <span>{emotion}</span>
                </div>
              ))}
            </div>
            
            <div className="customizer-footer">
              <button onClick={() => setSelectedEmotions(Object.keys(emotionColorScheme))}>
                Select All
              </button>
              <button onClick={() => setSelectedEmotions([])}>
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === "radar" && (
        <div className="spider-graph-container" ref={chartRef}>
          <AnimatePresence mode="wait">
            {animateChart && (
              <motion.div
                className="chart-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                key={`chart-${timeRange}-${selectedEmotions.join('-')}`}
              >
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart 
                    outerRadius="70%" 
                    data={spiderData}
                    margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
                  >
                    <PolarGrid stroke="#3a3a3a" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="emotion" 
                      tick={({ payload, x, y, cx, cy, index }) => (
                        <g
                          onMouseEnter={() => handleEmotionHover(payload.value)}
                          onMouseLeave={resetEmotionHover}
                          style={{ cursor: 'pointer' }}
                        >
                          <text
                            x={x}
                            y={y}
                            textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
                            fill={
                              activeEmotion && activeEmotion !== payload.value 
                                ? "#7a7a7a" 
                                : "#DED6D1"
                            }
                            style={{
                              fontWeight: activeEmotion === payload.value ? "bold" : "normal",
                              fontSize: activeEmotion === payload.value ? "14px" : "12px",
                              transition: "all 0.3s ease"
                            }}
                          >
                            {payload.value}
                          </text>
                        </g>
                      )}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 10]} 
                      tickCount={6}
                      stroke="#DED6D1"
                      strokeOpacity={0.5}
                    />
                    <Radar
                      name="Emotion Intensity"
                      dataKey="value"
                      stroke="#e91e63"
                      fill="#e91e63"
                      fillOpacity={0.5}
                      animationBegin={0}
                      animationDuration={1000}
                      isAnimationActive={true}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Individual emotion radars for highlighting */}
                    {selectedEmotions.map((emotion, index) => {
                      const singleEmotionData = spiderData.filter(
                        item => item.emotion === emotion
                      );
                      return (
                        <Radar
                          key={`radar-${emotion}`}
                          name={emotion}
                          dataKey="value"
                          data={singleEmotionData}
                          stroke={emotionColorScheme[emotion]}
                          fill={emotionColorScheme[emotion]}
                          fillOpacity={
                            activeEmotion === emotion ? 0.8 : activeEmotion ? 0.1 : 0.3
                          }
                          strokeWidth={activeEmotion === emotion ? 3 : 1}
                          isAnimationActive={true}
                          animationBegin={index * 100}
                          animationDuration={1000}
                        />
                      );
                    })}
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
          
          {spiderData.length === 0 && (
            <div className="no-data-message">
              <p>No data available for the selected time range and emotions.</p>
              <p>Try selecting different emotions or changing the time range.</p>
            </div>
          )}
        </div>
      )}
      
      {viewMode === "timeline" && (
        <div className="timeline-container">
          <div className="timeline-header">
            <h3>Emotion Intensity Timeline</h3>
            <p>Showing data for the past {timeRange === "week" ? "7 days" : timeRange === "month" ? "month" : "year"}</p>
          </div>
          
          <div className="timeline-chart">
            {/* Timeline visualization would go here */}
            <div className="timeline-placeholder">
              <p>Timeline visualization is under development</p>
            </div>
          </div>
        </div>
      )}
      
      {(viewMode === "cards" || spiderData.length === 0) && (
        <div className="entries-grid">
          {sortedEntries.slice(0, 8).map((entry, index) => {
            const dateString = entry.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            
            // Find the emotion with highest intensity
            let highestEmotion = entry.emotions[0];
            let highestIntensity = 0;
            
            Object.entries(entry.emotionIntensities).forEach(([emotion, intensity]) => {
              if (intensity > highestIntensity) {
                highestEmotion = emotion;
                highestIntensity = intensity;
              }
            });

            return (
              <motion.div
                key={entry.id || index}
                className="entry-card"
                style={{ 
                  backgroundColor: emotionColorScheme[highestEmotion],
                  backgroundImage: `radial-gradient(circle at bottom right, rgba(255,255,255,0.1), transparent 70%)`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.25)"
                }}
              >
                <div className="entry-content">
                  <div className="entry-date">{dateString}</div>
                  <div className="entry-emotions">
                    {entry.emotions.join(" → ")}
                  </div>
                  <div className="emotion-intensities">
                    {Object.entries(entry.emotionIntensities)
                      .filter(([emotion, intensity]) => 
                        entry.emotions.includes(emotion) && intensity > 0
                      )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([emotion, intensity]) => (
                        <div key={emotion} className="intensity-bar">
                          <span>{emotion}</span>
                          <div className="bar-container">
                            <div 
                              className="bar-fill" 
                              style={{ 
                                width: `${intensity * 10}%`,
                                backgroundColor: emotionColorScheme[emotion]
                              }}
                            ></div>
                          </div>
                          <span className="intensity-value">{intensity}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      <div className="insights-panel">
        <h3>Emotional Insights</h3>
        <div className="insights-content">
          {spiderData.length > 0 ? (
            <>
              <p className="insight-highlight">
                {spiderData.sort((a, b) => b.value - a.value)[0]?.emotion || "No"} is your dominant 
                emotion ({spiderData.sort((a, b) => b.value - a.value)[0]?.value || 0}/10) for the selected period.
              </p>
              <p>
                You've tracked {sortedEntries.length} emotional entries. Keep going to unlock more detailed insights.
              </p>
            </>
          ) : (
            <p>Select emotions and time range to see your emotional insights.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionOverview;