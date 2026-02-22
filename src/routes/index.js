import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/web_src/Home/Home.vue')
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
    component: () => import('../components/web_src/register-component.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/web_src/login-component.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;