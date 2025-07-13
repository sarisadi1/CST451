const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'learning_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'learning_platform'}`);
    await connection.end();
    
    // Create tables
    await createTables();
    
    // Insert sample data
    await insertSampleData();
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const createTables = async () => {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('ADMIN', 'INSTRUCTOR', 'LEARNER') DEFAULT 'LEARNER',
      is_verified BOOLEAN DEFAULT false,
      avatar VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Courses table
    `CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      thumbnail VARCHAR(500),
      level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
      duration VARCHAR(50),
      instructor_id INT,
      enrollment_count INT DEFAULT 0,
      tags JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
    )`,

    // Lessons table
    `CREATE TABLE IF NOT EXISTS lessons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      course_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content TEXT,
      video_url VARCHAR(500),
      duration VARCHAR(50),
      order_index INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,

    // Challenges table
    `CREATE TABLE IF NOT EXISTS challenges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lesson_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'EASY',
      language VARCHAR(50) NOT NULL,
      starter_code TEXT,
      solution_code TEXT,
      test_cases JSON,
      points INT DEFAULT 10,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    )`,

    // Enrollments table
    `CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      progress DECIMAL(5,2) DEFAULT 0.00,
      UNIQUE KEY unique_enrollment (user_id, course_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    )`,

    // User Progress table
    `CREATE TABLE IF NOT EXISTS user_progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      lesson_id INT,
      challenge_id INT,
      completed BOOLEAN DEFAULT false,
      completion_date TIMESTAMP NULL,
      last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
    )`,

    // Code Submissions table
    `CREATE TABLE IF NOT EXISTS code_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      challenge_id INT NOT NULL,
      code TEXT NOT NULL,
      language VARCHAR(50) NOT NULL,
      status ENUM('SUCCESS', 'ERROR', 'TIMEOUT') DEFAULT 'SUCCESS',
      output TEXT,
      error_message TEXT,
      execution_time DECIMAL(10,2),
      memory_usage DECIMAL(10,2),
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
    )`,

    // User sessions table
    `CREATE TABLE IF NOT EXISTS user_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  for (const table of tables) {
    await pool.execute(table);
  }
};

const insertSampleData = async () => {
  try {
    // Check if sample data already exists
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    if (users[0].count > 0) {
      console.log('Sample data already exists, skipping insertion');
      return;
    }

    // Insert sample users
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    
    const sampleUsers = [
      ['Admin User', 'admin@test.com', hashedPassword, 'ADMIN', true, 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'],
      ['John Instructor', 'instructor@test.com', hashedPassword, 'INSTRUCTOR', true, 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'],
      ['Jane Learner', 'learner@test.com', hashedPassword, 'LEARNER', true, 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100'],
      ['John Doe', 'john@example.com', hashedPassword, 'LEARNER', true, 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'],
      ['Sarah Wilson', 'sarah@example.com', hashedPassword, 'INSTRUCTOR', true, 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100']
    ];

    for (const user of sampleUsers) {
      await pool.execute(
        'INSERT INTO users (name, email, password, role, is_verified, avatar) VALUES (?, ?, ?, ?, ?, ?)',
        user
      );
    }

    // Insert sample courses
    const sampleCourses = [
      ['JavaScript Fundamentals', 'Master the basics of JavaScript programming', 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=500', 'BEGINNER', '8 hours', 2, 125, JSON.stringify(['JavaScript', 'Programming', 'Web Development'])],
      ['Python for Data Science', 'Learn Python programming for data analysis', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=500', 'INTERMEDIATE', '12 hours', 2, 89, JSON.stringify(['Python', 'Data Science', 'Analytics'])],
      ['React Development', 'Build modern web applications with React', 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500', 'INTERMEDIATE', '15 hours', 5, 67, JSON.stringify(['React', 'JavaScript', 'Frontend'])],
      ['Node.js Backend', 'Server-side development with Node.js', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=500', 'ADVANCED', '20 hours', 5, 45, JSON.stringify(['Node.js', 'Backend', 'API'])]
    ];

    for (const course of sampleCourses) {
      await pool.execute(
        'INSERT INTO courses (title, description, thumbnail, level, duration, instructor_id, enrollment_count, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        course
      );
    }

    // Insert sample lessons
    const sampleLessons = [
      [1, 'Introduction to JavaScript', 'Learn the basics of JavaScript syntax and concepts', 'Welcome to JavaScript! This lesson covers variables, data types, and basic operations.', 'https://www.youtube.com/embed/PkZNo7MFNFg', '45 min', 1],
      [1, 'Functions and Scope', 'Understanding JavaScript functions and variable scope', 'Deep dive into function declarations, expressions, and scope rules.', 'https://www.youtube.com/embed/N8ap4k_1QEQ', '50 min', 2],
      [1, 'Arrays and Objects', 'Working with JavaScript data structures', 'Learn to manipulate arrays and objects in JavaScript.', 'https://www.youtube.com/embed/9-6W6fPGS4Q', '55 min', 3],
      [2, 'Python Basics', 'Introduction to Python programming', 'Get started with Python syntax and basic programming concepts.', 'https://www.youtube.com/embed/kqtD5dpn9C8', '40 min', 1],
      [2, 'Data Analysis with Pandas', 'Working with data using Pandas library', 'Learn to manipulate and analyze data with Pandas.', 'https://www.youtube.com/embed/vmEHCJofslg', '60 min', 2]
    ];

    for (const lesson of sampleLessons) {
      await pool.execute(
        'INSERT INTO lessons (course_id, title, description, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
        lesson
      );
    }

    // Insert sample challenges
    const sampleChallenges = [
      [1, 'Variable Declaration', 'Create variables and assign values', 'EASY', 'javascript', 'var name = ""; // Your code here', 'var name = "JavaScript"; console.log(name);', JSON.stringify([
        { input: '', expectedOutput: 'JavaScript' }
      ]), 10],
      [2, 'Sum Function', 'Write a function that adds two numbers', 'EASY', 'javascript', 'function sum(a, b) {\n  // Your code here\n}', 'function sum(a, b) {\n  return a + b;\n}', JSON.stringify([
        { input: 'sum(2, 3)', expectedOutput: '5' },
        { input: 'sum(10, 15)', expectedOutput: '25' }
      ]), 15],
      [4, 'Python Variables', 'Create and use Python variables', 'EASY', 'python', 'name = "" # Your code here', 'name = "Python"\nprint(name)', JSON.stringify([
        { input: '', expectedOutput: 'Python' }
      ]), 10],
      [5, 'List Comprehension', 'Create a list using list comprehension', 'MEDIUM', 'python', 'numbers = [1, 2, 3, 4, 5]\n# Create squared numbers list', 'numbers = [1, 2, 3, 4, 5]\nsquared = [x**2 for x in numbers]\nprint(squared)', JSON.stringify([
        { input: '[1, 2, 3, 4, 5]', expectedOutput: '[1, 4, 9, 16, 25]' }
      ]), 20]
    ];

    for (const challenge of sampleChallenges) {
      await pool.execute(
        'INSERT INTO challenges (lesson_id, title, description, difficulty, language, starter_code, solution_code, test_cases, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        challenge
      );
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

module.exports = { pool, initializeDatabase };