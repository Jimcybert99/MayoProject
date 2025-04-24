import React, { useState, useEffect } from 'react';
import './MoodJournal.css';

function MoodJournal() {
  const [moodHistory, setMoodHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('moodHistory')) || [];
  });
  const [currentMood, setCurrentMood] = useState('');
  const [currentRating, setCurrentRating] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState('selectMood');

  const handleMoodClick = (mood) => {
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
    if (!reason.trim()) {
      alert("Please enter a reason for how you're feeling.");
      return;
    }
    const entry = {
      mood: currentMood,
      rating: currentRating,
      reason,
      date: new Date().toLocaleString()
    };
    const updatedHistory = [...moodHistory, entry];
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    setStep('selectMood');
    setCurrentMood('');
    setCurrentRating('');
    setReason('');
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your mood history?")) {
      setMoodHistory([]);
      localStorage.removeItem('moodHistory');
    }
  };

  return (
    <div className="mood-journal">
      <h1>How are you feeling today?</h1>
      {step === 'selectMood' && (
        <div className="mood-buttons">
          {['Happy', 'Sad', 'Angry', 'Neutral', 'Excited', 'Nervous'].map((mood) => (
            <button key={mood} className={mood.toLowerCase()} onClick={() => handleMoodClick(mood)}>
              {mood}
            </button>
          ))}
        </div>
      )}

      {step === 'rateMood' && (
        <div className="rating">
          <label>Rate your mood (1-10): </label>
          <input
            type="number"
            min="1"
            max="10"
            value={currentRating}
            onChange={(e) => setCurrentRating(e.target.value)}
          />
          <button onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
      )}

      {step === 'reasonMood' && (
        <div className="reason">
          <label>Why do you feel that way?</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            cols="50"
            placeholder="Enter your reason here..."
          ></textarea>
          <button onClick={handleReasonSubmit}>Submit Reason</button>
        </div>
      )}

      <h2>Your Mood History</h2>
      <ul className="mood-history">
        {moodHistory.map((entry, index) => (
          <li key={index}>
            {`${entry.mood} (Rating: ${entry.rating}) - ${entry.reason} - ${entry.date}`}
          </li>
        ))}
      </ul>

      {moodHistory.length > 0 && (
        <button className="clear-button" onClick={clearHistory}>Clear History</button>
      )}
    </div>
  );
}

export default MoodJournal;

