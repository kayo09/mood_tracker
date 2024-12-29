import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const BASE_URL = 'http://127.0.0.1:8000';

const MoodCalendar = ({ entries, setEntries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState(null);
  const [emotions, setEmotions] = useState({
    primary: [],
    secondary: [],
    tertiary: []
  });
  const [selectedEmotions, setSelectedEmotions] = useState({});
  const [note, setNote] = useState('');

  const { year, month, firstDay, daysInMonth } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    firstDay: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
    daysInMonth: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  }), [currentDate]);

  const getEntryForDate = useCallback((date) => {
    return entries.find(entry => 
      new Date(entry.date).toDateString() === date.toDateString()
    );
  }, [entries]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      
      try {
        const [entriesRes, emotionsRes] = await Promise.all([
          axios.get(`${BASE_URL}/entries/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${BASE_URL}/primary_emotions/`).then(res => res.json())
        ]);

        setEntries(entriesRes.data);
        setEmotions(prev => ({ ...prev, primary: emotionsRes }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [month, year, setEntries]);

  const handleEmotionSelect = async (emotion, level, e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    
    if (level === 'tertiary' && !note.trim()) return;

    if (level !== 'tertiary') {
      const endpoint = level === 'primary' ? 'secondary' : 'tertiary';
      const response = await fetch(`${BASE_URL}/${endpoint}_emotions/${emotion}`);
      const data = await response.json();
      setEmotions(prev => ({ ...prev, [endpoint]: data }));
    }

    setSelectedEmotions(prev => ({
      ...prev,
      [expandedDay]: {
        ...prev[expandedDay],
        [level]: emotion
      }
    }));

    if (level === 'tertiary') {
      const { primary, secondary } = selectedEmotions[expandedDay];
      const finalEmotion = `${primary} > ${secondary} > ${emotion}`;
      
      try {
        const response = await fetch(`${BASE_URL}/add_entry/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            date_time: expandedDay,
            emotion: finalEmotion,
            notes: note
          })
        });

        if (response.ok) {
          const newEntry = await response.json();
          setEntries(prev => [...prev, newEntry]);
          setExpandedDay(null);
          setNote('');
          setSelectedEmotions(prev => {
            const newState = { ...prev };
            delete newState[expandedDay];
            return newState;
          });
        }
      } catch (error) {
        console.error('Error saving entry:', error);
      }
    }
  };

  const handleExpandedClick = (e) => {
    // Prevent closing when clicking inside the expanded content
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setNote(e.target.value.slice(0, 30));
  };
  const calendarStyles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '20px auto',
      fontFamily: '"Futura", sans-serif',
      color: '#555555',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#fdf0e1',
      borderRadius: '8px',
    },
    headerButton: {
      backgroundColor: '#d2a679',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 15px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    headerButtonHover: {
      backgroundColor: '#b38867',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
    },
    day: {
      padding: '10px',
      backgroundColor: '#faf3e0',
      border: '2px solid #e6d5c3',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    dayHover: {
      transform: 'scale(1.05)',
    },
    dayExpanded: {
      gridColumn: 'span 7',
      backgroundColor: '#fff5e8',
      padding: '15px',
    },
    expandedContent: {
      marginTop: '15px',
      padding: '15px',
      backgroundColor: '#fff5e8',
      borderRadius: '8px',
    },
    expandedContentInput: {
      width: '100%',
      padding: '10px',
      border: '2px solid #ffa07a',
      borderRadius: '6px',
      marginBottom: '15px',
      transition: 'all 0.3s ease',
    },
    expandedContentInputFocus: {
      outline: 'none',
      borderColor: '#ff7f50',
      boxShadow: '0 0 8px rgba(255, 127, 80, 0.4)',
    },
    emotionContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
    },
    emotionButton: {
      padding: '8px 15px',
      backgroundColor: '#ffeedd',
      color: '#666',
      border: '1px solid #ffd1a9',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    emotionButtonHover: {
      backgroundColor: '#ffd1a9',
      color: 'white',
      transform: 'translateY(-2px)',
    },
    emotionButtonSelected: {
      backgroundColor: '#ffa07a',
      color: 'white',
      borderColor: '#ff7f50',
      boxShadow: '0 0 8px rgba(255, 127, 80, 0.4)',
    },
    emotionButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    entryEmotion: {
      fontSize: '0.875rem',
      color: '#4a5568',
      marginTop: '5px',
    },
    dayNumber: {
      fontWeight: 'bold',
    },
  };
  
  return (
    <div style={calendarStyles.container}>
      <div style={calendarStyles.header}>
        <button 
          onClick={() => setCurrentDate(new Date(year, month - 1))}
          style={calendarStyles.button}
        >
          &lt;
        </button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {year}</h2>
        <button 
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          style={calendarStyles.button}
        >
          &gt;
        </button>
      </div>

      <div style={calendarStyles.grid}>
        {DAYS.map(day => (
          <div key={day} style={{ textAlign: 'center', padding: '0.5rem' }}>
            {day.slice(0, 3)}
          </div>
        ))}
        
        {Array(firstDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = getEntryForDate(new Date(year, month, day));
          const isExpanded = expandedDay === dateKey;

          return (
            <div
              key={day}
              onClick={() => setExpandedDay(isExpanded ? null : dateKey)}
              style={{
                ...calendarStyles.day,
                ...(isExpanded && calendarStyles.dayExpanded),
                backgroundColor: entry ? '#ebf5ff' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{day}</span>
                {entry && (
                  <div style={{ fontSize: '0.875rem', color: '#4a5568' }}>
                    {entry.emotion}
                  </div>
                )}
              </div>

              {isExpanded && (
                <div 
                  style={calendarStyles.expandedContent} 
                  onClick={handleExpandedClick}
                >
                  <input
                    type="text"
                    value={note}
                    onChange={handleInputChange}
                    placeholder="Add a note (max 30 chars)"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.25rem',
                      marginBottom: '1rem'
                    }}
                  />

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(selectedEmotions[dateKey]?.secondary 
                      ? emotions.tertiary 
                      : selectedEmotions[dateKey]?.primary 
                        ? emotions.secondary 
                        : emotions.primary
                    ).map(emotion => (
                      <button
                        key={emotion}
                        onClick={(e) => handleEmotionSelect(
                          emotion,
                          selectedEmotions[dateKey]?.secondary 
                            ? 'tertiary' 
                            : selectedEmotions[dateKey]?.primary 
                              ? 'secondary' 
                              : 'primary',
                          e
                        )}
                        disabled={selectedEmotions[dateKey]?.secondary && !note.trim()}
                        style={{
                          ...calendarStyles.emotionButton,
                          opacity: (selectedEmotions[dateKey]?.secondary && !note.trim()) ? 0.5 : 1
                        }}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;