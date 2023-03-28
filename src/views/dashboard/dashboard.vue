
<template>
    
    <div class="block text-center mt-5 mb-5 w-full"> 
        <h1 class="mt-5 font-semibold spacing text-accent text-3xl tracking-wide mb-8">NAŠE UDALOSTI</h1>
        <div v-if="userrole == 'admin'">
            <div class="flex justify-center gap-3 my-4">
                <button class="text-base-content btn" v-on:click="openDialog">Pridat udalost</button>
                <button class="text-base-content btn" @click="addMoney">Pridat vklad uzivatelom</button>
                
                <p-dialog v-model:visible="displaymoney" modal  style="width:330px">
                    <template #header>
                        <h3 class="text-xl">Vklad pre uzivatelov</h3>
                    </template>
                    <div>
                        <div class="card mt-4 flex justify-content-center">
                        <SelectButton v-model="fondtype" :options="options" aria-labelledby="basic" />
                        </div>
                        <div class="field mt-4 mb-4">
                            <input class="text-base-content input input-bordered" v-model="nameofinsert" placeholder="Meno-Datum vkladu" type="text" />
                        </div>
                        <div class="field mb-4 text-xl">
                            <input class="text-base-content input input-bordered" v-model="priceppofinsert" placeholder="Vklad na človeka" />
                            <span class="ml-1">€</span>
                        </div>
                        <div class="field mb-4" >
                        <label class="text-xl">Users:</label>
                        <div v-for="user in users" :key="user.id">
                            <div class="form-control">
                                
                                <label class="block cursor-pointer">
                                    
                                    <input type="checkbox" :value="user.id" v-model="user.id" checked="checked" class="checkbox" />
                                    <span class="inline-block align-middle ml-2">{{ user.name + ' ' + user.surname }}</span> 
                                </label>
                            </div>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <button class="btn btn-primary" @click="pridatVklad">Submit</button>
                    </template>
                </p-dialog>
                <p-dialog v-model:visible="display1" modal  style="width:330px">
                    <template #header>
		                <h3 class="text-2xl">Pridanie udalosti</h3>
	                </template>
                    <div class="card mt-4 flex justify-content-center">
                        <SelectButton v-model="fondtype" :options="options" aria-labelledby="basic" />
                    </div>
                    <div class="field mb-4">
                        <p>Meno Udalosti</p>
                        <input class="text-base-content input input-bordered" id= "input11" v-model="nameofevent" placeholder="Medická záhrada" />
                    </div>
                    <div class="field mb-4">
                        <p>Dátum</p>
                        <input class="text-base-content input input-bordered" id= "input22" v-model="dateofevent" placeholder="DD.MM.YYYY" />
                    </div>
                    <div class="field mb-4">
                        <p>Miesto</p>
                        <input class="text-base-content input input-bordered" id= "input33" v-model="place" placeholder="GJH" />
                    </div>
                    <div class="field mb-4">
                        <p>Dodatočné poznámky</p>
                        <input class="text-base-content input input-bordered" id= "input55" v-model="notes" placeholder="Poznamky" />
                    </div>
                    <div class="field mb-4">
                        <!-- <p class="text-base-content input input-bordered">Cena (použiť znak - )</p> -->
                        <!-- <input class="text-base-content input input-bordered" id= "input44" v-model="costofevent" placeholder="-69" />  -->
                        <span class="ml-1 text-xl">Cena je počítana automaticky transakciami</span>
                    </div>
                    
                    <button class="btn btn-primary px-auto" v-on:click="addEvent">Pridať Udalosť</button>
                </p-dialog>
            </div>
            
        </div>

        <div v-if="loading">
            <p-spinner/>
        </div>

        <div class="table-responsive my-5 text-base-content md:mx-8 mx-0" v-else>
            <!-- The table component -->
            <TableDashboard :userfields='userfields' :rowsofevents ="rowsofevents" :headersoftransactions="headers"></TableDashboard>
        </div>
    </div>
</template>


