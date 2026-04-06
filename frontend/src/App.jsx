import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Campaigns from './pages/Campaigns'
import CampaignBrief from './pages/CampaignBrief'
import Analytics from './pages/Analytics'
import AlertRules from './pages/AlertRules'
import Settings from './pages/Settings'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'

function App() {
  const [token, setToken] = useState(localStorage.getItem('accessToken'))

  // Listen for token changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('accessToken')
      setToken(currentToken)
    }

    // Check token on mount
    checkToken()

    // Listen for storage changes (for multi-tab support)
    window.addEventListener('storage', checkToken)
    
    // Custom event for same-tab token changes
    window.addEventListener('tokenChange', checkToken)
    
    return () => {
      window.removeEventListener('storage', checkToken)
      window.removeEventListener('tokenChange', checkToken)
    }
  }, [])

  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      {token ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaign-brief" element={<CampaignBrief />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alert-rules" element={<AlertRules />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      ) : (
        <Route path="*" element={<Login />} />
      )}
    </Routes>
  )
}

export default App
