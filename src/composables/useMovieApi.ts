import { ref, computed } from '@vue/composition-api'
import axios from 'axios'
import type { Movie, MovieDetails, SearchResponse } from '../types/movie.types'

const OMDB_API_KEY = '4287ad07' // Free API key for demo
const OMDB_BASE_URL = 'https://www.omdbapi.com/'
// You can get a free YouTube API key from Google Cloud Console
const YOUTUBE_API_KEY = 'AIzaSyCK5s4rHANZJ-4GQcQB4TkF3Q2l4qGqIw8' // Demo key - get your own!

export function useMovieApi() {
  const movies = ref<Movie[]>([])
  const movieDetails = ref<MovieDetails | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')
  const currentPage = ref(1)
  const totalResults = ref(0)
  const trailerUrl = ref<string | null>(null)
  const isLoadingTrailer = ref(false)

  const hasMovies = computed(() => movies.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalResults.value / 10))

  async function searchMovies(query: string, page = 1) {
    if (!query.trim()) return

    isLoading.value = true
    hasError.value = false
    errorMessage.value = ''
    currentPage.value = page

    try {
      const response = await axios.get(OMDB_BASE_URL, {
        params: {
          apikey: OMDB_API_KEY,
          s: query,
          page: page,
          type: 'movie'
        }
      })

      if (response.data.Response === 'True') {
        // Fix poster URLs - add fallback for missing images
        movies.value = (response.data.Search || []).map((movie: any) => ({
          ...movie,
          Poster: movie.Poster && movie.Poster !== 'N/A' 
            ? movie.Poster 
            : `https://via.placeholder.com/300x450/1e293b/f1f5f9?text=${encodeURIComponent(movie.Title)}`
        }))
        totalResults.value = parseInt(response.data.totalResults) || 0
      } else {
        movies.value = []
        totalResults.value = 0
        hasError.value = true
        errorMessage.value = response.data.Error || 'No movies found'
      }
    } catch (error) {
      console.error('Search error:', error)
      movies.value = []
      totalResults.value = 0
      hasError.value = true
      errorMessage.value = 'Failed to search movies. Please check your connection and try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function getMovieDetails(imdbId: string) {
    if (!imdbId) return

    isLoading.value = true
    hasError.value = false
    errorMessage.value = ''

    try {
      const response = await axios.get(OMDB_BASE_URL, {
        params: {
          apikey: OMDB_API_KEY,
          i: imdbId,
          plot: 'full'
        }
      })

      if (response.data.Response === 'True') {
        // Fix poster URL with fallback
        movieDetails.value = {
          ...response.data,
          Poster: response.data.Poster && response.data.Poster !== 'N/A'
            ? response.data.Poster
            : `https://via.placeholder.com/400x600/1e293b/f1f5f9?text=${encodeURIComponent(response.data.Title)}`
        }
      } else {
        movieDetails.value = null
        hasError.value = true
        errorMessage.value = response.data.Error || 'Movie details not found'
      }
    } catch (error) {
      console.error('Details error:', error)
      movieDetails.value = null
      hasError.value = true
      errorMessage.value = 'Failed to load movie details. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  async function searchTrailer(movieTitle: string, year: string) {
    isLoadingTrailer.value = true
    trailerUrl.value = null

    try {
      // Create a proper search query for the movie trailer
      const searchQuery = `${movieTitle} ${year} official trailer`
      
      // Try to search for the trailer using YouTube API
      const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: YOUTUBE_API_KEY,
          q: searchQuery,
          part: 'snippet',
          type: 'video',
          maxResults: 1,
          order: 'relevance',
          videoDefinition: 'high'
        }
      }).catch(() => null)

      if (youtubeResponse?.data?.items?.[0]) {
        // Found a real trailer!
        const videoId = youtubeResponse.data.items[0].id.videoId
        trailerUrl.value = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0`
      } else {
        // Fallback: Search using a more generic approach
        const fallbackQuery = encodeURIComponent(searchQuery)
        
        // Try alternative search methods or use curated trailers
        const knownTrailers = {
          'The Dark Knight': '6ZfuNTqbHE8',
          'Inception': 'YoHD9XEInc0', 
          'Interstellar': 'zSWdZVtXT7E',
          'The Matrix': 'vKQi3bIA1Bc',
          'Avatar': '5PSNL1qE6VY',
          'Avengers': 'eOrNdBpGMv8',
          'Iron Man': '8ugaeA-nMTc',
          'Spider-Man': 't06RUxPbp_c',
          'Batman': 'Cj62x_UWDFA',
          'Superman': 'T6DJcgm3wNY'
        }

        // Check if we have a known trailer for this movie
        const knownTrailer = Object.keys(knownTrailers).find(key => 
          movieTitle.toLowerCase().includes(key.toLowerCase())
        )

        if (knownTrailer) {
          trailerUrl.value = `https://www.youtube.com/embed/${knownTrailers[knownTrailer as keyof typeof knownTrailers]}?autoplay=0&controls=1&showinfo=0&rel=0`
        } else {
          // Last resort: Create a YouTube search link
          trailerUrl.value = `https://www.youtube.com/results?search_query=${fallbackQuery}`
        }
      }
      
    } catch (error) {
      console.error('Trailer search error:', error)
      
      // Final fallback with YouTube search
      const fallbackQuery = encodeURIComponent(`${movieTitle} ${year} trailer`)
      trailerUrl.value = `https://www.youtube.com/results?search_query=${fallbackQuery}`
    } finally {
      isLoadingTrailer.value = false
    }
  }

  function clearMovies() {
    movies.value = []
    totalResults.value = 0
    currentPage.value = 1
    hasError.value = false
    errorMessage.value = ''
  }

  function clearDetails() {
    movieDetails.value = null
    hasError.value = false
    errorMessage.value = ''
    trailerUrl.value = null
  }

  return {
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
  }
} 