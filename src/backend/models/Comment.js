const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  likes: { type: Number, default: 0 }, // Add this field to track likes
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
