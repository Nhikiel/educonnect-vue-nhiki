<template>
  <div class="bg-gray-100 text-gray-800 antialiased min-h-screen">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b shadow-sm fixed top-0 inset-x-0 z-50">
      <div class="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-4">
          <router-link to="/" class="text-2xl font-bold text-indigo-600">EduConnect</router-link>
          <div class="hidden md:block">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-64 bg-gray-100 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @input="handleSearch"
            />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="relative text-gray-600 hover:text-indigo-600 focus:outline-none" @click="toggleNotifications">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">{{ notificationCount }}</span>
          </button>
          
          <!-- Profile Dropdown -->
          <div class="relative">
            <button @click="toggleProfileDropdown" class="flex items-center focus:outline-none">
              <img
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="w-8 h-8 rounded-full"
              />
            </button>
            <div v-if="showProfileDropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-10">
              <router-link to="/profile" class="block px-4 py-2 text-gray-600 hover:bg-gray-100" @click="showProfileDropdown = false">View Profile</router-link>
              <a href="#settings" class="block px-4 py-2 text-gray-600 hover:bg-gray-100">Settings</a>
              <a href="#logout" class="block px-4 py-2 text-gray-600 hover:bg-gray-100" @click="handleLogout">Log Out</a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Layout wrapper -->
    <div class="pt-16 max-w-7xl mx-auto flex flex-col lg:flex-row">
      <!-- Left Sidebar -->
      <aside class="hidden lg:block lg:w-64 bg-white border-r px-4 py-6 space-y-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">Navigation</h3>
          <nav class="space-y-2">
            <router-link 
              v-for="navItem in navigationItems" 
              :key="navItem.path"
              :to="navItem.path" 
              class="flex items-center hover:text-indigo-600"
              :class="$route.path === navItem.path ? 'text-indigo-600 font-medium' : 'text-gray-600'"
            >
              <component :is="navItem.icon" class="w-5 h-5 mr-2" />
              {{ navItem.name }}
            </router-link>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Icons as template strings for simplicity
const FeedIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 17l4-4-4-4m8 8l-4-4 4-4" /></svg>`
}

const CommunitiesIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1M3 8a4 4 0 014-4 4 4 0 014 4v4a4 4 0 01-4 4 4 4 0 01-4-4V8zM17 8a4 4 0 00-4-4 4 4 0 00-4 4v4a4 4 0 004 4 4 4 0 004-4V8z" /></svg>`
}

const AssignmentsIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m2 4H7m4 4h2M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>`
}

const ChatIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>`
}

const ProfileIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A9 9 0 1118.878 6.196a9 9 0 01-13.757 11.608z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
}

const CreateCourseIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>`
}

const StudentsIcon = {
  template: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 714-4h1M20 9a4 4 0 00-4-4 4 4 0 00-4 4v5a4 4 0 004 4 4 4 0 004-4V9zM4 9a4 4 0 014-4 4 4 0 014 4v5a4 4 0 01-4 4 4 4 0 01-4-4V9z" /></svg>`
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Reactive data
const searchQuery = ref('')
const showProfileDropdown = ref(false)
const notificationCount = ref(3)

// Navigation items
const navigationItems = ref([
  { name: 'Feed', path: '/', icon: FeedIcon },
  { name: 'Communities', path: '/communities', icon: CommunitiesIcon },
  { name: 'Assignments', path: '/assignments', icon: AssignmentsIcon },
  { name: 'Chat', path: '/chat', icon: ChatIcon },
  { name: 'Profile', path: '/profile', icon: ProfileIcon },
  { name: 'Create Course', path: '/create-course', icon: CreateCourseIcon },
  { name: 'Students', path: '/students', icon: StudentsIcon },
])

// Computed properties
const currentUser = computed(() => userStore.currentUser || {
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
})

const searchPlaceholder = computed(() => {
  const routePlaceholders = {
    '/': 'Search for courses, people, or communities…',
    '/assignments': 'Search assignments…',
    '/chat': 'Search chats…',
    '/communities': 'Search for communities or people…',
    '/create-course': 'Search courses…',
    '/students': 'Search students…'
  }
  return routePlaceholders[route.path] || 'Search…'
})

// Methods
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const toggleNotifications = () => {
  console.log('Toggle notifications')
  // Implement notifications functionality
}

const handleSearch = () => {
  console.log('Search query:', searchQuery.value)
  // Implement search functionality
}

const handleLogout = () => {
  console.log('Logging out...')
  userStore.logout()
  router.push('/login')
}

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (showProfileDropdown.value && !event.target.closest('.relative')) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
