<template>
<div class="collapse">
	<nav class="navbar bg-neutral text-neutral-content !mb-16 md:flex hidden">
		<div class="flex-1">
			<a class="btn btn-ghost normal-case text-xl">Kartel 1.B</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li v-if="isLoggedIn"  class="btn">Zostatok : {{ balance }}€</li>
				<li><router-link to="/dashboard" class="" v-if="isLoggedIn">Dashboard</router-link></li>
				<li><router-link to="/profile" class="" v-if="isLoggedIn">My account</router-link></li>
				<li>
					<button class="btn" @click="handleSignOut()" v-if="isLoggedIn"><i class="pi pi-sign-out"/></button>
				</li>
			</ul>
		</div>
	</nav>
</div>

<div class="collapse md:hidden w-full">
  <input type="checkbox" class="peer" v-if="isLoggedIn" /> 
  <div class="collapse-title bg-neutral text-neutral-content flex pr-[16px] justify-between">
		<div class="">
			<a class="btn btn-ghost normal-case text-xl">Kartel 1.B</a>
			<a v-if="isLoggedIn" class="btn-ghost">Zostatok : {{ balance }}€</a>
		</div>
		<label class="btn btn-square btn-ghost">
			<svg v-if="isLoggedIn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
		</label>
  </div>
  <div class="collapse-content bg-neutral text-neutral-content"> 
		<div class="divider"></div>
		<ul class="menu menu-vertical px-1">
			<li><router-link to="/dashboard" class="" v-if="isLoggedIn">Dashboard</router-link></li>
			<li><router-link to="/profile" class="" v-if="isLoggedIn">My account</router-link></li>
			<div class="divider"></div>
			<li>
				<button class="btn justify-start" @click="handleSignOut()" v-if="isLoggedIn"><i class="pi pi-sign-out"/>Sign Out</button>
			</li>
		</ul>
  </div>
</div>

</template>

<script>

import {getFirestore,getDoc,doc,onSnapshot} from "firebase/firestore" ;
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';


export default {
	data() {
		return {
			balance:0,
			items: [
				{
					label:'Dashboard',
					icon:'pi pi-fw pi-home',
					command: () => {
						this.$router.push('/dashboard')
					} 
				},
				{
					label:'Quit',
					icon:'pi pi-fw pi-power-off'
				}
			],
			isLoggedIn: null
		}
	},

	methods: {
		handleSignOut() {
			let auth = getAuth()
			signOut(auth).then(() => {
				this.$router.push('/auth/login')
			})
		}
	},
	created() {
		let auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.isLoggedIn = true
				const db = getFirestore()
      			const uid = getAuth().currentUser.uid;
				
				onSnapshot(doc(db, "users", uid), (doc) => {
   					 this.balance = doc.data().balance
			});
			} else {
				this.isLoggedIn = false
				this.balance = 0
			}
		})
	},
}
</script>

<!-- <template>
<nav class="navbar navbar-expand-lg bg-light d-lg-flex">
  <div class="container-fluid">
	<a class="navbar-brand" href="#">
		<img src="./_assets/logo.png" alt="Bootstrap" width="24" height="24">
		Kartel 1.B
	</a>
	<div class="collapse navbar-collapse" id="navbarNav">
	  <ul class="navbar-nav">
		<li class="nav-item">
			<router-link to="/dashboard" class="nav-link active" v-if="isLoggedIn">Dashboard</router-link>
		</li>
		
		<li class="nav-item">
			<router-link to="/profile" class="nav-link" v-if="isLoggedIn">My account</router-link>
		</li>
		<li>
			<button class="btn btn-secondary" @click="handleSignOut()" v-if="isLoggedIn">Log out</button>
		</li>
	  </ul>
	</div>
  </div>
</nav>
<nav class="navbar bg-light fixed-top d-lg-none">
  <div class="container-fluid">
	<a class="navbar-brand" href="#">
		<img src="./_assets/logo.png" alt="Bootstrap" width="24" height="24">
		Kartel 1.B
	</a>
	<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
	  <span class="navbar-toggler-icon"></span>
	</button>
	<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
	  <div class="offcanvas-header">
		<h5 class="offcanvas-title" id="offcanvasNavbarLabel">Navigation</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	  </div>
	  <div class="offcanvas-body">
		<ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
		  <li class="nav-item">
			<router-link to="/app/dashboard" class="nav-link active" v-if="isLoggedIn">Dashboard</router-link>
		  </li>
		  <li class="nav-item">
			<router-link to="/app/about" class="nav-link" v-if="isLoggedIn">My account</router-link>
		  </li>

		  <li>
			<button class="btn-primary" @click="handleSignOut()" v-if="isLoggedIn">Log out</button>
		  </li>
		</ul>
	  </div>
	</div>
  </div>
</nav>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
let auth
onMounted(() => {
	auth = getAuth()
	onAuthStateChanged(auth, (user) => {
		if (user) {
			isLoggedIn.value = true
		} else {
			isLoggedIn.value = false
		}
	})
})

const handleSignOut = () => {
	signOut(auth).then(() => {
		router.push('/auth/login')
	})
}

</script> -->