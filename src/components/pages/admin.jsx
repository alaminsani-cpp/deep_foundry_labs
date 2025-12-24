import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext.jsx';
import AdminLogin from './admin/adminlogin.jsx';
import AdminDashboard from './admin/admindashboard.jsx';
import AdminDatasets from './admin/admindatasets.jsx';


const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#02081a] to-[#0a1025] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const Admin = () => {
  return (
    <div className="admin-layout">
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/datasets" element={
          <ProtectedRoute>
            <AdminDatasets />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default Admin;