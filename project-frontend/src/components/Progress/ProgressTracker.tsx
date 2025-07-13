import React from 'react';
import { Trophy, Award, Clock, TrendingUp, Calendar, Download, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const { enrolledCourses, userProgress } = useApp();

  const totalProgress = userProgress.reduce((acc, progress) => acc + progress.totalProgress, 0) / Math.max(userProgress.length, 1);
  const completedChallenges = userProgress.reduce((acc, progress) => acc + progress.completedChallenges.length, 0);
  const totalLessons = userProgress.reduce((acc, progress) => acc + progress.completedLessons.length, 0);

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: Trophy, earned: totalLessons > 0, color: 'from-green-500 to-teal-600' },
    { id: 2, title: 'Code Warrior', description: 'Solve 10 coding challenges', icon: Award, earned: completedChallenges >= 10, color: 'from-blue-500 to-purple-600' },
    { id: 3, title: 'Course Crusher', description: 'Complete a full course', icon: Star, earned: userProgress.some(p => p.totalProgress >= 100), color: 'from-orange-500 to-red-600' },
    { id: 4, title: 'Learning Streak', description: 'Learn for 7 consecutive days', icon: Calendar, earned: false, color: 'from-purple-500 to-pink-600' },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
        <p className="text-gray-600">Track your achievements and learning journey</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900">{Math.round(totalProgress)}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Challenges Solved</p>
              <p className="text-3xl font-bold text-gray-900">{completedChallenges}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Hours Learned</p>
              <p className="text-3xl font-bold text-gray-900">45</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Course Progress</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course, index) => {
              const progress = userProgress.find(p => p.courseId === course.id);
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{course.title}</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(progress?.totalProgress || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress?.totalProgress || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {progress?.completedLessons.length || 0} lessons completed
                    </span>
                    <span>
                      Last accessed: {progress ? format(new Date(progress.lastAccessed), 'MMM dd') : 'Never'}
                    </span>
                  </div>
                  {progress?.totalProgress === 100 && (
                    <button className="mt-3 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 text-sm">
                      <Download className="h-4 w-4" />
                      <span>Download Certificate</span>
                    </button>
                  )}
                </motion.div>
              );
            })}
            {enrolledCourses.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses enrolled yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    achievement.earned
                      ? 'border-transparent bg-gradient-to-r ' + achievement.color + ' text-white'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      achievement.earned
                        ? 'bg-white/20'
                        : 'bg-gray-200'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        achievement.earned ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        achievement.earned ? 'text-white' : 'text-gray-900'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <div className="text-white">
                        <Trophy className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Achievement Progress</span>
              <span className="text-sm text-blue-700">{earnedAchievements.length}/{achievements.length}</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(earnedAchievements.length / achievements.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressTracker;