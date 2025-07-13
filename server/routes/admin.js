const express = require('express');
const { adminQueries } = require('../db/queries');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await adminQueries.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get user growth data
router.get('/growth', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const data = await adminQueries.getUserGrowthData(parseInt(months));
    res.json(data);
  } catch (error) {
    console.error('Get growth data error:', error);
    res.status(500).json({ error: 'Failed to get growth data' });
  }
});

// Get recent activities
router.get('/activities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await adminQueries.getRecentActivities(parseInt(limit));
    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

module.exports = router;