const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Post = require('./models/Post');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/medibiotic', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.log(`❌ MongoDB connection failed: ${err}`));


// Routes

// GET all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// POST create a new post
app.post('/api/posts', async (req, res) => {
  const { title, content, user } = req.body;
  if (!title || !content || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newPost = new Post({ title, content, user });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// POST add a comment to a post
app.post('/api/posts/:id/comments', async (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ message: "User and text are required" });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ user, text });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// DELETE a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Community Forum API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
