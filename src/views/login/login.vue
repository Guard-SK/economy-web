<template>
  <div class="container justify-content-center">
    <form @submit.prevent="handleSubmit" class="row d-flex mt-5">
      <h3 class="mb-4">Login</h3>
      <div class="col-12 justify-content-center">
        <div class="mb-3r">
          <label for="emailInput" class="form-label">Email</label>
          <input type="email" class="form-control w-lg-75 w-50 mx-auto" id="emailInput" aria-describedby="emailHelp" v-model="email" required>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Heslo</label>
          <input type="password" class="form-control w-lg-75 w-50 mx-auto" id="passwordInput" v-model="password" required>
        </div>
        <div class="d-flex mx-auto">
          <p class="mb-3">Nemáš účet?</p>
          <a @click="$router.push('/auth/signup')" class="ms-2 mb-3">Vytvor si ho.</a>
        </div>
      </div>
      <button type="submit" class="btn col-12 btn-primary py-3">Login</button>
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
  await store.dispatch('login', {
  email: email.value,
  password: password.value
  })
  router.push('/home')
}
catch (err) {
  error.value = err.message
}
}
return { handleSubmit, email, password, error }
}
}
</script>