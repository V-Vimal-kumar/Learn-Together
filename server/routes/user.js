const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.js');
const userController = require('../controllers/userController.js');

router.get('/all', verifyToken, isAdmin, async (req, res) => {
  const users = await User.find().select('name email role');
  res.json(users);
});

// Get current user profile
router.get('/me', verifyToken, userController.getMe);

// Get user by ID
router.get('/:id', verifyToken, userController.getUserById);

// User updates their own profile
router.put('/me', verifyToken, userController.updateProfile);

// Admin changes role of any user
router.put('/:id/role', verifyToken, isAdmin, userController.updateUserRole);

router.post('/pair/send', verifyToken, userController.sendRequest);


module.exports = router;
