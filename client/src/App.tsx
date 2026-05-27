import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/:username" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/:username/project/:id" element={<ProjectDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/super/login" element={<SuperAdminLogin />} />
        <Route path="/admin/super" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  );
}
