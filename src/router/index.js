import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
	{
		path: '/',
		redirect: '/auth/login'
	},
	{
		path: '/photos',
		name: 'Photos',
		component: () => import('../views/photos/photos.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/admin/user',
		name: 'tabuser',
		component: () => import('../views/admin/user.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/admin/notes',
		name: 'tabmotes',
		component: () => import('../views/admin/notes.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/admin/storage',
		name: 'tabstorage',
		component: () => import('../views/admin/storage.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/fileview/:filename',
		name: 'FileView',
		component: () => import('../views/filesystem/file.vue'),
		props: true,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/auth/dashboard',
		redirect: '/dashboard'
	},
	{
		path: '/notes',
		name: '/notes',
		component: () => import('../views/notes/notesmenu.vue'),
		meta: {
			requiresAuth: true
		}
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
		path: '/admin',
		name: 'admin',
		meta: {
			requiresAuth: true
		},
		component: () => import('../views/admin/admin.vue')
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

const getCurrentUser = () => {
	return new Promise((resolve, reject)=>  {
		const removeListener = onAuthStateChanged(
			getAuth(),
			(user) => {
				removeListener()
				resolve(user)
			},
			reject
		)
	})
}

router.beforeEach(async (to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (await getCurrentUser()) {
			console.log('user logged in, can go there',getAuth().currentUser)
			next()
		} else {
			console.log('not logged in, cant go into there', getAuth().currentUser)
			next('/')
		}
	} else {
		next()
	}
	if (to.matched.some(record => record.meta.requiresVisitor)) {
		if (await getCurrentUser()) {
			console.log('not a visitor', getAuth().currentUser)
			router.push('/dashboard')
		} else {
			console.log(getAuth().currentUser)
			next()
		}
	} else {
		next()
	}
})

export default router
