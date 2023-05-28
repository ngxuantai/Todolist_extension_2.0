const connectionDB = require('./db');
const cors = require ("cors");
const express = require ("express");
const app = express();
const todoRouter = require ("./routes/todosRouter");

connectionDB();
app.use (express.json());
app.use (cors());

app.use ("/api/todos", todoRouter);

const port = 5000;
app.listen (port, () => console.log( `Listening on port ${port}... `));