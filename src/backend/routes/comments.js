const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

// Route to handle like functionality for comments
router.patch('/:id/like', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    comment.likes = comment.likes + 1;
    await comment.save();
    res.status(200).json(comment); // Send back the updated comment
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
