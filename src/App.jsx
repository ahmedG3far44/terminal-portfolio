import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Theme from './pages/Theme'
import ProjectDetails from './pages/ProjectDetails'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Theme />} />
        <Route path="/project/:slug" element={<ProjectDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}