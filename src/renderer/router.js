import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/import', component: () => import('./views/import.vue') },
    { path: '/ports', component: () => import('./views/ports.vue') },
    { path: '/baud', component: () => import('./views/baud.vue') },
    { path: '/furnace', component: () => import('./views/furnace.vue') },
    { path: '/adapter', component: () => import('./views/adapter.vue') },
    { path: '/', component: () => import('./views/launch.vue') },
  ],
})
