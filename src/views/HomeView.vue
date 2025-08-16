<template>
  <AppLayout>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Feed (Left Column) -->
      <div class="lg:col-span-2 space-y-8">
        <h1 class="text-2xl font-bold">Your Feed</h1>
      
      <!-- Create Post Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-start space-x-3">
          <img
            :src="currentUser.avatar"
            :alt="currentUser.name"
            class="w-10 h-10 rounded-full"
          />
          <div class="flex-1">
            <textarea
              v-model="newPost"
              placeholder="What's on your mind?"
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="3"
            ></textarea>
            <div class="mt-3 flex justify-between items-center">
              <div class="flex space-x-2">
                <button @click="attachImage" class="text-gray-500 hover:text-indigo-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button @click="attachFile" class="text-gray-500 hover:text-indigo-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
              <button
                @click="createPost"
                :disabled="!newPost.trim()"
                class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed Posts -->
      <div class="space-y-6">
        <div v-for="post in posts" :key="post.id" class="bg-white rounded-lg shadow">
          <!-- Post Header -->
          <div class="p-6 pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img
                  :src="post.author.avatar"
                  :alt="post.author.name"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 class="font-medium text-gray-900">{{ post.author.name }}</h3>
                  <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
                </div>
              </div>
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Post Content -->
          <div class="px-6 pb-3">
            <p class="text-gray-800">{{ post.content }}</p>
            <img v-if="post.image" :src="post.image" :alt="post.title" class="mt-3 rounded-lg max-w-full h-auto" />
          </div>

          <!-- Post Actions -->
          <div class="px-6 py-3 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex space-x-6">
                <button @click="toggleLike(post)" class="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5" :class="post.isLiked ? 'text-red-600 fill-current' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{{ post.likes }}</span>
                </button>
                <button @click="toggleComments(post)" class="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{{ post.comments?.length || 0 }}</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div v-if="post.showComments" class="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <div v-for="comment in post.comments" :key="comment.id" class="flex space-x-3 mb-3">
              <img :src="comment.author.avatar" :alt="comment.author.name" class="w-8 h-8 rounded-full" />
              <div class="flex-1 bg-white rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-sm">{{ comment.author.name }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="text-sm mt-1">{{ comment.content }}</p>
              </div>
            </div>
            
            <!-- Add Comment -->
            <div class="flex space-x-3 mt-3">
              <img :src="currentUser.avatar" :alt="currentUser.name" class="w-8 h-8 rounded-full" />
              <div class="flex-1">
                <input
                  v-model="newComment[post.id]"
                  @keyup.enter="addComment(post)"
                  type="text"
                  placeholder="Write a comment..."
                  class="w-full bg-white border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6">
        <!-- User Profile Card -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-start space-x-3 mb-4">
            <img 
              :src="currentUser.avatar" 
              :alt="currentUser.name"
              class="w-12 h-12 rounded-full object-cover"
            >
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ currentUser.name }}</h3>
              <p class="text-sm text-gray-600">{{ currentUser.major || 'Computer Science' }},</p>
              <p class="text-sm text-gray-600">Class of {{ currentUser.graduationYear || '2026' }}</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-700 mb-3">
              Welcome back! Here's your quick overview: {{ unreadMessages }} new messages, {{ upcomingAssignments.length }} upcoming deadlines, and {{ todayEvents }} event today.
            </p>
            <div class="flex space-x-2">
              <button 
                @click="viewProfile"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                View Profile
              </button>
              <button 
                @click="openSettings"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Communities -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold mb-4 text-gray-900">Communities</h3>
          <div class="space-y-3">
            <div v-for="community in communities" :key="community.id" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                  :style="{ backgroundColor: community.color }"
                >
                  {{ community.abbreviation }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ community.name }}</span>
              </div>
              <button 
                @click="joinCommunity(community)"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                :disabled="community.joined"
              >
                {{ community.joined ? 'Joined' : 'Join' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Chats -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold mb-4 text-gray-900">Chats</h3>
          <div class="space-y-3">
            <div 
              v-for="chat in recentChats" 
              :key="chat.id" 
              @click="openChat(chat)"
              class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <img 
                :src="chat.avatar" 
                :alt="chat.name"
                class="w-10 h-10 rounded-full object-cover"
              >
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <p class="font-medium text-sm text-gray-900 truncate">{{ chat.name }}</p>
                  <span class="text-xs text-gray-500 ml-2">{{ chat.timeAgo }}</span>
                </div>
                <p class="text-sm text-gray-600 truncate">{{ chat.lastMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Assignments -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold mb-4">Upcoming Assignments</h3>
          <div class="space-y-3">
            <div v-for="assignment in upcomingAssignments" :key="assignment.id" class="flex justify-between items-center">
              <div>
                <p class="font-medium text-sm">{{ assignment.title }}</p>
                <p class="text-xs text-gray-500">Due {{ formatDate(assignment.dueDate) }}</p>
              </div>
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getAssignmentStatusClass(assignment.status)"
              >
                {{ assignment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)

// Reactive data
const newPost = ref('')
const newComment = ref({})
const posts = ref([])
const upcomingAssignments = ref([])
const recentChats = ref([])
const communities = ref([])
const unreadMessages = ref(3)
const todayEvents = ref(1)

// Sample data
onMounted(() => {
  loadFeedData()
})

const loadFeedData = () => {
  // Sample posts data
  posts.value = [
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
      },
      content: 'Just finished my machine learning project! The neural network achieved 94% accuracy on the test dataset. Excited to present it next week! 🤖',
      image: null,
      likes: 12,
      isLiked: false,
      createdAt: new Date('2025-08-15T10:30:00'),
      showComments: false,
      comments: [
        {
          id: 1,
          author: {
            name: 'Mike Johnson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
          },
          content: 'Impressive results! Which algorithm did you use?',
          createdAt: new Date('2025-08-15T11:00:00')
        }
      ]
    },
    {
      id: 2,
      author: {
        name: 'Professor Davis',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
      },
      content: 'Reminder: The deadline for the Physics lab report is tomorrow at 11:59 PM. Make sure to include all calculations and error analysis.',
      image: null,
      likes: 8,
      isLiked: false,
      createdAt: new Date('2025-08-15T09:15:00'),
      showComments: false,
      comments: []
    },
    {
      id: 3,
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80'
      },
      content: 'Study group for Calculus III tomorrow at 2 PM in the library. We\'ll be reviewing integration techniques. Everyone welcome!',
      image: null,
      likes: 15,
      isLiked: true,
      createdAt: new Date('2025-08-15T08:45:00'),
      showComments: false,
      comments: []
    }
  ]

  // Sample upcoming assignments
  upcomingAssignments.value = [
    {
      id: 1,
      title: 'Physics Lab Report',
      dueDate: new Date('2025-08-16T23:59:00'),
      status: 'Due Soon'
    },
    {
      id: 2,
      title: 'Math Problem Set',
      dueDate: new Date('2025-08-18T23:59:00'),
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'CS Project',
      dueDate: new Date('2025-08-20T23:59:00'),
      status: 'Not Started'
    }
  ]

  // Sample recent chats
  recentChats.value = [
    {
      id: 1,
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Sure, let\'s meet at 2 PM.',
      timeAgo: '3m'
    },
    {
      id: 2,
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Don\'t forget our meeting tomorrow.',
      timeAgo: '1h'
    },
    {
      id: 3,
      name: 'Sophia Lee',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Thanks for sharing the notes!',
      timeAgo: '2h'
    }
  ]

  // Sample communities
  communities.value = [
    {
      id: 1,
      name: 'Computer Science',
      abbreviation: 'CS',
      color: '#8B5CF6',
      joined: false
    },
    {
      id: 2,
      name: 'Mathematics',
      abbreviation: 'Math',
      color: '#3B82F6',
      joined: false
    },
    {
      id: 3,
      name: 'Biology Club',
      abbreviation: 'Bio',
      color: '#10B981',
      joined: false
    },
    {
      id: 4,
      name: 'Arts Society',
      abbreviation: 'Art',
      color: '#F59E0B',
      joined: false
    }
  ]
}

// Methods
const createPost = () => {
  if (!newPost.value.trim()) return

  const post = {
    id: Date.now(),
    author: {
      name: currentUser.value.name,
      avatar: currentUser.value.avatar
    },
    content: newPost.value,
    image: null,
    likes: 0,
    isLiked: false,
    createdAt: new Date(),
    showComments: false,
    comments: []
  }

  posts.value.unshift(post)
  newPost.value = ''
}

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const toggleComments = (post) => {
  post.showComments = !post.showComments
}

const addComment = (post) => {
  const commentText = newComment.value[post.id]
  if (!commentText?.trim()) return

  const comment = {
    id: Date.now(),
    author: {
      name: currentUser.value.name,
      avatar: currentUser.value.avatar
    },
    content: commentText,
    createdAt: new Date()
  }

  if (!post.comments) post.comments = []
  post.comments.push(comment)
  newComment.value[post.id] = ''
}

const attachImage = () => {
  // Image attachment functionality
}

const attachFile = () => {
  // File attachment functionality
}

const formatDate = (date) => {
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

const getAssignmentStatusClass = (status) => {
  const classes = {
    'Due Soon': 'bg-red-100 text-red-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Not Started': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-green-100 text-green-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

// Button functionality
const viewProfile = () => {
  router.push('/profile')
}

const openSettings = () => {
  // In a real app, this could open a settings modal or navigate to settings page
  console.log('Opening settings...')
  // router.push('/settings')
}

const joinCommunity = (community) => {
  community.joined = !community.joined
  if (community.joined) {
    console.log(`Joined ${community.name} community`)
    // In a real app, you would make an API call here
  } else {
    console.log(`Left ${community.name} community`)
  }
}

const openChat = (chat) => {
  console.log(`Opening chat with ${chat.name}`)
  router.push('/chat')
}
</script>
