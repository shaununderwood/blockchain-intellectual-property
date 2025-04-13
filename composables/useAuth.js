// composables/useAuth.js
export const useAuth = () => {
  const router = useRouter()
  
  // Mock authentication function
  const login = () => {
    // In a real app, this would validate credentials and get a token from the server
    // For now, we'll just set a mock token in localStorage
    localStorage.setItem('auth_token', 'mock_token_' + Date.now())
    router.push('/dashboard')
  }
  
  // Sign out function
  const logout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('auth_token') !== null
  }
  
  return {
    login,
    logout,
    isAuthenticated
  }
}
