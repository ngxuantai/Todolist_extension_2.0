const Todo = require("../model/todos");

exports.postTodo = async (req, res) => {
  try {
    const todo = await new Todo(req.body).save();
    res.send(todo);
  } catch (error) {
    res.send(error);
  }
};

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.send(todos);
  } catch (error) {
    res.send(error);
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate({_id: req.params.id}, req.body, {
      new: true,
    });
    res.send(todo);
  } catch (error) {
    res.send(error);
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    res.send(todo);
  } catch (error) {
    res.send(error);
  }
};
