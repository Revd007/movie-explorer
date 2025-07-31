<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-12">
      <h1 class="text-5xl font-bold mb-4 gradient-text">
        Discover Amazing Movies
      </h1>
      <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Search through thousands of movies, explore details, and build your personal collection of favorites.
      </p>
      
      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto relative">
        <input
          v-model="searchInput"
          @keyup.enter="handleSearch"
          @input="handleSearchInput"
          type="text"
          placeholder="Search for movies, actors, or directors..."
          class="search-bar pr-12"
          :disabled="movieStore.isSearching"
        />
        <button
          @click="handleSearch"
          :disabled="movieStore.isSearching || !searchInput.trim()"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-movie-gold transition-colors duration-300 disabled:opacity-50"
        >
          <svg v-if="!movieStore.isSearching" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <svg v-else class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="flex justify-center space-x-4 mt-6">
        <button
          @click="loadPopularMovies"
          class="btn-secondary"
          :disabled="movieStore.isSearching"
        >
          Popular Movies
        </button>
        <button
          @click="clearSearch"
          v-if="movieStore.searchQuery || movieStore.hasMovies"
          class="btn-secondary"
        >
          Clear Search
        </button>
      </div>
    </section>

    <!-- Search Results Header -->
    <section v-if="movieStore.searchQuery || movieStore.hasMovies" class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-white">
          {{ movieStore.searchQuery ? `Search Results for "${movieStore.searchQuery}"` : 'Popular Movies' }}
        </h2>
        <p class="text-white/60 mt-1">
          {{ movieStore.movies.length }} movie{{ movieStore.movies.length !== 1 ? 's' : '' }} found
        </p>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="movieStore.isSearching" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="i in 10" :key="i" class="movie-card loading-shimmer">
        <div class="bg-white/5 h-80 rounded-lg mb-4"></div>
        <div class="bg-white/5 h-4 rounded mb-2"></div>
        <div class="bg-white/5 h-3 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="movieStore.searchError" class="text-center py-12">
      <div class="glass-effect rounded-xl p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Search Error</h3>
        <p class="text-white/70 mb-4">{{ movieStore.searchError }}</p>
        <button @click="retrySearch" class="btn-primary">
          Try Again
        </button>
      </div>
    </div>

    <!-- Movies Grid -->
    <div
      v-else-if="movieStore.hasMovies"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <MovieCard
        v-for="movie in movieStore.movies"
        :key="movie.imdbID"
        :movie="movie"
        @click="goToMovieDetails(movie.imdbID)"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!movieStore.isSearching" class="text-center py-12">
      <div class="glass-effect rounded-xl p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m4 5V6"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">No Movies Found</h3>
        <p class="text-white/70 mb-4">Try searching for a different movie, actor, or director.</p>
        <button @click="loadPopularMovies" class="btn-primary">
          Show Popular Movies
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const movieStore = useMovieStore()

const searchInput = ref('')

const debouncedSearch = useDebounceFn((query: string) => {
  if (query.trim()) {
    movieStore.searchMovies(query)
  }
}, 500)

function handleSearchInput() {
  if (searchInput.value.trim()) {
    debouncedSearch(searchInput.value)
  } else {
    movieStore.clearSearch()
  }
}

function handleSearch() {
  if (searchInput.value.trim()) {
    movieStore.searchMovies(searchInput.value)
  }
}

function loadPopularMovies() {
  searchInput.value = ''
  movieStore.loadPopularMovies()
}

function clearSearch() {
  searchInput.value = ''
  movieStore.clearSearch()
}

function retrySearch() {
  if (movieStore.searchQuery) {
    movieStore.searchMovies(movieStore.searchQuery)
  } else {
    loadPopularMovies()
  }
}

function goToMovieDetails(imdbId: string) {
  router.push(`/movie/${imdbId}`)
}

onMounted(() => {
  // Load popular movies if no search is active
  if (!movieStore.hasMovies && !movieStore.searchQuery) {
    loadPopularMovies()
  }
})
</script> 