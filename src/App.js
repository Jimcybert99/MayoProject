import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForumHome from './pages/ForumHome';
import ThreadDetail from './pages/ThreadDetail';
import MoodJournal from './pages/MoodJournal';

function App() {
  // Shared currentUser state across pages, initialized from sessionStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const name = sessionStorage.getItem('username') || 'Anonymous';
    const role = sessionStorage.getItem('role') || 'user';
    return { name, role };
  });

  return (
    <Router>
      <Routes>
        {/* Pass currentUser and setCurrentUser to ForumHome */}
        <Route
          path="/"
          element={
            <ForumHome
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        {/* Pass currentUser to ThreadDetail */}
        <Route
          path="/thread/:id"
          element={<ThreadDetail currentUser={currentUser} />}
        />

        {/* Mood Journal page */}
        <Route path="/mood" element={<MoodJournal />} />
      </Routes>
    </Router>
  );
}

export default App;