<script>
import TableDashboard from './_components/TableDashboard.vue'
import SelectButton from 'primevue/selectbutton';
import { doc, getFirestore, getDocs, collection,setDoc, getDoc,addDoc, query, where, onSnapshot} from "firebase/firestore";
import { getAuth } from 'firebase/auth'


export default {
    components: {
        TableDashboard,
        SelectButton,
        
        
    },
    data() {
        return {
            eventname: '',
            display1: false,
            nameofevent: '',
            dateofevent: '',
            place: '',
            costofevent: '',
            notes: '',
            displaymoney:false,
            users: [],
            priceppofinsert:'',
            nameofinsert:'',
            loading: true,
            rowsofevents: [],
            headers: [],
            userfields: [],
            userrole: 'user',
            headers: [],
            fondtype: 'unofficial',
            options: ['unofficial', 'official']
        }
    },

    async created() {
        this.headers = ['Transakcia','Cena','Subor']
        const db = getFirestore()
        const docs = await getDocs(collection(db,'users'))
        docs.forEach((doc5)=>{
            var data = doc5.data()
            data['id'] = doc5.id
            data['uid'] = doc5.id
            this.users.push(data)

            
            
        })
        const userfieldsSnap = await getDocs(collection(db, 'users'))
            const pushrow = {eventname:'Zostatok uzivatelov'}
            userfieldsSnap.forEach((doc) => {
            const username = {
                name: doc.data().name + ' ' + doc.data().surname,
                
            }


            
            this.userfields.push(username) 
            pushrow[username.name] = "OFC: " + doc.data().balanceofficial + '€\n' +'UOFC: '+ doc.data().balanceunofficial +'€'
            });
        const q = query(collection(db, "events"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            
            this.rowsofevents = []

      		const uid = getAuth().currentUser.uid;
				
				
				onSnapshot(doc(db, "users", uid), (doc) => {
   					 
					 this.userrole = doc.data().role
			});
            

            this.rowsofevents = []
            this.rowsofevents.push(pushrow)
            querySnapshot.forEach((doc) => {
                var data = doc.data()
                
                data['eventname'] = doc.id
                for (const prop in data) {
                if (prop.includes('visible')){
                    const newString = prop.replace('visible', '');
                    
                   if (data[prop] == true) {
                    
                    data[newString] = '❌❓'
                    
                   }
                }
                if (prop.includes('set')) {
                    if (prop != 'eventnumberset') {
                        if (prop != 'eventcostset'){
                            if (data[prop] !== false) {
                           
                            const newString = prop.replace('set', '');
                            
                            data[newString] = '✅ Set: ' + data[prop] + '€'
                            }
                            
                        }
                    }
                    
                }
                }
                            
                //const doc2 = doc.data()
                // const arr = Object.values(doc2)
                // count = arr.filter(function(value) {
                //     return value === "✅";
                // }).length;
                // var valuex1 = doc.data().costofevent
                // var cpp = valuex1 / count
                // cpp = Math.round((cpp+ Number.EPSILON) * 100) / 100
                // if (cpp == Infinity){
                //     data['cpp'] = 'None'
                // } else if (cpp == -Infinity){
                //     data['cpp'] = 'None'
                // } else{
                //     data['cpp'] = cpp + '€'
                // }
                
                this.rowsofevents.push(data)
               
                
                
                
            }); 
            
            
        });
        this.loading = false
        
    },
    
methods: {
        resetForm1(){
            this.nameofinsert = ''
            this.priceppofinsert = ''
    },
    async recalculate() {
        
            const db = getFirestore()
            const events = await getDocs(collection(db,'events'))
            const users = await getDocs(collection(db,'users'))
            users.forEach(async user => {
                let uid = user.id
                let username = user.data().name + ' ' + user.data().surname
                let usernameset = user.data().name + ' ' + user.data().surname + 'set'
                let costsofficial =[0]
                let costsunofficial = [0]
                events.forEach(event => {

                    if (event.data()[username] == "✅"){
                        if (event.data()[usernameset] != false) {
                            if (event.data().typeoffond == 'official') {
                            costsofficial.push(parseFloat(event.data()[usernameset]))
                            }else {
                            costsunofficial.push(parseFloat(event.data()[usernameset]))
                            }
                        }else{
                            var eventdata = event.data()
                            const arr = Object.values(eventdata)
                            var count = arr.filter(function(value) {
                                return value === "✅";
                            }).length;
                            count -= event.data().eventnumberset
                            var eventcost = event.data().costofevent - event.data().eventcostset
                            var cpp = eventcost / count
                            if (event.data().typeoffond == 'official'){
                                costsofficial.push(cpp)
    
                            }else {
                                costsunofficial.push(cpp)
                            } 
                        }
                    }
                })
                const sum = costsofficial.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0);
                const sum2 = costsunofficial.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue;
                }, 0);
                const baloff = sum + user.data().positivebalanceofficial
                const balunoff = sum2 + user.data().positivebalanceunofficial

                await setDoc(doc(db,'users',uid),{balanceofficial: parseFloat(baloff.toFixed(2)),balanceunofficial: parseFloat(balunoff.toFixed(2)),},{merge:true})
            })
        },
        async pridatVklad() {
            console.log(this.fondtype)
            this.users.forEach(async doc1 =>{           
                if (doc1.id == true){
                    const db = getFirestore()
                    const data321 = await getDoc(doc(db,'users',doc1.uid))
                    let fond = 'positivebalance' + this.fondtype
                    var posbalneu = data321.data()[fond] + parseFloat(this.priceppofinsert)
                    if (isNaN(posbalneu) == false){
                        let obj1 = {eventname1: posbalneu}
                        obj1[fond] = obj1['eventname1'];
                        delete obj1['eventname1'];
                        await setDoc(doc(db,'users',doc1.uid),obj1,{merge:true})
                        await addDoc(collection(db,'users',doc1.uid,'vklady'),{
                          nameofinsertdd: this.nameofinsert,
                            priceadded:parseFloat(this.priceppofinsert),
                            fond: this.fondtype
                        })
                        
                    }
                    
                }
                
            })
    
                    setTimeout(() => {
            this.recalculate()
        }, 1000);
            this.displaymoney = false
            
            

        },
        
        async addMoney(){
            
            this.displaymoney = true

        },
        async openDialog(){
            this.display1 = true
        },
        resetForm() {
            this.nameofevent = '';
            this.dateofevent = '';
            this.place = '';
            this.costofevent = '';
            this.notes = ''
        },
        async addEvent() {
            const db = getFirestore();
            await setDoc(doc(db, "events", this.nameofevent), {
                    nameofevent: this.nameofevent,
                    dateofevent: this.dateofevent,
                    place: this.place,
                    costofevent: 0,
                    notes:this.notes,
                    typeoffond: this.fondtype,
                    eventcostset: 0,
                    eventnumberset: 0
                })
            const usersRef = collection(db,'users')
            const usersSnap = await getDocs(usersRef)
            usersSnap.forEach(async (doc1)=> {
                var username = doc1.data().name + ' ' + doc1.data().surname
                var username1 = username+ 'visible'
                var username2 = username+ 'set'
                const reff1223 = doc(db,'events',this.nameofevent)
                let obj1 = {eventname1: "❌"}
                obj1[username] = obj1['eventname1'];
                delete obj1['eventname1'];
                let obj2 = {eventname1: true}
                obj2[username1] = obj2['eventname1'];
                delete obj2['eventname1'];

                let obj3 = {eventname1: false}
                obj3[username2] = obj3['eventname1'];
                delete obj3['eventname1'];
                
                await setDoc(reff1223, obj1,{merge:true}) 
                await setDoc(reff1223, obj2,{merge:true}) 
                await setDoc(reff1223, obj3,{merge:true}) 


                
            });
            const coll = doc(db, 'transakcie', this.nameofevent,'transakcie', 'number')
            await setDoc(coll,{
                number: 0
            });
            this.display1 = false
            this.resetForm()
            
        } 
    }
}
</script>


