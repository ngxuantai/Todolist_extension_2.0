const express = require('express');
const cors = require('cors');
const router = express.Router();
const NotifiedController = require('../controller/notified.controller');

router.post('/', NotifiedController.postNotified);
router.get('/', NotifiedController.getNotified);

module.exports = router;
