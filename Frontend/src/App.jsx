

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate  } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';
import EditApplication from './pages/EditApplication';
import ApplicationDetails from './pages/ApplicationDetails';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AppliedApplication from './pages/Appliedjobscilent'
import AdminDashboard  from './pages/AdminDashboard';
import Jobposting from './pages/PostJobs';
import PublicRoute from './components/PublicRoutes';
import  Feedback  from './pages/Feedback';


function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public pages only accessible when logged out */}
         <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Navigate to={localStorage.getItem('userRole') === 'admin' ? '/admin' : '/dashboard'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Private/Protected pages */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/applications/:id/edit" element={<ProtectedRoute><EditApplication /></ProtectedRoute>} />
        <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><AppliedApplication /></ProtectedRoute>} />
        <Route path="/adminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/postjobs" element={<ProtectedRoute><Jobposting /></ProtectedRoute>} />
         <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
      </Routes>
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
