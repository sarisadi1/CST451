import React from 'react';
import { Clock, Users, Star, Play, BookOpen } from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const { enrollInCourse } = useApp();

  const handleEnroll = () => {
    enrollInCourse(course.id);
    toast.success(`Enrolled in ${course.title}!`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{course.title}</h3>
          {isEnrolled && course.progress !== undefined && (
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{course.progress}%</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.enrollmentCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons.length} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {course.instructor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-sm text-gray-600">{course.instructor.name}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {isEnrolled ? (
          <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200">
            <Play className="h-5 w-5" />
            <span>Continue Learning</span>
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            <BookOpen className="h-5 w-5" />
            <span>Enroll Now</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;