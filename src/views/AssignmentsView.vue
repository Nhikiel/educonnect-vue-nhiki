<template>
  <AppLayout>
    <div class="space-y-8">
      <h1 class="text-2xl font-bold mb-6">Your Assignments</h1>
      
      <!-- Assignment Filter/Search -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div class="flex space-x-4">
            <select v-model="selectedFilter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Assignments</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
            <select v-model="selectedCourse" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Courses</option>
              <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
            </select>
          </div>
          <button @click="createNewAssignment" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            + New Assignment
          </button>
        </div>
      </div>

      <!-- Upcoming Assignments -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Upcoming Assignments</h2>
        <div class="space-y-4">
          <div v-for="assignment in filteredUpcomingAssignments" :key="assignment.id" class="flex items-start justify-between bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800">{{ assignment.title }}</h3>
              <p class="text-sm text-gray-500">{{ assignment.course }} – Due {{ formatDueDate(assignment.dueDate) }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ assignment.description }}</p>
              <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>{{ assignment.points }} points</span>
                <span>{{ assignment.type }}</span>
                <span v-if="assignment.estimatedTime">Est. {{ assignment.estimatedTime }}</span>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2 ml-4">
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getStatusClass(assignment.status)"
              >
                {{ assignment.status }}
              </span>
              <div class="flex space-x-2">
                <button 
                  @click="viewAssignment(assignment)"
                  class="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  View
                </button>
                <button 
                  @click="submitAssignment(assignment)"
                  class="text-sm px-3 py-1 rounded-md"
                  :class="assignment.status === 'Submitted' ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : assignment.status === 'Overdue' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
                  :disabled="assignment.status === 'Submitted'"
                >
                  {{ assignment.status === 'Submitted' ? 'Submitted' : assignment.status === 'Overdue' ? 'Submit Late' : assignment.status === 'In Progress' ? 'Submit Work' : 'Begin Assignment' }}
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredUpcomingAssignments.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m2 4H7m4 4h2M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
            <p>No upcoming assignments found</p>
          </div>
        </div>
      </section>

      <!-- Completed Assignments -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Completed Assignments</h2>
        <div class="space-y-4">
          <div v-for="assignment in filteredCompletedAssignments" :key="assignment.id" class="flex items-start justify-between bg-gray-50 p-4 rounded-md">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800">{{ assignment.title }}</h3>
              <p class="text-sm text-gray-500">{{ assignment.course }} – Submitted {{ formatDueDate(assignment.submittedDate) }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ assignment.description }}</p>
              <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>{{ assignment.points }} points</span>
                <span v-if="assignment.grade">Grade: {{ assignment.grade }}%</span>
                <span v-if="assignment.feedback">Feedback available</span>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2 ml-4">
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getGradeClass(assignment.grade)"
              >
                {{ assignment.grade ? `Graded: ${assignment.grade}%` : 'Submitted' }}
              </span>
              <div class="flex space-x-2">
                <button 
                  @click="viewSubmission(assignment)"
                  class="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  View
                </button>
                <button 
                  v-if="assignment.feedback"
                  @click="viewFeedback(assignment)"
                  class="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700"
                >
                  Feedback
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredCompletedAssignments.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <p>No completed assignments found</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Assignment Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">{{ selectedAssignment?.title }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedAssignment" class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-800">Course</h4>
              <p class="text-gray-600">{{ selectedAssignment.course }}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Due Date</h4>
              <p class="text-gray-600">{{ formatDueDate(selectedAssignment.dueDate) }}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Description</h4>
              <p class="text-gray-600">{{ selectedAssignment.description }}</p>
            </div>
            <div v-if="selectedAssignment.instructions">
              <h4 class="font-medium text-gray-800">Instructions</h4>
              <div class="text-gray-600 whitespace-pre-wrap">{{ selectedAssignment.instructions }}</div>
            </div>
            <div class="flex space-x-4 text-sm text-gray-500">
              <span>{{ selectedAssignment.points }} points</span>
              <span>{{ selectedAssignment.type }}</span>
              <span v-if="selectedAssignment.estimatedTime">Est. {{ selectedAssignment.estimatedTime }}</span>
            </div>

            <!-- Submission Area (only shown when in progress) -->
            <div v-if="selectedAssignment.status === 'In Progress' || selectedAssignment.status === 'Overdue'" class="mt-6 border-t pt-6">
              <h4 class="font-medium text-gray-800 mb-3">Your Submission</h4>
              <textarea 
                v-model="submissionContent"
                placeholder="Type your assignment submission here..."
                class="w-full h-40 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
              <div class="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>{{ submissionContent.length }} characters</span>
                <span>Remember to save your work before submitting</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="closeModal" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Close
            </button>
            <button 
              v-if="selectedAssignment?.status !== 'Submitted'"
              @click="submitAssignment(selectedAssignment)" 
              class="px-4 py-2 rounded-md"
              :class="selectedAssignment?.status === 'Overdue' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
            >
              {{ selectedAssignment?.status === 'Overdue' ? 'Submit Late' : selectedAssignment?.status === 'In Progress' ? 'Submit Assignment' : 'Begin Assignment' }}
            </button>
            <button 
              v-if="selectedAssignment?.status === 'Submitted'"
              @click="viewSubmission(selectedAssignment)"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              View Submission
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Submission View Modal -->
    <div v-if="showSubmissionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Submission: {{ selectedAssignment?.title }}</h3>
            <button @click="showSubmissionModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedAssignment" class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-800">Submitted Date</h4>
              <p class="text-gray-600">{{ formatDueDate(selectedAssignment.submittedDate) }}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Submission Type</h4>
              <p class="text-gray-600">{{ selectedAssignment.submissionType }}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Content</h4>
              <div class="bg-gray-50 p-4 rounded-md text-gray-700">
                {{ selectedAssignment.submissionContent }}
              </div>
            </div>
            <div v-if="selectedAssignment.grade">
              <h4 class="font-medium text-gray-800">Grade</h4>
              <p class="text-gray-600 font-semibold">{{ selectedAssignment.grade }}%</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showSubmissionModal = false" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div v-if="showFeedbackModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Feedback: {{ selectedAssignment?.title }}</h3>
            <button @click="showFeedbackModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedAssignment" class="space-y-4">
            <div v-if="selectedAssignment.grade">
              <h4 class="font-medium text-gray-800">Grade</h4>
              <p class="text-2xl font-bold" :class="getGradeClass(selectedAssignment.grade)">
                {{ selectedAssignment.grade }}%
              </p>
            </div>
            <div>
              <h4 class="font-medium text-gray-800">Instructor Feedback</h4>
              <div class="bg-blue-50 p-4 rounded-md text-gray-700">
                {{ selectedAssignment.feedbackContent }}
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="showFeedbackModal = false" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Assignment Modal -->
    <div v-if="showNewAssignmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Create New Assignment</h3>
            <button @click="closeNewAssignmentModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveNewAssignment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
              <input 
                v-model="newAssignmentForm.title" 
                type="text" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter assignment title"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select 
                v-model="newAssignmentForm.course" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                v-model="newAssignmentForm.dueDate" 
                type="datetime-local" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
              <input 
                v-model.number="newAssignmentForm.points" 
                type="number" 
                min="1"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="100"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
              <select 
                v-model="newAssignmentForm.type" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Homework">Homework</option>
                <option value="Quiz">Quiz</option>
                <option value="Project">Project</option>
                <option value="Exam">Exam</option>
                <option value="Essay">Essay</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
              <input 
                v-model="newAssignmentForm.estimatedTime" 
                type="text" 
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 2 hours"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="newAssignmentForm.description" 
                required
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief description of the assignment"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
              <textarea 
                v-model="newAssignmentForm.instructions" 
                rows="4"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Detailed instructions for students"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                @click="closeNewAssignmentModal" 
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

