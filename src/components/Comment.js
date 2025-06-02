import React, { useState } from 'react';

const Comment = ({ comment }) => {
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = async () => {
    const response = await fetch(`/api/comments/${comment._id}/like`, { method: 'PATCH' });

    if (response.ok) {
      const updatedComment = await response.json();
      setLikes(updatedComment.likes);
    } else {
      alert('Failed to like comment');
    }
  };

  return (
    <div className="comment">
      <p>{comment.content}</p>
      <button onClick={handleLike}>
        Like ({likes})
      </button>
    </div>
  );
};

export default Comment;
