import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/Users.vue'),
    },
    {
      path: '/gifts',
      name: 'Gifts',
      component: () => import('@/views/Gifts.vue'),
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('@/views/History.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/admin/AdminLogin.vue'),
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/AdminUsers.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/gifts',
      name: 'AdminGifts',
      component: () => import('@/views/admin/AdminGifts.vue'),
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/exchanges',
      name: 'AdminExchanges',
      component: () => import('@/views/admin/AdminExchanges.vue'),
      meta: { requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const store = useAppStore();
  
  if (to.meta.requiresAdmin && !store.isAdmin) {
    next('/admin');
    return;
  }
  
  if (to.path === '/admin' && store.isAdmin) {
    next('/admin/users');
    return;
  }
  
  next();
});

export default router;
