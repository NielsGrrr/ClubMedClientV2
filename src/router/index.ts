import { createRouter, createWebHistory } from 'vue-router'
import TypeChambreList from '../views/TypeChambreList.vue'
import AnnonceList from '../views/AnnoncesList.vue'
import LocalisationList from '../views/LocalisationList.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import { useAuthStore } from '../stores/auth'
import AnnonceDetail from '../views/AnnonceDetail.vue'

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
      component: TypeChambreList
    },
    {
      path: '/admin/resorts',
      name: 'admin-resorts',
      component: () => import('../views/admin/DashboardResortsView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/resorts/create',
      name: 'admin-resorts-create',
      component: () => import('../views/admin/ResortCreateView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/resorts/edit/:id',
      name: 'admin-resorts-edit',
      component: () => import('../views/admin/ResortEditView.vue'),
      meta: { requiresAdmin: true },
      props: true
    },
    {
      path: '/reservation/step1',
      name: 'reservationStep1',
      component: () => import('../views/ReservationStep1.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservation/step2',
      name: 'reservationStep2',
      component: () => import('../views/ReservationStep2.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservation/step3',
      name: 'reservationStep3',
      component: () => import('../views/ReservationStep3.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reservation/step4',
      name: 'reservationStep4',
      component: () => import('../views/ReservationStep4.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/panier',
      name: 'panier',
      component: () => import('../views/PanierView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/typeChambres',
      name: 'types-chambres-static',
      component: TypeChambreList
    },
    {
      path: '/annonces/:id?',
      name: 'annonces-list',
      component: AnnonceList,
      props: true
    },
    {
      path: '/localisations',
      name: 'localisations',
      component: LocalisationList
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/annonces/detail/:id',
      name: 'annonce-detail',
      component: AnnonceDetail,
      props: true
    },
    {
      path: '/mes-favoris',
      name: 'favoris-list',
      component: () => import('../views/FavorisList.vue') // Utilise l'import dynamique
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'home' }) // Redirige si pas admin
  }
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' }) // Redirige vers login si non connecté
  }
  next()
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // --- GESTION DE L'AUTHENTIFICATION (Dev 2) ---
    // const authStore = useAuthStore()
    // if (!authStore.isAuthenticated) {
    //   return next({ name: 'login' })
    // }

    // En attendant le store de Dev 2, on laisse passer
    next()
  } else {
    next()
  }
})



export default router

