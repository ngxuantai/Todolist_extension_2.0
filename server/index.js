const connectionDB = require('./db');
const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./routes');

connectionDB();
app.use(express.json());
app.use(cors());

app.use('/', router);

const {scheduleTodo} = require('./controller/scheduler.controller');

const port = 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}... `);
  scheduleTodo('normal');
  scheduleTodo('uit');
});
