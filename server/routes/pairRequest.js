const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const pairRequestController = require('../controllers/pairRequestController');

router.post('/send', verifyToken, pairRequestController.sendRequest);
router.get('/', verifyToken, pairRequestController.getMyRequests);
router.patch('/:id', verifyToken, pairRequestController.respondToRequest);

module.exports = router;
