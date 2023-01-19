<template>
    <div class="container text-center  mt-5 mb-5"> 
        <h1 class="mt-5 fw-bolder text-success text-xl">Udalosti:</h1>
        <div v-if="userrole == 'admin'">
            
            <div class="flex justify-center gap-3 my-4">
                
                <button class="text-base-content btn" v-on:click="openDialog">Pridat udalost</button>
                <Dialog v-model:visible="display1">
                    <template #header>
		                <h3 class="text-xl">Pridanie udalosti:</h3>
	                </template>
                    <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input11" v-model="nameofevent" placeholder="Meno udalost" /></div>
                    <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input22" v-model="dateofevent" placeholder="Datum" /></div>
                    <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input33" v-model="place" placeholder="Miesto" /></div>
                    <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input44" v-model="costofevent" placeholder="Cena akcie(pouzivat -)" /></div>
                    <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input55" v-model="notes" placeholder="Poznamky" /></div>
                    <button class="btn btn-primary" v-on:click="addEvent">Pridat Udalost</button>
                </Dialog>
            </div>
        </div>
        <div class="table-responsive my-5 text-base-content">
            <!-- The table component -->
            <TableDashboard :userfields='userfields' :rowsofevents ="rowsofevents" :headersoftransactions="headers" :attendancedata="attendancedata"></TableDashboard>
        </div>
    </div>
</template>
<script>
import TableDashboard from './_components/TableDashboard.vue'
import { doc, getFirestore, getDocs, collection,setDoc, getDoc} from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import Dialog from 'primevue/dialog';

export default {
    components: {
        
        Dialog,
        
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
            notes: ''
        }
    },
    
    async setup(){
        const db = getFirestore();
        const uid = getAuth().currentUser.uid;
        const documentSnap = await getDoc(doc(db,"users", uid))
        const userrole = documentSnap.data()['role'];
        var userfields = []
        var attendancedata = []
        const userfieldsSnap = await getDocs(collection(db, 'users'))
        userfieldsSnap.forEach((doc) => {
            var namepush = doc.data().name+ ' ' + doc.data().surname
            userfields.push(namepush) 
        });
        var rowsofevents = []
        const rowsofeventsSnap = await getDocs(collection(db,'events'))
        rowsofeventsSnap.forEach((doc) =>{
            var data = doc.data()
            data['eventname'] = doc.id
            rowsofevents.push(data)
        });
        var headers = ['Number','Transakcia','cena', 'Datum']
            return{rowsofevents,userfields,userrole,headers,attendancedata}
    },
methods: {
        async openDialog(){
            this.display1 = true
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
                const reff1223 = doc(db,'events',this.nameofevent)
                let obj1 = {eventname1: "❌"}
                obj1[username] = obj1['eventname1'];
                delete obj1['eventname1'];
                await setDoc(reff1223, obj1,{merge:true}) 
            });
        } 
    }
}
</script>