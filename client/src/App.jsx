import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Sessions from './pages/Sessions'
import SessionsAdmin from './pages/SessionsAdmin'
import AdminGate from './components/AdminGate'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/admin/sessions" element={<AdminGate><SessionsAdmin /></AdminGate>} />
      </Routes>
    </BrowserRouter>
  )
}
