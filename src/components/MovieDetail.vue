<template>
  <div v-if="movie">
    <img
      v-if="movie.poster_path"
      :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
      alt="Movie Poster"
    />
    <h1>{{ movie.title }}</h1>
    <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
    <p><strong>Rating:</strong> {{ movie.vote_average || 'N/A' }}</p>
    <p><strong>Overview:</strong> {{ movie.overview }}</p>

  </div>
  <div v-else>
    <p>Loading movie details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// import.meta.env.VITE_TMDB_API_KEY;

const route = useRoute();
const movie = ref(null);

const fetchMovieDetails = async () => {
  const movieId = route.params.id;
  const url = `https://api.themoviedb.org/3/movie/${movieId}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  };

  try {
    const response = await fetch(url, options);
    movie.value = await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

onMounted(fetchMovieDetails);
</script>

<style scoped>

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}
img {
  max-width: 30%;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
