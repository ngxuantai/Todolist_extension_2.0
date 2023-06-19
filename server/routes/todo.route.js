const express = require("express");
const cors = require("cors");
const router = express.Router();
const TodoController = require("../controller/todo.controller");

router.post("/", TodoController.postTodo);
router.get("/", TodoController.getTodos);
router.put("/:id", TodoController.updateTodo);
router.delete("/:id", TodoController.deleteTodo);

module.exports = router;
