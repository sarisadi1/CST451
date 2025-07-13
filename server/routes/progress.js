const express = require('express');
const { body, validationResult } = require('express-validator');
const { progressQueries } = require('../db/queries');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's progress
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.query;
    const progress = await progressQueries.getUserProgress(req.user.id, courseId);
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get progress summary
router.get('/summary/me', authenticateToken, async (req, res) => {
  try {
    const summary = await progressQueries.getProgressSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    console.error('Get progress summary error:', error);
    res.status(500).json({ error: 'Failed to get progress summary' });
  }
});

// Update lesson progress
router.post('/lesson', authenticateToken, [
  body('courseId').isInt().withMessage('Course ID must be an integer'),
  body('lessonId').isInt().withMessage('Lesson ID must be an integer'),
  body('completed').isBoolean().withMessage('Completed must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, lessonId, completed } = req.body;
    
    await progressQueries.updateLessonProgress(req.user.id, courseId, lessonId, completed);
    
    res.json({ message: 'Lesson progress updated successfully' });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({ error: 'Failed to update lesson progress' });
  }
});

// Update challenge progress
router.post('/challenge', authenticateToken, [
  body('courseId').isInt().withMessage('Course ID must be an integer'),
  body('challengeId').isInt().withMessage('Challenge ID must be an integer'),
  body('completed').isBoolean().withMessage('Completed must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId, challengeId, completed } = req.body;
    
    await progressQueries.updateChallengeProgress(req.user.id, courseId, challengeId, completed);
    
    res.json({ message: 'Challenge progress updated successfully' });
  } catch (error) {
    console.error('Update challenge progress error:', error);
    res.status(500).json({ error: 'Failed to update challenge progress' });
  }
});

module.exports = router;