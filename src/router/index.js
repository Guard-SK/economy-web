import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

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
		meta: {
			requiresAuth: true
		},
		component: () => import('../views/HomeView.vue')
	},
	{
		path: '/about',
		name: 'about',
		meta: {
			requiresAuth: true
		},
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

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (getAuth().currentUser) {
			next()
		} else {
			console.log('not logged in, cant go into there')
		}
	} else {
		next()
	}
})

export default router
