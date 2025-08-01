const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'completed', 'deleted'],
    default: 'todo'
  }
});

module.exports = mongoose.model('Todo', TodoSchema);