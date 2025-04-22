import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecentlyViewedSidebar.css'; // reuse styles

function RecentlyViewedSidebar() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setRecent(viewed);
  }, []);

  return (
    <div className="topics-sidebar">
      <h3>Recently Viewed</h3>
      <ul>
        {recent.length === 0 ? (
          <li style={{ color: '#777' }}>No threads yet</li>
        ) : (
          recent.map((thread) => (
            <li key={thread.id}>
              <Link to={`/thread/${thread.id}`} style={{ textDecoration: 'none', color: '#005eb8' }}>
                {thread.title}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default RecentlyViewedSidebar;
