import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Landing from './pages/Landing';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/:username" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/:username/project/:id" element={<ProjectDetails />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<SuperAdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute><SuperAdminDashboard /></ProtectedAdminRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}
