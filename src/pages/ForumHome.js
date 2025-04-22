import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ForumHome.css';
import RecentlyViewedSidebar from '../components/RecentlyViewedSidebar';
import NewThreadModal from '../components/NewThreadModal';
import axios from 'axios';

function ForumHome() {
  const [discussions, setDiscussions] = useState([]);
  const [sortOption, setSortOption] = useState('date');
  const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch discussions when component mounts
  useEffect(() => {
    axios.get('http://localhost:5001/api/discussions')
      .then(response => setDiscussions(response.data))
      .catch(error => console.error('Error fetching discussions:', error));
  }, []);

    // Submit new discussion to backend
  const handlePostDiscussion = async (newPost) => {
    try {
      const response = await axios.post('http://localhost:5001/api/discussion', {
        user: newPost.user || 'Anonymous',
        title: newPost.title,
        content: newPost.content
      });
      if (response.status === 201) {
        setDiscussions([response.data, ...discussions]);
      }
    } catch (error) {
      console.error('Error posting discussion:', error.message);
      if (error.response) {
        console.error('Backend error:', error.response.data);
      }
    }
  };

  const handleViewThread = (id, title) => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const updated = [
      { id, title },
      ...viewed.filter((item) => item.id !== id)
    ].slice(0, 5); // Max 5 items
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };
  
  
  return (
    <div className="forum-home">
      <div className="forum-body">
        <RecentlyViewedSidebar />

        <div className="discussions-list">
          <NewThreadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPost={handlePostDiscussion}
          />

          <div className="forum-header">
          <button className="start-discussion-btn" onClick={() => setIsModalOpen(true)}>
            Start a discussion
          </button>

            <input
              type="text"
              placeholder="Search discussions"
              className="search-input"
            />
            <select
              className="sort-dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="unanswered">Unanswered</option>
              <option value="date">By Date</option>
              <option value="alphabetical">Alphabetically</option>
            </select>
          </div>

          <div className="discussions-header">
            <span className="title-col">Title</span>
            <span className="replies-col">Replies</span>
            <span className="likes-col">Likes</span>
            <span className="activity-col">Activity</span>
          </div>

          {discussions.map((d) => (
            <div className="discussion-card" key={d.id}>
              <span className="title-col">
              <Link
               to={`/thread/${d.id}`}
               onClick={() => handleViewThread(d.id, d.title)}
              >
                {d.title}
              </Link>

              </span>
              <span className="replies-col">{d.replies}</span>
              <span className="likes-col">{d.likes}</span>
              <span className="activity-col">{d.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForumHome;