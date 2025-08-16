<template>
  <div class="bg-gray-100 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500"
            >create a new account</router-link
          >
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
              @click="handleForgotPassword"
              >Forgot your password?</a
            >
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 class="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <p class="text-xs text-blue-700">
            You can use any email and password to log in to the demo.
          </p>
          <div class="mt-2 space-x-2">
            <button
              type="button"
              @click="fillDemoCredentials"
              class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Fill Demo Data
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Reactive data
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: 'nhikiel.vidallon@university.edu',
  password: 'password123',
  rememberMe: false,
})

// Methods
const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    // Simulate login - accept any credentials
    if (form.email && form.password) {
      // Always log in as Nhikiel Vidallon for demo
      const nhikielUser = {
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
      userStore.setCurrentUser(nhikielUser)
      router.push('/')
    } else {
      error.value = 'Please enter both email and password'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = () => {
  // Forgot password functionality
}

const fillDemoCredentials = () => {
  form.email = 'nhikiel.vidallon@university.edu'
  form.password = 'password123'
}
</script>
