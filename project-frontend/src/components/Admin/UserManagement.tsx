import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, MoreVertical, Shield, Mail } from 'lucide-react';
import { User } from '../../types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'LEARNER',
      createdAt: '2024-01-15',
      isVerified: true,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'INSTRUCTOR',
      createdAt: '2024-01-10',
      isVerified: true,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'INSTRUCTOR',
      createdAt: '2024-01-08',
      isVerified: false,
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'LEARNER',
      createdAt: '2024-01-20',
      isVerified: true,
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setShowEditModal(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'LEARNER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const roleStats = {
    total: users.length,
    learners: users.filter(u => u.role === 'LEARNER').length,
    instructors: users.filter(u => u.role === 'INSTRUCTOR').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage platform users and their permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{roleStats.total}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{roleStats.learners}</div>
            <div className="text-gray-600">Learners</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{roleStats.instructors}</div>
            <div className="text-gray-600">Instructors</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{roleStats.admins}</div>
            <div className="text-gray-600">Admins</div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Roles</option>
                <option value="LEARNER">Learners</option>
                <option value="INSTRUCTOR">Instructors</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              <UserPlus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="text-sm text-gray-600">
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toast.success('Email sent successfully')}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(selectedUser);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LEARNER">Learner</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={selectedUser.isVerified}
                  onChange={(e) => setSelectedUser({ ...selectedUser, isVerified: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="verified" className="text-sm text-gray-700">Verified User</label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;