import { createRouter, createWebHistory } from 'vue-router';
import AdminHome from '../components/admin_src/home.vue';
import Home from '../components/web_src/Home/Home.vue';
import Register from '../components/web_src/register-component.vue';
import Login from '../components/web_src/login-component.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    component: () => import('../components/admin_src/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin.home',
        component: () => import('../components/admin_src/home.vue')
      },
      {
        path: 'service-home-edit',
        name: 'admin.services-home-edit',
        component: () => import('../components/admin_src/service-home-edit-component.vue')
      },
      {
        path: '/admin/admin-sidebar-configuration',
        name: 'admin.sidebar-configuration',
        component: () => import('../components/admin_src/sidebar-configuration/sidebar-configuration.vue')
      }
    
    ]
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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;