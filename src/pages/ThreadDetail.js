import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ThreadDetail.css';
import axios from 'axios';
import RecentlyViewedSidebar from '../components/RecentlyViewedSidebar';

function ThreadDetail({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [comment, setComment] = useState('');
  const commentBoxRef = useRef(null);
  const [userLiked, setUserLiked] = useState(false);
  const [threadLikes, setThreadLikes] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const postMenuRef = useRef();
  const commentMenuRef = useRef();

  // Fetch thread + replies
  useEffect(() => {
    axios.get(`http://localhost:5001/api/discussion/${id}`)
      .then(res => {
        setThread(res.data.discussion);
        setReplies(res.data.comments);
      })
      .catch(err => console.error('Error fetching thread:', err));
  }, [id]);

  // Initialize like count
  useEffect(() => {
    if (thread) setThreadLikes(thread.likes);
  }, [thread]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        postMenuRef.current && !postMenuRef.current.contains(e.target) &&
        commentMenuRef.current && !commentMenuRef.current.contains(e.target)
      ) {
        setIsPostMenuOpen(false);
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Like a thread
  const handleLike = () => {
    if (!userLiked) {
      axios.post(`http://localhost:5001/api/discussion/${id}/like`)
        .then(() => {
          setThreadLikes(prev => prev + 1);
          setUserLiked(true);
        })
        .catch(err => console.error('Error liking thread:', err));
    }
  };

  // Like a comment
  const handleReplyLike = replyId => {
    axios.post(`http://localhost:5001/api/comment/${replyId}/like`)
      .then(() => {
        setReplies(prev =>
          prev.map(r =>
            r.id === replyId && !r.userLiked
              ? { ...r, likes: r.likes + 1, userLiked: true }
              : r
          )
        );
      })
      .catch(err => console.error('Error liking comment:', err));
  };

  // Post a new comment
  const handlePostComment = () => {
    if (!sessionStorage.getItem('loggedIn')) {
      alert('You must be logged in to post a comment.');
      return;
    }
    if (comment.trim()) {
      axios.post('http://localhost:5001/api/comment', {
        discussion_id: id,
        user: currentUser.name,
        message: comment
      })
      .then(() => {
        // refetch all comments from the server so we get the true IDs & owner fields
        return axios.get(`http://localhost:5001/api/discussion/${id}`);
      })
      .then(res => {
        setReplies(res.data.comments);
        setComment('');
      })
      .catch(err => console.error('Error posting or fetching comments:', err));
    }
  };

  // Toggle reply menu
  const toggleCommentMenu = replyId => {
    setOpenMenuId(prev => (prev === replyId ? null : replyId));
  };

  // Toggle post menu
  const togglePostMenu = () => {
    setIsPostMenuOpen(prev => !prev);
  };

  // Delete the thread (owner or admin)
  const handleDeleteThread = async threadId => {
    if (!window.confirm('Delete this discussion?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/discussion/${threadId}`, {
        headers: {
          'X-Admin-Token': sessionStorage.getItem('adminToken') || '',
          'X-Username': currentUser.name
        }
      });
      // clean up recently viewed
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      localStorage.setItem('recentlyViewed',
        JSON.stringify(viewed.filter(v => v.id !== threadId))
      );
      navigate('/');
    } catch (err) {
      console.error('Failed to delete thread:', err);
    }
  };

  // Delete a comment (owner or admin)
  const handleDeleteComment = async commentId => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const headers = {
        'X-Admin-Token': sessionStorage.getItem('adminToken') || '',
        'X-Username': currentUser.name
      };
      console.log('🔍 Deleting comment with headers:', headers, 'commentId=', commentId);

      await axios.delete(
        `http://localhost:5001/api/comment/${commentId}`,
        {
          headers: {
            'X-Admin-Token': sessionStorage.getItem('adminToken') || '',
            'X-Username':   currentUser.name
          }
        }
      );

      // on success, remove locally (if you weren’t doing this already)
      setReplies(prev => prev.filter(r => r.id !== commentId));

    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };


  const scrollToCommentBox = () => {
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const textarea = commentBoxRef.current.querySelector('textarea');
      textarea?.focus();
    }
  };

  if (!thread) return <p>Loading...</p>;

  return (
    <div className="thread-page">
      <div className="thread-content">
        <div className="thread-detail">
          <div className="thread-post">
            <h1 className="thread-title">{thread.title}</h1>
            {(currentUser.role === 'admin' || currentUser.name === thread.user) && (
              <div className="post-menu" ref={postMenuRef}>
                <button className="menu-icon" onClick={togglePostMenu}>⋮</button>
                {isPostMenuOpen && (
                  <div className="menu-options">
                    <button onClick={() => alert('Edit thread coming soon')}>Edit</button>
                    <button onClick={() => handleDeleteThread(thread.id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
            <p className="meta">
              Posted by <strong>{thread.user}</strong> on {thread.date}
            </p>
            <p>{thread.content}</p>
            <button
              className="comment-btn"
              onClick={scrollToCommentBox}
            >
              Comment
            </button>
            <button className="like-btn" onClick={handleLike} disabled={userLiked}>
              Like ({threadLikes})
            </button>
          </div>

          <div className="replies-section">
            <h3>Replies</h3>
            {replies.map(reply => (
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
                {(currentUser.role === 'admin'
                  || currentUser.name === reply.user
                  || currentUser.name === thread.user) && (
                  <div className="post-menu" ref={openMenuId === reply.id ? commentMenuRef : null}>
                    <button
                      className="menu-icon"
                      onClick={() => toggleCommentMenu(reply.id)}
                    >
                      ⋮
                    </button>
                    {openMenuId === reply.id && (
                      <div className="menu-options">
                        <button onClick={() => alert('Edit comment coming soon')}>Edit</button>
                        <button
                          onClick={() => {
                            console.log('🛑 Delete button clicked for comment', reply.id);
                            handleDeleteComment(reply.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div 
            className="comment-box"
              ref={commentBoxRef} 
            >
              <h4>Add a comment</h4>
              <textarea
                placeholder="Write your comment here..."
                value={comment}
                onChange={e => setComment(e.target.value)}
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

