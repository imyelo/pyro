import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/import', component: () => import('./views/import.vue') },
    { path: '/ports', component: () => import('./views/ports.vue') },
    { path: '/furnace', component: () => import('./views/furnace.vue') },
    { path: '/adapter', component: () => import('./views/adapter.vue') },
    { path: '/preferences', component: () => import('./views/preferences.vue') },
    { path: '/', component: () => import('./views/launch.vue') },
  ],
})
