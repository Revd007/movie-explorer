<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm transition-opacity"
      @click="$emit('close')"
    ></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div 
        class="relative w-full max-w-6xl bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-purple-900/95 
               backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl transform transition-all"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="$emit('close')"
          class="absolute top-6 right-6 z-10 p-3 rounded-full bg-black/40 hover:bg-black/60 
                 text-white transition-all duration-200 hover:scale-110 group"
        >
          <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div v-if="movie" class="p-8">
          <div class="flex flex-col xl:flex-row gap-8">
            <!-- Movie Poster -->
            <div class="flex-shrink-0 xl:w-80">
              <div class="relative group">
                <img
                  :src="movie.Poster"
                  :alt="movie.Title"
                  class="w-full xl:w-80 aspect-[2/3] object-cover rounded-2xl shadow-2xl 
                         group-hover:scale-105 transition-transform duration-300"
                  @error="handleImageError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                </div>
              </div>
            </div>

            <!-- Movie Info -->
            <div class="flex-1 space-y-6">
              <!-- Title and Basic Info -->
              <div>
                <h1 class="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                  {{ movie.Title }}
                </h1>
                <div class="flex flex-wrap items-center gap-4 text-white/80">
                  <span class="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <svg class="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {{ movie.Year }}
                  </span>
                  <span class="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">{{ movie.Runtime }}</span>
                  <span class="bg-blue-500/20 text-blue-300 rounded-full px-4 py-2 border border-blue-400/30">{{ movie.Rated }}</span>
                </div>
              </div>

              <!-- Genres -->
              <div class="flex flex-wrap gap-3">
                <span
                  v-for="genre in movie.Genre.split(', ')"
                  :key="genre"
                  class="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                         text-purple-200 rounded-full text-sm font-medium border border-purple-400/30
                         hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
                >
                  {{ genre }}
                </span>
              </div>

              <!-- Ratings -->
              <div v-if="movie.Ratings && movie.Ratings.length > 0" 
                   class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Ratings
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    v-for="rating in movie.Ratings"
                    :key="rating.Source"
                    class="text-center bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div class="text-2xl font-bold text-yellow-400 mb-1">{{ rating.Value }}</div>
                    <div class="text-sm text-white/70">{{ rating.Source }}</div>
                  </div>
                </div>
              </div>

              <!-- Trailer Section -->
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-white flex items-center">
                    <svg class="w-6 h-6 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Trailer
                  </h3>
                  <button
                    v-if="!trailerUrl"
                    @click="loadTrailer"
                    :disabled="isLoadingTrailer"
                    class="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white 
                           rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <LoadingSpinner v-if="isLoadingTrailer" size="sm" color="white" class="mr-2" />
                    <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    {{ isLoadingTrailer ? 'Loading...' : 'Watch Trailer' }}
                  </button>
                </div>
                
                <div v-if="trailerUrl" class="relative aspect-video rounded-xl overflow-hidden">
                  <iframe
                    :src="trailerUrl"
                    class="w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                
                <div v-else-if="!isLoadingTrailer" 
                     class="aspect-video rounded-xl bg-white/5 border-2 border-dashed border-white/20 
                            flex items-center justify-center">
                  <div class="text-center text-white/60">
                    <svg class="w-16 h-16 mx-auto mb-3 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>Click "Watch Trailer" to load the trailer</p>
                  </div>
                </div>
              </div>

              <!-- Plot -->
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Plot
                </h3>
                <p class="text-white/90 leading-relaxed text-lg">{{ movie.Plot }}</p>
              </div>

              <!-- Cast & Crew -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cast & Crew
                  </h3>
                  <div class="space-y-3 text-sm">
                    <div><span class="text-yellow-400 font-semibold">Director:</span> 
                         <span class="text-white/90 ml-1">{{ movie.Director }}</span></div>
                    <div><span class="text-yellow-400 font-semibold">Writer:</span> 
                         <span class="text-white/90 ml-1">{{ movie.Writer }}</span></div>
                    <div><span class="text-yellow-400 font-semibold">Actors:</span> 
                         <span class="text-white/90 ml-1">{{ movie.Actors }}</span></div>
                  </div>
                </div>

                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Details
                  </h3>
                  <div class="space-y-3 text-sm">
                    <div><span class="text-yellow-400 font-semibold">Released:</span> 
                         <span class="text-white/90 ml-1">{{ movie.Released }}</span></div>
                    <div><span class="text-yellow-400 font-semibold">Language:</span> 
                         <span class="text-white/90 ml-1">{{ movie.Language }}</span></div>
                    <div><span class="text-yellow-400 font-semibold">Country:</span> 
                         <span class="text-white/90 ml-1">{{ movie.Country }}</span></div>
                    <div v-if="movie.BoxOffice"><span class="text-yellow-400 font-semibold">Box Office:</span> 
                         <span class="text-white/90 ml-1">{{ movie.BoxOffice }}</span></div>
                  </div>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  @click="$emit('toggle-favorite')"
                  class="flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-200 
                         hover:scale-105 active:scale-95 shadow-lg"
                  :class="isFavorite 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-500/25' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm'"
                >
                  <svg class="w-6 h-6 mr-3 transition-transform duration-200" 
                       :class="isFavorite ? 'scale-110' : ''"
                       :fill="isFavorite ? 'currentColor' : 'none'" 
                       stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { MovieDetails } from '../types/movie.types'
import LoadingSpinner from './LoadingSpinner.vue'

export default defineComponent({
  name: 'MovieDetails',
  components: {
    LoadingSpinner
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    movie: {
      type: Object as () => MovieDetails | null,
      default: null
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    trailerUrl: {
      type: String,
      default: null
    },
    isLoadingTrailer: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'toggle-favorite', 'load-trailer'],
  setup(props, { emit }) {
    function loadTrailer() {
      if (props.movie) {
        emit('load-trailer', props.movie.Title, props.movie.Year)
      }
    }

    function handleImageError(event: Event) {
      const img = event.target as HTMLImageElement
      if (props.movie) {
        img.src = `https://via.placeholder.com/400x600/1e293b/f1f5f9?text=${encodeURIComponent(props.movie.Title)}`
      }
    }

    return {
      loadTrailer,
      handleImageError
    }
  }
})
</script>   