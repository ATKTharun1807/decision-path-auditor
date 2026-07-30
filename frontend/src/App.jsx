import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Sessions     from './pages/Sessions';
import Analytics    from './pages/Analytics';
import Policies     from './pages/Policies';
import SettingsPage from './pages/Settings';
import TimelineView from './pages/TimelineView';

// Global auth interceptors
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/sessions"    element={<PrivateRoute><Sessions /></PrivateRoute>} />
        <Route path="/analytics"   element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/policies"    element={<PrivateRoute><Policies /></PrivateRoute>} />
        <Route path="/settings"    element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/session/:id" element={<PrivateRoute><TimelineView /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
