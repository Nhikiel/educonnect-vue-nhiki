<template>
  <AppLayout>
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Students & Enrollments</h1>
        <div class="flex space-x-3">
          <button @click="exportData" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            Export
          </button>
          <button @click="addStudent" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            + Add Student
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex flex-wrap gap-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search students..."
              class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              v-model="selectedYear"
              class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Years</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
            <select
              v-model="selectedMajor"
              class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Majors</option>
              <option v-for="major in majors" :key="major" :value="major">{{ major }}</option>
            </select>
            <select
              v-model="selectedStatus"
              class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <button
              @click="viewMode = 'table'"
              class="px-3 py-2 rounded-md text-sm"
              :class="viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'"
            >
              Table
            </button>
            <button
              @click="viewMode = 'cards'"
              class="px-3 py-2 rounded-md text-sm"
              :class="viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'"
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Total Students</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Active Students</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeStudents }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">Average GPA</p>
              <p class="text-2xl font-semibold text-gray-900">{{ averageGPA }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-600">New This Month</p>
              <p class="text-2xl font-semibold text-gray-900">{{ newStudents }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Students List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Table View -->
        <div v-if="viewMode === 'table'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('name')" class="flex items-center space-x-1 hover:text-gray-700">
                    <span>Student</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('major')" class="flex items-center space-x-1 hover:text-gray-700">
                    <span>Major</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('gpa')" class="flex items-center space-x-1 hover:text-gray-700">
                    <span>GPA</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Courses</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="student.avatar" :alt="student.name" class="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                      <div class="text-sm text-gray-500">{{ student.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ student.studentId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ student.major }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ student.year }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ student.gpa }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="course in student.courses.slice(0, 2)"
                      :key="course"
                      class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                    >
                      {{ course }}
                    </span>
                    <span
                      v-if="student.courses.length > 2"
                      class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      +{{ student.courses.length - 2 }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(student.status)"
                  >
                    {{ student.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="viewStudent(student)" class="text-indigo-600 hover:text-indigo-900">View</button>
                    <button @click="editStudent(student)" class="text-green-600 hover:text-green-900">Edit</button>
                    <button @click="deleteStudent(student)" class="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards View -->
        <div v-else class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="student in filteredStudents"
              :key="student.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center space-x-4 mb-4">
                <img :src="student.avatar" :alt="student.name" class="w-12 h-12 rounded-full" />
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ student.name }}</h3>
                  <p class="text-sm text-gray-500">{{ student.studentId }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(student.status)"
                >
                  {{ student.status }}
                </span>
              </div>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Major:</span>
                  <span class="text-gray-900">{{ student.major }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Year:</span>
                  <span class="text-gray-900">{{ student.year }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">GPA:</span>
                  <span class="text-gray-900">{{ student.gpa }}</span>
                </div>
              </div>
              
              <div class="mt-4">
                <p class="text-sm text-gray-500 mb-2">Current Courses:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="course in student.courses"
                    :key="course"
                    class="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                  >
                    {{ course }}
                  </span>
                </div>
              </div>
              
              <div class="mt-4 flex space-x-2">
                <button
                  @click="viewStudent(student)"
                  class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700"
                >
                  View Details
                </button>
                <button
                  @click="editStudent(student)"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Students Found -->
        <div v-if="filteredStudents.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 714-4h1M3 8a4 4 0 714-4 4 4 0 714 4v4a4 4 0 01-4 4 4 4 0 01-4-4V8zM17 8a4 4 0 00-4-4 4 4 0 00-4 4v4a4 4 0 004 4 4 4 0 004-4V8z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800 mb-2">No students found</h3>
          <p class="text-gray-600">Try adjusting your search or filters</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

// Reactive data
const searchQuery = ref('')
const selectedYear = ref('')
const selectedMajor = ref('')
const selectedStatus = ref('')
const viewMode = ref('table')
const sortField = ref('name')
const sortDirection = ref('asc')
const students = ref([])

const years = ref(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'])
const majors = ref(['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Business', 'Psychology', 'Biology', 'Chemistry'])

onMounted(() => {
  loadStudents()
})

const loadStudents = () => {
  // Sample student data
  students.value = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@university.edu',
      studentId: 'ST2021001',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      major: 'Computer Science',
      year: 'Senior',
      gpa: 3.9,
      status: 'active',
      courses: ['CS 401', 'CS 425', 'MATH 301', 'CS 490']
    },
    {
      id: 2,
      name: 'Michael Johnson',
      email: 'michael.johnson@university.edu',
      studentId: 'ST2022015',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      major: 'Mathematics',
      year: 'Junior',
      gpa: 3.7,
      status: 'active',
      courses: ['MATH 301', 'MATH 315', 'STAT 201']
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@university.edu',
      studentId: 'ST2020087',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      major: 'Physics',
      year: 'Graduate',
      gpa: 3.8,
      status: 'active',
      courses: ['PHYS 501', 'PHYS 520', 'MATH 401']
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@university.edu',
      studentId: 'ST2023042',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      major: 'Engineering',
      year: 'Sophomore',
      gpa: 3.5,
      status: 'active',
      courses: ['ENG 201', 'MATH 205', 'PHYS 201', 'ENG 210']
    },
    {
      id: 5,
      name: 'Lisa Park',
      email: 'lisa.park@university.edu',
      studentId: 'ST2021156',
      avatar: 'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      major: 'Business',
      year: 'Senior',
      gpa: 3.6,
      status: 'inactive',
      courses: ['BUS 401', 'BUS 420', 'ECON 301']
    }
  ]
}

// Computed properties
const filteredStudents = computed(() => {
  let filtered = students.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query) ||
      student.major.toLowerCase().includes(query)
    )
  }

  // Filter by year
  if (selectedYear.value) {
    filtered = filtered.filter(student => student.year === selectedYear.value)
  }

  // Filter by major
  if (selectedMajor.value) {
    filtered = filtered.filter(student => student.major === selectedMajor.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(student => student.status === selectedStatus.value)
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue = a[sortField.value]
    let bValue = b[sortField.value]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'active').length)
const averageGPA = computed(() => {
  const sum = students.value.reduce((acc, student) => acc + student.gpa, 0)
  return (sum / students.value.length).toFixed(2)
})
const newStudents = computed(() => 8) // Mock data

// Methods
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'graduated':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const viewStudent = (student) => {
  console.log('Viewing student:', student.name)
  // Student details functionality
}

const editStudent = (student) => {
  console.log('Editing student:', student.name)
  // Edit student functionality
}

const deleteStudent = (student) => {
  if (confirm(`Are you sure you want to delete ${student.name}?`)) {
    const index = students.value.findIndex(s => s.id === student.id)
    if (index > -1) {
      students.value.splice(index, 1)
    }
  }
}

const addStudent = () => {
  console.log('Adding new student')
  // Add student functionality
}

const exportData = () => {
  console.log('Exporting student data')
  // Export functionality
}
</script>
