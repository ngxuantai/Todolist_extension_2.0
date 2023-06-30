const express = require('express');
const cors = require('cors');
const router = express.Router();
const LinkController = require('../controller/link.controller');

router.post('/', LinkController.postLink);
router.get('/', LinkController.getLink);
router.delete('/', LinkController.deleteLink);
router.post('/refresh', LinkController.refreshTodos);

module.exports = router;
