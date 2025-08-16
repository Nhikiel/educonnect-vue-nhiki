<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-8">
        <h1 class="text-2xl font-bold mb-6">Create New Course</h1>
        
        <form @submit.prevent="createCourse" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Introduction to Computer Science"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
              <input
                v-model="form.code"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., CS 101"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                v-model="form.department"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Credits *</label>
              <select
                v-model="form.credits"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Credits</option>
                <option v-for="credit in [1, 2, 3, 4, 5, 6]" :key="credit" :value="credit">{{ credit }}</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
            ></textarea>
          </div>

          <!-- Schedule -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Schedule</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  v-model="form.startDate"
                  type="date"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  v-model="form.endDate"
                  type="date"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Enrollment</label>
                <input
                  v-model.number="form.maxEnrollment"
                  type="number"
                  min="1"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 30"
                />
              </div>
            </div>
          </div>

          <!-- Meeting Times -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Meeting Times</h3>
            <div class="space-y-4">
              <div
                v-for="(meeting, index) in form.meetingTimes"
                :key="index"
                class="flex items-center space-x-4 p-4 border border-gray-200 rounded-md"
              >
                <select
                  v-model="meeting.day"
                  class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Day</option>
                  <option v-for="day in daysOfWeek" :key="day" :value="day">{{ day }}</option>
                </select>
                
                <input
                  v-model="meeting.startTime"
                  type="time"
                  class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                <span class="text-gray-500">to</span>
                
                <input
                  v-model="meeting.endTime"
                  type="time"
                  class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                <input
                  v-model="meeting.location"
                  type="text"
                  placeholder="Location"
                  class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                <button
                  type="button"
                  @click="removeMeetingTime(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <button
                type="button"
                @click="addMeetingTime"
                class="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                + Add Meeting Time
              </button>
            </div>
          </div>

          <!-- Prerequisites -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
            <div class="flex items-center space-x-2 mb-2">
              <input
                v-model="newPrerequisite"
                type="text"
                placeholder="Enter course code (e.g., MATH 101)"
                class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @keyup.enter="addPrerequisite"
              />
              <button
                type="button"
                @click="addPrerequisite"
                class="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(prereq, index) in form.prerequisites"
                :key="index"
                class="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full flex items-center"
              >
                {{ prereq }}
                <button
                  type="button"
                  @click="removePrerequisite(index)"
                  class="ml-2 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Additional Settings -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Additional Settings</h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <input
                  v-model="form.isOnline"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Online/Hybrid Course</label>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="form.allowWaitlist"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Allow Waitlist</label>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="form.requiresPermission"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label class="ml-2 text-sm text-gray-700">Requires Instructor Permission</label>
              </div>
            </div>
          </div>

          <!-- Grading Policy -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Grading Policy</label>
            <textarea
              v-model="form.gradingPolicy"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the grading breakdown (e.g., Exams 40%, Assignments 30%, Projects 20%, Participation 10%)"
            ></textarea>
          </div>

          <!-- Course Materials -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Required Textbooks/Materials</label>
            <textarea
              v-model="form.materials"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="List required textbooks, software, or other materials..."
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="saveDraft"
              class="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Creating...' : 'Create Course' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'

const router = useRouter()

// Reactive data
const loading = ref(false)
const newPrerequisite = ref('')

const departments = ref([
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Psychology',
  'English',
  'History',
  'Economics',
  'Business Administration',
  'Engineering',
  'Art',
  'Music'
])

const daysOfWeek = ref([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
])

const form = reactive({
  title: '',
  code: '',
  department: '',
  credits: '',
  description: '',
  startDate: '',
  endDate: '',
  maxEnrollment: 30,
  meetingTimes: [
    {
      day: '',
      startTime: '',
      endTime: '',
      location: ''
    }
  ],
  prerequisites: [],
  isOnline: false,
  allowWaitlist: true,
  requiresPermission: false,
  gradingPolicy: '',
  materials: ''
})

// Methods
const addMeetingTime = () => {
  form.meetingTimes.push({
    day: '',
    startTime: '',
    endTime: '',
    location: ''
  })
}

const removeMeetingTime = (index) => {
  if (form.meetingTimes.length > 1) {
    form.meetingTimes.splice(index, 1)
  }
}

const addPrerequisite = () => {
  if (newPrerequisite.value.trim() && !form.prerequisites.includes(newPrerequisite.value.trim())) {
    form.prerequisites.push(newPrerequisite.value.trim())
    newPrerequisite.value = ''
  }
}

const removePrerequisite = (index) => {
  form.prerequisites.splice(index, 1)
}

const createCourse = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Creating course:', form)
    // Course created successfully
    router.push('/')
  } catch (error) {
    console.error('Failed to create course:', error)
    // Handle error
  } finally {
    loading.value = false
  }
}

const saveDraft = () => {
  console.log('Saving draft:', form)
  // Course saved as draft
}
</script>
