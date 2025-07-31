<template>
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center space-y-8 max-w-2xl mx-auto px-4">
      <!-- 404 Animation -->
      <div class="relative">
        <div class="text-9xl font-bold text-movie-gold/20 select-none">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-24 h-24 text-movie-gold animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m4 5V6"/>
          </svg>
        </div>
      </div>

      <!-- Error Message -->
      <div class="space-y-4">
        <h1 class="text-4xl md:text-6xl font-bold text-white text-shadow">
          Page Not Found
        </h1>
        <p class="text-xl text-white/80 leading-relaxed">
          Looks like this page went to a different dimension! The movie you're looking for doesn't exist in our database.
        </p>
      </div>

      <!-- Search Suggestion -->
      <div class="glass-effect rounded-xl p-8 space-y-6">
        <h2 class="text-2xl font-semibold text-white mb-4">
          Let's find you something amazing instead
        </h2>
        
        <!-- Quick Search -->
        <div class="max-w-md mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Search for movies..."
              class="search-bar pr-12"
            />
            <button
              @click="performSearch"
              :disabled="!searchQuery.trim()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-movie-gold transition-colors duration-300 disabled:opacity-50"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Options -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <router-link to="/" class="btn-primary flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7 5-5 5 5"/>
            </svg>
            Go Home
          </router-link>
          
          <router-link to="/favorites" class="btn-secondary flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            My Favorites
          </router-link>
          
          <button
            @click="goBack"
            class="btn-secondary flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Go Back
          </button>
        </div>
      </div>

      <!-- Fun Movie Quotes -->
      <div class="glass-effect rounded-xl p-6">
        <blockquote class="text-lg italic text-white/90 mb-3">
          "{{ currentQuote.text }}"
        </blockquote>
        <cite class="text-movie-gold font-medium">
          — {{ currentQuote.movie }} ({{ currentQuote.year }})
        </cite>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const movieQuotes = [
  {
    text: "I'm going to make him an offer he can't refuse.",
    movie: "The Godfather",
    year: "1972"
  },
  {
    text: "May the Force be with you.",
    movie: "Star Wars",
    year: "1977"
  },
  {
    text: "Here's looking at you, kid.",
    movie: "Casablanca",
    year: "1942"
  },
  {
    text: "You can't handle the truth!",
    movie: "A Few Good Men",
    year: "1992"
  },
  {
    text: "I'll be back.",
    movie: "The Terminator",
    year: "1984"
  },
  {
    text: "Life is like a box of chocolates.",
    movie: "Forrest Gump",
    year: "1994"
  },
  {
    text: "Houston, we have a problem.",
    movie: "Apollo 13",
    year: "1995"
  },
  {
    text: "Keep your friends close, but your enemies closer.",
    movie: "The Godfather Part II",
    year: "1974"
  }
]

const currentQuote = ref(movieQuotes[0])

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/',
      query: { q: searchQuery.value.trim() }
    })
  }
}

function goBack() {
  router.go(-1)
}

onMounted(() => {
  // Show a random quote
  const randomIndex = Math.floor(Math.random() * movieQuotes.length)
  currentQuote.value = movieQuotes[randomIndex]
  
  // Check if there's a search query in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const query = urlParams.get('q')
  if (query) {
    searchQuery.value = query
  }
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style> 