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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
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
