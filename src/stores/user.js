import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const isLoggedIn = ref(false)

  // Initialize with demo user
  const initializeUser = () => {
    currentUser.value = {
      id: 2,
      name: 'Nhikiel Vidallon',
      email: 'nhikiel.vidallon@university.edu',
      avatar: '/image/nhk.jpg',
      role: 'student',
      bio: 'BSIT 31E1 student, likes to play with computers.',
      year: '3rd Year',
      major: 'BSIT 31E1',
      description: 'likes to play with computers',
      status: 'student',
      joinedDate: '2025-08-16',
    }
    isLoggedIn.value = true
  }

  const login = async (credentials) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo login - accept any email/password
      currentUser.value = {
        id: 1,
        name: 'Alex Johnson',
        email: credentials.email,
        avatar:
          'https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
        role: 'student',
      }
      isLoggedIn.value = true
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      currentUser.value = {
        id: Date.now(),
        name: userData.fullName,
        email: userData.email,
        avatar:
          'https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
        role: 'student',
      }
      isLoggedIn.value = true
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
  }

  const setCurrentUser = (user) => {
    currentUser.value = user
    isLoggedIn.value = true
  }

  const updateProfile = (updates) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates }
    }
  }

  // Initialize user on store creation - commented out for login/register flow
  // initializeUser()

  return {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    setCurrentUser,
    updateProfile,
    initializeUser,
  }
})
