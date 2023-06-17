const router = require("express").Router();

const TodoController = require("./todo.route");
const LinkController = require("./link.route");

router.use("/todos", TodoController);
router.use("/link", LinkController);

module.exports = router;
