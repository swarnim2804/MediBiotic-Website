import React, { useState, useEffect } from "react";
import "./CommunityForum.css";

function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({ title: "", content: "", user: "" });
  const [commentData, setCommentData] = useState("");

  // Load posts from Local Storage on component mount
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("communityPosts")) || [];
    setPosts(storedPosts);
  }, []);

  // Save posts to Local Storage when posts state changes
  useEffect(() => {
    localStorage.setItem("communityPosts", JSON.stringify(posts));
  }, [posts]);

  // Create new post
  const handleCreatePost = () => {
    if (!postData.title || !postData.content || !postData.user) {
      alert("Please fill out all fields");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: postData.title,
      content: postData.content,
      user: postData.user,
      createdAt: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostData({ title: "", content: "", user: "" });
  };

  // Delete post
  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
  };

  // Like/Dislike post
  const handleReaction = (id, type) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        return {
          ...post,
          likes: type === "like" ? post.likes + 1 : post.likes,
          dislikes: type === "dislike" ? post.dislikes + 1 : post.dislikes,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  // Add comment to post
  const handleAddComment = (id) => {
    if (!commentData.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        return {
          ...post,
          comments: [...post.comments, { text: commentData, date: new Date().toLocaleString() }],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    setCommentData("");
  };

  return (
    <div className="community-forum">
      <h1>🌍 Community Guestbook</h1>

      {/* Post Creation Section */}
      <div className="create-post">
        <input
          type="text"
          placeholder="Title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={postData.content}
          onChange={(e) => setPostData({ ...postData, content: e.target.value })}
        />
        <input
          type="text"
          placeholder="Your Name"
          value={postData.user}
          onChange={(e) => setPostData({ ...postData, user: e.target.value })}
        />
        <button onClick={handleCreatePost}>Create Post</button>
      </div>

      {/* Posts Section */}
      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <small>
                By <strong>{post.user}</strong> on {post.createdAt}
              </small>

              {/* Like & Dislike */}
              <div className="reactions">
                <button onClick={() => handleReaction(post.id, "like")}>👍 {post.likes}</button>
                <button onClick={() => handleReaction(post.id, "dislike")}>👎 {post.dislikes}</button>
              </div>

              <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                🗑️ Delete
              </button>

              {/* Comments Section */}
              <div className="comments">
                <h4>💬 Comments:</h4>
                {post.comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <p>{comment.text}</p>
                      <small>{comment.date}</small>
                    </div>
                  ))
                )}
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={commentData}
                  onChange={(e) => setCommentData(e.target.value)}
                />
                <button onClick={() => handleAddComment(post.id)}>Comment</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityForum;
