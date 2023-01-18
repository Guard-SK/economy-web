<template>
    <table  id="tableComponent" class="table table-bordered table-striped center">
        <thead>
        <!-- Headers with users -->
            <tr>
                <th>Názov udalosti</th>
                <th></th>
                <th></th>
                <th v-for="field in userfields" :key="field" class="text-primary-content">{{field}}</th>
            </tr>
        </thead>
        <tbody>
        <!-- Every row is one event. -->
        <!-- Event row consists of its name, properties button, transactions button and attendance  -->
            <tr v-for="event in rowsofevents" :key="event" class="text-primary-content">
                <td>{{ event.eventname }}</td>
                <td><Button label="Detaily" class="p-button-raised" @click="details(event)"/></td>
                <td><Button label="Transakcie" class="p-button-raised" @click="transactions(event)"/></td>
                <td v-for="field in userfields" :key="field" class="text-primary-content">{{event[field]}}</td>
            </tr>
        </tbody>
    </table>
    <Dialog header="Header" footer="Footer" v-model:visible="display">
        <template #header>
		    <h3 class="text-xl">Detaily transakcie: {{dialname }}</h3>
	    </template>
        <template #footer>
		<h3 >Spolu cena(poznamenanych):</h3><h3 :class="getCenaClass(total)">{{ total }}</h3>
	    </template>
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th v-for="header in headersoftransactions" :key="header" class="text-primary-content">{{header}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.id">
                    <td class="text-primary-content">{{ row['Number'] }}</td>
                    <td class="text-primary-content">{{ row['Transakcia'] }}</td>
                    <td class="text-primary-content" :class="getCenaClass(row.cena)">{{ row['cena'] }}</td>
                    <td class="text-primary-content">{{ row['Datum'] }}</td>
                </tr>
            </tbody>
        </table>
    </Dialog>
    <Dialog  header="Header" v-model:visible="display1">
        <template #header>
		    <h1>Detaily(popis):</h1>
	    </template>
        <p>{{ detaildata }}</p>
    </Dialog>
</template>
<script>
import {getFirestore,getDocs,collection,doc,getDoc} from "firebase/firestore";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
export default {
name: 'TableComponent',
data(){
    return{
        display:false,
        display1:false,
        rows : [],
        total:0,
        dialname: 'null',
        detaildata: ''
        
    }
},
components:{
    Dialog,
    Button
},
props:{
    rowsofevents:{
        type: Array,
        required: true
    },
    userfields:{
        type: Array,
        required: true
    },
    headersoftransactions:{
        type: Array,
        required: true
    },
    attendancedata:{
        type:Array,
        required: true
    }
},
methods:{
    async transactions(event) {
        try {
            const db = getFirestore();
            const docRef = collection(db, "transakcie", event.eventname, 'transakcie');
            let docs = await getDocs(docRef);
            this.display = true;
            this.rows = [];
            this.total = 0
            docs.forEach((doc) => {
                this.rows.push(doc.data());
                let price  = doc.data().cena
                this.total += price
            this.rows.sort((a, b) => a.Number - b.Number);
            });
            this.dialname = ' ' + event.eventname
        } catch (error) {
            console.error(error);
        }
    },
    async details(event){
        const db = getFirestore()
        const detRef = doc(db,'events', event.eventname)
        var data = await getDoc(detRef);
        this.display1 = true;
        this.detaildata = ''
        this.detaildata = data.data().details
        console.log(data.data().details)
    },
    getCenaClass(cena) {
        if (cena > 0) {
          return 'positive-cena';
        } else if (cena < 0) {
          return 'negative-cena';
        } else {
          return 'neutral-cena';
        }
    }
}
}

</script>