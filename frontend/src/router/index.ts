import { createRouter, createWebHistory } from 'vue-router'
import RegionsView from '../views/RegionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'regions',
      component: RegionsView
    }
  ]
})

export default router
