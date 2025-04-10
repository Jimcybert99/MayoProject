import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ThreadDetail.css';
import axios from 'axios';
import TopicSidebar from '../components/TopicSidebar';

function ThreadDetail() {

  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [comment, setComment] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  const [threadLikes, setThreadLikes] = useState(0);

    // Fetch discussion and its comments
  useEffect(() => {
    axios.get(`http://localhost:5000/api/discussion/${id}`)
      .then(response => {
        setThread(response.data.discussion);
        setReplies(response.data.comments);
      })
      .catch(error => console.error('Error fetching thread:', error));
  }, [id]);

    // Update likes when thread data is available
  useEffect(() => {
    if (thread) {
      setThreadLikes(thread.likes);
    }
  }, [thread]);

    // Handle thread like
  const handleLike = () => {
    if (!userLiked) {
      axios.post(`http://localhost:5000/api/discussion/${id}/like`)
        .then(() => {
          setThreadLikes(prev => prev + 1);
          setUserLiked(true);
        })
        .catch(error => console.error('Error liking thread:', error));
    }
  };

    // Handle comment like
  const handleReplyLike = (replyId) => {
    axios.post(`http://localhost:5000/api/comment/${replyId}/like`)
      .then(() => {
        setReplies(prev =>
          prev.map(reply =>
            reply.id === replyId && !reply.userLiked
              ? { ...reply, likes: reply.likes + 1, userLiked: true }
              : reply
          )
        );
      })
      .catch(error => console.error('Error liking comment:', error));
  };

    // Handle posting a new comment
  const handlePostComment = () => {
    if (comment.trim()) {
      axios.post('http://localhost:5000/api/comment', {
        discussion_id: id,
        user: 'Anonymous',
        message: comment
      })
        .then(() => {
          const newComment = {
            id: replies.length + 1,
            user: 'Anonymous',
            date: 'Just now',
            message: comment,
            likes: 0
          };
          setReplies([...replies, newComment]);
          setComment('');
        })
        .catch(error => console.error('Error posting comment:', error));
    }
  };

  if (!thread) return <p>Loading...</p>;


  return (
    <div className="thread-page">
        <div className="thread-content">
            <div className="thread-detail">
                <div className="thread-post">
                    <h1 className="thread-title">{thread.title}</h1>
                    <p className="meta">
                    Posted by <strong>{thread.author}</strong> on {thread.date}
                    </p>
                    <p>{thread.content}</p>

                    <button className="comment-btn">Comment</button>
                    <button className="like-btn" onClick={handleLike} disabled={userLiked}>
                        Like ({threadLikes})
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
