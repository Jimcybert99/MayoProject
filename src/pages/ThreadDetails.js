import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ThreadDetail.css';

function ThreadDetail() {
  const { id } = useParams();

  // Dummy data 
  const thread = {
    id,
    title: "We are working on this project",
    author: "raulBravo",
    date: "Mar 28, 2018",
    content: "I am hoping someone can help me with this. I am not trying to work on the project",
    likes: 12
  };

  const [userLiked, setUserLiked] = useState(false);
  const [threadLikes, setThreadLikes] = useState(thread.likes);
  const [replies, setReplies] = useState([
    {
      id: 1,
      user: "littleonefmohio",
      date: "Apr 2, 2018",
      message: "Who are you talking to? There are no users here",
      likes: 2
    },
    {
      id: 2,
      user: "Merry, Alumni Mentor",
      date: "Apr 2, 2018",
      message: "Dude how tf did you make a post here? functionality is not there yet",
      likes: 3
    }
  ]);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    if (!userLiked) {
      setThreadLikes(threadLikes + 1);
      setUserLiked(true);
    }
  };

  const handleReplyLike = (id) => {
    setReplies((prev) =>
      prev.map((reply) =>
        reply.id === id && !reply.userLiked
          ? { ...reply, likes: reply.likes + 1, userLiked: true }
          : reply
      )
    );
  };

  const handlePostComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: replies.length + 1,
        user: "You",
        date: "Just now",
        message: comment,
        likes: 0
      };
      setReplies([...replies, newComment]);
      setComment('');
    }
  };

  return (
    <div className="thread-detail">
      <div className="thread-post">
        <h2>{thread.title}</h2>
        <p className="meta">
          Posted by <strong>{thread.author}</strong> on {thread.date}
        </p>
        <p>{thread.content}</p>

        <button className="comment-btn">Comment</button>
        <button className="like-btn" onClick={handleLike} disabled={userLiked}>
          👍 Like ({threadLikes})
        </button>
      </div>

      <div className="replies-section">
        <h3>Replies</h3>
        {replies.map((reply) => (
          <div className="reply-card" key={reply.id}>
            <p className="meta">
              <strong>{reply.user}</strong> — {reply.date}
            </p>
            <p>{reply.message}</p>
            <button
              className="like-btn"
              onClick={() => handleReplyLike(reply.id)}
              disabled={reply.userLiked}
            >
              👍 Like ({reply.likes})
            </button>
          </div>
        ))}

        <div className="comment-box">
          <h4>Add a comment</h4>
          <textarea
            placeholder="Write your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button onClick={handlePostComment} className="post-btn">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThreadDetail;
