const express = require('express');
const cors = require('cors');
const router = express.Router();
const GGCalendarController = require('../controller/ggcalendar.controller');

router.get('/get-task', GGCalendarController.getTaskData);
// router.put('/edit-task', GGCalendarController.editTask);
// router.delete('/', GGCalendarController.deleteLink);
// router.post('/refresh', GGCalendarController.refreshTodos);

module.exports = router;
