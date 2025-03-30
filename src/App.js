import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForumHome from './pages/ForumHome';
import ThreadDetail from './pages/ThreadDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ForumHome />} />
        <Route path="/thread/:id" element={<ThreadDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
