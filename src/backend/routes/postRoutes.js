import express from 'express';
import Post from '../models/Post.js';
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const { title, content, user } = req.body;
  if (!title || !content || !user) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newPost = await Post.create({ title, content, user });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post' });
  }
});

export default router;
