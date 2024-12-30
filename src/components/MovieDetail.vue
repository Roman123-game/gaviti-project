<template>
  <div v-if="isLoading">Loading movie details...</div>
  <div v-else>
    <h1>{{ movie.title }}</h1>
    <img
      v-if="movie.poster_path"
      :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
      alt="Movie Poster"
    />
    <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
    <p><strong>Rating:</strong> {{ movie.vote_average || 'N/A' }}</p>
    <p><strong>Overview:</strong> {{ movie.overview }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Access route parameters
const route = useRoute();
const movie = ref(null);
const isLoading = ref(true);

// Function to fetch movie details
const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer YOUR_API_KEY', // Replace with your API key
      },
    });
    const data = await response.json();
    movie.value = data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch movie details on component mount
onMounted(() => {
  const movieId = route.params.id; // Get the movie ID from the route parameters
  fetchMovieDetails(movieId);
});
</script>
