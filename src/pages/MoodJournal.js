import React, { useState, useEffect } from 'react';
import './MoodJournal.css';

function MoodJournal() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentMood, setCurrentMood] = useState('');
  const [currentRating, setCurrentRating] = useState('');
  const [reason, setReason] = useState('');
  const [step, setStep] = useState('selectMood');

  const loadMoodHistory = () => {
    fetch("http://localhost:5001/api/moods")
      .then(res => res.json())
      .then(data => setMoodHistory(data))
      .catch(err => console.error("Failed to load mood history:", err));
  };

  useEffect(() => {
    loadMoodHistory();
    fetch("http://localhost:5001/api/moods")
      .then(res => res.json())
      .then(data => setMoodHistory(data))
      .catch(err => console.error("Failed to load mood history:", err));
  }, []);
  

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

    if (!sessionStorage.getItem('loggedIn')) {
      alert('You must be logged in to submit your mood.');
      return;
    }

    if (!reason.trim()) {
      alert("Please enter a reason for how you're feeling.");
      return;
    }
  
    const entry = {
      mood: currentMood,
      rating: parseInt(currentRating),
      reason,
      date: new Date().toISOString()  // Send ISO date string
    };
  
    // Send the entry to the Flask backend
    fetch("http://localhost:5001/api/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to save mood entry.");
        return response.json();
      })
      .then(() => {
        setStep("selectMood");
        setCurrentMood("");
        setCurrentRating("");
        setReason("");
        loadMoodHistory();
        alert("Mood entry saved successfully!");
      })
      .catch(error => {
        console.error("Error saving mood entry:", error);
        alert("There was a problem saving your mood.");
      });
  };
  
  const clearHistory = () => {

    if (!sessionStorage.getItem('loggedIn')) {
      alert('You must be logged in to clear history.');
      return;
    }

    if (window.confirm("Are you sure you want to clear your mood history?")) {
      fetch("http://localhost:5001/api/moods", {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(() => {
        setMoodHistory([]);
        alert("Mood history cleared.");
      })
      .catch(err => {
        console.error("Error clearing mood history:", err);
        alert("There was a problem clearing your mood history.");
      });
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

