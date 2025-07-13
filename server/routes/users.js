const express = require('express');
const { body, validationResult } = require('express-validator');
const { userQueries } = require('../db/queries');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const result = await userQueries.getAllUsers(parseInt(page), parseInt(limit), role);
    
    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await userQueries.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['LEARNER', 'INSTRUCTOR', 'ADMIN']).withMessage('Invalid role'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, role, isVerified } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (isVerified !== undefined) updates.is_verified = isVerified;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const success = await userQueries.updateUser(req.params.id, updates);
    if (!success) {
      return res.status(400).json({ error: 'Failed to update user' });
    }

    const updatedUser = await userQueries.findUserById(req.params.id);
    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Prevent deleting self
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const success = await userQueries.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await userQueries.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

module.exports = router;