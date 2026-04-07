import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/lib/api'
import { initSocket, disconnectSocket } from '@/lib/socket'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      // Just set user as authenticated - don't call API which might fail and clear token
      setUser({ token })
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    const result = data.data || data  // Handle nested response structure
    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)
    setUser(result.user)
    return result
  }

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    // Don't auto-login after registration - user must sign in manually
    return data.data || data
  }

  const logout = () => {
    disconnectSocket()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    // Notify App component that token changed
    window.dispatchEvent(new Event('tokenChange'))
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
