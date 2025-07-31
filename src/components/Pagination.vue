<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 md:mt-12 animate-slideUp">
    <!-- Enhanced pagination controls -->
    <div class="flex items-center space-x-2">
      <!-- Previous button -->
      <button
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="p-2 md:p-3 glass-effect hover:glass-effect-strong rounded-xl 
               transition-all duration-200 focus-visible group
               disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        :class="currentPage <= 1 ? '' : 'hover:scale-110 active:scale-95'"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5 text-white transition-transform duration-200 group-hover:-translate-x-1" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page numbers -->
      <div class="flex items-center space-x-1 md:space-x-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('page-change', page)"
          class="px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-semibold text-sm md:text-base
                 transition-all duration-200 focus-visible"
          :class="[
            page === currentPage
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 animate-glow'
              : 'glass-effect hover:glass-effect-strong text-white hover:scale-105 active:scale-95'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next button -->
      <button
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="p-2 md:p-3 glass-effect hover:glass-effect-strong rounded-xl 
               transition-all duration-200 focus-visible group
               disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        :class="currentPage >= totalPages ? '' : 'hover:scale-110 active:scale-95'"
      >
        <svg class="w-4 h-4 md:w-5 md:h-5 text-white transition-transform duration-200 group-hover:translate-x-1" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Enhanced results info -->
    <div class="glass-effect rounded-xl px-4 py-2 md:px-6 md:py-3 animate-pulse">
      <div class="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-white/80 text-xs md:text-sm">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="font-medium text-shadow-sm">
            Showing {{ ((currentPage - 1) * 10) + 1 }}-{{ Math.min(currentPage * 10, totalResults) }}
          </span>
        </div>
        <div class="hidden sm:block w-px h-4 bg-white/20"></div>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="font-medium text-shadow-sm">
            {{ totalResults.toLocaleString() }} total results
          </span>
        </div>
      </div>
    </div>

    <!-- Page jump for large result sets -->
    <div v-if="totalPages > 10" class="flex items-center space-x-2">
      <span class="text-white/60 text-xs md:text-sm text-shadow-sm">Go to:</span>
      <input
        v-model.number="jumpToPage"
        @keyup.enter="handlePageJump"
        type="number"
        :min="1"
        :max="totalPages"
        :placeholder="`1-${totalPages}`"
        class="w-16 md:w-20 px-2 py-1 text-xs md:text-sm text-white bg-white/10 
               border border-white/20 rounded-lg focus:outline-none focus:ring-2 
               focus:ring-blue-400/50 transition-all duration-200 text-center
               backdrop-blur-sm"
      />
      <button
        @click="handlePageJump"
        class="px-3 py-1 text-xs md:text-sm glass-effect hover:glass-effect-strong 
               rounded-lg transition-all duration-200 hover:scale-105 active:scale-95
               text-white font-medium focus-visible"
      >
        Go
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalResults: {
      type: Number,
      required: true
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const jumpToPage = ref<number | null>(null)

    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(props.totalPages, start + maxVisible - 1)
      
      // Adjust start if we don't have enough pages at the end
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      // Add first page if not included
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }
      
      // Add visible range
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add last page if not included
      if (end < props.totalPages) {
        if (end < props.totalPages - 1) {
          pages.push('...')
        }
        pages.push(props.totalPages)
      }
      
      return pages
    })

    function handlePageJump() {
      if (jumpToPage.value && jumpToPage.value >= 1 && jumpToPage.value <= props.totalPages) {
        emit('page-change', jumpToPage.value)
        jumpToPage.value = null
      }
    }

    return {
      visiblePages,
      jumpToPage,
      handlePageJump
    }
  }
})
</script>

<style scoped>
/* Enhanced button hover effects */
button:not(:disabled):hover {
  transform: translateY(-2px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Input number styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Loading animation for current page */
@keyframes current-page-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
}

.animate-glow {
  animation: current-page-glow 2s ease-in-out infinite;
}
</style>