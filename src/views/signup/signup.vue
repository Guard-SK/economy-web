<template>
    <div class="container justify-content-center">
      <form @submit.prevent="handleSubmit" class="row d-flex mt-5">
        <h3 class="mb-4">Sign up</h3>
        <div class="col-12 justify-content-center">
          <div class="mb-3">
            <label for="nameInput" class="form-label">Meno</label>
            <input type="name" class="form-control w-lg-75 w-50 mx-auto" id="nameInput" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="surenameInput" class="form-label">Priezvisko</label>
            <input type="surename" class="form-control w-lg-75 w-50 mx-auto" id="surenameInput" aria-describedby="emailHelp">
          </div>
          <div class="mb-3r">
            <label for="emailInput" class="form-label">Email</label>
            <input type="email" class="form-control w-lg-75 w-50 mx-auto" id="emailInput" aria-describedby="emailHelp" v-model="email" required>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Heslo</label>
            <input type="password" class="form-control w-lg-75 w-50 mx-auto" id="passwordInput" v-model="password" required>
          </div>
          <div class="mb-3">
        	<label for="exampleInputPassword1" class="form-label">Zopakuj heslo</label>
            <input type="password" class="form-control w-lg-75 w-50 mx-auto" id="repeatPasswordInput">
          </div>
        </div>
        <button type="submit" class="btn col-12 btn-primary py-3">Sign up</button>
        <div v-if="error" class="alert alert-danger w-75 mt-3 mx-auto" role="alert">
          {{ error }}
        </div>
      </form>
    </div>
</template>
  
<script>
import { ref} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
setup() {
	const email = ref('')
	const password = ref('')
	const error = ref(null)
	const store = useStore()
	const router = useRouter()
	const handleSubmit = async () => {
	try {
		await store.dispatch('signUp', {
		email: email.value,
		password: password.value
		})
		router.push('/')
	}
	catch (err) {
		error.value = err.message
	}
	}
	return { handleSubmit, email, password, error }
}
}
</script>