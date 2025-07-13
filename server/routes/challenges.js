const express = require('express');
const { body, validationResult } = require('express-validator');
const { challengeQueries } = require('../db/queries');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const { difficulty, language } = req.query;
    const challenges = await challengeQueries.getAllChallenges(difficulty, language);
    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await challengeQueries.getChallengeById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Failed to get challenge' });
  }
});

// Execute code for a challenge
router.post('/:id/execute', authenticateToken, [
  body('code').notEmpty().withMessage('Code is required'),
  body('language').isIn(['javascript', 'python', 'java', 'cpp']).withMessage('Invalid language')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language } = req.body;
    const challengeId = req.params.id;

    // Mock code execution - in a real app, you'd use a code execution service
    const mockExecution = {
      status: 'SUCCESS',
      output: 'Mock output - code executed successfully',
      executionTime: Math.random() * 100,
      memory: Math.random() * 50
    };

    // Save submission
    const submissionId = await challengeQueries.submitCode(
      req.user.id,
      challengeId,
      code,
      language,
      mockExecution.status,
      mockExecution.output,
      null,
      mockExecution.executionTime,
      mockExecution.memory
    );

    res.json({
      submissionId,
      ...mockExecution
    });
  } catch (error) {
    console.error('Execute code error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

// Get user's submissions for a challenge
router.get('/:id/submissions', authenticateToken, async (req, res) => {
  try {
    const submissions = await challengeQueries.getUserSubmissions(req.user.id, req.params.id);
    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
});

// Get all user's submissions
router.get('/submissions/me', authenticateToken, async (req, res) => {
  try {
    const submissions = await challengeQueries.getUserSubmissions(req.user.id);
    res.json(submissions);
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
});

module.exports = router;