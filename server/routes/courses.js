const express = require('express');
const router = express.Router();
const db = require('../db/database'); // ✅ THIS IS THE CORRECT LINE

// Get all courses
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courses');

    const formatted = rows.map(course => ({
      id: String(course.id),
      title: course.title,
      description: course.description,
      instructor: {
        id: String(course.instructorId || 1),
        name: 'Unknown',
        email: '',
        role: 'INSTRUCTOR',
        createdAt: '',
        isVerified: true
      },
      enrollmentCount: course.enrollmentCount || 0,
      duration: course.duration || '',
      level: course.level || 'BEGINNER',
      tags: course.tags ? JSON.parse(course.tags) : ['General'],
      thumbnail: course.thumbnail || 'https://via.placeholder.com/400x200',
      lessons: [],
      createdAt: course.createdAt || '',
      updatedAt: course.updatedAt || ''
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

module.exports = router;
