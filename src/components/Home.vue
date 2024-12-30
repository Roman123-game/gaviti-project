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

const movies = ref([]);
const page = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

const startDate = ref('');
const endDate = ref('');

const sortBy = ref('release_date');

const fetchMovies = async (pageNum = 1, startDate = '', endDate = '', sortBy = 'release_date') => {
  isLoading.value = true;
  try {
    let queryParams = `?page=${pageNum}&sort_by=${sortBy}.desc`;
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
    isLoading.value = false;
  }
};

const applyDateRangeFilter = () => {
  fetchMovies(page.value, startDate.value, endDate.value, sortBy.value);
};

const sortMovies = () => {
  fetchMovies(page.value, startDate.value, endDate.value, sortBy.value);
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchMovies(page.value, startDate.value, endDate.value, sortBy.value);
  }
};
const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchMovies(page.value, startDate.value, endDate.value, sortBy.value);
  }
};

onMounted(() => {
  fetchMovies(page.value, startDate.value, endDate.value, sortBy.value);
});
</script>



<template>
  <div>
    <h1>Popular Movies</h1>

    <div class="filter-sort-container">
      <div class="filter-container">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="startDate" />

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="endDate" />

        <button class="home-button" @click="applyDateRangeFilter">Filter</button>
      </div>

      <div class="sort-container">
        <label for="sortBy">Sort By:</label>
        <select id="sortBy" v-model="sortBy" @change="sortMovies">
          <option value="release_date">Release Date</option>
          <option value="title">Title</option>
          <option value="vote_average">Rating</option>
        </select>
      </div>
    </div>

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

    <div class="pagination" v-if="movies.length">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>







<style scoped>
.filter-sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container,
.sort-container {
  display: flex;
  align-items: center;
}

.filter-container label,
.sort-container label {
  margin-right: 10px;
}

.filter-container input,
.sort-container select {
  margin-right: 10px;
  padding: 5px;
}

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
  background: lightgray;
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
  padding: 9px;
  font-size: 8px;
  cursor: pointer;
  background-color: lightgreen;
  border: 1px solid black;
  border-radius: 2px;
  color: whitesmoke;

}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
button:hover {
  border-color: #646cff;
}
</style>


