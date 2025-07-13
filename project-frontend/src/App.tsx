import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Layout/Navigation';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './components/Dashboard/Dashboard';
import CourseList from './components/Courses/CourseList';
import CodingLab from './components/Coding/CodingLab';
import ProgressTracker from './components/Progress/ProgressTracker';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 ml-64">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/coding" element={<CodingLab />} />
          {user.role === 'LEARNER' && (
            <Route path="/progress" element={<ProgressTracker />} />
          )}
          {user.role === 'ADMIN' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <AppContent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;