import { useState, useEffect } from 'react'

interface AuthHook {
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const useAuth = (): AuthHook => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for authentication token in localStorage or cookies
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem('auth_token', token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout
  }
}

export default useAuth 