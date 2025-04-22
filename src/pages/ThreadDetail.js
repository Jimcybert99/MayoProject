import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ThreadDetail.css';
import axios from 'axios';
import RecentlyViewedSidebar from '../components/RecentlyViewedSidebar';

const currentUser = { name: "Gabriel", role: "admin" }; // or "user"

function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [comment, setComment] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  const [threadLikes, setThreadLikes] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);

  const postMenuRef = useRef();
  const commentMenuRef = useRef();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/discussion/${id}`)
      .then(response => {
        setThread(response.data.discussion);
        setReplies(response.data.comments);
      })
      .catch(error => console.error('Error fetching thread:', error));
  }, [id]);

  useEffect(() => {
    if (thread) {
      setThreadLikes(thread.likes);
    }
  }, [thread]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        postMenuRef.current && !postMenuRef.current.contains(event.target) &&
        commentMenuRef.current && !commentMenuRef.current.contains(event.target)
      ) {
        setIsPostMenuOpen(false);
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLike = () => {
    if (!userLiked) {
      axios.post(`http://localhost:5001/api/discussion/${id}/like`)
        .then(() => {
          setThreadLikes(prev => prev + 1);
          setUserLiked(true);
        })
        .catch(error => console.error('Error liking thread:', error));
    }
  };

  const handleReplyLike = (replyId) => {
    axios.post(`http://localhost:5001/api/comment/${replyId}/like`)
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

  const handlePostComment = () => {
    if (comment.trim()) {
      axios.post('http://localhost:5001/api/comment', {
        discussion_id: id,
        user: currentUser.name,
        message: comment
      })
        .then(() => {
          const newComment = {
            id: replies.length + 1,
            user: currentUser.name,
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

  const toggleCommentMenu = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  const togglePostMenu = () => {
    setIsPostMenuOpen(prev => !prev);
  };

  const handleDeleteThread = async (threadId) => {
    const confirm = window.confirm("Delete this discussion?");
    if (confirm) {
      try {
        await axios.delete(`http://localhost:5001/api/discussion/${threadId}`);
        navigate("/");
      } catch (err) {
        console.error("Failed to delete thread:", err);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = window.confirm("Delete this comment?");
    if (confirm) {
      try {
        await axios.delete(`http://localhost:5001/api/comment/${commentId}`);
        setReplies(prev => prev.filter(reply => reply.id !== commentId));
      } catch (err) {
        console.error("Failed to delete comment:", err);
      }
    }
  };

  if (!thread) return <p>Loading...</p>;

  return (
    <div className="thread-page">
      <div className="thread-content">
        <div className="thread-detail">
          <div className="thread-post">
            <h1 className="thread-title">{thread.title}</h1>
            {(currentUser.role === "admin" || currentUser.name === thread.user) && (
              <div className="post-menu" ref={postMenuRef}>
                <button className="menu-icon" onClick={togglePostMenu}>⋮</button>
                {isPostMenuOpen && (
                  <div className="menu-options">
                    <button onClick={() => alert("Edit thread coming soon")}>Edit</button>
                    <button onClick={() => handleDeleteThread(thread.id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
            <p className="meta">
              Posted by <strong>{thread.user}</strong> on {thread.date}
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
                {(currentUser.role === "admin" || currentUser.name === reply.user || currentUser.name === thread.user) && (
                  <div className="post-menu">
                    <button
                      className="menu-icon"
                      onClick={() => setOpenMenuId(prev => (prev === reply.id ? null : reply.id))}
                    >
                      ⋮
                    </button>
                    {openMenuId === reply.id && (
                      <div className="menu-options">
                        <button onClick={() => alert("Edit comment coming soon")}>Edit</button>
                        <button onClick={() => handleDeleteComment(reply.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
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
          <RecentlyViewedSidebar />
        </div>
      </div>
    </div>
  );
}

export default ThreadDetail;
