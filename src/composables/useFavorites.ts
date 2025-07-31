import { ref, computed } from '@vue/composition-api'
import type { Movie } from '../types/movie.types'

const FAVORITES_KEY = 'movie-explorer-favorites'

export function useFavorites() {
  const favorites = ref<Movie[]>([])

  // Load favorites from localStorage on initialization
  function loadFavorites() {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        favorites.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  // Save favorites to localStorage
  function saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
    } catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }

  // Check if a movie is in favorites
  function isFavorite(movieId: string) {
    return favorites.value.some(movie => movie.imdbID === movieId)
  }

  // Add movie to favorites
  function addToFavorites(movie: Movie) {
    if (!isFavorite(movie.imdbID)) {
      favorites.value.push(movie)
      saveFavorites()
    }
  }

  // Remove movie from favorites
  function removeFromFavorites(movieId: string) {
    const index = favorites.value.findIndex(movie => movie.imdbID === movieId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  // Toggle favorite status
  function toggleFavorite(movie: Movie) {
    if (isFavorite(movie.imdbID)) {
      removeFromFavorites(movie.imdbID)
    } else {
      addToFavorites(movie)
    }
  }

  const favoritesCount = computed(() => favorites.value.length)

  // Initialize favorites on creation
  loadFavorites()

  return {
    favorites,
    favoritesCount,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavorites,
    saveFavorites
  }
} 