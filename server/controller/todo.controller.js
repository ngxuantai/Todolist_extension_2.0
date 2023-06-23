const Todo = require('../model/todos');

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
    const {type} = req.query;
    const condition = {};
    if (type !== undefined) {
      condition.type = type;
    }
    const todos = await Todo.find(condition);
    res.send(todos);
  } catch (error) {
    res.send(error);
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.send(todo);
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

exports.deleteTodoByType = async (req, res) => {
  try {
    const {type} = req.query;
    const todo = await Todo.deleteMany({type: type});
    res.send(todo);
  } catch (error) {
    res.send(error);
  }
};
