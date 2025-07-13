const { pool } = require('./database');

// User Queries
const userQueries = {
  // Create new user
  createUser: async (name, email, hashedPassword, role = 'LEARNER') => {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },

  // Find user by email
  findUserByEmail: async (email) => {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  // Find user by ID
  findUserById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_verified, avatar, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Get all users with pagination
  getAllUsers: async (page = 1, limit = 10, role = null) => {
    const offset = (page - 1) * limit;
    let query = 'SELECT id, name, email, role, is_verified, avatar, created_at FROM users';
    let params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let countParams = [];
    if (role) {
      countQuery += ' WHERE role = ?';
      countParams.push(role);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    
    return {
      users: rows,
      total: countResult[0].total,
      page,
      limit
    };
  },

  // Update user
  updateUser: async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const [result] = await pool.execute(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  },

  // Delete user
  deleteUser: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Get user stats
  getUserStats: async () => {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'LEARNER' THEN 1 ELSE 0 END) as learners,
        SUM(CASE WHEN role = 'INSTRUCTOR' THEN 1 ELSE 0 END) as instructors,
        SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified_users
      FROM users
    `);
    return stats[0];
  }
};

// Course Queries
const courseQueries = {
  // Get all courses
  getAllCourses: async (page = 1, limit = 10, level = null) => {
    const offset = (page - 1) * limit;
    let query = `
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id
    `;
    let params = [];

    if (level) {
      query += ' WHERE c.level = ?';
      params.push(level);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM courses';
    let countParams = [];
    if (level) {
      countQuery += ' WHERE level = ?';
      countParams.push(level);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);
    
    return {
      courses: rows.map(course => ({
        ...course,
        tags: JSON.parse(course.tags || '[]'),
        instructor: {
          id: course.instructor_id,
          name: course.instructor_name
        }
      })),
      total: countResult[0].total,
      page,
      limit
    };
  },

  // Get course by ID with lessons and challenges
  getCourseById: async (id) => {
    const [courseRows] = await pool.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      WHERE c.id = ?
    `, [id]);

    if (courseRows.length === 0) return null;

    const course = courseRows[0];
    
    // Get lessons for this course
    const [lessonRows] = await pool.execute(`
      SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index
    `, [id]);

    // Get challenges for each lesson
    for (let lesson of lessonRows) {
      const [challengeRows] = await pool.execute(`
        SELECT * FROM challenges WHERE lesson_id = ?
      `, [lesson.id]);
      
      lesson.challenges = challengeRows.map(challenge => ({
        ...challenge,
        testCases: JSON.parse(challenge.test_cases || '[]')
      }));
    }

    return {
      ...course,
      tags: JSON.parse(course.tags || '[]'),
      instructor: {
        id: course.instructor_id,
        name: course.instructor_name
      },
      lessons: lessonRows
    };
  },

  // Get enrolled courses for a user
  getEnrolledCourses: async (userId) => {
    const [rows] = await pool.execute(`
      SELECT c.*, e.enrolled_at, e.progress, u.name as instructor_name
      FROM courses c
      JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [userId]);

    return rows.map(course => ({
      ...course,
      tags: JSON.parse(course.tags || '[]'),
      instructor: {
        id: course.instructor_id,
        name: course.instructor_name
      }
    }));
  },

  // Enroll user in course
  enrollUser: async (userId, courseId) => {
    try {
      const [result] = await pool.execute(
        'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
        [userId, courseId]
      );
      
      // Update enrollment count
      await pool.execute(
        'UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = ?',
        [courseId]
      );
      
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User already enrolled in this course');
      }
      throw error;
    }
  },

  // Check if user is enrolled in course
  isUserEnrolled: async (userId, courseId) => {
    const [rows] = await pool.execute(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    return rows.length > 0;
  }
};

// Challenge Queries
const challengeQueries = {
  // Get all challenges
  getAllChallenges: async (difficulty = null, language = null) => {
    let query = `
      SELECT c.*, l.title as lesson_title, co.title as course_title
      FROM challenges c
      JOIN lessons l ON c.lesson_id = l.id
      JOIN courses co ON l.course_id = co.id
    `;
    let params = [];
    let conditions = [];

    if (difficulty) {
      conditions.push('c.difficulty = ?');
      params.push(difficulty);
    }

    if (language) {
      conditions.push('c.language = ?');
      params.push(language);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.execute(query, params);
    
    return rows.map(challenge => ({
      ...challenge,
      testCases: JSON.parse(challenge.test_cases || '[]')
    }));
  },

  // Get challenge by ID
  getChallengeById: async (id) => {
    const [rows] = await pool.execute(`
      SELECT c.*, l.title as lesson_title, co.title as course_title
      FROM challenges c
      JOIN lessons l ON c.lesson_id = l.id
      JOIN courses co ON l.course_id = co.id
      WHERE c.id = ?
    `, [id]);

    if (rows.length === 0) return null;

    return {
      ...rows[0],
      testCases: JSON.parse(rows[0].test_cases || '[]')
    };
  },

  // Submit code for challenge
  submitCode: async (userId, challengeId, code, language, status, output, errorMessage, executionTime, memoryUsage) => {
    const [result] = await pool.execute(`
      INSERT INTO code_submissions 
      (user_id, challenge_id, code, language, status, output, error_message, execution_time, memory_usage)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, challengeId, code, language, status, output, errorMessage, executionTime, memoryUsage]);

    return result.insertId;
  },

  // Get user's code submissions
  getUserSubmissions: async (userId, challengeId = null) => {
    let query = `
      SELECT cs.*, c.title as challenge_title
      FROM code_submissions cs
      JOIN challenges c ON cs.challenge_id = c.id
      WHERE cs.user_id = ?
    `;
    let params = [userId];

    if (challengeId) {
      query += ' AND cs.challenge_id = ?';
      params.push(challengeId);
    }

    query += ' ORDER BY cs.submitted_at DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  }
};

