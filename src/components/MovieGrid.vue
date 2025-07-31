<template>
  <div class="w-full">
    <!-- Enhanced Loading state -->
    <div v-if="isLoading" class="loading-grid">
      <div 
        v-for="i in 12" 
        :key="i"
        class="glass-effect rounded-2xl overflow-hidden animate-pulse"
        :style="{ animationDelay: `${i * 0.1}s` }"
      >
        <div class="aspect-poster skeleton"></div>
        <div class="p-3 md:p-4 space-y-3">
          <div class="h-4 skeleton rounded-full"></div>
          <div class="h-3 skeleton rounded-full w-2/3"></div>
          <div class="flex justify-between items-center">
            <div class="h-3 skeleton rounded-full w-16"></div>
            <div class="h-3 skeleton rounded-full w-8"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Error state -->
    <div v-else-if="hasError" class="flex justify-center py-12 md:py-16 animate-fadeIn">
      <div class="max-w-md w-full mx-4 p-6 md:p-8 glass-effect-strong rounded-3xl text-center">
        <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-red-500/20 rounded-full 
                    flex items-center justify-center animate-bounce">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-xl md:text-2xl font-bold text-contrast mb-3 md:mb-4">Oops! Something went wrong</h3>
        <p class="text-white/80 text-base md:text-lg mb-4 md:mb-6 leading-relaxed text-shadow">{{ errorMessage }}</p>
        <button
          @click="$emit('retry')"
          class="btn-primary"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    </div>

    <!-- Enhanced Movies grid -->
    <div 
      v-else-if="movies.length > 0"
      class="movie-grid"
    >
      <MovieCard
        v-for="(movie, index) in movies"
        :key="movie.imdbID"
        :movie="movie"
        :is-favorite="favoriteMovieIds.includes(movie.imdbID)"
        @click="$emit('movie-click', movie)"
        @toggle-favorite="$emit('toggle-favorite', movie)"
        :style="{ animationDelay: `${index * 0.05}s` }"
        class="animate-slideUp"
      />
    </div>

    <!-- Enhanced Empty state -->
    <div v-else class="flex justify-center py-12 md:py-16 animate-fadeIn">
      <div class="max-w-lg w-full mx-4 p-6 md:p-8 glass-effect rounded-3xl text-center">
        <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-blue-500/20 rounded-full 
                    flex items-center justify-center animate-float">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4h10m-5 6v-4m0 0l-2-2m2 2l2-2" />
          </svg>
        </div>
        <h3 class="text-xl md:text-2xl font-bold text-contrast mb-3 md:mb-4">No movies found</h3>
        <p class="text-white/70 text-base md:text-lg leading-relaxed text-shadow mb-4 md:mb-6">
          Try searching for your favorite movies, actors, or directors!
        </p>
        
        <!-- Enhanced suggestion tags -->
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="$emit('suggestion-click', suggestion)"
            class="px-3 py-1.5 text-xs md:text-sm text-blue-300 bg-blue-500/20 rounded-full 
                   border border-blue-400/30 hover:bg-blue-500/30 hover:border-blue-400/50
                   transition-all duration-200 hover:scale-105 active:scale-95 text-shadow-sm"
          >
            {{ suggestion }}
          </button>
        </div>

        <!-- Fun loading message -->
        <div class="mt-6 md:mt-8 text-white/50 text-sm animate-pulse">
          <p>🎬 Ready to discover amazing movies?</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { Movie } from '../types/movie.types'
import MovieCard from './MovieCard.vue'

export default defineComponent({
  name: 'MovieGrid',
  components: {
    MovieCard
  },
  props: {
    movies: {
      type: Array as () => Movie[],
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    favoriteMovieIds: {
      type: Array as () => string[],
      default: () => []
    }
  },
  emits: ['movie-click', 'toggle-favorite', 'retry', 'suggestion-click'],
  setup() {
    const suggestions = [
      'Marvel', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance',
      'Christopher Nolan', 'Leonardo DiCaprio', 'Animated', 'Thriller'
    ]
    
    return {
      suggestions
    }
  }
})
</script>

<style scoped>
/* Enhanced grid animations */
.movie-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 475px) {
  .movie-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 640px) {
  .movie-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .movie-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5rem;
  }
}

/* Loading grid matches movie grid */
.loading-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 475px) {
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 640px) {
  .loading-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .loading-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .loading-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .loading-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5rem;
  }
}
</style>