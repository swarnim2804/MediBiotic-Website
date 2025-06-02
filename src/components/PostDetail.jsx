import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// Set up Socket.io client to connect to the server
const socket = io('http://localhost:5000');

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  // Fetch the post details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/${postId}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => console.error('Error fetching post:', error));

    // Listen for real-time new comments
    socket.on('newComment', (updatedPost) => {
      if (updatedPost._id === postId) {
        setPost(updatedPost);
      }
    });

    return () => {
      // Clean up the socket listener when the component is unmounted
      socket.off('newComment');
    };
  }, [postId]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      axios.post(`http://localhost:5000/api/posts/${postId}/comments`, { user: 'User', text: comment })
        .then(response => {
          setPost(response.data);
          setComment('');
        })
        .catch(error => console.error('Error posting comment:', error));
    }
  };

  return (
    <div className="p-4">
      {post ? (
        <>
          <h1 className="text-2xl mb-4">{post.title}</h1>
          <p>{post.content}</p>
          <div className="mt-4">
            <h2 className="text-lg">Comments</h2>
            {post.comments.map((comment, index) => (
              <div key={index} className="border p-2 mb-2 rounded-md">
                <p><strong>{comment.user}</strong>: {comment.text}</p>
              </div>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border mb-2"
          />
          <button onClick={handleCommentSubmit} className="bg-blue-500 text-white p-2 rounded-md">Post Comment</button>
        </>
      ) : (
        <p>Loading...</p
