import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Sessions from './pages/Sessions'
import SessionsAdmin from './pages/SessionsAdmin'
import Leaderboard from './pages/Leaderboard'
import LeaderboardAdmin from './pages/LeaderboardAdmin'
import AdminGate from './components/AdminGate'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/admin/sessions" element={<AdminGate><SessionsAdmin /></AdminGate>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/leaderboard-mgmt-7k2x" element={<AdminGate><LeaderboardAdmin /></AdminGate>} />
      </Routes>
    </BrowserRouter>
  )
}