// Progress Queries
const progressQueries = {
  // Get user progress for a course
  getUserProgress: async (userId, courseId = null) => {
    let query = `
      SELECT up.*, c.title as course_title, l.title as lesson_title, ch.title as challenge_title
      FROM user_progress up
      JOIN courses c ON up.course_id = c.id
      LEFT JOIN lessons l ON up.lesson_id = l.id
      LEFT JOIN challenges ch ON up.challenge_id = ch.id
      WHERE up.user_id = ?
    `;
    let params = [userId];

    if (courseId) {
      query += ' AND up.course_id = ?';
      params.push(courseId);
    }

    query += ' ORDER BY up.last_accessed DESC';

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  // Update lesson progress
  updateLessonProgress: async (userId, courseId, lessonId, completed = true) => {
    const [existing] = await pool.execute(
      'SELECT id FROM user_progress WHERE user_id = ? AND course_id = ? AND lesson_id = ?',
      [userId, courseId, lessonId]
    );

    if (existing.length > 0) {
      await pool.execute(
        'UPDATE user_progress SET completed = ?, completion_date = ? WHERE id = ?',
        [completed, completed ? new Date() : null, existing[0].id]
      );
    } else {
      await pool.execute(
        'INSERT INTO user_progress (user_id, course_id, lesson_id, completed, completion_date) VALUES (?, ?, ?, ?, ?)',
        [userId, courseId, lessonId, completed, completed ? new Date() : null]
      );
    }

    // Update enrollment progress
    await updateEnrollmentProgress(userId, courseId);
  },

  // Update challenge progress
  updateChallengeProgress: async (userId, courseId, challengeId, completed = true) => {
    const [existing] = await pool.execute(
      'SELECT id FROM user_progress WHERE user_id = ? AND course_id = ? AND challenge_id = ?',
      [userId, courseId, challengeId]
    );

    if (existing.length > 0) {
      await pool.execute(
        'UPDATE user_progress SET completed = ?, completion_date = ? WHERE id = ?',
        [completed, completed ? new Date() : null, existing[0].id]
      );
    } else {
      await pool.execute(
        'INSERT INTO user_progress (user_id, course_id, challenge_id, completed, completion_date) VALUES (?, ?, ?, ?, ?)',
        [userId, courseId, challengeId, completed, completed ? new Date() : null]
      );
    }

    // Update enrollment progress
    await updateEnrollmentProgress(userId, courseId);
  },

  // Get progress summary for user
  getProgressSummary: async (userId) => {
    const [summary] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT up.course_id) as enrolled_courses,
        COUNT(DISTINCT CASE WHEN up.lesson_id IS NOT NULL AND up.completed = true THEN up.lesson_id END) as completed_lessons,
        COUNT(DISTINCT CASE WHEN up.challenge_id IS NOT NULL AND up.completed = true THEN up.challenge_id END) as completed_challenges,
        AVG(e.progress) as average_progress
      FROM user_progress up
      LEFT JOIN enrollments e ON up.user_id = e.user_id AND up.course_id = e.course_id
      WHERE up.user_id = ?
    `, [userId]);

    return summary[0];
  }
};

// Helper function to update enrollment progress
const updateEnrollmentProgress = async (userId, courseId) => {
  // Get total lessons and challenges for the course
  const [totals] = await pool.execute(`
    SELECT 
      COUNT(DISTINCT l.id) as total_lessons,
      COUNT(DISTINCT c.id) as total_challenges
    FROM lessons l
    LEFT JOIN challenges c ON l.id = c.lesson_id
    WHERE l.course_id = ?
  `, [courseId]);

  // Get completed lessons and challenges for the user
  const [completed] = await pool.execute(`
    SELECT 
      COUNT(DISTINCT CASE WHEN up.lesson_id IS NOT NULL AND up.completed = true THEN up.lesson_id END) as completed_lessons,
      COUNT(DISTINCT CASE WHEN up.challenge_id IS NOT NULL AND up.completed = true THEN up.challenge_id END) as completed_challenges
    FROM user_progress up
    WHERE up.user_id = ? AND up.course_id = ?
  `, [userId, courseId]);

  const totalItems = totals[0].total_lessons + totals[0].total_challenges;
  const completedItems = completed[0].completed_lessons + completed[0].completed_challenges;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Update enrollment progress
  await pool.execute(
    'UPDATE enrollments SET progress = ? WHERE user_id = ? AND course_id = ?',
    [progress, userId, courseId]
  );
};

// Admin Queries
const adminQueries = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM courses) as total_courses,
        (SELECT COUNT(*) FROM enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM code_submissions WHERE status = 'SUCCESS') as successful_submissions,
        (SELECT AVG(progress) FROM enrollments) as average_progress
    `);

    return stats[0];
  },

  // Get user growth data
  getUserGrowthData: async (months = 6) => {
    const [data] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as users,
        (SELECT COUNT(*) FROM courses WHERE DATE_FORMAT(created_at, '%Y-%m') <= DATE_FORMAT(u.created_at, '%Y-%m')) as courses
      FROM users u
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `, [months]);

    return data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const [activities] = await pool.execute(`
      SELECT 
        'enrollment' as type,
        u.name as user_name,
        c.title as course_title,
        e.enrolled_at as timestamp
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      UNION ALL
      SELECT 
        'submission' as type,
        u.name as user_name,
        ch.title as challenge_title,
        cs.submitted_at as timestamp
      FROM code_submissions cs
      JOIN users u ON cs.user_id = u.id
      JOIN challenges ch ON cs.challenge_id = ch.id
      ORDER BY timestamp DESC
      LIMIT ?
    `, [limit]);

    return activities;
  }
};

module.exports = {
  userQueries,
  courseQueries,
  challengeQueries,
  progressQueries,
  adminQueries
};