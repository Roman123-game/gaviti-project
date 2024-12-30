import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import MovieDetail from '@/components/MovieDetail.vue';  // Create this component

const routes = [
  { path: '/', component: Home },
  { path: '/movie/:id', component: MovieDetail, name: 'movie-details' },  // Dynamic route for movie details
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
