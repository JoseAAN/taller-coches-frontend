import { createRouter, createWebHistory } from 'vue-router';
import AdminHome from '../components/admin_src/home.vue';
import Home from '../components/web_src/Home/Home.vue';
import Register from '../components/web_src/register-component.vue';
import Login from '../components/web_src/login-component.vue';
import ServiceHomeEditComponent from '../components/admin_src/service-home-edit-component.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'admin.home',
    component: AdminHome
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/admin/service-home-edit',
    name: 'admin.service-home-edit',
    component: ServiceHomeEditComponent
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;