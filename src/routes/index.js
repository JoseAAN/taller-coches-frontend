import { createRouter, createWebHistory } from 'vue-router';
import { loaderState } from '../loaderState.js';
import { authState } from '../JS/Auth.js';

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
    meta: { requiresAuth: true },
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
        path: 'invoices',
        name: 'InvoicesProfile',
        component: () => import('../components/web_src/sections/profile/sections-profile/profile-invoices.vue')
      },
      {
        path: 'appointments',
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
      },
      {
        path: 'users',
        name: 'admin.users',
        component: () => import('../components/admin_src/users/admin-users.vue')
      },
      {
        path: 'products',
        name: 'admin.products',
        component: () => import('../components/admin_src/products/products-crud.vue')
      },
      {
        path: 'services-types',
        name: 'admin.services-types',
        component: () => import('../components/admin_src/services-types/services-type-crud.vue')
      },
      {
        path: 'services',
        name: 'admin.services',
        component: () => import('../components/admin_src/services/services-crud.vue')
      },
      {
        path: 'vehicles',
        name: 'admin.vehicles',
        component: () => import('../components/admin_src/vehicles/admin-vehicles.vue')
      },
      {
        path: 'categories',
        name: 'admin.categories',
        component: () => import('../components/admin_src/category/category-crud.vue')
      },
      {
        path: 'appointments',
        name: 'admin.appointments',
        component: () => import('../components/admin_src/appointments/admin-appointments.vue')
      },
      {
        path: 'invoices',
        name: 'admin.invoices',
        component: () => import('../components/admin_src/invoices/admin-invoices.vue')
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
  {
    path: '/privacidad',
    name: 'Privacidad',
    component: () => import('../components/web_src/privacidad.vue')
  },
  {
    path: '/terminos',
    name: 'Terminos',
    component: () => import('../components/web_src/terminos.vue')
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresAuth  = to.matched.some(record => record.meta.requiresAuth);

  loaderState.show();

  const token = localStorage.getItem('user_token');

  if (requiresAdmin) {
    // Sin token → login directo.
    if (!token) return next('/login');

    // Usamos el authState cacheado en memoria (cargado al iniciar la app desde
    // localStorage). No hace falta un fetch: el backend sigue siendo la barrera
    // real con su middleware auth.admin.
    const user = authState.user;

    if (user?.role?.name === 'admin') {
      return next();
    } else {
      // Sin datos de usuario cacheados o rol insuficiente.
      return next(user ? '/' : '/login');
    }

  } else if (requiresAuth) {
    if (!token) return next('/login');
    next();
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