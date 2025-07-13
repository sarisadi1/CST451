const { pool, initializeDatabase } = require('./db/database');
const { userQueries, courseQueries, challengeQueries, progressQueries } = require('./db/queries');

const testDatabase = async () => {
  try {
    console.log('🧪 Starting database tests...\n');

    // Test 1: Database connection
    console.log('Test 1: Database Connection');
    await pool.execute('SELECT 1');
    console.log('✅ Database connection successful\n');

    // Test 2: User queries
    console.log('Test 2: User Queries');
    const users = await userQueries.getAllUsers(1, 5);
    console.log(`✅ Found ${users.users.length} users`);
    
    if (users.users.length > 0) {
      const firstUser = users.users[0];
      console.log(`   First user: ${firstUser.name} (${firstUser.email})`);
    }
    console.log();

    // Test 3: Course queries
    console.log('Test 3: Course Queries');
    const courses = await courseQueries.getAllCourses(1, 5);
    console.log(`✅ Found ${courses.courses.length} courses`);
    
    if (courses.courses.length > 0) {
      const firstCourse = courses.courses[0];
      console.log(`   First course: ${firstCourse.title} (${firstCourse.level})`);
    }
    console.log();

    // Test 4: Challenge queries
    console.log('Test 4: Challenge Queries');
    const challenges = await challengeQueries.getAllChallenges();
    console.log(`✅ Found ${challenges.length} challenges`);
    
    if (challenges.length > 0) {
      const firstChallenge = challenges[0];
      console.log(`   First challenge: ${firstChallenge.title} (${firstChallenge.difficulty})`);
    }
    console.log();

    // Test 5: User statistics
    console.log('Test 5: User Statistics');
    const userStats = await userQueries.getUserStats();
    console.log(`✅ User stats:`);
    console.log(`   Total users: ${userStats.total_users}`);
    console.log(`   Learners: ${userStats.learners}`);
    console.log(`   Instructors: ${userStats.instructors}`);
    console.log(`   Admins: ${userStats.admins}`);
    console.log();

    // Test 6: Test enrollment
    console.log('Test 6: Enrollment Test');
    if (users.users.length > 0 && courses.courses.length > 0) {
      const userId = users.users[0].id;
      const courseId = courses.courses[0].id;
      
      try {
        const enrollmentId = await courseQueries.enrollUser(userId, courseId);
        console.log(`✅ Enrollment successful (ID: ${enrollmentId})`);
        
        const isEnrolled = await courseQueries.isUserEnrolled(userId, courseId);
        console.log(`✅ Enrollment verification: ${isEnrolled ? 'Enrolled' : 'Not enrolled'}`);
      } catch (error) {
        if (error.message.includes('already enrolled')) {
          console.log('✅ User already enrolled (expected behavior)');
        } else {
          throw error;
        }
      }
    }
    console.log();

    // Test 7: Progress tracking
    console.log('Test 7: Progress Tracking');
    if (users.users.length > 0 && courses.courses.length > 0) {
      const userId = users.users[0].id;
      const courseId = courses.courses[0].id;
      
      const progress = await progressQueries.getUserProgress(userId, courseId);
      console.log(`✅ Found ${progress.length} progress entries for user`);
      
      const summary = await progressQueries.getProgressSummary(userId);
      console.log(`✅ Progress summary:`);
      console.log(`   Enrolled courses: ${summary.enrolled_courses || 0}`);
      console.log(`   Completed lessons: ${summary.completed_lessons || 0}`);
      console.log(`   Completed challenges: ${summary.completed_challenges || 0}`);
    }
    console.log();

    console.log('🎉 All database tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
};

// Run tests
testDatabase();