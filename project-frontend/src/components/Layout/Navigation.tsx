import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Home, 
  User, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  Code,
  Trophy,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['LEARNER', 'INSTRUCTOR', 'ADMIN'] },
    { path: '/courses', icon: BookOpen, label: 'Courses', roles: ['LEARNER', 'INSTRUCTOR', 'ADMIN'] },
    { path: '/coding', icon: Code, label: 'Coding Lab', roles: ['LEARNER', 'INSTRUCTOR', 'ADMIN'] },
    { path: '/progress', icon: Trophy, label: 'Progress', roles: ['LEARNER'] },
    { path: '/my-courses', icon: BookOpen, label: 'My Courses', roles: ['INSTRUCTOR'] },
    { path: '/admin', icon: BarChart3, label: 'Admin Panel', roles: ['ADMIN'] },
    { path: '/users', icon: Users, label: 'User Management', roles: ['ADMIN'] },
  ];

  const visibleItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <nav className="bg-white shadow-lg border-r border-gray-200 h-screen w-64 fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduCode</h1>
            <p className="text-sm text-gray-500">Learning Platform</p>
          </div>
        </Link>
      </div>

      <div className="px-4 py-6 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;