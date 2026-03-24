import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/chambres',
      name: 'types-chambres',
      component: () => import('../views/TypeChambreList.vue')
    },
    // --- NOUVELLES ROUTES : RÉSERVATION ET PANIER ---
    {
      path: '/reservation/step1',
      name: 'reservationStep1',
      component: () => import('../views/ReservationStep1.vue')
    },
    {
      path: '/reservation/step2',
      name: 'reservationStep2',
      component: () => import('../views/ReservationStep2.vue')
    },
    {
      path: '/panier',
      name: 'panier',
      component: () => import('../views/PanierView.vue')
    }
  ],
})

export default router