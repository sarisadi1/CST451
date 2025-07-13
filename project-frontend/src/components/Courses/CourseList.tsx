import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { motion } from 'framer-motion';

const CourseList: React.FC = () => {
  const { courses, enrolledCourses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'ALL' || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const enrollerCourseIds = enrolledCourses.map(c => c.id);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
        <p className="text-gray-600">Discover and enroll in courses to enhance your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{filteredCourses.length}</div>
            <div className="text-gray-600">Available Courses</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{enrolledCourses.length}</div>
            <div className="text-gray-600">Enrolled Courses</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) / Math.max(enrolledCourses.length, 1))}%
            </div>
            <div className="text-gray-600">Average Progress</div>
          </div>
        </motion.div>
      </div>

      {/* Course Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          : 'space-y-6'
      }>
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard
              course={course}
              isEnrolled={enrollerCourseIds.includes(course.id)}
            />
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;