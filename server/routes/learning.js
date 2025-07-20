const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const learningController = require('../controllers/learningController.js');

router.post('/join', verifyToken, learningController.joinCourse);
router.patch('/progress', verifyToken, learningController.updateProgress);
router.get('/me', verifyToken, learningController.getMyLearning); 
router.delete('/unpair', verifyToken, learningController.unpair);
router.patch('/complete', verifyToken, learningController.markAsComplete); 
router.delete('/leave', verifyToken, learningController.leaveCourse); 
router.get('/completed', verifyToken, learningController.getCompletedCourses); // ✅ Uncommented
router.get('/completed/:courseId', verifyToken, learningController.getCompletedCourse); // ✅ Fixed
// router.get('/:courseId', verifyToken, learningController.getCourseProgress);

module.exports = router;
