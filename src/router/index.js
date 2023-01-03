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
		meta: {
			requiresVisitor: true
		},
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
		path: '/dashboard',
		name: 'dashboard',
		meta: {
			requiresAuth: true
		},
		component: () => import('../views/dashboard/dashboard.vue')
	},
	{
		path: '/profile',
		name: 'profile',
		meta: {
			requiresAuth: true
		},
		component: () => import('../views/profile/profile.vue')
	},
	{ 
		path: '/:pathMatch(.*)*', 
		name: '404',
		component: () => import('../views/404/404.vue')
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
	} else if (to.matched.some(record => record.meta.requiresVisitor)) {
		if (!getAuth().currentUser) {
			next()
		} else {
			throw new Error(`not a visitor`)
		}
	} else {
		next()
	}
})

export default router
