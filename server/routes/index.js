const router = require('express').Router();

const TodoController = require('./todo.route');
const LinkController = require('./link.route');
const NotifiedController = require('./notified.route');
const GGCalendarController = require('./ggcalendar.route');

router.use('/todos', TodoController);
router.use('/link', LinkController);
router.use('/notified', NotifiedController);
router.use('/ggcalendar', GGCalendarController);

module.exports = router;
