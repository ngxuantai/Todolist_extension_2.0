const {Int32} = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifiedSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {versionKey: false}
);

module.exports = mongoose.model('notified', notifiedSchema);
