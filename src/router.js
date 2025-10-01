import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('./components/Home.vue') },
//  { path: '/home', name: 'HomeAlias', component: () => import('./components/Home.vue') },
  { path: '/about', name: 'About', component: () => import('./components/About.vue') },
  { path: '/calendrier', name: 'Calendrier', component: () => import('./components/Calendar.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
