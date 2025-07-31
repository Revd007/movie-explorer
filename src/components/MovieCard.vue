<template>
  <div 
    class="movie-card group animate-scaleIn"
    @click="handleClick"
    :style="{ animationDelay: `${(Math.random() * 0.5)}s` }"
  >
    <!-- Movie Poster -->
    <div class="relative aspect-poster overflow-hidden">
      <!-- Loading state -->
      <div v-if="imageLoading" 
           class="absolute inset-0 glass-effect animate-pulse flex items-center justify-center">
        <LoadingSpinner size="md" color="white" />
      </div>
      
      <img 
        :src="imageUrl" 
        :alt="movie.Title"
        class="absolute inset-0 w-full h-full object-cover transition-all duration-500 
               group-hover:scale-110 rounded-t-2xl"
        :class="{ 'opacity-0': imageLoading }"
        @load="handleImageLoad"
        @error="handleImageError"
        loading="lazy"
      />
      
      <!-- Enhanced gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <!-- Enhanced favorite button -->
      <button
        @click="handleFavoriteClick"
        class="absolute top-2 right-2 md:top-3 md:right-3 p-2 md:p-2.5 rounded-full backdrop-blur-sm
               transition-all duration-200 opacity-0 group-hover:opacity-100
               transform hover:scale-110 active:scale-95 shadow-lg z-10 focus-visible"
        :class="isFavorite 
          ? 'bg-red-500/90 hover:bg-red-600/90 text-white animate-pulse' 
          : 'bg-white/20 hover:bg-white/30 text-white'"
      >
        <svg 
          class="w-4 h-4 md:w-5 md:h-5 transition-all duration-200"
          :class="{ 'animate-bounce': isFavorite }"
          :fill="isFavorite ? 'currentColor' : 'none'"
          stroke="currentColor" 
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>
      
      <!-- Enhanced play icon overlay -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-all duration-300">
        <div class="p-3 md:p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg
                    transform group-hover:scale-110 transition-transform duration-300 animate-pulse">
          <svg class="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>

      <!-- Enhanced movie type badge -->
      <div class="absolute top-2 left-2 md:top-3 md:left-3 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300">
        <span class="px-2 py-1 text-xs font-semibold bg-blue-500/90 text-white rounded-full 
                     backdrop-blur-sm border border-blue-400/30 shadow-sm text-shadow-sm">
          {{ movie.Type?.toUpperCase() || 'MOVIE' }}
        </span>
      </div>

      <!-- Rating indicator if available -->
      <div v-if="movie.imdbRating && movie.imdbRating !== 'N/A'" 
           class="absolute bottom-2 left-2 md:bottom-3 md:left-3 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300">
        <div class="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-white text-xs font-medium">{{ movie.imdbRating }}</span>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Movie Info -->
    <div class="p-3 md:p-4 space-y-2">
      <h3 class="font-bold text-white text-sm md:text-lg leading-tight line-clamp-2 
                 group-hover:text-blue-300 transition-colors duration-200 text-contrast">
        {{ movie.Title }}
      </h3>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center text-white/70 text-xs md:text-sm">
          <svg class="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span class="font-medium text-shadow-sm">{{ movie.Year }}</span>
        </div>
        
        <!-- Enhanced favorite indicator -->
        <div v-if="isFavorite" class="flex items-center text-red-400 text-xs animate-pulse">
          <svg class="w-3 h-3 md:w-4 md:h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="font-semibold text-shadow-sm hidden sm:inline">Favorite</span>
          <span class="font-semibold text-shadow-sm sm:hidden">❤️</span>
        </div>
      </div>

      <!-- Additional movie info on larger screens -->
      <div class="hidden md:block pt-2 border-t border-white/10">
        <div class="flex items-center justify-between text-xs text-white/60">
          <span class="text-shadow-sm">Click to view details</span>
          <div class="flex items-center space-x-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced hover glow effect -->
    <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300
                bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none
                animate-glow"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import type { Movie } from '../types/movie.types'
import LoadingSpinner from './LoadingSpinner.vue'

export default defineComponent({
  name: 'MovieCard',
  components: {
    LoadingSpinner
  },
  props: {
    movie: {
      type: Object as () => Movie,
      required: true
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click', 'toggleFavorite'],
  setup(props, { emit }) {
    const imageLoading = ref(true)
    const imageError = ref(false)

    const imageUrl = computed(() => {
      if (imageError.value || !props.movie.Poster || props.movie.Poster === 'N/A') {
        return `https://via.placeholder.com/300x450/1e293b/f1f5f9?text=${encodeURIComponent(props.movie.Title)}`
      }
      return props.movie.Poster
    })

    function handleClick() {
      emit('click', props.movie)
    }

    function handleFavoriteClick(event: Event) {
      event.stopPropagation()
      emit('toggleFavorite', props.movie)
    }

    function handleImageLoad() {
      imageLoading.value = false
    }

    function handleImageError() {
      imageLoading.value = false
      imageError.value = true
    }

    return {
      imageUrl,
      imageLoading,
      handleClick,
      handleFavoriteClick,
      handleImageLoad,
      handleImageError
    }
  }
})
</script>

<style scoped>
/* Enhanced hover effects */
.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.movie-card:active {
  transform: translateY(-4px) scale(1.01);
}

/* Responsive aspect ratio */
@media (max-width: 640px) {
  .aspect-poster {
    aspect-ratio: 2/3;
  }
}

/* Animation delays */
.movie-card:nth-child(1) { animation-delay: 0.1s; }
.movie-card:nth-child(2) { animation-delay: 0.2s; }
.movie-card:nth-child(3) { animation-delay: 0.3s; }
.movie-card:nth-child(4) { animation-delay: 0.4s; }
.movie-card:nth-child(5) { animation-delay: 0.5s; }
.movie-card:nth-child(6) { animation-delay: 0.6s; }
</style>