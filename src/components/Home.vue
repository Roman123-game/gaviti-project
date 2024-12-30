<script setup>
import { ref, onMounted } from 'vue';
import.meta.env.VITE_TMDB_API_KEY;

const url = 'https://api.themoviedb.org/3/discover/movie';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
  }
};

// Reactive state variables
const movies = ref([]);
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

// Date Range State Variables
const startDate = ref('');
const endDate = ref('');

// Fetch movies based on date range filter
const fetchMovies = async (pageNum = 1, startDate = '', endDate = '') => {
  isLoading.value = true; // Show loading indicator
  try {
    // Create query parameters based on date range
    let queryParams = `?page=${pageNum}`;
    if (startDate && endDate) {
      queryParams += `&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}`;
    }

    const response = await fetch(`${url}${queryParams}`, options);
    const data = await response.json();

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

// Function to apply date range filter
const applyDateRangeFilter = () => {
  fetchMovies(page.value, startDate.value, endDate.value);
};

// Pagination controls
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchMovies(page.value, startDate.value, endDate.value);
  }
};
const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchMovies(page.value, startDate.value, endDate.value);
  }
};

// Fetch initial data on component mount
onMounted(() => {
  fetchMovies(page.value);
});
</script>

<template>
  <div>
    <h1>Popular Movies</h1>

    <!-- Date Range Filter -->
    <div class="filter-container">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate" />

      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" />

      <button @click="applyDateRangeFilter">Filter</button>
    </div>

    <!-- Movies Grid -->
    <div v-if="isLoading">Loading...</div>
    <div v-else class="movies-grid">
      <div v-for="(movie, index) in movies" :key="movie.id" class="movie-card">
        <router-link :to="`/movie/${movie.id}`">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w200${movie.poster_path}`"
            alt="Movie Poster"
          />
          <h3>{{ movie.title }}</h3>
        </router-link>
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
</template>





<style scoped>
.movies-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin: 20px 0 0 0;
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


