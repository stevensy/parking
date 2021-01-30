import Vue from 'vue';

import VueRouter from 'vue-router';

import Home from '../views/Home.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/auth.vue')
  },
  {
    path: '/my',
    name: 'My',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/my/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/getPwd',
    name: 'GetPwd',
    component: () => import('../views/my/getPwd.vue')
  },
  {
    path: '/changePwd',
    name: 'ChangePwd',
    component: () => import('../views/my/changePwd.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/order.vue')
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: '/',
  routes
})

export default router
