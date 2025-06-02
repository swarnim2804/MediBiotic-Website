import React, { useState } from 'react';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {
    const response = await fetch(`/api/posts/${post._id}/like`, { method: 'PATCH' });

    if (response.ok) {
      const updatedPost = await response.json();
      setLikes(updatedPost.likes);
    } else {
      alert('Failed to like post');
    }
  };

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button onClick={handleLike}>
        Like ({likes})
      </button>
    </div>
  );
};

export default Post;
