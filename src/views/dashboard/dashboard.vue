<template>
    <div class="block text-center mt-5 mb-5 w-full"> 
        <h1 class="mt-5 font-semibold spacing text-accent text-3xl tracking-wide mb-8">NAŠE UDALOSTI</h1>
        <div v-if="userrole == 'admin'">
            <div class="flex justify-center gap-3 my-4">
                <button class="text-base-content btn" v-on:click="openDialog">Pridat udalost</button>
                <button class="text-base-content btn" @click="addMoney">Pridat vklad uzivatelom</button>
                <p-dialog v-model:visible="displaymoney" style="width:330px">
                    <template #header>
                        <h3 class="text-xl">Vklad pre uzivatelov</h3>
                    </template>
                    <div>
                        <div class="field mb-4">
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
                        <button class="btn btn-primary" @click="submitForm">Submit</button>
                    </template>
                </p-dialog>
                <p-dialog v-model:visible="display1" style="width:330px">
                    <template #header>
		                <h3 class="text-2xl">Pridanie udalosti</h3>
	                </template>
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
                        <p>Cena (použiť znak - )</p>
                        <input class="text-base-content input input-bordered" id= "input44" v-model="costofevent" placeholder="-69" /> 
                        <span class="ml-1 text-xl">€</span>
                    </div>
                    <div class="field mb-4">
                        <p>Dodatočné poznámky</p>
                        <input class="text-base-content input input-bordered" id= "input55" v-model="notes" placeholder="Poznamky" />
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
            <TableDashboard :userfields='userfields' :rowsofevents ="rowsofevents" :headersoftransactions="headers" :attendancedata="attendancedata"></TableDashboard>
        </div>
    </div>
</template>
<script>
import TableDashboard from './_components/TableDashboard.vue'
import { doc, getFirestore, getDocs, collection,setDoc, getDoc,addDoc} from "firebase/firestore";
import { getAuth } from 'firebase/auth'

export default {
    components: {
        TableDashboard
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
            loading: true
        }
    },

    async created() {
        const db = getFirestore()
        const docs = await getDocs(collection(db,'users'))
        docs.forEach((doc5)=>{
            var data = doc5.data()
            data['id'] = doc5.id
            data['uid'] = doc5.id
            this.users.push(data)
            
        })
        this.loading = false
    },
    async setup(){
        const db = getFirestore();
        const uid = getAuth().currentUser.uid;
        const documentSnap = await getDoc(doc(db,"users", uid))
        const userrole = documentSnap.data()['role'];
        var userfields = []
        var attendancedata = []
        const userfieldsSnap = await getDocs(collection(db, 'users'))
        const pushrow = {eventname:'Zostatok uzivatelov', cpp: '------'}
        userfieldsSnap.forEach((doc) => {
            const username = {
                name: doc.data().name + ' ' + doc.data().surname,
                
            }


            
            userfields.push(username) 
            pushrow[username.name] = doc.data().balance + '€'
        });
            
        var rowsofevents = []
        rowsofevents.push(pushrow)
        const rowsofeventsSnap = await getDocs(collection(db,'events'))
        rowsofeventsSnap.forEach((doc1) =>{
            var data = doc1.data()
            data['eventname'] = doc1.id
            var count = 0
            
            const doc2 = doc1.data()
            const arr = Object.values(doc2)
            count = arr.filter(function(value) {
                return value === "✅";
            }).length;
            var valuex1 = doc1.data().costofevent
            var cpp = valuex1 / count
            cpp = Math.round((cpp+ Number.EPSILON) * 100) / 100
            if (cpp == Infinity){
                data['cpp'] = 'None'
            } else if (cpp == -Infinity){
                data['cpp'] = 'None'
            } else{
                data['cpp'] = cpp + '€'
            }
            rowsofevents.push(data)
        });
        var headers = ['Transakcia','Cena','Subor']
        return{rowsofevents,userfields,userrole,headers,attendancedata}
    },
methods: {
        resetForm1(){
            this.nameofinsert = ''
            this.priceppofinsert = ''
    },
        async submitForm() {
            var change = false

            this.users.forEach(async doc1 =>{
                var username = doc1.name + ' ' + doc1.surname
                if (doc1.id == true){
                    const db = getFirestore()
                    const data321 = await getDoc(doc(db,'users',doc1.uid))
                    var bal1 = data321.data().positivebalance
    
                    var posbalneu = bal1 + parseFloat(this.priceppofinsert)

                    if (isNaN(posbalneu) == false){
                        await setDoc(doc(db,'users',doc1.uid),{positivebalance: posbalneu},{merge:true})
                        var posbal = posbalneu
                        const rowsofeventsSnap = await getDocs(collection(db,'events'))
                        var usedcpp = 0
                        rowsofeventsSnap.forEach((doc3) =>{
                            var data = doc3.data()
                            var count = 0
                            const doc2 = doc3.data()
                            const arr = Object.values(doc2)
                            count = arr.filter(function(value) {
                                return value === "✅";
                            }).length;
                            var valuex1 = doc3.data().costofevent
                            var cpp = valuex1 / count
                            if (data[username] == "✅")  {
                                usedcpp += cpp
                            }
                        });
                        var setval = posbal + usedcpp
                        var setval1 = Math.round((setval+ Number.EPSILON) * 100) / 100
                        await setDoc(doc(db,'users',doc1.uid),{balance: setval1},{merge:true})
                        await addDoc(collection(db,'users',doc1.uid,'vklady'),{
                            nameofinsertdd: this.nameofinsert,
                            priceadded:parseFloat(this.priceppofinsert)
                        })
                        change = true
                    }
                    
                }
                
            })
    
            
            this.displaymoney = false
            setInterval(() => {if (change == true){location.reload()}}, 1000);
            

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
                    costofevent: parseFloat(this.costofevent),
                    notes:this.notes
                })
            const usersRef = collection(db,'users')
            const usersSnap = await getDocs(usersRef)
            usersSnap.forEach(async (doc1)=> {
                var username = doc1.data().name + ' ' + doc1.data().surname
                var username1 = username+ 'visible'
                const reff1223 = doc(db,'events',this.nameofevent)
                let obj1 = {eventname1: "❌"}
                obj1[username] = obj1['eventname1'];
                delete obj1['eventname1'];
                let obj2 = {eventname1: true}
                obj2[username1] = obj2['eventname1'];
                delete obj2['eventname1'];
                
                await setDoc(reff1223, obj1,{merge:true}) 
                await setDoc(reff1223, obj2,{merge:true}) 
            });
            const coll = doc(db, 'transakcie', this.nameofevent,'transakcie', 'number')
            await setDoc(coll,{
                number: 0
            });
            this.display1 = false
            this.resetForm()
            location.reload();
        } 
    }
}
</script>


