<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <p-table :value="rowsofevents" :scrollable="true" :key="rowsofevents" scrollDirection="horizontal">
        <Column field="eventname" header="Nazov udalosti" style="min-width:150px"></Column>
        <Column style="min-width:360px" header="">
                <template #body="{data}">
                    <div class="flex gap-3">
                        <button v-if="data.eventname != 'Zostatok uzivatelov'" class="btn btn-outline btn-accent" @click="details(data)">Detaily</button>
                        <button v-if="data.eventname != 'Zostatok uzivatelov'" class="btn btn-outline btn-accent" @click="transactions(data)">Transakcie</button>
                        <button v-if="data.eventname != 'Zostatok uzivatelov' && userrole == 'admin'" class="btn btn-outline btn-error" @click="deleteevent(data)">Vymazať</button>
                    </div>
                </template>
        </Column>
        <Column field="cpp" header="CPP" style="min-width:100px"></Column>
        <Column v-for="field in userfields" :key="field" :field="field.name" :header= field.name style="min-width:100px" ></Column>
    </p-table>
    
    <p-dialog header="Header" footer="Footer" v-model:visible="display">
        <template #header>
            <div class="xl:flex block">
                <button v-if="userrole == 'admin'" class="text-base-content btn" v-on:click="openTransaction(nameofevent)">Pridat transakciu</button>
                <h3 class="text-xl xl:ml-6 mt-4 xl:my-auto">Detaily transakcie: {{dialname}}</h3>
            </div>
            
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
                    <td class="max-w-[220px] overflow-hidden text-primary-content truncate">{{ row['Transakcia'] }}</td>
                    <td class="text-primary-content" :class="getCenaClass(row.cena)">{{ row['cena'] }}€</td>
                    <td v-if="row.file !== false"><button @click="downloadFile(row.file)"><i class="fa fa-download"></i>...Download</button></td>
                </tr>
            </tbody>
        </table>
    </p-dialog>
    <p-dialog header="Header" v-model:visible="display1">
        <template #header>
		    <h1 >Detaily(popis):</h1>
	    </template>
        <p>Meno Udalosti: {{ nameofevent }}</p>
        <p>Datum udalosti: {{ dateofevent }}</p>
        <p>Miesto: {{ place }}</p>
        <p>Dodatočné poznámky: {{ notes }}</p>
        <p>Celková cena:</p><p :class="getCenaClass(costofevent1)" > {{ costofevent }}</p>
    </p-dialog>
    <p-dialog header="Header" footer="Footer" v-model:visible="display2">
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
    </p-dialog>
</template>


<script>
import {getFirestore,getDocs,collection,doc,getDoc,setDoc,addDoc,deleteDoc} from "firebase/firestore";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
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
        userrole: 'user',
        customers2: []
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
    Column
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

},
methods:{
    async uploadFile(eventnamepp) {
        var change = false
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
        });
        }else{
            await addDoc(collection(db, "transakcie",eventnamepp,'transakcie'), {
            Transakcia: this.nameoftransaction,
            cena: parseFloat(this.priceoftransaction),
            Number: number1,
            file: false
            
        }
        );
        

    }

    
    },
    async downloadFile(fileref){
        if (fileref !== false){
            const downloadRef = ref(storage,fileref)
            getDownloadURL(downloadRef)
                .then((url) => {
                const link = document.createElement("a");
                link.href = url;
                link.download = 'readme.txt' ;
                link.click()
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
            for (var i = 0, len = this.rows.length; i < len; i++) {
                delete this.rows[i].Number;
            }
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
    async deleteevent(event){
        const db = getFirestore()
        const transakcie = await getDocs(collection(db,'transakcie',event.eventname,'transakcie'))
        transakcie.forEach(async doc5=>{
            await deleteDoc(doc(db,'transakcie',event.eventname,'transakcie',doc5.id))
        })
        var change = false
        await deleteDoc(doc(db,'transakcie',event.eventname))
        await deleteDoc(doc(db,'events',event.eventname))
        const usersSnap = await getDocs(collection(db,'users'))
        usersSnap.forEach(async userdoc => {
            const uddata = userdoc.data()
            const userid = userdoc.id
            var posbal = uddata.positivebalance
            var usedcpp = 0
            var username2 = uddata.name+ ' ' + uddata.surname
            const rowsofeventsSnap = await getDocs(collection(db,'events'))
            rowsofeventsSnap.forEach(eventdoc => {
                var eventdata = eventdoc.data()
                const arr = Object.values(eventdata)
                var count = arr.filter(function(value) {
                    return value === "✅";
                }).length;
                var valuex1 = eventdata.costofevent
                var cpp123 = valuex1 / count
                if (eventdata[username2] == "✅")  {
                    usedcpp += cpp123
                }
                
            })
            var setbal = posbal + usedcpp
            var setbal3= Math.round((setbal+ Number.EPSILON) * 100) / 100
            await setDoc(doc(db,'users',userid),{balance: setbal3},{merge:true})
            
        })
        
        
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
