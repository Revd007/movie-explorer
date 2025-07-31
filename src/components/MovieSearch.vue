<template>
  <div class="relative max-w-4xl mx-auto animate-scaleIn">
    <div class="relative">
      <!-- Enhanced Search input -->
      <div class="relative group">
        <input
          v-model="searchQuery"
          @input="handleInput"
          @keyup.enter="handleSearch"
          @focus="handleFocus"
          @blur="handleBlur"
          type="text"
          placeholder="Search for movies, actors, directors..."
          class="search-bar focus-visible text-shadow"
          :class="{
            'ring-2 ring-blue-400/50 border-blue-400/50 animate-glow': isFocused,
            'opacity-50 cursor-not-allowed': isLoading
          }"
          :disabled="isLoading"
        />
        
        <!-- Enhanced search icon / loading -->
        <div class="absolute right-14 md:right-16 top-1/2 transform -translate-y-1/2">
          <div class="animate-float" style="animation-delay: 0.5s;">
            <LoadingSpinner v-if="isLoading" size="sm" color="blue" />
            <svg v-else class="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white/80 transition-colors duration-200" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Enhanced clear button -->
        <button
          v-if="searchQuery && !isLoading"
          @click="handleClear"
          class="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full
                 text-white/60 hover:text-white hover:bg-white/10
                 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible
                 animate-float"
          style="animation-delay: 0.7s;"
        >
          <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Input focus glow effect -->
        <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300
                    bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none -z-10"></div>
      </div>
      
      <!-- Enhanced search suggestions -->
      <div class="mt-4 md:mt-6 animate-slideUp" style="animation-delay: 0.3s;">
        <div class="flex flex-wrap gap-2 md:gap-3 justify-center">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="suggestion"
            @click="handleSuggestionClick(suggestion)"
            class="group px-3 py-2 text-xs md:text-sm font-medium text-white/70 hover:text-white
                   glass-effect hover:glass-effect-strong rounded-full
                   transition-all duration-200 hover:scale-105 active:scale-95 focus-visible
                   animate-slideUp text-shadow-sm"
            :style="{ animationDelay: `${0.4 + index * 0.05}s` }"
            :disabled="isLoading"
          >
            <span class="flex items-center">
              <svg class="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 opacity-60 group-hover:opacity-100 
                         transition-opacity duration-200 animate-wiggle" 
                   :style="{ animationDelay: `${index * 0.1}s` }"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4h10m-5 6v-4m0 0l-2-2m2 2l2-2" />
              </svg>
              {{ suggestion }}
            </span>
          </button>
        </div>
      </div>
      
      <!-- Enhanced search tips -->
      <Transition
        name="fade"
        enter-active-class="duration-300 ease-out"
        enter-from-class="opacity-0 transform translate-y-2"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform translate-y-2"
      >
        <div v-if="showTips" class="mt-4 text-center animate-pulse">
          <div class="inline-flex items-center space-x-2 glass-effect rounded-full px-4 py-2">
            <span class="text-2xl animate-bounce">💡</span>
            <p class="text-white/60 text-xs md:text-sm text-shadow-sm">
              Try searching by movie title, actor name, or year (e.g., "2019")
            </p>
          </div>
        </div>
      </Transition>

      <!-- Search stats -->
      <div v-if="searchQuery && !showTips" 
           class="mt-3 text-center animate-fadeIn">
        <p class="text-white/50 text-xs text-shadow-sm">
          🔍 Searching for: <span class="text-white/70 font-medium">"{{ searchQuery }}"</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { debounce } from '../utils/debounce'
import LoadingSpinner from './LoadingSpinner.vue'

export default defineComponent({
  name: 'MovieSearch',
  components: {
    LoadingSpinner
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['search', 'clear'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const isFocused = ref(false)
    const showTips = ref(true)
    
    const suggestions = [
      'Marvel', 'DC Comics', 'Action', 'Comedy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller',
      'Christopher Nolan', 'Leonardo DiCaprio', 'Tom Hanks', 'Disney', '2023', 'Animated'
    ]

    const debouncedSearch = debounce((query: string) => {
      if (query.trim()) {
        emit('search', query.trim())
        showTips.value = false
      }
    }, 500)

    function handleInput() {
      if (searchQuery.value.trim()) {
        debouncedSearch(searchQuery.value)
      } else {
        emit('clear')
        showTips.value = true
      }
    }

    function handleSearch() {
      if (searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim())
        showTips.value = false
      }
    }

    function handleClear() {
      searchQuery.value = ''
      emit('clear')
      showTips.value = true
    }

    function handleSuggestionClick(suggestion: string) {
      searchQuery.value = suggestion
      emit('search', suggestion)
      showTips.value = false
    }

    function handleFocus() {
      isFocused.value = true
    }

    function handleBlur() {
      isFocused.value = false
    }

    return {
      searchQuery,
      isFocused,
      showTips,
      suggestions,
      handleInput,
      handleSearch,
      handleClear,
      handleSuggestionClick,
      handleFocus,
      handleBlur
    }
  }
})
</script>

<style scoped>
/* Enhanced focus and interaction styles */
.search-bar:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

input {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced placeholder animation */
.search-bar::placeholder {
  transition: color 0.3s ease;
}

.search-bar:focus::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

/* Fade transition for tips */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Mobile-specific improvements */
@media (max-width: 640px) {
  .search-bar {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .search-bar {
    border: 2px solid rgba(255, 255, 255, 0.8);
  }
  
  .search-bar:focus {
    border-color: rgba(59, 130, 246, 1);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
}
</style>