// Reactive data
const selectedFilter = ref('all')
const selectedCourse = ref('all')
const showModal = ref(false)
const showSubmissionModal = ref(false)
const showFeedbackModal = ref(false)
const showNewAssignmentModal = ref(false)
const selectedAssignment = ref(null)
const assignments = ref([])
const submissionContent = ref('')
const isEditingAssignment = ref(false)

// New assignment form data
const newAssignmentForm = ref({
  title: '',
  course: 'Mathematics',
  dueDate: '',
  points: 100,
  type: 'Homework',
  estimatedTime: '',
  description: '',
  instructions: ''
})

// Sample data
const courses = ref(['Mathematics', 'Computer Science', 'Physics', 'English Literature', 'Environmental Science'])

onMounted(() => {
  loadAssignments()
})

const loadAssignments = () => {
  // Sample assignments data
  assignments.value = [
    {
      id: 1,
      title: 'Calculus Homework #3',
      course: 'Mathematics',
      dueDate: new Date('2025-08-17T23:59:00'),
      description: 'Complete exercises 7–12 on page 143 of the textbook.',
      instructions: 'Solve all problems showing complete work. Submit as PDF with clear handwriting or typed solutions.',
      status: 'In Progress',
      type: 'Homework',
      points: 50,
      estimatedTime: '2-3 hours',
      isCompleted: false
    },
    {
      id: 2,
      title: 'Group Project Proposal',
      course: 'Computer Science',
      dueDate: new Date('2025-08-20T23:59:00'),
      description: 'Draft the proposal for your final group project including objectives and timeline.',
      instructions: 'Include: 1. Project overview, 2. Team members, 3. Timeline, 4. Expected deliverables',
      status: 'Not Started',
      type: 'Project',
      points: 100,
      estimatedTime: '4-5 hours',
      isCompleted: false
    },
    {
      id: 3,
      title: 'Reading Response',
      course: 'English Literature',
      dueDate: new Date('2025-08-12T23:59:00'),
      description: 'Write a 500‑word reflection on the assigned short story.',
      instructions: 'Analyze themes, character development, and literary devices used by the author.',
      status: 'Overdue',
      type: 'Essay',
      points: 75,
      estimatedTime: '1-2 hours',
      isCompleted: false
    },
    {
      id: 4,
      title: 'Physics Lab Report',
      course: 'Physics',
      dueDate: new Date('2025-07-29T23:59:00'),
      submittedDate: new Date('2025-07-29T20:30:00'),
      description: 'Experiment on projectile motion with detailed data analysis.',
      status: 'Completed',
      type: 'Lab Report',
      points: 100,
      grade: 95,
      feedback: true,
      isCompleted: true,
      submissionContent: 'Lab Report: Projectile Motion Analysis\n\nObjective: To study the motion of projectiles and verify theoretical predictions.\n\nMethods: Used launch apparatus to fire projectiles at various angles and measured range and height.\n\nResults: Data collected shows strong correlation with theoretical predictions. Maximum range achieved at 45° angle as expected.\n\nConclusion: Experimental results confirm projectile motion equations with 95% accuracy.',
      submissionType: 'PDF Document',
      feedbackContent: 'Excellent lab report! Your experimental design was thorough and data analysis was precise. The conclusion effectively tied experimental results to theoretical predictions. Consider adding error analysis for future reports. Well done!'
    },
    {
      id: 5,
      title: 'Essay on Climate Change',
      course: 'Environmental Science',
      dueDate: new Date('2025-07-22T23:59:00'),
      submittedDate: new Date('2025-07-22T15:45:00'),
      description: 'A persuasive essay discussing current climate challenges and solutions.',
      status: 'Completed',
      type: 'Essay',
      points: 150,
      grade: 88,
      feedback: true,
      isCompleted: true,
      submissionContent: 'Climate Change: A Call for Immediate Action\n\nIntroduction: Climate change represents one of the most pressing challenges of our time...\n\nBody: Current evidence shows unprecedented warming trends, rising sea levels, and extreme weather events...\n\nSolutions: Renewable energy adoption, carbon pricing, and international cooperation are essential...\n\nConclusion: Immediate action is required to mitigate climate impacts and ensure a sustainable future.',
      submissionType: 'Word Document',
      feedbackContent: 'Strong essay with compelling arguments and good use of evidence. Your structure is clear and the writing flows well. To improve, consider incorporating more recent data and addressing counterarguments. Overall, very persuasive work!'
    }
  ]
}

