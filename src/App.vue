<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
    <!-- Enhanced animated background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-2xl animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-l from-pink-500/5 to-purple-500/5 rounded-full blur-2xl animate-float" style="animation-delay: 1s;"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 px-3 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4">
          <div class="text-center sm:text-left animate-slideDown">
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-contrast mb-2 leading-tight">
              Movie 
              <span class="gradient-text animate-pulse">
                Explorer
              </span>
            </h1>
            <p class="text-white/80 text-base sm:text-lg md:text-xl font-medium text-shadow">
              🎬 Discover and explore your favorite movies with trailers
            </p>
          </div>
          
          <!-- Enhanced Favorites button -->
          <button
            @click="handleShowFavorites"
            class="relative p-3 md:p-4 glass-effect rounded-2xl hover:glass-effect-strong 
                   transition-all duration-300 group hover:scale-110 active:scale-95 animate-slideLeft
                   focus-visible border-0 hover:animate-glow"
          >
            <svg class="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-red-400 transition-colors duration-200 animate-float" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span v-if="favoritesCount > 0" 
                  class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold 
                         rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center animate-bounce shadow-lg text-shadow">
              {{ favoritesCount > 99 ? '99+' : favoritesCount }}
            </span>
          </button>
        </div>

        <!-- Enhanced Search -->
        <div class="animate-slideUp" style="animation-delay: 0.2s;">
          <MovieSearch 
            :is-loading="isLoading"
            @search="handleSearch"
            @clear="handleClearSearch"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 px-3 sm:px-6 lg:px-8 pb-8 md:pb-12">
      <div class="max-w-7xl mx-auto">
        <!-- Enhanced Movies Grid -->
        <div class="animate-slideUp" style="animation-delay: 0.4s;">
          <MovieGrid
            :movies="movies"
            :is-loading="isLoading"
            :has-error="hasError"
            :error-message="errorMessage"
            :favorite-movie-ids="favoriteMovieIds"
            @movie-click="handleMovieClick"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>

        <!-- Enhanced Pagination -->
        <div v-if="hasMovies && !isLoading" class="animate-slideUp" style="animation-delay: 0.6s;">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-results="totalResults"
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </main>

    <!-- Enhanced Movie Details Modal -->
    <Transition
      name="modal"
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <MovieDetails
        v-if="isDetailsOpen"
        :is-open="isDetailsOpen"
        :movie="movieDetails"
        :is-favorite="selectedMovieIsFavorite"
        :trailer-url="trailerUrl"
        :is-loading-trailer="isLoadingTrailer"
        @close="handleCloseDetails"
        @toggle-favorite="handleToggleSelectedMovieFavorite"
        @load-trailer="handleLoadTrailer"
      />
    </Transition>

    <!-- Enhanced Favorites Sidebar -->
    <Transition
      name="slide"
      enter-active-class="duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <FavoritesList
        v-if="isFavoritesOpen"
        :favorites="favorites"
        :is-visible="isFavoritesOpen"
        @movie-click="handleMovieClick"
        @remove-favorite="handleRemoveFromFavorites"
        @close="handleCloseFavorites"
      />
    </Transition>

    <!-- Loading overlay for better UX -->
    <Transition
      name="fade"
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading && movies.length === 0" 
           class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
        <div class="glass-effect-strong rounded-3xl p-8 flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" color="primary" />
          <p class="text-white/90 text-lg font-medium text-shadow">Searching movies...</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import MovieSearch from './components/MovieSearch.vue'
import MovieGrid from './components/MovieGrid.vue'
import MovieDetails from './components/MovieDetails.vue'
import FavoritesList from './components/FavoritesList.vue'
import Pagination from './components/Pagination.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { useMovieApi } from './composables/useMovieApi'
import { useFavorites } from './composables/useFavorites'
import type { Movie, MovieDetails as MovieDetailsType } from './types/movie.types'

export default defineComponent({
  name: 'App',
  components: {
    MovieSearch,
    MovieGrid,
    MovieDetails,
    FavoritesList,
    Pagination,
    LoadingSpinner
  },
  setup() {
    // Composables
    const {
      movies,
      movieDetails,
      isLoading,
      hasError,
      errorMessage,
      hasMovies,
      currentPage,
      totalPages,
      totalResults,
      trailerUrl,
      isLoadingTrailer,
      searchMovies,
      getMovieDetails,
      searchTrailer,
      clearMovies,
      clearDetails
    } = useMovieApi()

    const {
      favorites,
      favoritesCount,
      isFavorite,
      toggleFavorite
    } = useFavorites()

    // Local state
    const currentSearchQuery = ref('')
    const isDetailsOpen = ref(false)
    const isFavoritesOpen = ref(false)
    const selectedMovie = ref<Movie | null>(null)

    // Computed
    const favoriteMovieIds = computed(() => favorites.value.map(movie => movie.imdbID))
    const selectedMovieIsFavorite = computed(() => 
      selectedMovie.value ? isFavorite(selectedMovie.value.imdbID) : false
    )

    // Methods
    async function handleSearch(query: string, page = 1) {
      currentSearchQuery.value = query
      await searchMovies(query, page)
    }

    function handleClearSearch() {
      currentSearchQuery.value = ''
      clearMovies()
    }

    async function handleMovieClick(movie: Movie) {
      selectedMovie.value = movie
      await getMovieDetails(movie.imdbID)
      isDetailsOpen.value = true
    }

    function handleCloseDetails() {
      isDetailsOpen.value = false
      clearDetails()
      selectedMovie.value = null
    }

    function handleToggleFavorite(movie: Movie) {
      toggleFavorite(movie)
    }

    function handleToggleSelectedMovieFavorite() {
      if (selectedMovie.value) {
        toggleFavorite(selectedMovie.value)
      }
    }

    async function handleLoadTrailer(title: string, year: string) {
      await searchTrailer(title, year)
    }

    function handleRemoveFromFavorites(movie: Movie) {
      toggleFavorite(movie)
    }

    function handleShowFavorites() {
      isFavoritesOpen.value = true
    }

    function handleCloseFavorites() {
      isFavoritesOpen.value = false
    }

    async function handlePageChange(page: number) {
      if (currentSearchQuery.value) {
        await handleSearch(currentSearchQuery.value, page)
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    return {
      // Data
      movies,
      movieDetails,
      isLoading,
      hasError,
      errorMessage,
      hasMovies,
      currentPage,
      totalPages,
      totalResults,
      trailerUrl,
      isLoadingTrailer,
      favorites,
      favoritesCount,
      favoriteMovieIds,
      selectedMovieIsFavorite,
      isDetailsOpen,
      isFavoritesOpen,
      
      // Methods
      handleSearch,
      handleClearSearch,
      handleMovieClick,
      handleCloseDetails,
      handleToggleFavorite,
      handleToggleSelectedMovieFavorite,
      handleLoadTrailer,
      handleRemoveFromFavorites,
      handleShowFavorites,
      handleCloseFavorites,
      handlePageChange
    }
  }
})
</script>

<style>
/* Enhanced transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global scrollbar improvements */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.7), rgba(147, 51, 234, 0.7));
}

/* Smooth focus transitions */
*:focus {
  transition: all 0.2s ease;
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>