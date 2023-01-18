<template>
    <div class="container text-center  mt-5 mb-5"> 
        <h1 class="mt-5 fw-bolder text-success text-xl">Udalosti:</h1>
        <div v-if="userrole == 'admin'">
            <p class="text-base-content mt-8">Meno noveho eventu:</p>
            <div class="flex justify-center gap-3 my-4">
                <input class="text-base-content input input-bordered" id= "eventname" v-model="eventname" placeholder="Event name" />
                <button class="text-base-content btn" v-on:click="addEvent">Pridat Event</button>

            </div>
        </div>
        <div class="table-responsive my-5 text-base-content">
            <!-- The table component -->
            <TableDashboard :userfields='userfields' :rowsofevents ="rowsofevents" :headersoftransactions="headers" :attendancedata="attendancedata"></TableDashboard>
        </div>
    </div>
</template>
<script>
import Table from './_components/Table.vue'
import Table1 from './_components/Table1.vue'
import TableDashboard from './_components/TableDashboard.vue'
import { doc, getFirestore, getDocs, collection,setDoc, getDoc} from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import Dialog from 'primevue/dialog';

export default {
    components: {
        Table,
        Dialog,
        Table1,
        TableDashboard
        
    },
    data() {
        return {
            eventname: '',
            display1: false
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
        const docRef = collection(db, "userstats");
        const docRef2 = collection(db,'events');
        const docSnap = await getDocs(docRef);
        const docSnap2 = await getDocs(docRef2)
        // var studentData = []
        // docSnap.forEach((doc) => {
   
        //     studentData.push(doc.data()) 
        // });
        var rowsofevents = []
        const rowsofeventsSnap = await getDocs(collection(db,'events'))
        rowsofeventsSnap.forEach((doc) =>{
            var data = doc.data()
            data['eventname'] = doc.id
            rowsofevents.push(data)
        });
        
        var fields1 = ['Transakcia', 'Datum','FinalCena', 'Cena na osobu']
        const transactions = []
        // docSnap2.forEach((doc) => {
        //     fields.push(doc.id)
        // });
       // var dataTransakcie = [{Transakcia: 'pepo',item: 1},{Transakcia:'lelo', item:2}]
        var studentData1 = [{Transakcia: 'Medicka25.11'}]
        var headers = ['Number','Transakcia','cena', 'Datum']
            return{rowsofevents,userfields,userrole,headers,fields1,studentData1,attendancedata}
    },
methods: {
        async addEvent() {
            const db = getFirestore();
            const eventname1 = this.eventname
            console.log(eventname1)
            const data = {
                event: true
            } 
            await setDoc(doc(db,"events",eventname1),data)
            const docRef = collection(db, "userstats");
            const docSnap = await getDocs(docRef);
            docSnap.forEach((docum) => {
            let eventRef = doc(db,'userstats',docum.id)
            let obj = {eventname1: '❌'}
            obj[eventname1] = obj['eventname1'];
            delete obj['eventname1'];
            setDoc(eventRef, obj , {merge: true})
            
            });
            let obj1 = {eventname1: "❌"}
            obj1[eventname1] = obj1['eventname1'];
            delete obj1['eventname1'];
            let sampleway = doc(db,'sample','sample')
            setDoc(sampleway,obj1,{merge: true})
        } 
    }
}
</script>