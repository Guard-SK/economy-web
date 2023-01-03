<template>
    <div class="container text-center  mt-5 mb-5"> 
        <h1 class="mt-5 fw-bolder text-success "> Student's Database </h1>
        <div>
            <p class="text-primary-content">Meno noveho eventu:</p>
            <input class="text-primary-content" id= "eventname" v-model="eventname" placeholder="edit me" />
            <button class="text-primary-content" v-on:click="addEvent">Pridat Event</button>
        </div>
        <div class="table-responsive my-5">
            <!-- The table component -->
            <Table :fields='fields' :studentData ="studentData"></Table>
        </div>
    </div>

</template>


<script>

// Importing the table component
import Table from './_components/Table.vue'
import { doc, getFirestore, getDocs, collection,setDoc} from "firebase/firestore";

export default {
    components: {
        Table
    },
    data() {
        return {
            eventname: ''
        }
    },
    async setup(){
        const db = getFirestore();
        const docRef = collection(db, "userstats");
        const docRef2 = collection(db,'events');
        const docSnap = await getDocs(docRef);
        const docSnap2 = await getDocs(docRef2)
        var studentData = []
        docSnap.forEach((doc) => {
           studentData.push(doc.data()) 
        });
        var fields = ['name','surname']
        docSnap2.forEach((doc) => {
            fields.push(doc.id)
        });
            return{studentData,fields}
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
