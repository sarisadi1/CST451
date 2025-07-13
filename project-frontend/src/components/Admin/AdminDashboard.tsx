import React from 'react';
import { Users, BookOpen, TrendingUp, DollarSign, Eye, Shield, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Courses', value: '89', change: '+5%', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { label: 'Active Sessions', value: '1,234', change: '+8%', icon: Eye, color: 'from-purple-500 to-purple-600' },
    { label: 'Revenue', value: '$45.2K', change: '+15%', icon: DollarSign, color: 'from-orange-500 to-orange-600' },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, courses: 45 },
    { month: 'Feb', users: 1400, courses: 52 },
    { month: 'Mar', users: 1800, courses: 58 },
    { month: 'Apr', users: 2100, courses: 65 },
    { month: 'May', users: 2300, courses: 73 },
    { month: 'Jun', users: 2543, courses: 89 },
  ];

  const courseCompletionData = [
    { name: 'Completed', value: 78, color: '#10B981' },
    { name: 'In Progress', value: 15, color: '#F59E0B' },
    { name: 'Not Started', value: 7, color: '#EF4444' },
  ];

  const securityAlerts = [
    { id: 1, type: 'warning', message: 'Unusual login pattern detected for user john@example.com', time: '5 minutes ago' },
    { id: 2, type: 'info', message: 'System backup completed successfully', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'High CPU usage detected on server-2', time: '2 hours ago' },
  ];

  const recentActivity = [
    { action: 'New user registration', user: 'alice@example.com', time: '2 minutes ago' },
    { action: 'Course completion', user: 'bob@example.com', time: '15 minutes ago' },
    { action: 'Payment processed', user: 'charlie@example.com', time: '30 minutes ago' },
    { action: 'Course enrollment', user: 'diana@example.com', time: '1 hour ago' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform performance and manage system operations</p>
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
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Users"
              />
              <Line 
                type="monotone" 
                dataKey="courses" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Courses"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Course Completion Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Course Completion</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={courseCompletionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {courseCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {courseCompletionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Security Alerts</h2>
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
                {alert.type === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;