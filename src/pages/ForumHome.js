import React, { useState } from 'react';
import './ForumHome.css';
import TopicSidebar from '../components/TopicSidebar';

function ForumHome() {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      topic: 'topic 1',
      title: 'I am not creative with titles',
      replies: 12,
      likes: 5,
      activity: '48s'
    },
    {
      id: 2,
      topic: 'topic 2',
      title: 'How can I be happy? Please reply',
      replies: 8,
      likes: 3,
      activity: '2m'
    },
    {
      id: 3,
      topic: 'topic 3',
      title: 'How can I pay Taxes?',
      replies: 0,
      likes: 0,
      activity: '5m'
    }
  ]);

  const [sortOption, setSortOption] = useState('date');

  
  return (
    <div className="forum-home">
      <div className="forum-body">
        <TopicSidebar />

        <div className="discussions-list">
          <div className="forum-header">
            <button className="start-discussion-btn">Start a discussion</button>
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
            <span className="topic-col">Topic</span>
            <span className="title-col">Title</span>
            <span className="replies-col">Replies</span>
            <span className="likes-col">Likes</span>
            <span className="activity-col">Activity</span>
          </div>

          {discussions.map((d) => (
            <div className="discussion-card" key={d.id}>
              <span className="topic-col">{d.topic}</span>
              <span className="title-col">{d.title}</span>
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