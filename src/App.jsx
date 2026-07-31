import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Checkin from './pages/Checkin'
import Report from './pages/Report'
import Doctor from './pages/Doctor'
import Family from './pages/Family'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/report" element={<Report />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/family" element={<Family />} />
    </Routes>
  )
}
