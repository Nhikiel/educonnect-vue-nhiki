<template>
  <AppLayout>
    <div class="space-y-8">
      <!-- Cover & Profile Info -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Cover Image -->
        <div class="h-40 bg-indigo-600 relative">
          <img
            v-if="userProfile.coverImage"
            :src="userProfile.coverImage"
            alt="Cover"
            class="w-full h-full object-cover"
          />
          <button
            v-if="isOwnProfile"
            @click="changeCoverPhoto"
            class="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm hover:bg-opacity-70"
          >
            Change Cover
          </button>
        </div>
        
        <!-- Profile Content -->
        <div class="px-6 pb-6 relative">
          <!-- Profile Picture - overlaps cover -->
          <div class="absolute -top-16 left-6 z-20">
            <img
              :src="userProfile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'"
              :alt="userProfile.name || 'User'"
              class="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <button
              v-if="isOwnProfile"
              @click="changeProfilePhoto"
              class="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 z-30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <!-- Profile Info - positioned below cover with proper spacing -->
          <div class="pt-20">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ userProfile.name || 'Loading...' }}</h1>
                <p class="text-gray-600">{{ userProfile.year || 'N/A' }} • {{ userProfile.major || 'N/A' }}</p>
                <p class="text-sm text-gray-500 mt-1">Joined {{ userProfile.joinedDate ? formatDate(userProfile.joinedDate) : 'N/A' }}</p>
              </div>
              <div class="flex space-x-3 mt-4 sm:mt-0">
                <button
                  v-if="isOwnProfile"
                  @click="editProfile"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
                <template v-else>
                  <button
                    @click="sendMessage"
                    class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Message
                  </button>
                  <button
                    @click="toggleFollow"
                    class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    {{ isFollowing ? 'Unfollow' : 'Follow' }}
                  </button>
                </template>
              </div>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="flex space-x-8 mt-6 pt-6 border-t border-gray-200">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ userProfile.stats?.posts || 0 }}</div>
              <div class="text-sm text-gray-500">Posts</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ userProfile.stats?.followers || 0 }}</div>
              <div class="text-sm text-gray-500">Followers</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ userProfile.stats?.following || 0 }}</div>
              <div class="text-sm text-gray-500">Following</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ userProfile.gpa || 'N/A' }}</div>
              <div class="text-sm text-gray-500">GPA</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- About Section -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">About</h2>
              <button
                v-if="isOwnProfile"
                @click="editAbout"
                class="text-indigo-600 text-sm hover:underline"
              >
                Edit
              </button>
            </div>
            <p class="text-gray-600">{{ userProfile.bio || 'No bio available.' }}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-2">Academic Info</h4>
                <div class="space-y-2 text-sm text-gray-600">
                  <div class="flex justify-between">
                    <span>Major:</span>
                    <span>{{ userProfile.major || 'Not specified' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Year:</span>
                    <span>{{ userProfile.year || 'Not specified' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>GPA:</span>
                    <span>{{ userProfile.gpa || 'N/A' }}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-800 mb-2">Current Courses</h4>
                <div class="space-y-1">
                  <span
                    v-for="course in (userProfile.coursesEnrolled || [])"
                    :key="course"
                    class="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                  >
                    {{ course }}
                  </span>
                  <p v-if="!userProfile.coursesEnrolled || userProfile.coursesEnrolled.length === 0" class="text-sm text-gray-500">
                    No courses enrolled
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Posts -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Recent Posts</h2>
            <div class="space-y-6">
              <div v-for="post in userPosts" :key="post.id" class="border-b border-gray-100 pb-6 last:border-b-0">
                <div class="flex items-start space-x-3">
                  <img
                    :src="userProfile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'"
                    :alt="userProfile.name || 'User'"
                    class="w-10 h-10 rounded-full"
                  />
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <span class="font-medium">{{ userProfile.name || 'User' }}</span>
                      <span class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</span>
                    </div>
                    <p class="text-gray-800 mt-1">{{ post.content }}</p>
                    
                    <!-- Post Actions -->
                    <div class="flex space-x-4 mt-3 text-sm text-gray-500">
                      <button class="flex items-center space-x-1 hover:text-red-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{{ post.likes }}</span>
                      </button>
                      <button class="flex items-center space-x-1 hover:text-indigo-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{{ post.comments }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="userPosts.length === 0" class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p>No posts yet</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          <!-- Friends -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">Friends</h3>
              <span class="text-sm text-gray-500">{{ (userProfile.friends || []).length }} friends</span>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="friend in (userProfile.friends || []).slice(0, 9)" :key="friend.id" class="text-center">
                <img
                  :src="friend.avatar"
                  :alt="friend.name"
                  class="w-16 h-16 rounded-lg mx-auto mb-2 cursor-pointer hover:opacity-80"
                  @click="viewProfile(friend)"
                />
                <p class="text-xs text-gray-600 truncate">{{ friend.name }}</p>
              </div>
            </div>
            <div v-if="!userProfile.friends || userProfile.friends.length === 0" class="text-center py-4 text-gray-500">
              <p class="text-sm">No friends yet</p>
            </div>
            <button
              v-if="userProfile.friends && userProfile.friends.length > 9"
              class="w-full mt-4 text-indigo-600 text-sm hover:underline"
              @click="viewAllFriends"
            >
              View all friends
            </button>
          </div>

          <!-- Academic Progress -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Academic Progress</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Current Semester</span>
                  <span>85%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" style="width: 85%"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Degree Progress</span>
                  <span>72%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" style="width: 72%"></div>
                </div>
              </div>
              
              <div class="pt-4 border-t border-gray-100">
                <h4 class="font-medium text-gray-800 mb-2">Recent Achievements</h4>
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span class="text-yellow-600 text-xs">🏆</span>
                    </div>
                    <span class="text-sm text-gray-600">Dean's List - Spring 2025</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 text-xs">📚</span>
                    </div>
                    <span class="text-sm text-gray-600">Completed Advanced Algorithms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">Edit Profile</h3>
        <form @submit.prevent="saveProfile">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                v-model="editForm.bio"
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                v-model="editForm.major"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                v-model="editForm.year"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
                <option>Graduate</option>
              </select>
            </div>
          </div>
          <div class="flex space-x-3 mt-6">
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- File Inputs for Profile and Cover Photos - Hidden -->
    <input
      type="file"
      ref="profileInputRef"
      accept="image/*"
      class="hidden"
      @change="onProfilePhotoSelected"
    />
    <input
      type="file"
      ref="coverInputRef"
      accept="image/*"
      class="hidden"
      @change="onCoverPhotoSelected"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Reactive data
const userProfile = ref({})
const userPosts = ref([])
const isFollowing = ref(false)
const showEditModal = ref(false)

const editForm = reactive({
  bio: '',
  major: '',
  year: ''
})

// Computed properties
const isOwnProfile = computed(() => {
  return !route.params.id || route.params.id === userStore.currentUser?.id?.toString()
})

onMounted(() => {
  loadProfile()
})

const loadProfile = () => {
  // For demo, load current user's profile or sample profile
  if (isOwnProfile.value) {
    userProfile.value = {
      ...userStore.currentUser,
      bio: 'Computer Science student passionate about AI and machine learning. Love coding, problem-solving, and learning new technologies.',
      year: 'Senior',
      major: 'Computer Science',
      gpa: 3.8,
      coursesEnrolled: ['CS 301 - Advanced Algorithms', 'MATH 205 - Linear Algebra', 'PHYS 201 - Quantum Physics'],
      joinedDate: '2022-09-01',
      coverImage: null,
      stats: {
        posts: 23,
        followers: 156,
        following: 89
      },
      friends: [
        {
          id: 1,
          name: 'Sarah Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
        },
        {
          id: 2,
          name: 'Mike Johnson',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
        },
        {
          id: 3,
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
        },
        {
          id: 4,
          name: 'John Smith',
          avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
        },
        {
          id: 5,
          name: 'Lisa Park',
          avatar: 'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
        },
        {
          id: 6,
          name: 'David Kim',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
        }
      ]
    }
  } else {
    // Load other user's profile
    userProfile.value = {
      id: route.params.id,
      name: 'John Smith',
      email: 'john.smith@university.edu',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      bio: 'Mathematics major with a passion for theoretical mathematics and research.',
      year: 'Junior',
      major: 'Mathematics',
      gpa: 3.9,
      coursesEnrolled: ['MATH 301', 'STAT 205', 'PHYS 201'],
      joinedDate: '2023-09-01',
      coverImage: null,
      stats: {
        posts: 45,
        followers: 234,
        following: 123
      },
      friends: []
    }
  }

  // Load user posts
  loadUserPosts()
}

const loadUserPosts = () => {
  // Sample posts
  userPosts.value = [
    {
      id: 1,
      content: 'Just finished implementing a neural network from scratch! The mathematics behind backpropagation is fascinating.',
      createdAt: new Date('2025-08-14T15:30:00'),
      likes: 12,
      comments: 3
    },
    {
      id: 2,
      content: 'Excited to start my internship at Google this summer! Can\'t wait to work on real-world projects.',
      createdAt: new Date('2025-08-13T10:15:00'),
      likes: 28,
      comments: 8
    },
    {
      id: 3,
      content: 'Study group for Advanced Algorithms tomorrow at 2 PM in the library. Everyone welcome!',
      createdAt: new Date('2025-08-12T18:45:00'),
      likes: 15,
      comments: 5
    }
  ]
}

// Methods
const editProfile = () => {
  editForm.bio = userProfile.value.bio || ''
  editForm.major = userProfile.value.major || ''
  editForm.year = userProfile.value.year || ''
  showEditModal.value = true
}

const editAbout = () => {
  editProfile()
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveProfile = () => {
  userProfile.value.bio = editForm.bio
  userProfile.value.major = editForm.major
  userProfile.value.year = editForm.year
  
  // Update in store
  userStore.updateProfile({
    bio: editForm.bio,
    major: editForm.major,
    year: editForm.year
  })
  
  showEditModal.value = false
}

const profileInputRef = ref(null)
const coverInputRef = ref(null)

const changeProfilePhoto = () => {
  profileInputRef.value && profileInputRef.value.click()
}

const changeCoverPhoto = () => {
  coverInputRef.value && coverInputRef.value.click()
}

const onProfilePhotoSelected = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      userProfile.value.avatar = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

const onCoverPhotoSelected = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      userProfile.value.coverImage = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

const sendMessage = () => {
  console.log('Send message to:', userProfile.value.name)
  router.push('/chat')
}

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  if (userProfile.value.stats) {
    if (isFollowing.value) {
      userProfile.value.stats.followers++
    } else {
      userProfile.value.stats.followers--
    }
  }
}

const viewProfile = (friend) => {
  router.push(`/profile/${friend.id}`)
}

const viewAllFriends = () => {
  console.log('View all friends')
  // Friends list functionality
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}
</script>
