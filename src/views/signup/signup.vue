<template>
    <div class="form-demo flex justify-center card bg-neutral md:w-[500px] w-full mx-auto text-neutral-content shadow-lg">
        <div class="flex justify-content-center">
            <div class="card-body items-center text-center">
                <div class="typewriter w-auto mx-auto mb-7 card-title">
                    <h2 class="static-text sm:text-3xl text-xl">Vytvor si u nás účet!</h2>
                </div>
                <form @submit.prevent="handleSubmit()" class="p-fluid form-control w-full h-full">
                    <div class="field mb-4">
                        <div>
                            <input id="name" v-model="v$.name.$model" placeholder="Meno" class="input input-bordered w-[70%] shadow-md" :class="{'p-invalid':v$.name.$invalid && submitted}" />
                        </div>
                        <small v-if="(v$.name.$invalid && submitted) || v$.name.$pending.$response" class="p-error h-3">{{v$.name.required.$message.replace('Value', 'Name')}}</small>
                    </div>
                    <div class="field mb-4">
                        <div>
                            <input id="surname" v-model="v$.surname.$model" placeholder="Priezvisko" class="input input-bordered w-[70%] shadow-md" :class="{'p-invalid':v$.surname.$invalid && submitted}" />
                        </div>
                        <small v-if="(v$.surname.$invalid && submitted) || v$.surname.$pending.$response" class="p-error">{{v$.name.required.$message.replace('Value', 'Surname')}}</small>
                    </div>
                    <div class="field mb-4">
                        <div>
                            <input id="email" v-model="v$.email.$model" placeholder="Email" class="input input-bordered w-[70%] shadow-md" :class="{'p-invalid':v$.email.$invalid && submitted}" aria-describedby="email-error"/>
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
    <div v-if="error" class="alert alert-error shadow-l md:w-96 w-[80%] mx-auto mt-5">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span> {{ error }} </span>
        </div>
    </div>
</template>

<script>
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { getFirestore,setDoc ,doc,getDoc,collection, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
const db = getFirestore();
export default {
    setup: () => ({ v$: useVuelidate() }),
    data() {
        return {
            name: '',
            surname: '',
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
            surname: {
                required
            },
            password: {
                required
            }
        }
    },
    methods: {
        async handleSubmit() {
            this.submitted = true

			if (!await this.v$.$validate())
				return

            try {
                await this.$store.dispatch('signUp', {
                    email: this.email,
                    password: this.password
                })
            }
            catch (error) {
                if (error.code === 'auth/weak-password') {
                    this.error = 'Heslo musí mať aspoň 6 znakov' 
                } else if(error.code === 'auth/email-already-in-use') {
                    this.error = 'Tento email sa už používa'
                } else if(error.code === 'auth/invalid-email') {
                    this.error = 'Zadajte správnu mailovú adresu'
                } else {
                    this.error = 'Vyskytla sa neočakávaná chyba, ak sa bude chyba opakovať kontaktujte developera.'
                    console.error("Vyskytla sa neočakávaná chyba", err);
                }
            }

            try {
                const auth = getAuth();
                const user = auth.currentUser;
                const uid = user.uid;
                const user1 = 'user'
                await setDoc(doc(db, "users", uid), {
                    name: this.name,
                    surname: this.surname,
                    email: this.email,
                    role: user1,
                    positivebalance: 0,
                    balance: 0
                })

                const attendaceRef = collection(db,'events')
                const attendaceSnap = await getDocs(attendaceRef)
                attendaceSnap.forEach(async doc4 =>{
                    const refatt2 = doc(db,'events',doc4.id)
                    var eventname = this.name + ' ' + this.surname;
                    var name2 = eventname + 'visible'
                    let obj1 = {eventname1: "❌"}
                    obj1[eventname] = obj1['eventname1'];
                    delete obj1['eventname1'];
                    let obj2 = {eventname1: true}
                    obj2[name2] = obj2['eventname1'];
                    delete obj2['eventname1'];

                    await setDoc(refatt2, obj1,{merge:true})
                    await setDoc(refatt2, obj2,{merge:true})
                });
                this.resetForm()
                this.$router.push('/dashboard')
            } catch (e) {
                console.error("Error adding document: ", e);
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

#password {
    width: 70%;
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