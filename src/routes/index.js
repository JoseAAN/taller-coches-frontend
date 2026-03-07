import { createRouter, createWebHistory } from 'vue-router';
import { loaderState } from '../loaderState.js';

const routes = [
  {
    path: '/',
    component: () => import('../components/web_src/layouts/homepage-layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../components/web_src/Home/Home.vue')
      },
      {
        path: 'services',
        name: 'services',
        component: () => import('../components/web_src/sections/home-sections/services-components/service-component.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('../components/web_src/sections/products/index.vue')
      },
      {
        path: 'product/:id',
        name: 'ProductDetails',
        component: () => import('../components/web_src/sections/products/details/product-details.vue')
      }
    ]
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
        path: 'admin-sidebar-configuration',
        name: 'admin.sidebar-configuration',
        component: () => import('../components/admin_src/sidebar-configuration/sidebar-configuration.vue')
      }
    
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/web_src/auth/register-component.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/web_src/auth/login-component.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  loaderState.show();
  await new Promise(resolve => setTimeout(resolve, 400));

  next();
});

router.afterEach(() => {
  console.log('after');
  loaderState.hide();
});

router.onError(() => {
  loaderState.hide();
});

export default router;