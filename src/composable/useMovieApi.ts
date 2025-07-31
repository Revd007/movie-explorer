import { ref, computed } from '@vue/composition-api'
import axios from 'axios'
import type { Movie, MovieDetails, SearchResponse } from '../types/movie.type'

// Free OMDB API key - you can get your own at http://www.omdbapi.com/apikey.aspx
const API_KEY = 'b9bd48a6'
const BASE_URL = 'https://www.omdbapi.com/'

export function useMovieApi() {
  const movies = ref<Movie[]>([])
  const movieDetails = ref<MovieDetails | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')
  const currentPage = ref(1)
  const totalResults = ref(0)

  const hasMovies = computed(() => movies.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalResults.value / 10))

  async function searchMovies(query: string, page = 1) {
    if (!query.trim()) return

    try {
      isLoading.value = true
      hasError.value = false
      currentPage.value = page

      const response = await axios.get<SearchResponse>(BASE_URL, {
        params: {
          apikey: API_KEY,
          s: query,
          page,
          type: 'movie'
        }
      })

      if (response.data.Response === 'True') {
        movies.value = response.data.Search.map(movie => ({
          ...movie,
          Poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop'
        }))
        totalResults.value = parseInt(response.data.totalResults)
      } else {
        movies.value = []
        totalResults.value = 0
        hasError.value = true
        errorMessage.value = response.data.Error || 'No movies found'
      }
    } catch (error) {
      console.error('Search error:', error)
      hasError.value = true
      errorMessage.value = 'Failed to search movies. Please try again.'
      movies.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function getMovieDetails(imdbId: string) {
    try {
      isLoading.value = true
      hasError.value = false

      const response = await axios.get<MovieDetails>(BASE_URL, {
        params: {
          apikey: API_KEY,
          i: imdbId,
          plot: 'full'
        }
      })

      if (response.data.Response === 'True') {
        movieDetails.value = {
          ...response.data,
          Poster: response.data.Poster !== 'N/A' ? response.data.Poster : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'
        }
      }
    } catch (error) {
      console.error('Details error:', error)
      hasError.value = true
      errorMessage.value = 'Failed to load movie details'
    } finally {
      isLoading.value = false
    }
  }

  function clearMovies() {
    movies.value = []
    totalResults.value = 0
    currentPage.value = 1
  }

  function clearDetails() {
    movieDetails.value = null
  }

  return {
    movies,
    movieDetails,
    isLoading,
    hasError,
    errorMessage,
    hasMovies,
    currentPage,
    totalResults,
    totalPages,
    searchMovies,
    getMovieDetails,
    clearMovies,
    clearDetails
  }
}