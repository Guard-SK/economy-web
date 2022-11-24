import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('../views/AboutView.vue')
  },
  { 
	path: '/:pathMatch(.*)*', 
	redirect: '/auth/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
