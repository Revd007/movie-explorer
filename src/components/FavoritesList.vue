<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>
    
    <!-- Sidebar -->
    <div class="fixed right-0 top-0 h-full w-full sm:w-96 max-w-md transform transition-all duration-300">
      <div class="h-full bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 
                  backdrop-blur-xl border-l border-white/20 shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <div>
            <h2 class="text-2xl font-bold text-white flex items-center">
              <svg class="w-7 h-7 mr-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              My Favorites
            </h2>
            <p class="text-white/60 text-sm mt-1">
              {{ favorites.length }} movie{{ favorites.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="p-3 rounded-full hover:bg-white/10 text-white transition-all duration-200 
                   hover:scale-110 hover:rotate-90"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Favorites list -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="favorites.length === 0" class="text-center py-16">
            <div class="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">No favorites yet</h3>
            <p class="text-white/70 leading-relaxed">
              Add movies to your favorites by clicking the heart icon on movie cards!
            </p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(movie, index) in favorites"
              :key="movie.imdbID"
              class="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl 
                     hover:bg-white/10 transition-all duration-200 cursor-pointer group border border-white/10
                     hover:border-white/20 animate-slide-in"
              :style="{ animationDelay: `${index * 100}ms` }"
              @click="$emit('movie-click', movie)"
            >
              <div class="relative flex-shrink-0">
                <img
                  :src="getMoviePoster(movie)"
                  :alt="movie.Title"
                  class="w-16 h-24 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-200"
                  @error="handleImageError"
                />
                <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-white truncate group-hover:text-blue-300 
                           transition-colors duration-200 text-shadow mb-1">
                  {{ movie.Title }}
                </h4>
                <div class="flex items-center text-white/60 text-sm space-x-3">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    {{ movie.Year }}
                  </span>
                  <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                    {{ movie.Type?.toUpperCase() || 'MOVIE' }}
                  </span>
                </div>
              </div>
              
              <button
                @click.stop="handleRemoveFavorite(movie)"
                class="p-2.5 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 
                       transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110
                       border border-transparent hover:border-red-400/30"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer with clear all option -->
        <div v-if="favorites.length > 0" 
             class="p-6 border-t border-white/20 bg-white/5">
          <button
            @click="handleClearAll"
            class="w-full flex items-center justify-center px-6 py-3 bg-red-500/20 hover:bg-red-500/30 
                   text-red-300 hover:text-red-200 rounded-2xl transition-all duration-200 
                   border border-red-400/30 hover:border-red-400/50 hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Clear All Favorites
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import type { Movie } from '../types/movie.types'

export default defineComponent({
  name: 'FavoritesList',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    favorites: {
      type: Array as () => Movie[],
      required: true
    }
  },
  emits: ['close', 'movie-click', 'remove-favorite'],
  setup(props, { emit }) {
    const showClearConfirm = ref(false)

    function getMoviePoster(movie: Movie) {
      if (!movie.Poster || movie.Poster === 'N/A') {
        return `https://via.placeholder.com/160x240/1e293b/f1f5f9?text=${encodeURIComponent(movie.Title)}`
      }
      return movie.Poster
    }

    function handleImageError(event: Event) {
      const img = event.target as HTMLImageElement
      const movieTitle = img.alt || 'Movie'
      img.src = `https://via.placeholder.com/160x240/1e293b/f1f5f9?text=${encodeURIComponent(movieTitle)}`
    }

    function handleRemoveFavorite(movie: Movie) {
      emit('remove-favorite', movie)
    }

    function handleClearAll() {
      if (confirm(`Remove all ${props.favorites.length} movies from favorites?`)) {
        props.favorites.forEach(movie => {
          emit('remove-favorite', movie)
        })
      }
    }

    return {
      showClearConfirm,
      getMoviePoster,
      handleImageError,
      handleRemoveFavorite,
      handleClearAll
    }
  }
})
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out forwards;
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.7), rgba(147, 51, 234, 0.7));
}
</style>