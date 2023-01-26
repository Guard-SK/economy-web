<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    <table  id="tableComponent" class="table table-bordered table-striped center">
        <thead>
        <!-- Headers with users -->
            <tr>
                <th>Názov udalosti</th>
                <th></th>
                <th></th>
                <th>CPP</th>
                <th  v-for="field in userfields" :key="field" class="text-primary-content" >{{field}}</th>
            </tr>
        </thead>
        <tbody>
        <!-- Every row is one event. -->
        <!-- Event row consists of its name, properties button, transactions button and attendance  -->
            <tr v-for="event in rowsofevents" :key="event" class="text-primary-content">
                <td>{{ event.eventname }}</td>
                <td><Button label="Detaily" class="p-button-raised" @click="details(event)"/></td>
                <td><Button label="Transakcie" class="p-button-raised" @click="transactions(event)"/></td>
                <td>{{ event.cpp }}</td>
                <td v-for="field in userfields" :key="field" class="text-primary-content">{{event[field]}}</td>
            </tr>
        </tbody>
    </table>
    <Dialog header="Header" footer="Footer" v-model:visible="display">
        <template #header>
            <div >
                <button v-if="userrole == 'admin'" class="text-base-content btn" v-on:click="openTransaction(nameofevent)">Pridat transakciu</button>
            </div>
                <h3 class="text-xl">Detaily transakcie: {{dialname}}</h3>
        </template>
        <template #footer>
		<h3 >Spolu cena(poznamenanych):</h3><h3 :class="getCenaClass(total)">{{ total }}</h3>
        <h3 >Celkova cena:</h3><h3 :class="getCenaClass(costofevent1)">{{ costofevent1  }}€ </h3>
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
                    <td class="text-primary-content" :class="getCenaClass(row.cena)">{{ row['cena'] }}€</td>
                    <td v-if="row.file !== false"><Button @click="downloadFile(row.file)"><i class="fa fa-download"></i>...Download</Button></td>
                    
                </tr>
            </tbody>
        </table>
    </Dialog>
    <Dialog  header="Header" v-model:visible="display1">
        <template #header>
		    <h1 >Detaily(popis):</h1>
	    </template>
        <p>Meno Udalosti: {{ nameofevent }}</p>
        <p>Datum udalosti: {{ dateofevent }}</p>
        <p>Miesto: {{ place }}</p>
        <p>Dodatočné poznámky: {{ notes }}</p>
        <p>Celková cena:</p><p :class="getCenaClass(costofevent1)" > {{ costofevent }}</p>
    </Dialog>
    <Dialog header="Header" footer="Footer" v-model:visible="display2">
        <template #header>
            <h3 class="text-xl">
                Dialog pre pridavanie transakcii <br>
                {{ namename }}
            </h3>
        </template>
        <template #footer>
            <button class="text-base-content btn" v-on:click="uploadFile(namename)">Potvrdit a odoslat</button>
	    </template>
        <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input111" v-model="nameoftransaction" placeholder="Meno Transakcie" /></div>
        <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input222" v-model="priceoftransaction" placeholder="Cena Transakcie" /></div>
        <input type="file" ref="fileInput"  class="file-input file-input-bordered file-input-info w-full max-w-xs" />
    </Dialog>
</template>


<script>
import {getFirestore,getDocs,collection,doc,getDoc,setDoc,addDoc} from "firebase/firestore";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth'
const storage = getStorage();
export default {
name: 'TableComponent',
data(){
    return{
        display:false,
        display1:false,
        display2:false,
        rows : [],
        total:0,
        dialname: 'null',
        nameofevent: '',
        dateofevent: '',
        place: '',
        costofevent: 0,
        costofevent1:0,
        notes: '',
        namename: '',
        nameoftransaction: '',
        priceoftransaction:'',
        userrole: 'user'
    }
},
async setup() {
    const db = getFirestore()
    const uid = getAuth().currentUser.uid;
    const documentSnap = await getDoc(doc(db,"users", uid))
    const userrole = documentSnap.data()['role'];
    return{userrole}
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
    async uploadFile(eventnamepp) {
        const db = getFirestore()
        const doc11 = await getDoc(doc(db,'transakcie',eventnamepp,'transakcie','number'))
        const number1 = parseInt(doc11.data().number) + 1
        const file = this.$refs.fileInput.files[0]
        await setDoc(doc(db,'transakcie',eventnamepp,'transakcie','number'),{number: number1},{merge: true})
        if (file != undefined){
        const mountainsRef = ref(storage, eventnamepp+'/'+ file.name);
        const fileString = eventnamepp+'/'+ file.name
        uploadBytes(mountainsRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');})
        await addDoc(collection(db, "transakcie",eventnamepp,'transakcie'), {
            Transakcia: this.nameoftransaction,
            cena: parseFloat(this.priceoftransaction),
            Number: number1,
            file: fileString
        });}else{
            await addDoc(collection(db, "transakcie",eventnamepp,'transakcie'), {
            Transakcia: this.nameoftransaction,
            cena: parseFloat(this.priceoftransaction),
            Number: number1,
            file: false
        });
    }
    location.reload();
    },
    async downloadFile(fileref){
        console.log(fileref)
        if (fileref !== false){
            const downloadRef = ref(storage,fileref)
            getDownloadURL(downloadRef)
                .then((url) => {
   


                const link = document.createElement("a");
                link.href = url;
                link.download = 'readme.txt' ;
                link.click()

                    

                        }).catch((error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
    }
                    })}
    },
    async transactions(event) {
        try {
            const db = getFirestore();
            const docRef = collection(db, "transakcie", event.eventname, 'transakcie');
            let docs = await getDocs(docRef);
            this.display = true;
            this.rows = [];
            this.total = 0
            docs.forEach((doc) => {
                if (doc.id != 'number'){
                this.rows.push(doc.data());
                let price  = doc.data().cena
                
                this.total += price
                this.total = Math.round((this.total+ Number.EPSILON) * 100) / 100
            this.rows.sort((a, b) => a.Number - b.Number);
            }});
            this.dialname = ' ' + event.eventname
            const detRef = doc(db,'events', event.eventname)
            var data1 = await getDoc(detRef);
            this.costofevent1 = data1.data().costofevent
            this.namename = event.eventname
            
        } catch (error) {
            console.error(error);
        }
    },
    async details(event){
        const db = getFirestore()
        const detRef = doc(db,'events', event.eventname)
        var data = await getDoc(detRef);
        this.display1 = true;
        this.nameofevent = ''
        this.dateofevent = ''
        this.place = ''
        this.costofevent = 0
        this.notes = ''
        this.nameofevent = data.data().nameofevent
        this.dateofevent = data.data().dateofevent
        this.place = data.data().place
        this.costofevent = data.data().costofevent + '€'
        this.notes = data.data().notes
        this.costofevent1 = data.data().costofevent
    },
    async openTransaction(nameofevent){
        this.display2= true
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