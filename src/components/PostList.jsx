import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import io from 'socket.io-client';

// Set up Socket.io client to connect to the server
const socket = io('http://localhost:5000');

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const history = useHistory();

  // Fetch posts on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => console.error('Error fetching posts:', error));

    // Listen for real-time new posts
    socket.on('newPost', (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    // Listen for real-time new comments
    socket.on('newComment', (updatedPost) => {
      setPosts((prevPosts) => prevPosts.map(post => post._id === updatedPost._id ? updatedPost : post));
    });

    return () => {
      // Clean up the socket listeners on component unmount
      socket.off('newPost');
      socket.off('newComment');
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Community Forum</h1>
      {posts.map(post => (
        <div key={post._id} className="border p-4 mb-4 rounded-md">
          <h2 className="font-semibold text-lg">{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() => history.push(`/post/${post._id}`)} className="mt-2 text-blue-500">
            View Comments
          </button>
        </div>
      ))}
    </div>
  );
};

export default PostList;
