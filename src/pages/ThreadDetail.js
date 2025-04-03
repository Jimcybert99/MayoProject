import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ThreadDetail.css';
import axios from "axios";
import TopicSidebar from '../components/TopicSidebar';

function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    axios.get(`http://localhost:5000/api/discussion/${id}`)
      .then(response => {
        setThread(response.data.discussion);
        setReplies(response.data.comments);
        setThreadLikes(response.data.discussion.likes); //update when data arrives
      })
      .catch(error => console.error('Error fetching thread:', error));
  }, [id]);
  

  const [userLiked, setUserLiked] = useState(false);
  const [threadLikes, setThreadLikes] = useState(0);
    

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
      fetch('http://localhost:5000/api/comment', {
        method: 'POST',
        body: JSON.stringify({ discussion_id: id, user: 'You', message: comment }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(() => {
        setReplies([...replies, { id: replies.length + 1, user: "You", date: "Just now", message: comment, likes: 0 }]);
        setComment('');
      })
      .catch(error => console.error('Error posting comment:', error));
    }
  };

  return (
    <div className="thread-page">
        <div className="thread-content">
            <div className="thread-detail">
              
            {thread ? (
              <div className="thread-post">
                <h1 className="thread-title">{thread.title}</h1>
                <p className="meta">
                  Posted by <strong>{thread.user}</strong> on {thread.created_at}
                </p>
                <p>{thread.content}</p>

                <button className="comment-btn">Comment</button>
                <button className="like-btn" onClick={handleLike} disabled={userLiked}>
                  Like ({threadLikes})
                </button>
              </div>
            ) : (
              <p>Loading post...</p>
            )}


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
                            Like ({reply.likes})
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

            <div className="thread-sidebar">
                <TopicSidebar />
            </div>
        </div>
    </div>

    );
}

export default ThreadDetail;
