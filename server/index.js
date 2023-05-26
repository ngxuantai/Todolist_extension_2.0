const connectionDB = require('./db');
const cors = require ("cors");
const express = require ("express");
const app = express();
const todoRouter = require ("./routes/todosRouter");

connectionDB();
app.use (express.json());
app.use (cors());

app.use ("/todos", todoRouter);

const port = 3000;
console.log(port);
app.listen (port, () => console.log( 'Listening on port ${port}... '));