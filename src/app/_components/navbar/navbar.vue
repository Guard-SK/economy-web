<template>
<nav class="navbar navbar-expand-lg bg-light d-lg-flex">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
		<img src="./_assets/logo.png" alt="Bootstrap" width="24" height="24">
		Kartel 1.B
	</a>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
			<router-link to="/home" class="nav-link active" v-if="isLoggedIn">Dashboard</router-link>
        </li>
		
        <li class="nav-item">
			<router-link to="/about" class="nav-link" v-if="isLoggedIn">My account</router-link>
        </li>
		<li>
			<button class="btn-primary" @click="handleSignOut()" v-if="isLoggedIn">Log out</button>
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

</script>