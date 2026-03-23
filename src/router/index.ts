import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TypeChambreList from '../views/TypeChambreList.vue'

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
      component: TypeChambreList 
    },
    {
      path: '/admin/resorts',
      name: 'admin-resorts',
      component: () => import('../views/admin/DashboardResortsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/resorts/create',
      name: 'admin-resorts-create',
      component: () => import('../views/admin/ResortCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/resorts/edit/:id',
      name: 'admin-resorts-edit',
      component: () => import('../views/admin/ResortEditView.vue'),
      meta: { requiresAuth: true },
      props: true
    }
  ],
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
