import React from 'react';
import './TopicSidebar.css';

function TopicSidebar() {
  const topics = [
    "Topic 1",
    "Topic 2",
    "Topic 3",
    "Topic 4",
    "Topic 5"
  ];

  return (
    <div className="topics-sidebar">
      <h3>Topics</h3>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopicSidebar;
