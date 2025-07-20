const express = require('express');
const router = express.Router(); 
const courseController = require('../controllers/courseController.js');
const { verifyToken, isAdmin } = require('../middleware/auth.js');

// Guest route (public info)
router.get('/public', courseController.getPublicCourses);

// Authenticated users (full details)
router.get('/', verifyToken, courseController.getAllCourses);

// Admin-only
router.post('/', verifyToken, isAdmin, courseController.createCourse);
router.put('/:id', verifyToken, isAdmin, courseController.updateCourse);
router.delete('/:id', verifyToken, isAdmin, courseController.deleteCourse);

// Course details 
router.get('/:id', verifyToken, courseController.getCourseDetails);

module.exports= router;