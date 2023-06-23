const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema(
  {
    link: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {versionKey: false}
);

module.exports = mongoose.model('link', linkSchema);
