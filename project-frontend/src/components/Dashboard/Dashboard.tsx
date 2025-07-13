import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp, 
  Clock,
  Star,
  Play,
  Award,
  Calendar,
  Code
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrolledCourses, userProgress } = useApp();

  const getDashboardStats = () => {
    if (user?.role === 'ADMIN') {
      return [
        { label: 'Total Users', value: '2,543', icon: Users, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Courses', value: courses.length.toString(), icon: BookOpen, color: 'from-green-500 to-green-600' },
        { label: 'Active Enrollments', value: '1,892', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
        { label: 'Completion Rate', value: '78%', icon: Trophy, color: 'from-orange-500 to-orange-600' },
      ];
    } else if (user?.role === 'INSTRUCTOR') {
      return [
        { label: 'My Courses', value: '5', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
        { label: 'Total Students', value: '234', icon: Users, color: 'from-green-500 to-green-600' },
        { label: 'Average Rating', value: '4.8', icon: Star, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Course Views', value: '1,205', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
      ];
    } else {
      return [
        { label: 'Enrolled Courses', value: enrolledCourses.length.toString(), icon: BookOpen, color: 'from-blue-500 to-blue-600' },
        { label: 'Hours Learned', value: '45', icon: Clock, color: 'from-green-500 to-green-600' },
        { label: 'Challenges Solved', value: '23', icon: Code, color: 'from-purple-500 to-purple-600' },
        { label: 'Certificates', value: '3', icon: Award, color: 'from-orange-500 to-orange-600' },
      ];
    }
  };

  const stats = getDashboardStats();

  const recentActivity = [
    { action: 'Completed Python Challenge #5', time: '2 hours ago', type: 'success' },
    { action: 'Started JavaScript Fundamentals', time: '1 day ago', type: 'info' },
    { action: 'Earned Python Basics Certificate', time: '3 days ago', type: 'success' },
    { action: 'Joined Advanced React Course', time: '1 week ago', type: 'info' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          {user?.role === 'ADMIN' 
            ? 'Monitor platform performance and manage users'
            : user?.role === 'INSTRUCTOR'
            ? 'Track your courses and student progress'
            : 'Continue your learning journey'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user?.role === 'LEARNER' ? (
              <>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                  <Play className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Continue Learning</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Browse Courses</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200">
                  <Code className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800 font-medium">Practice Coding</span>
                </button>
              </>
            ) : user?.role === 'INSTRUCTOR' ? (
              <>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Create New Course</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">View Students</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">Course Analytics</span>
                </button>
              </>
            ) : (
              <>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-200">
                  <Users className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Manage Users</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">View Analytics</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Course Management</span>
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Progress</h2>
          <div className="space-y-4">
            {enrolledCourses.slice(0, 3).map((course, index) => (
              <div key={course.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{course.progress || 0}%</span>
                </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No courses enrolled yet</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                  Browse courses
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;