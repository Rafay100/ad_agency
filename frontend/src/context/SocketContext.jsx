import { createContext, useContext, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { initSocket, getSocket } from '@/lib/socket'

const SocketContext = createContext(null)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const { user } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        socketRef.current = initSocket(token)
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [user])

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }

  const value = {
    socket: socketRef.current,
    connected: socketRef.current?.connected || false,
    on,
    off,
    emit,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
