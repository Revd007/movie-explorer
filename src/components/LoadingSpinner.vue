<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- Main spinner -->
      <div 
        :class="[sizeClasses[size], colorClasses[color]]"
        class="animate-spin rounded-full border-4 border-t-transparent border-r-transparent border-current"
        :style="{ animationDuration: speed }"
      ></div>
      
      <!-- Inner pulsing dot -->
      <div 
        :class="[innerSizeClasses[size], colorClasses[color]]"
        class="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-ping opacity-60"
        :style="{ animationDuration: `calc(${speed} * 1.5)` }"
      ></div>
      
      <!-- Center dot -->
      <div 
        :class="[centerDotClasses[size], colorClasses[color]]"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-80"
      ></div>
    </div>
    
    <!-- Loading text -->
    <div v-if="showText" :class="textClasses" class="ml-3 font-medium">
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'xl',
      default: 'md'
    },
    color: {
      type: String as () => 'primary' | 'secondary' | 'white' | 'blue' | 'purple' | 'gold',
      default: 'primary'
    },
    speed: {
      type: String,
      default: '1s'
    },
    showText: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Loading...'
    },
    centered: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16'
    }

    const innerSizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-10 h-10',
      xl: 'w-14 h-14'
    }

    const centerDotClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    }

    const colorClasses = {
      primary: 'text-blue-500',
      secondary: 'text-purple-500',
      white: 'text-white',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      gold: 'text-yellow-400'
    }

    const textSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    }

    const textColorClasses = {
      primary: 'text-blue-500',
      secondary: 'text-purple-500',
      white: 'text-white',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      gold: 'text-yellow-400'
    }

    const containerClass = props.centered ? 'min-h-32' : ''
    const textClasses = `${textSizeClasses[props.size]} ${textColorClasses[props.color]}`

    return {
      sizeClasses,
      innerSizeClasses,
      centerDotClasses,
      colorClasses,
      containerClass,
      textClasses
    }
  }
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-spin {
  animation: spin var(--spin-duration, 1s) linear infinite;
}

.animate-ping {
  animation: ping var(--ping-duration, 1s) cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>