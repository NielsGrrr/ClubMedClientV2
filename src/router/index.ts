import { createRouter, createWebHistory } from 'vue-router'
import TypeChambreList from '../views/TypeChambreList.vue'
import AnnonceList from '../views/AnnoncesList.vue'
import LocalisationList from '../views/LocalisationList.vue'
import AnnonceDetail from '../views/AnnonceDetail.vue'
//import AnnonceDetail from '../views/AnnonceDetail.vue'

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
      path: '/typeChambres',
      name: 'types-chambre',
      component: TypeChambreList
    },
    {
      path: '/annonces/:id?',
      name: 'annonces-list',
      component: AnnonceList,
      props : true
    },
    // {
    //   path: '/annonces/detail/:id?',
    //   name: 'annonces-detail',
    //   component: AnnonceDetail,
    //   props : true
    // },
    {
      path: '/',
      name: 'localisations',
      component: LocalisationList
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
      component: () => import('../views/FavorisList.vue')
    }
  ],
})

export default router