<script setup>
import { ref, onMounted } from 'vue';

// TMDb API details
const url = 'https://api.themoviedb.org/3/movie/popular';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjFlNzU5ZjEwM2NkYTY1NzFlZDhhZGJiY2ZlZjE5OSIsIm5iZiI6MTczNTU0Mzg0NC40NzcsInN1YiI6IjY3NzI0YzI0M2ZjNzZlYTU4ODkyNzVjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.J8wzs1i-Kan6NSVDQ2tywg95rglnYgQUpHK7_E4pACs'
  }
};

// Reactive state variables
const movies = ref([]);
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

// Function to fetch data from TMDb API
const fetchMovies = async (pageNum = 1) => {
  isLoading.value = true; // Show loading indicator
  try {
    const response = await fetch(`${url}?page=${pageNum}`, options);
    const data = await response.json();

    // Filter out duplicates based on the 'id' field
    const uniqueMovies = [];
    const seenIds = new Set();

    data.results.forEach((movie) => {
      if (!seenIds.has(movie.id)) {
        uniqueMovies.push(movie);
        seenIds.add(movie.id);
      }
    });

    movies.value = uniqueMovies;
    totalPages.value = data.total_pages || 1;
  } catch (error) {
    console.error('Error fetching movies:', error);
  } finally {
    isLoading.value = false; // Hide loading indicator
  }
};

// Pagination controls
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchMovies(page.value);
  }
};
const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchMovies(page.value);
  }
};

// Fetch initial data on component mount
onMounted(() => {
  fetchMovies(page.value);
});
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading">Loading...</div>

    <!-- Movies Grid -->
    <div v-else>
      <div class="movies-grid">
        <div v-for="(movie, index) in movies" :key="index" class="movie-card">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
            alt="Movie Poster"
          />
          <h3>{{ movie.title }}</h3>
          <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
          <p><strong>Rating:</strong> {{ movie.vote_average || 'N/A' }}</p>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination" v-if="movies.length">
        <button @click="prevPage" :disabled="page === 1">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>



<style scoped>
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.movie-card {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  text-align: center;
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
}

.movie-card h3 {
  margin: 10px 0;
  font-size: 18px;
}

.movie-card p {
  margin: 5px 0;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>


