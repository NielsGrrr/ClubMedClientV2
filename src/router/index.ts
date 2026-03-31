import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/chambres',
      name: 'types-chambres',
      component: () => import('../views/TypeChambreList.vue'),
    },
    {
      path: '/reservation/step1',
      name: 'reservationStep1',
      component: () => import('../views/ReservationStep1.vue'),
    },
    {
      path: '/reservation/step2',
      name: 'reservationStep2',
      component: () => import('../views/ReservationStep2.vue'),
    },
    {
      path: '/reservation/step3',
      name: 'reservationStep3',
      component: () => import('../views/ReservationStep3.vue'),
    },
    {
      path: '/reservation/step4',
      name: 'reservationStep4',
      component: () => import('../views/ReservationStep4.vue'),
    },
    {
      path: '/panier',
      name: 'panier',
      component: () => import('../views/PanierView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
})

export default router