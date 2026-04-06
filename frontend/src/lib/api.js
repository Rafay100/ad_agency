import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle responses - DO NOT automatically clear tokens on 401
// Only clear tokens on explicit logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Just pass the error through - let the calling component handle it
    // DO NOT auto-redirect or clear tokens here
    return Promise.reject(error)
  }
)

export default api
