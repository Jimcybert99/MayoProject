import React, { useState } from 'react';
import './App.css';

const initialPosts = [
  { id: 1, title: "First Post", content: "This is the first post!", likes: 0, dislikes: 0, comments: [] },
  { id: 2, title: "Second Post", content: "This is the second post!", likes: 0, dislikes: 0, comments: [] },
  { id: 3, title: "Third Post", content: "This is the third post!", likes: 0, dislikes: 0, comments: [] },
  { id: 4, title: "Fourth Post", content: "This is the fourth post!", likes: 0, dislikes: 0, comments: [] },
  { id: 5, title: "Fifth Post", content: "This is the fifth post!", likes: 0, dislikes: 0, comments: [] },
  { id: 6, title: "Sixth Post", content: "This is the sixth post!", likes: 0, dislikes: 0, comments: [] },
];

const initialSocialGroups = [
  { id: 1, name: "Tech Enthusiasts" },
  { id: 2, name: "Music Lovers" },
  { id: 3, name: "Sports Fans" },
  { id: 4, name: "Travel Explorers" },
  { id: 5, name: "Foodies" },
  { id: 6, name: "Book Club" },
];

const POSTS_PER_PAGE = 6;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);
  const [socialGroups, setSocialGroups] = useState(initialSocialGroups);

  // Form data states for creating new group and post
  const [newGroupName, setNewGroupName] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const getPaginatedPosts = () => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    return posts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const handleLike = (id) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDislike = (id) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return { ...post, dislikes: post.dislikes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleComment = (id, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        const newComments = post.comments ? [...post.comments, comment] : [comment];
        return { ...post, comments: newComments };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  // Handle creating a new group
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: socialGroups.length + 1,
        name: newGroupName
      };
      setSocialGroups([...socialGroups, newGroup]);
      setNewGroupName(""); // Reset input
    }
  };

  // Handle creating a new post
  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        title: newPostTitle,
        content: newPostContent,
        likes: 0,
        dislikes: 0,
        comments: []
      };
      setPosts([...posts, newPost]);
      setNewPostTitle(""); // Reset input
      setNewPostContent(""); // Reset input
    }
  };

  return (
    <div className="App">
      <div className="container">
        {/* Left Column for Social Groups */}
        <div className="social-groups">
          <h2>Social Groups</h2>
          <ul>
            {socialGroups.map(group => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>

          {/* Form to Create a New Group */}
          <div className="create-group">
            <input
              type="text"
              placeholder="New Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button onClick={handleCreateGroup}>Create Group</button>
          </div>
        </div>

        {/* Right Column for Posts */}
        <div className="posts-column">
          <h1>Forum</h1>

          {/* Form to Create a New Post */}
          <div className="create-post">
            <input
              type="text"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <textarea
              placeholder="Post Content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            <button onClick={handleCreatePost}>Create Post</button>
          </div>

          {/* Display the posts */}
          <div className="posts">
            {getPaginatedPosts().map(post => (
              <div key={post.id} className="post">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                
                {/* Like and Dislike Buttons */}
                <div className="post-actions">
                  <button onClick={() => handleLike(post.id)} className="like-btn">
                    Like {post.likes}
                  </button>
                  <button onClick={() => handleDislike(post.id)} className="dislike-btn">
                    Dislike {post.dislikes}
                  </button>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                  <h3>Comments</h3>
                  <ul>
                    {post.comments && post.comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleComment(post.id, e.target.value);
                        e.target.value = ''; // Clear input after comment
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;