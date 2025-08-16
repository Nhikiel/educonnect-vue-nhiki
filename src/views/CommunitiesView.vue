<template>
  <AppLayout>
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Communities</h1>
        <button @click="createCommunity" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          + Create Community
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search communities..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              v-model="filterCategory"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </select>
          </div>
          <div>
            <select
              v-model="sortBy"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="members">Sort by Members</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Communities Grid -->
      <section>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="community in filteredCommunities"
            :key="community.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            @click="viewCommunity(community)"
          >
            <div class="relative">
              <img
                :src="community.coverImage"
                :alt="community.name"
                class="w-full h-32 object-cover rounded-t-lg"
              />
              <div class="absolute top-2 right-2">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getCategoryClass(community.category)"
                >
                  {{ community.category }}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-lg">{{ community.name }}</h3>
                <button
                  @click.stop="toggleJoin(community)"
                  class="text-sm px-3 py-1 rounded-full transition-colors"
                  :class="community.isJoined 
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ community.isJoined ? 'Joined' : 'Join' }}
                </button>
              </div>
              
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ community.description }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ community.members }} members
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                    </svg>
                    {{ community.posts }} posts
                  </span>
                </div>
                <span>{{ formatDate(community.lastActive) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'

// Reactive data
const searchQuery = ref('')
const filterCategory = ref('all')
const sortBy = ref('name')
const communities = ref([])

// Sample data
onMounted(() => {
  loadCommunities()
})

const loadCommunities = () => {
  communities.value = [
    {
      id: 1,
      name: 'Computer Science Club',
      description: 'A community for CS students to share knowledge, collaborate on projects, and discuss the latest in technology.',
      category: 'academic',
      members: 245,
      posts: 89,
      coverImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
      isJoined: true,
      lastActive: new Date('2025-08-15')
    },
    {
      id: 2,
      name: 'Photography Society',
      description: 'Share your photography, get feedback, and learn new techniques from fellow photography enthusiasts.',
      category: 'social',
      members: 189,
      posts: 156,
      coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
      isJoined: false,
      lastActive: new Date('2025-08-14')
    },
    {
      id: 3,
      name: 'Basketball Team',
      description: 'Join our university basketball team for practices, games, and building team spirit.',
      category: 'sports',
      members: 67,
      posts: 34,
      coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498573?auto=format&fit=crop&w=800&q=80',
      isJoined: false,
      lastActive: new Date('2025-08-13')
    },
    {
      id: 4,
      name: 'AI Research Group',
      description: 'Dedicated to exploring artificial intelligence, machine learning, and their applications.',
      category: 'technology',
      members: 123,
      posts: 67,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      isJoined: true,
      lastActive: new Date('2025-08-15')
    },
    {
      id: 5,
      name: 'Study Abroad Network',
      description: 'Connect with students who have studied abroad or are planning to. Share experiences and tips.',
      category: 'academic',
      members: 91,
      posts: 45,
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
      isJoined: false,
      lastActive: new Date('2025-08-12')
    },
    {
      id: 6,
      name: 'Music Appreciation Club',
      description: 'For music lovers to discover, discuss, and share their favorite artists and songs.',
      category: 'social',
      members: 134,
      posts: 78,
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
      isJoined: false,
      lastActive: new Date('2025-08-11')
    }
  ]
}

// Computed properties
const filteredCommunities = computed(() => {
  let filtered = communities.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(community => 
      community.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by category
  if (filterCategory.value !== 'all') {
    filtered = filtered.filter(community => community.category === filterCategory.value)
  }

  // Sort
  switch (sortBy.value) {
    case 'members':
      filtered.sort((a, b) => b.members - a.members)
      break
    case 'recent':
      filtered.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
      break
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  return filtered
})

// Methods
const toggleJoin = (community) => {
  community.isJoined = !community.isJoined
  if (community.isJoined) {
    community.members++
  } else {
    community.members--
  }
}

const getCategoryClass = (category) => {
  const classes = {
    academic: 'bg-blue-100 text-blue-800',
    social: 'bg-green-100 text-green-800',
    sports: 'bg-orange-100 text-orange-800',
    technology: 'bg-purple-100 text-purple-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const viewCommunity = (community) => {
  console.log('Viewing community:', community.name)
  // Community details functionality
}

const createCommunity = () => {
  console.log('Creating new community')
  // Create community functionality
}

const formatDate = (date) => {
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
