<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <form @submit.prevent="handleSubmit">
      <h3>Sign up</h3>

      <label for="email">Email:</label>
      <input type="email" name="email" v-model="email" required>

      <label for="email">Password:</label>
      <input type="password" name="password" v-model="password" required>

      <button>Sign up</button>
      <div v-if="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import { ref} from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)
    const store = useStore()
    const handleSubmit = async () => {
      try {
        await store.dispatch('signUp', {
          email: email.value,
          password: password.value
        })
        this.$router.push('/')
      }
      catch (err) {
        error.value = err.message
      }
    }
    return { handleSubmit, email, password, error }
  }
}
</script>

