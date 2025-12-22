import React from 'react';
import { useAuth } from '../../../contexts/authcontext.jsx';

const AdminDashboard = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02081a] to-[#0a1025] p-6">
      {/* No navigation bar or header here */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome to the admin panel</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard content here */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Users</h3>
            <p className="text-gray-400">Manage user accounts</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Content</h3>
            <p className="text-gray-400">Manage website content</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
            <p className="text-gray-400">Configure system settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;