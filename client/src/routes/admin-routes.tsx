import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import AdminLayout from '@/pages/admin-layout';
import AdminDashboard from '@/pages/admin-dashboard';
import AdminUsers from '@/pages/admin-users';
import AdminCreateUser from '@/pages/admin-create-user';
import AdminEditUser from '@/pages/admin-edit-user';
import AdminInvoices from '@/pages/admin-invoices';
import AdminCreateInvoice from '@/pages/admin-create-invoice';
import AdminEditInvoice from '@/pages/admin-edit-invoice';
import AdminSettings from '@/pages/admin-settings';
import AdminProfile from '@/pages/admin-profile';
import AdminNotifications from '@/pages/admin-notifications';
import AdminLogin from '@/pages/admin/login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/create" element={<AdminCreateUser />} />
        <Route path="users/:id" element={<AdminEditUser />} />
        <Route path="invoices" element={<AdminInvoices />} />
        <Route path="invoices/create" element={<AdminCreateInvoice />} />
        <Route path="invoices/:id" element={<AdminEditInvoice />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
} 