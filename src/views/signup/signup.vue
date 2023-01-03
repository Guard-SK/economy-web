<template>
    <div class="form-demo flex justify-center card bg-neutral w-[500px] mx-auto text-neutral-content shadow-lg">
        <div class="flex justify-content-center">
            <div class="card-body items-center text-center">
                <div class="typewriter w-auto mx-auto mb-7 card-title">
                    <h2 class="static-text text-3xl">Vytvor si u nás účet!</h2>
                </div>
                <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid form-control">
                    <div class="field mb-4">
                        <div>
                            <input id="name" v-model="v$.name.$model" placeholder="Meno" class="input input-bordered w-[250px] shadow-md" :class="{'p-invalid':v$.name.$invalid && submitted}" />
                        </div>
                        <small v-if="(v$.name.$invalid && submitted) || v$.name.$pending.$response" class="p-error h-3">{{v$.name.required.$message.replace('Value', 'Name')}}</small>
                    </div>
                    <div class="field mb-4">
                        <div>
                            <input id="surename" v-model="v$.surename.$model" placeholder="Priezvisko" class="input input-bordered w-[250px] shadow-md" :class="{'p-invalid':v$.surename.$invalid && submitted}" />
                        </div>
                        <small v-if="(v$.surename.$invalid && submitted) || v$.surename.$pending.$response" class="p-error">{{v$.name.required.$message.replace('Value', 'Surname')}}</small>
                    </div>
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
                        <p-password id="password" placeholder="Heslo" v-model="v$.password.$model" :class="{'p-invalid':v$.password.$invalid && submitted}" toggleMask></p-password>
                        <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{v$.password.required.$message.replace('Value', 'Password')}}</small>
                    </div>
                    <div class="card-action">
                        <div class="field mb-4">
                            <span>Máš účet?</span>
                            <span class="text-accent ml-1 cursor-pointer" @click="$router.push('/auth/login')">Prihlás sa!</span>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
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
import { getFirestore } from "firebase/firestore";
import { useStore } from 'vuex'
import { setDoc ,doc } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth'

const db = getFirestore();
export default {
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            name: '',
            surename: '',
            email: '',
            password: '',
            submitted: false,
            showMessage: false,
            error: ''
        }
    },
    countryService: null,
    validations() {
        return {
            name: {
                required
            },
            email: {
                required,
                email
            },
            surename: {
                required
            },
            password: {
                required
            }
        }
    },
    methods: {
        async handleSubmit() {
			if (!await this.v$.$validate())
				return

            try {
                await this.$store.dispatch('signUp', {
                    email: this.email,
                    password: this.password
                })
            }
            catch (err) {
                console.error("Error signing up: ", err);
            }

            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const uid = user.uid;

                const docRef = setDoc(doc(db, "users", uid), {
                    name: this.name,
                    surename: this.surename,
                    email: this.email,
                    password: this.password
                })
            } catch (e) {
                console.error("Error adding document: ", e);
            }
            this.$router.push('/dashboard')
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

.p-password {
    width: 250px;
    margin: auto;
    background-color: #212121;
}
.p-password .p-inputtext {
    border-radius: 2px !important;
    background-color: #212121;
    border-color: #444444;
    color: #cbdce4;
}

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
  50% { border-color: #ffa500; }
}

</style>

<!-- <template>
<div class="container justify-content-center">
    <form @submit.prevent="handleSubmit" class="row d-flex mt-5">
        <h3 class="mb-4">Vytvorenie účtu</h3>
        <div class="col-12 justify-content-center">
            <div class="mb-3">
                <label for="nameInput" class="form-label">Meno</label>
                <input type="name" class="form-control w-lg-75 w-50 mx-auto" id="nameInput" aria-describedby="emailHelp" v-model="name" required />
            </div>
            <div class="mb-3">
                <label for="surenameInput" class="form-label">Priezvisko</label>
                <input type="surename" class="form-control w-lg-75 w-50 mx-auto" id="surenameInput" aria-describedby="emailHelp" v-model="surename" required>
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
        <div class="col-12">
            <div class="d-flex mx-auto col-6">
                <p class="mb-3">Máš účet?</p>
                <a @click="$router.push('/auth/login')" class="ms-1 mb-3">Prihlás sa.</a>
            </div>
            <p-button type="submit" label="Login" class=""/>
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
import { getFirestore } from "firebase/firestore";
import { setDoc ,doc } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth'

const db = getFirestore();
export default {
    setup() {
        const name = ref('')
        const surename = ref('')
        const email = ref('')
        const password = ref('')
        const auth = getAuth();
        const error = ref(null)
        const store = useStore()
        const router = useRouter()
        const handleSubmit = async () => {
            try {
                await store.dispatch('signUp', {
                email: email.value,
                password: password.value
                })
                router.push('/home')
            }
            catch (err) {
                error.value = err.message
            }

            try {
                const user = auth.currentUser;
                const uid = user.uid;

                const docRef = await setDoc(doc(db, "users", uid), {
                    name: name.value,
                    surename: surename.value,
                    email: email.value,
                    password: password.value
                })
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        return { handleSubmit,name,surename, email, password, error }
    }
}
</script> -->