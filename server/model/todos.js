const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
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
},{versionKey: false});

module.exports = mongoose.model("todo", todoSchema);