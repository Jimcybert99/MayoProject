import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForumHome from './pages/ForumHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ForumHome />} />
      </Routes>
    </Router>
  );
}

export default App;