// Computed properties
const filteredUpcomingAssignments = computed(() => {
  return assignments.value.filter(assignment => {
    if (assignment.isCompleted) return false
    
    let matchesFilter = true
    if (selectedFilter.value === 'upcoming') {
      matchesFilter = assignment.status !== 'Overdue'
    } else if (selectedFilter.value === 'overdue') {
      matchesFilter = assignment.status === 'Overdue'
    }
    
    let matchesCourse = selectedCourse.value === 'all' || assignment.course === selectedCourse.value
    
    return matchesFilter && matchesCourse
  })
})

const filteredCompletedAssignments = computed(() => {
  return assignments.value.filter(assignment => {
    if (!assignment.isCompleted) return false
    
    let matchesCourse = selectedCourse.value === 'all' || assignment.course === selectedCourse.value
    
    return matchesCourse
  })
})

// Methods
const getStatusClass = (status) => {
  switch (status) {
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-700'
    case 'Not Started':
      return 'bg-green-100 text-green-700'
    case 'Overdue':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getGradeClass = (grade) => {
  if (!grade) return 'bg-blue-100 text-blue-700'
  if (grade >= 90) return 'bg-green-100 text-green-700'
  if (grade >= 80) return 'bg-yellow-100 text-yellow-700'
  if (grade >= 70) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

const formatDueDate = (date) => {
  const now = new Date()
  const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} days ago`
  } else if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString()
  }
}

const viewAssignment = (assignment) => {
  selectedAssignment.value = assignment
  // Load existing submission content if assignment is in progress
  if (assignment.status === 'In Progress' && assignment.submissionContent) {
    submissionContent.value = assignment.submissionContent
  } else {
    submissionContent.value = ''
  }
  showModal.value = true
}

const submitAssignment = (assignment) => {
  console.log('Submitting assignment:', assignment.title)
  
  // Prevent action if already submitted
  if (assignment.status === 'Submitted') {
    console.log('Assignment already submitted:', assignment.title)
    return
  }
  
  if (assignment.status === 'Not Started') {
    // Begin working on assignment
    assignment.status = 'In Progress'
    console.log(`Started working on: ${assignment.title}`)
  } else if (assignment.status === 'In Progress' || assignment.status === 'Overdue') {
    // Check if there's submission content
    if (!submissionContent.value.trim()) {
      alert('Please enter your submission content before submitting.')
      return
    }
    
    // Submit completed work
    assignment.status = 'Submitted'
    assignment.submittedDate = new Date()
    
    // Use the actual submission content
    assignment.submissionContent = submissionContent.value.trim()
    assignment.submissionType = 'Text Submission'
    
    // Move from upcoming to completed
    const index = assignments.value.findIndex(a => a.id === assignment.id)
    if (index > -1) {
      assignments.value[index] = { ...assignment, status: 'Submitted' }
    }
    
    // Clear the submission content and close modal
    submissionContent.value = ''
    showModal.value = false
    
    console.log(`Submitted: ${assignment.title}`)
  }
  
  // Close modal if open
  if (showModal.value && selectedAssignment.value?.id === assignment.id) {
    closeModal()
  }
}

const viewSubmission = (assignment) => {
  console.log('Viewing submission:', assignment.title)
  
  // Create a submission view modal
  selectedAssignment.value = {
    ...assignment,
    submissionContent: assignment.submissionContent || 'Your submitted work would be displayed here...',
    submissionType: assignment.submissionType || 'Document'
  }
  showSubmissionModal.value = true
}

const viewFeedback = (assignment) => {
  console.log('Viewing feedback:', assignment.title)
  
  // Show feedback in modal
  selectedAssignment.value = {
    ...assignment,
    feedbackContent: assignment.feedbackContent || `Excellent work on "${assignment.title}"! Your analysis was thorough and well-structured. Consider expanding on the conclusion section for future assignments. Grade: ${assignment.grade || 'Pending'}%`
  }
  showFeedbackModal.value = true
}

const createNewAssignment = () => {
  console.log('Opening new assignment form')
  
  // Reset form
  newAssignmentForm.value = {
    title: '',
    course: selectedCourse.value !== 'all' ? selectedCourse.value : 'Mathematics',
    dueDate: '',
    points: 100,
    type: 'Homework',
    estimatedTime: '',
    description: '',
    instructions: ''
  }
  
  // Set default due date to one week from now
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(23, 59, 0, 0)
  newAssignmentForm.value.dueDate = nextWeek.toISOString().slice(0, 16)
  
  showNewAssignmentModal.value = true
}

const saveNewAssignment = () => {
  const newAssignment = {
    id: Date.now(),
    title: newAssignmentForm.value.title,
    course: newAssignmentForm.value.course,
    dueDate: new Date(newAssignmentForm.value.dueDate),
    description: newAssignmentForm.value.description,
    instructions: newAssignmentForm.value.instructions,
    points: newAssignmentForm.value.points,
    type: newAssignmentForm.value.type,
    status: 'Not Started',
    estimatedTime: newAssignmentForm.value.estimatedTime
  }
  
  assignments.value.unshift(newAssignment)
  console.log('Created new assignment:', newAssignment.title)
  
  closeNewAssignmentModal()
}

const closeNewAssignmentModal = () => {
  showNewAssignmentModal.value = false
  newAssignmentForm.value = {
    title: '',
    course: 'Mathematics',
    dueDate: '',
    points: 100,
    type: 'Homework',
    estimatedTime: '',
    description: '',
    instructions: ''
  }
}

const closeModal = () => {
  showModal.value = false
  showSubmissionModal.value = false
  showFeedbackModal.value = false
  showNewAssignmentModal.value = false
  selectedAssignment.value = null
}
</script>
