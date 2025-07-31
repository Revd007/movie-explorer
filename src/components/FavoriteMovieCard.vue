<template>
  <div class="movie-card group cursor-pointer p-4 relative overflow-hidden">
    <!-- Movie Poster -->
    <div class="relative overflow-hidden rounded-lg mb-4" @click="$emit('click')">
      <img
        :src="favorite.poster !== 'N/A' ? favorite.poster : fallbackPoster"
        :alt="favorite.title"
        class="movie-poster group-hover:scale-110 transition-transform duration-500"
        @error="handleImageError"
        loading="lazy"
      />
      
      <!-- Overlay with actions -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <!-- Date Added -->
          <div class="text-white text-xs">
            <div class="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              Added {{ formatDate(favorite.addedAt) }}
            </div>
          </div>
          
          <!-- Remove Button -->
          <button
            @click.stop="removeFromFavorites"
            class="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors duration-300 hover:scale-110"
            title="Remove from favorites"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Favorite indicator (always visible) -->
      <div class="absolute top-3 left-3">
        <div class="bg-red-500 text-white p-1.5 rounded-full shadow-lg">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Movie Info -->
    <div class="space-y-2" @click="$emit('click')">
      <h3 class="font-semibold text-white text-lg leading-tight line-clamp-2 group-hover:text-movie-gold transition-colors duration-300">
        {{ favorite.title }}
      </h3>
      
      <div class="flex items-center justify-between text-sm">
        <span class="text-white/70">{{ favorite.year }}</span>
        <span class="text-movie-gold text-xs">
          ★ Favorite
        </span>
      </div>

      <!-- Added Date -->
      <div class="text-xs text-white/50">
        Added {{ formatDate(favorite.addedAt) }}
      </div>
    </div>

    <!-- Remove confirmation overlay -->
    <div
      v-if="showRemoveConfirm"
      class="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
      @click.stop
    >
      <div class="text-center p-4">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <p class="text-white text-sm mb-4">Remove from favorites?</p>
        <div class="flex gap-2 justify-center">
          <button
            @click="confirmRemove"
            class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded transition-colors duration-300"
          >
            Remove
          </button>
          <button
            @click="showRemoveConfirm = false"
            class="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FavoriteMovie } from '@/types/movie'

interface Props {
  favorite: FavoriteMovie
}

defineProps<Props>()
defineEmits<{
  click: []
  remove: [movieId: string]
}>()

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
  remove: [movieId: string]
}>()

const showRemoveConfirm = ref(false)
const fallbackPoster = 'https://via.placeholder.com/300x450/1a1a2e/f39c12?text=No+Image'

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = fallbackPoster
}

function removeFromFavorites() {
  showRemoveConfirm.value = true
}

function confirmRemove() {
  emit('remove', props.favorite.id)
  showRemoveConfirm.value = false
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return 'today'
  } else if (diffDays <= 7) {
    return `${diffDays} days ago`
  } else if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  padding: 1px;
  background: linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.3), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover::before {
  opacity: 1;
}
</style> 