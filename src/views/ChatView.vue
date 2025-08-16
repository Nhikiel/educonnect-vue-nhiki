<template>
  <AppLayout>
    <div class="h-[calc(100vh-8rem)] flex flex-col md:flex-row overflow-hidden space-y-6 md:space-y-0 md:space-x-6">
      <!-- Conversations List -->
      <section class="md:w-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b flex justify-between items-center">
          <h2 class="font-semibold text-gray-800">Conversations</h2>
          <button @click="startNewChat" class="text-indigo-600 text-sm hover:underline">New Chat</button>
        </div>
        
        <!-- Search Conversations -->
        <div class="p-4 border-b">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search conversations..."
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div class="flex-1 overflow-y-auto divide-y">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            @click="selectConversation(conversation)"
            class="px-4 py-3 cursor-pointer flex items-center hover:bg-gray-100 transition-colors"
            :class="{ 'bg-gray-100': selectedConversation?.id === conversation.id }"
          >
            <div class="relative">
              <img
                :src="conversation.avatar"
                :alt="conversation.name"
                class="w-10 h-10 rounded-full mr-3"
              />
              <div
                v-if="conversation.isOnline"
                class="absolute bottom-0 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-800 truncate">{{ conversation.name }}</span>
                <span class="text-xs text-gray-500">{{ formatMessageTime(conversation.lastMessageTime) }}</span>
              </div>
              <p class="text-sm text-gray-600 truncate">{{ conversation.lastMessage }}</p>
              <div v-if="conversation.unreadCount > 0" class="text-xs bg-indigo-600 text-white rounded-full px-2 py-1 mt-1 inline-block">
                {{ conversation.unreadCount }}
              </div>
            </div>
          </div>
          
          <div v-if="filteredConversations.length === 0" class="p-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <p>No conversations found</p>
          </div>
        </div>
      </section>

      <!-- Chat Window -->
      <section class="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div v-if="selectedConversation" class="flex flex-col h-full">
          <!-- Chat Header -->
          <div class="px-4 py-3 border-b flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img
                  :src="selectedConversation.avatar"
                  :alt="selectedConversation.name"
                  class="w-8 h-8 rounded-full"
                />
                <div
                  v-if="selectedConversation.isOnline"
                  class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"
                ></div>
              </div>
              <div>
                <span class="font-medium text-gray-800">{{ selectedConversation.name }}</span>
                <p class="text-xs text-gray-500">{{ selectedConversation.isOnline ? 'Online' : 'Last seen ' + formatMessageTime(selectedConversation.lastSeen) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="makeVideoCall" class="text-gray-400 hover:text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button @click="makeVoiceCall" class="text-gray-400 hover:text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button @click="closeChatWindow" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            <div v-for="message in currentMessages" :key="message.id" class="flex" :class="message.isMine ? 'justify-end' : ''">
              <div v-if="!message.isMine" class="flex items-start">
                <img
                  :src="selectedConversation.avatar"
                  :alt="selectedConversation.name"
                  class="w-6 h-6 rounded-full mr-2 mt-1"
                />
                <div class="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p class="text-sm">{{ message.content }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatMessageTime(message.timestamp) }}</p>
                </div>
              </div>
              <div v-else class="flex items-start justify-end">
                <div class="bg-indigo-600 text-white rounded-lg p-3 max-w-xs">
                  <p class="text-sm">{{ message.content }}</p>
                  <p class="text-xs text-indigo-200 mt-1">{{ formatMessageTime(message.timestamp) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex">
              <img
                :src="selectedConversation.avatar"
                :alt="selectedConversation.name"
                class="w-6 h-6 rounded-full mr-2"
              />
              <div class="bg-white rounded-lg p-3 shadow-sm">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-3 border-t bg-white">
            <form @submit.prevent="sendMessage" class="flex items-center space-x-3">
              <button type="button" @click="attachFile" class="text-gray-400 hover:text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                v-model="newMessage"
                @input="handleTyping"
                type="text"
                placeholder="Type a message…"
                class="flex-1 bg-gray-100 border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="button" @click="sendEmoji" class="text-gray-400 hover:text-indigo-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                type="submit"
                :disabled="!newMessage.trim()"
                class="text-indigo-600 hover:text-indigo-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- No Conversation Selected -->
        <div v-else class="flex-1 flex items-center justify-center text-gray-500">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-lg font-medium mb-2">Select a conversation</h3>
            <p class="text-sm">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Reactive data
const searchQuery = ref('')
const selectedConversation = ref(null)
const newMessage = ref('')
const isTyping = ref(false)
const conversations = ref([])
const messages = ref({})
const messagesContainer = ref(null)

// Sample data
onMounted(() => {
  loadConversations()
  loadMessages()
})

const loadConversations = () => {
  conversations.value = [
    {
      id: 1,
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Sure, let\'s meet at 2 PM.',
      lastMessageTime: new Date('2025-08-15T14:30:00'),
      isOnline: true,
      unreadCount: 0,
      lastSeen: new Date('2025-08-15T14:30:00')
    },
    {
      id: 2,
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Don\'t forget our meeting tomorrow.',
      lastMessageTime: new Date('2025-08-15T13:00:00'),
      isOnline: false,
      unreadCount: 2,
      lastSeen: new Date('2025-08-15T12:45:00')
    },
    {
      id: 3,
      name: 'Sophia Lee',
      avatar: 'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Thanks for sharing the notes!',
      lastMessageTime: new Date('2025-08-15T12:00:00'),
      isOnline: true,
      unreadCount: 0,
      lastSeen: new Date('2025-08-15T12:00:00')
    },
    {
      id: 4,
      name: 'Professor Davis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=3&w=64&h=64&q=80',
      lastMessage: 'Office hours are from 2-4 PM today.',
      lastMessageTime: new Date('2025-08-15T09:00:00'),
      isOnline: false,
      unreadCount: 1,
      lastSeen: new Date('2025-08-15T08:30:00')
    }
  ]
}

const loadMessages = () => {
  messages.value = {
    1: [
      {
        id: 1,
        content: 'Hey Alex! Are you joining the study session later?',
        timestamp: new Date('2025-08-15T14:00:00'),
        isMine: false
      },
      {
        id: 2,
        content: 'Yes, I\'ll be there! See you at 5 PM.',
        timestamp: new Date('2025-08-15T14:15:00'),
        isMine: true
      },
      {
        id: 3,
        content: 'Great! Don\'t forget to bring the notes.',
        timestamp: new Date('2025-08-15T14:20:00'),
        isMine: false
      },
      {
        id: 4,
        content: 'Sure, let\'s meet at 2 PM.',
        timestamp: new Date('2025-08-15T14:30:00'),
        isMine: false
      }
    ],
    2: [
      {
        id: 1,
        content: 'Hi! Just wanted to remind you about our group meeting tomorrow.',
        timestamp: new Date('2025-08-15T12:30:00'),
        isMine: false
      },
      {
        id: 2,
        content: 'Thanks for the reminder! What time again?',
        timestamp: new Date('2025-08-15T12:45:00'),
        isMine: true
      },
      {
        id: 3,
        content: 'Don\'t forget our meeting tomorrow.',
        timestamp: new Date('2025-08-15T13:00:00'),
        isMine: false
      }
    ],
    3: [
      {
        id: 1,
        content: 'Could you share the lecture notes from today?',
        timestamp: new Date('2025-08-15T11:30:00'),
        isMine: false
      },
      {
        id: 2,
        content: 'Of course! I\'ll send them right now.',
        timestamp: new Date('2025-08-15T11:45:00'),
        isMine: true
      },
      {
        id: 3,
        content: 'Thanks for sharing the notes!',
        timestamp: new Date('2025-08-15T12:00:00'),
        isMine: false
      }
    ],
    4: [
      {
        id: 1,
        content: 'Hello! I have a question about the assignment.',
        timestamp: new Date('2025-08-15T08:30:00'),
        isMine: true
      },
      {
        id: 2,
        content: 'Office hours are from 2-4 PM today.',
        timestamp: new Date('2025-08-15T09:00:00'),
        isMine: false
      }
    ]
  }
}

// Computed properties
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  return conversations.value.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentMessages = computed(() => {
  return selectedConversation.value ? messages.value[selectedConversation.value.id] || [] : []
})

// Watch for conversation changes to scroll to bottom
watch(selectedConversation, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

watch(currentMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// Methods
const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  // Mark as read
  conversation.unreadCount = 0
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  const message = {
    id: Date.now(),
    content: newMessage.value,
    timestamp: new Date(),
    isMine: true
  }

  if (!messages.value[selectedConversation.value.id]) {
    messages.value[selectedConversation.value.id] = []
  }

  messages.value[selectedConversation.value.id].push(message)
  
  // Update conversation last message
  selectedConversation.value.lastMessage = newMessage.value
  selectedConversation.value.lastMessageTime = new Date()

  newMessage.value = ''
  
  // Simulate typing and response
  simulateResponse()
}

const simulateResponse = () => {
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    const responses = [
      'Thanks for the message!',
      'Got it, will do.',
      'Sounds good to me.',
      'Let me think about that.',
      'Perfect, see you then!',
      'I agree with that approach.',
      'That makes sense.'
    ]
    
    const response = {
      id: Date.now(),
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      isMine: false
    }
    
    if (messages.value[selectedConversation.value.id]) {
      messages.value[selectedConversation.value.id].push(response)
      selectedConversation.value.lastMessage = response.content
      selectedConversation.value.lastMessageTime = response.timestamp
    }
  }, 2000)
}

const handleTyping = () => {
  // Simulate typing indicator for the other user
  console.log('User is typing...')
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const startNewChat = () => {
  console.log('Starting new chat')
  // New chat functionality
}

const closeChatWindow = () => {
  selectedConversation.value = null
}

const makeVideoCall = () => {
  console.log('Making video call to:', selectedConversation.value.name)
  // Video call functionality
}

const makeVoiceCall = () => {
  console.log('Making voice call to:', selectedConversation.value.name)
  // Voice call functionality
}

const attachFile = () => {
  console.log('Attaching file')
  // File attachment functionality
}

const sendEmoji = () => {
  console.log('Opening emoji picker')
  // Simple emoji addition
  newMessage.value += ' 😊'
}

const formatMessageTime = (date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h`
  } else {
    return date.toLocaleDateString()
  }
}
</script>
