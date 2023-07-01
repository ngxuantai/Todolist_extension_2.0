const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    task: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
  },
  {versionKey: false}
);

module.exports = mongoose.model('todo', todoSchema);
