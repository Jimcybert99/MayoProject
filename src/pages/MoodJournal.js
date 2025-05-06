import React, { useState, useEffect } from 'react';
import './MoodJournal.css';

export default function MoodJournal() {
  // the usual flows
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentMood, setCurrentMood] = useState('');
  const [currentRating, setCurrentRating] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState('selectMood');

  // calendar state
  const [calendarEntries, setCalendarEntries] = useState([]);      // entries for the selected date
  const [viewDate, setViewDate] = useState(null);                  // YYYY-MM-DD
  const [currentDate, setCurrentDate] = useState(new Date());      // controls which month is shown

  // helper to format Date → "YYYY-MM-DD"
  const getDateKey = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // load all history on mount
  useEffect(() => {
    fetch("http://localhost:5001/api/moods")
      .then(r => r.json())
      .then(setMoodHistory)
      .catch(console.error);
  }, []);

  // move calendar month
  const prevMonth = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  // when you click a day
  const handleDayClick = date => {
    const key = getDateKey(date);
    fetch(`http://localhost:5001/api/moods?date=${key}`)
      .then(r => r.json())
      .then(data => {
        setCalendarEntries(data);
        setViewDate(key);
      })
      .catch(console.error);
  };

  // === existing UI flows ===

  const handleMoodClick = mood => {
    setCurrentMood(mood);
    setStep('rateMood');
  };

  const handleRatingSubmit = () => {
    if (currentRating < 1 || currentRating > 10) {
      alert("Please enter a rating between 1 and 10.");
      return;
    }
    setStep('reasonMood');
  };

  const handleReasonSubmit = () => {
    if (!sessionStorage.getItem('loggedIn')) {
      alert('You must be logged in to submit your mood.');
      return;
    }
    if (!reason.trim()) {
      alert("Please enter a reason for how you're feeling.");
      return;
    }
    const entry = { mood: currentMood, rating: +currentRating, reason };
    fetch("http://localhost:5001/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    })
      .then(r => {
        if (!r.ok) throw new Error("save failed");
        return r.json();
      })
      .then(() => {
        setStep('selectMood');
        setCurrentMood('');
        setCurrentRating('');
        setReason('');
        // reload full history and clear any date‐view
        return fetch("http://localhost:5001/api/moods");
      })
      .then(r => r.json())
      .then(data => {
        setMoodHistory(data);
        setViewDate(null);
      })
      .then(() => alert("Mood entry saved!"))
      .catch(err => {
        console.error(err);
        alert("There was a problem saving your mood.");
      });
  };

  const clearHistory = () => {
    if (!sessionStorage.getItem('loggedIn')) {
      alert('You must be logged in to clear history.');
      return;
    }
    if (!window.confirm("Clear all mood history?")) return;
    fetch("http://localhost:5001/api/moods", { method: "DELETE" })
      .then(r => {
        if (!r.ok) throw new Error("clear failed");
        return r.json();
      })
      .then(() => {
        setMoodHistory([]);
        setViewDate(null);
        alert("Mood history cleared.");
      })
      .catch(err => {
        console.error(err);
        alert("There was a problem clearing your mood history.");
      });
  };

  // === render ===
  // build calendar blanks + days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="mood-journal">
      {/* =========== 1) STEP FLOWS =========== */}
      <h2>How are you feeling today?</h2>
      {step === 'selectMood' && (
        <div className="mood-buttons">
          {['Happy','Sad','Angry','Neutral','Excited','Nervous'].map(m => (
            <button
              key={m}
              className={m.toLowerCase()}
              onClick={()=>handleMoodClick(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}
      {step === 'rateMood' && (
        <div className="rating">
          <label>Rate your mood (1-10):</label>
          <input
            type="number" min="1" max="10"
            value={currentRating}
            onChange={e => setCurrentRating(e.target.value)}
          />
          <button onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
      )}
      {step === 'reasonMood' && (
        <div className="reason">
          <label>Why do you feel that way?</label>
          <textarea
            rows="4" cols="50"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Enter your reason here…"
          />
          <button onClick={handleReasonSubmit}>Submit Reason</button>
        </div>
      )}

      {/* =========== 2) CALENDAR =========== */}
      <h2>Your daily record</h2>
      <div id="calendar">
        <div id="monthYear" className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <span id="monthYearText">
            {currentDate.toLocaleString('default',{month:'long'})} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div id="calendarWeekdays" className="calendar-days-header">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div id="calendarDays" className="calendar-grid">
          {Array(firstDay).fill(null).map((_,i) => <div key={"b"+i}/>)}
          {Array.from({length: totalDays},(_,i)=>i+1).map(day => {
            const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            return (
              <div key={day} onClick={()=>handleDayClick(dt)}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========== 3) HISTORY =========== */}
      {viewDate ? (
        <>
          <h2>Entries on {viewDate}</h2>
          <ul className="mood-history">
            {calendarEntries.map((e,i) => (
              <li key={i}>
                {`${e.mood} (Rating: ${e.rating}) — ${e.reason} — ${new Date(e.date).toLocaleTimeString()}`}
              </li>
            ))}
          </ul>
          <button className="clear-button" onClick={()=>setViewDate(null)}>
            Back to full history
          </button>
        </>
      ) : (
        <>
          <h2>Your Mood History</h2>
          <ul className="mood-history">
            {moodHistory.map((entry,i) => (
              <li key={i}>
                {`${new Date(entry.date).toLocaleDateString()}: ${entry.mood} (Rating: ${entry.rating}) — ${entry.reason}`}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* =========== 4) CLEAR BUTTON =========== */}
      {!viewDate && moodHistory.length > 0 && (
        <button className="clear-button" onClick={clearHistory}>
          Clear History
        </button>
      )}
    </div>
  );

}




