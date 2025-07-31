<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="movieStore.isLoadingDetails" class="animate-pulse">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="w-full lg:w-1/3">
          <div class="bg-white/10 aspect-[2/3] rounded-xl"></div>
        </div>
        <div class="flex-1 space-y-4">
          <div class="bg-white/10 h-8 rounded"></div>
          <div class="bg-white/10 h-4 rounded w-2/3"></div>
          <div class="bg-white/10 h-20 rounded"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/10 h-4 rounded"></div>
            <div class="bg-white/10 h-4 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="movieStore.detailsError" class="text-center py-12">
      <div class="glass-effect rounded-xl p-8 max-w-md mx-auto">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-white mb-2">Failed to Load Movie</h3>
        <p class="text-white/70 mb-4">{{ movieStore.detailsError }}</p>
        <div class="space-x-4">
          <button @click="loadMovieDetails" class="btn-primary">
            Try Again
          </button>
          <button @click="goBack" class="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie" class="animate-fade-in">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="flex items-center text-white/80 hover:text-movie-gold transition-colors duration-300 mb-6"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Movies
      </button>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Movie Poster -->
        <div class="w-full lg:w-1/3">
          <div class="sticky top-24">
            <div class="relative group">
              <img
                :src="movie.poster !== 'N/A' ? movie.poster : fallbackPoster"
                :alt="movie.title"
                class="w-full aspect-[2/3] object-cover rounded-xl shadow-movie group-hover:shadow-movie-hover transition-shadow duration-300"
                @error="handleImageError"
              />
              
              <!-- Favorite button overlay -->
              <button
                @click="toggleFavorite"
                class="absolute top-4 right-4 p-3 rounded-full glass-effect hover:bg-white/20 transition-colors duration-300"
                :class="{ 'text-red-500': isMovieFavorite, 'text-white/60 hover:text-red-500': !isMovieFavorite }"
              >
                <svg class="w-6 h-6" :fill="isMovieFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Movie Information -->
        <div class="flex-1 space-y-6">
          <!-- Title and Basic Info -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl font-bold text-white text-shadow">
              {{ movie.title }}
            </h1>
            
            <div class="flex flex-wrap items-center gap-4 text-white/80">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-movie-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                {{ movie.year }}
              </span>
              
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2 text-movie-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ movie.runtime }}
              </span>
              
              <span class="bg-movie-gold text-movie-dark px-3 py-1 rounded-full text-sm font-semibold">
                {{ movie.rated }}
              </span>
            </div>

            <!-- Genres -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in genres"
                :key="genre"
                class="glass-effect px-3 py-1 rounded-full text-sm text-white/90"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <!-- Ratings -->
          <div v-if="movie.ratings.length > 0" class="glass-effect rounded-xl p-6">
            <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-movie-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
              Ratings
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="rating in movie.ratings"
                :key="rating.source"
                class="text-center bg-white/5 rounded-lg p-4"
              >
                <div class="text-2xl font-bold text-movie-gold mb-1">
                  {{ rating.value }}
                </div>
                <div class="text-sm text-white/70">
                  {{ rating.source }}
                </div>
              </div>
            </div>
          </div>

          <!-- Plot -->
          <div class="glass-effect rounded-xl p-6">
            <h3 class="text-xl font-semibold text-white mb-4">Plot</h3>
            <p class="text-white/90 leading-relaxed">
              {{ movie.plot }}
            </p>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="glass-effect rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Cast & Crew</h3>
              <div class="space-y-3 text-sm">
                <div>
                  <span class="text-movie-gold font-medium">Director:</span>
                  <span class="text-white/90 ml-2">{{ movie.director }}</span>
                </div>
                <div>
                  <span class="text-movie-gold font-medium">Writers:</span>
                  <span class="text-white/90 ml-2">{{ movie.writer }}</span>
                </div>
                <div>
                  <span class="text-movie-gold font-medium">Stars:</span>
                  <span class="text-white/90 ml-2">{{ movie.actors }}</span>
                </div>
              </div>
            </div>

            <div class="glass-effect rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">Details</h3>
              <div class="space-y-3 text-sm">
                <div>
                  <span class="text-movie-gold font-medium">Released:</span>
                  <span class="text-white/90 ml-2">{{ movie.released }}</span>
                </div>
                <div>
                  <span class="text-movie-gold font-medium">Language:</span>
                  <span class="text-white/90 ml-2">{{ movie.language }}</span>
                </div>
                <div>
                  <span class="text-movie-gold font-medium">Country:</span>
                  <span class="text-white/90 ml-2">{{ movie.country }}</span>
                </div>
                <div v-if="movie.boxOffice">
                  <span class="text-movie-gold font-medium">Box Office:</span>
                  <span class="text-white/90 ml-2">{{ movie.boxOffice }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Awards -->
          <div v-if="movie.awards !== 'N/A'" class="glass-effect rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-movie-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
              </svg>
              Awards & Recognition
            </h3>
            <p class="text-white/90">{{ movie.awards }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 pt-4">
            <button
              @click="toggleFavorite"
              class="btn-primary flex items-center"
            >
              <svg class="w-5 h-5 mr-2" :fill="isMovieFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              {{ isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
            
            <button
              v-if="movie.website && movie.website !== 'N/A'"
              @click="openWebsite"
              class="btn-secondary flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Visit Website
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()

const movieId = computed(() => route.params.id as string)
const movie = computed(() => movieStore.currentMovieDetails)
const isMovieFavorite = computed(() => 
  movie.value ? movieStore.isMovieFavorite(movie.value.imdbID) : false
)

const genres = computed(() => 
  movie.value?.genre.split(', ') ?? []
)

const fallbackPoster = 'https://via.placeholder.com/400x600/1a1a2e/f39c12?text=No+Image'

function loadMovieDetails() {
  movieStore.getMovieDetails(movieId.value)
}

function toggleFavorite() {
  if (movie.value) {
    const movieData = {
      id: movie.value.id,
      title: movie.value.title,
      year: movie.value.year,
      poster: movie.value.poster,
      imdbID: movie.value.imdbID,
      type: movie.value.type
    }
    movieStore.toggleFavorite(movieData)
  }
}

function goBack() {
  router.go(-1)
}

function openWebsite() {
  if (movie.value?.website && movie.value.website !== 'N/A') {
    window.open(movie.value.website, '_blank')
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = fallbackPoster
}

// Load movie details when component mounts or route changes
onMounted(() => {
  loadMovieDetails()
})

watch(movieId, () => {
  movieStore.clearMovieDetails()
  loadMovieDetails()
})
</script> 