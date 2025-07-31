<template>
  <div class="space-y-8">
    <!-- Header -->
    <section class="text-center py-8">
      <h1 class="text-4xl font-bold mb-4 gradient-text flex items-center justify-center">
        <svg class="w-10 h-10 mr-3 text-movie-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
        My Favorite Movies
      </h1>
      <p class="text-xl text-white/80 max-w-2xl mx-auto">
        Your personal collection of amazing movies. {{ movieStore.favorites.length }} favorite{{ movieStore.favorites.length !== 1 ? 's' : '' }} saved.
      </p>
    </section>

    <!-- Stats -->
    <div v-if="movieStore.hasFavorites" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-movie-gold mb-2">
          {{ movieStore.favorites.length }}
        </div>
        <div class="text-white/70">Total Favorites</div>
      </div>
      
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-movie-gold mb-2">
          {{ uniqueYears.length }}
        </div>
        <div class="text-white/70">Different Years</div>
      </div>
      
      <div class="glass-effect rounded-xl p-6 text-center">
        <div class="text-3xl font-bold text-movie-gold mb-2">
          {{ newestYear }} - {{ oldestYear }}
        </div>
        <div class="text-white/70">Year Range</div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div v-if="movieStore.hasFavorites" class="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-3">
        <!-- Sort Options -->
        <select
          v-model="sortBy"
          class="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-movie-gold"
        >
          <option value="dateAdded">Sort by Date Added</option>
          <option value="title">Sort by Title</option>
          <option value="year">Sort by Year</option>
        </select>

        <!-- Sort Direction -->
        <button
          @click="toggleSortDirection"
          class="btn-secondary flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sortDirection === 'asc' ? 'M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12' : 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4'"/>
          </svg>
          {{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}
        </button>
      </div>

      <!-- Clear All -->
      <button
        @click="showClearAllDialog = true"
        class="btn-secondary text-red-400 hover:text-red-300 hover:bg-red-500/10"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
        Clear All
      </button>
    </div>

    <!-- Favorites Grid -->
    <div
      v-if="movieStore.hasFavorites"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <FavoriteMovieCard
        v-for="favorite in sortedFavorites"
        :key="favorite.id"
        :favorite="favorite"
        @click="goToMovieDetails(favorite.id)"
        @remove="removeFavorite"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div class="glass-effect rounded-xl p-12 max-w-lg mx-auto">
        <svg class="w-24 h-24 text-white/30 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <h3 class="text-2xl font-semibold text-white mb-4">No Favorites Yet</h3>
        <p class="text-white/70 mb-8 leading-relaxed">
          Start building your collection by adding movies to your favorites. 
          Find movies you love and click the heart icon to save them here.
        </p>
        <router-link to="/" class="btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Explore Movies
        </router-link>
      </div>
    </div>

    <!-- Clear All Confirmation Dialog -->
    <Teleport to="body">
      <div
        v-if="showClearAllDialog"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        @click="showClearAllDialog = false"
      >
        <div
          class="glass-effect rounded-xl p-8 max-w-md w-full"
          @click.stop
        >
          <div class="text-center">
            <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <h3 class="text-xl font-semibold text-white mb-2">Clear All Favorites?</h3>
            <p class="text-white/70 mb-6">
              This will permanently remove all {{ movieStore.favorites.length }} movies from your favorites. This action cannot be undone.
            </p>
            <div class="flex gap-4 justify-center">
              <button
                @click="clearAllFavorites"
                class="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Yes, Clear All
              </button>
              <button
                @click="showClearAllDialog = false"
                class="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import type { FavoriteMovie } from '@/types/movie'
import FavoriteMovieCard from '@/components/FavoriteMovieCard.vue'

const router = useRouter()
const movieStore = useMovieStore()

const sortBy = ref<'dateAdded' | 'title' | 'year'>('dateAdded')
const sortDirection = ref<'asc' | 'desc'>('desc')
const showClearAllDialog = ref(false)

const sortedFavorites = computed(() => {
  const favorites = [...movieStore.favorites]
  
  favorites.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy.value) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'year':
        comparison = parseInt(a.year) - parseInt(b.year)
        break
      case 'dateAdded':
        comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        break
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
  
  return favorites
})

const uniqueYears = computed(() => {
  const years = movieStore.favorites.map(fav => parseInt(fav.year))
  return [...new Set(years)].sort((a, b) => a - b)
})

const newestYear = computed(() => Math.max(...uniqueYears.value) || 0)
const oldestYear = computed(() => Math.min(...uniqueYears.value) || 0)

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

function goToMovieDetails(imdbId: string) {
  router.push(`/movie/${imdbId}`)
}

function removeFavorite(movieId: string) {
  movieStore.removeFromFavorites(movieId)
}

function clearAllFavorites() {
  // Clear all favorites by removing them one by one
  const favoriteIds = [...movieStore.favorites.map(fav => fav.id)]
  favoriteIds.forEach(id => movieStore.removeFromFavorites(id))
  showClearAllDialog.value = false
}
</script> 