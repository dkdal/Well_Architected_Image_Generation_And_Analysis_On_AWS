import { createRouter, createWebHistory } from 'vue-router';
import HomeComponent from '../components/HomeComponent.vue';
import ImageGenerator from '../components/ImageGenerator.vue';
import VerifyUser from '../components/VerifyUser.vue';
import auth from '../store/auth';

const routes = [
  { path: '/', component: HomeComponent },
  { path: '/verify', component: VerifyUser },
  { 
    path: '/generate', 
    component: ImageGenerator,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.state.isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
