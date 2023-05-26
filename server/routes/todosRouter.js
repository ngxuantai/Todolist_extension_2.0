const express = require ("express");
const cors = require ("cors");
const router = express.Router(); 
const Todo = require ("../model/todos");

router.post("/", async (req, res) => {
    try {
        const todo = await new Todo(req.body).save();
        res.send(todo);
    } catch (error) {
        res.send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;