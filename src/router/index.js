import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
		path: '/',
		redirect: '/auth/login'
	},
  {
		path: '/auth/',
    redirect: '/auth/login',
		children: [
			{
				path: '',
				redirect: '/auth/login'
			},
			{
				path: 'login',
				name: 'Login',
				component: () => import('../views/login/login.vue')
			},
      {
				path: 'signup',
				name: 'Sign up',
				component: () => import('../views/signup/signup.vue')
			}
		]
	},
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
