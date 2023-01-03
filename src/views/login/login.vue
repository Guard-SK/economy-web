<!-- <template>
<div class="flex justify-center">
    <form @submit.prevent="handleSubmit" class="row d-flex mt-5">
        <div class="typewriter w-auto mx-auto mb-5">
            <h2 class="static-text text-3xl">Vitaj v Karteli!</h2>
        </div>
        <div class="flex">
            <p-input-text type="email" placeholder="Email" class="form-control w-lg-75 w-50 mx-auto" id="emailInput" aria-describedby="emailHelp" v-model="email" required/>
            <p-input-text type="password" placeholder="Heslo" class="form-control w-lg-75 w-50 mx-auto" id="passwordInput" v-model="password" required/>
        </div>
        <div class="col-12">
            <div class="d-flex mx-auto col-6">
                <p class="mb-3">Nemáš účet?</p>
                <a @click="$router.push('/auth/signup')" class="ms-1 mb-3 text-decoration-none text-[#ffa500]">Vytvor si ho.</a>
            </div>
            <p-button type="submit" class="">Login</p-button>
        </div> 
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

<style>
.typewriter h2 {
  overflow: hidden; 
  border-right: .15em solid #ffa500; 
  white-space: nowrap; 
  margin: 0 auto; 
  letter-spacing: .15em; 
  animation: 
    typing 3.5s steps(16, end),
    blink-caret .75s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style> -->

<template>
    <div class="form-demo flex justify-center card bg-neutral w-[500px] mx-auto text-neutral-content shadow-lg">
        <div class="flex justify-content-center">
            <div class="card-body items-center text-center">
                <div class="typewriter w-auto mx-auto mb-7 card-title">
                    <h2 class="static-text text-3xl">Vitaj v Karteli!</h2>
                </div>
                <form @submit.prevent="submit()" class="p-fluid form-control">
                    <div class="field mb-4">
                        <div>
                            <input id="email" v-model="v$.email.$model" placeholder="Email" class="input input-bordered w-[250px] shadow-md" :class="{'p-invalid':v$.email.$invalid && submitted}" aria-describedby="email-error"/>
                        </div>
                        <span v-if="v$.email.$error && submitted">
                            <span id="email-error" v-for="(error, index) of v$.email.$errors" :key="index">
                            <small class="p-error">{{error.$message}}</small>
                            </span>
                        </span>
                        <small v-else-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response" class="p-error">{{v$.email.required.$message.replace('Value', 'Email')}}</small>
                    </div>
                    <div class="field mb-8">
                        <p-password id="password" placeholder="Heslo" :feedback="false" v-model="v$.password.$model" :class="{'p-invalid':v$.password.$invalid && submitted}" toggleMask></p-password>
                        <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{v$.password.required.$message.replace('Value', 'Password')}}</small>
                    </div>
                    <div class="card-action">
                        <div class="field mb-4">
                            <span>Nemáš účet?</span>
                            <span class="text-accent ml-1 cursor-pointer" @click="$router.push('/auth/signup')">Vytvor si ho!</span>
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-if="error" class="alert alert-error shadow-l max-w-[250px] mx-auto mt-5">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span> {{ error }} </span>
        </div>
    </div>
</template>

<script>
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

export default {
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            email: '',
            password: '',
            submitted: false,
            showMessage: false,
            error: ''
        }
    },
    validations() {
        return {
            email: {
                required,
                email
            },
            password: {
                required
            }
        }
    },
    methods: {
        async submit() {
			if (!await this.v$.$validate())
				return

            try {
                await this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password
                })
                this.$router.push('/dashboard')
            }
            catch (err) {
                this.error = err.message
            }
        },
        resetForm() {
            this.name = '';
            this.email = '';
            this.password = '';
            this.submitted = false;
        }
    }
}
</script>

<style lang="scss">
.typewriter h2 {
  overflow: hidden; 
  border-right: .15em solid #ffa500; 
  white-space: nowrap; 
  margin: 0 auto; 
  letter-spacing: .15em; 
  animation: 
    typing 3.5s steps(16, end),
    blink-caret .75s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}

</style>