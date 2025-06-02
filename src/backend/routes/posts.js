const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// Route to handle like functionality for posts
router.patch('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes = post.likes + 1;
    await post.save();
    res.status(200).json(post); // Send back the updated post
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
