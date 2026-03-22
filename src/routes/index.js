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
        component: () => import('../components/web_src/sections/services/index.vue')
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
      },
      {
        path: 'services/:id',
        name: 'ServiceDetails',
        component: () => import('../components/web_src/sections/services/details/service-details.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../components/web_src/sections/cart/cart-page.vue')
      },
      {
        path: 'checkout-invoice',
        name: 'CheckoutView',
        component: () => import('../components/web_src/sections/cart/checkout-success.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../components/web_src/maintenance-view.vue')
      },
      {
        path: 'empresas',
        name: 'Empresas',
        component: () => import('../components/web_src/maintenance-view.vue')
      }
    ]
  },
  {
    path: '/appointments',
    component: () => import('../components/web_src/layouts/layout-appointments.vue'),
    children: [
      {
        path: '',
        name: 'AppointmentCalendar',
        component: () => import('../components/web_src/sections/appointment/inf/appointment.vue')
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('../components/web_src/layouts/layout-profile.vue'),
    children: [
      {
        path: '',
        name: 'HomeProfile',
        component: () => import('../components/web_src/sections/profile/sections-profile/profile-index.vue')
      },
      {
        path: 'vehicles',
        name: 'VehiclesProfile',
        component: () => import('../components/web_src/sections/profile/sections-profile/profile-vehicles.vue')
      },
      {
        path: 'Invoices',
        name: 'InvoicesProfile',
        component: () => import('../components/web_src/sections/profile/sections-profile/profile-invoices.vue')
      },
      {
        path: 'Appointments',
        name: 'AppointmentsProfile',
        component: () => import('../components/web_src/sections/profile/sections-profile/profile-appointments.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('../components/admin_src/AdminLayout.vue'),
    meta: { requiresAdmin: true },
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

router.beforeEach((to, from, next) => {

  //verificacion para saber si la ruta requiere admin o no

  // TODO: tenemos esto de momento pero habría que cambiarlo por:
  // - Hacer peticion por cada ruta que vaya el cliente (realentiza la página)
  // - Guardar role en pinia o en app global properties

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  loaderState.show();

  if (requiresAdmin) {
    const token = localStorage.getItem('user_token');

    if (!token) {
      return next('/login');
    }

    return fetch(`${BASE_URL}/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
      })
      .then(data => {
        if (data.role && data.role.id === 1) {
          next();
        } else {
          console.error('Usuario sin permisos entro en un área restringida');
          next('/login');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        next('/login');
      });
  } else {
    next();
  }
});

router.afterEach(() => {
  loaderState.hide();
});

router.onError(() => {
  loaderState.hide();
});

export default router;