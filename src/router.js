import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/people',
      name: 'people',
      component: () => import('./views/People.vue')
    }, {
      path: '/message',
      name: 'message',
      component: () => import('./views/Message.vue')
    }, {
      path: '/help',
      name: 'help',
      component: () => import('./views/Help.vue')
    }
  ]
})
