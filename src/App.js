import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForumHome from './pages/ForumHome';
import ThreadDetail from './pages/ThreadDetail';
import MoodJournal  from './pages/MoodJournal';

function App() {
  //Shared currentUser state across pages
  const [currentUser, setCurrentUser] = useState({ name: "user", role: "user" });

  return (
    <Router>
      <Routes>
        {/*Pass currentUser and setCurrentUser to ForumHome*/}
        <Route path="/" element={
          <ForumHome currentUser={currentUser} setCurrentUser={setCurrentUser} />
        } />

        {/*Pass currentUser to ThreadDetail*/}
        <Route path="/thread/:id" element={
          <ThreadDetail currentUser={currentUser} />
        } />

        {/* mood-journal page */}
        <Route path="/mood" element={
          <MoodJournal />
        } />
      </Routes>
    </Router>
  );
}

export default App;
