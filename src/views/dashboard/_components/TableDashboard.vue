<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <p-table :value="rowsofevents" :scrollable="true" :key="rowsofevents" scrollDirection="horizontal">
        <Column field="eventname" header="Nazov udalosti" style="min-width:150px"></Column>
        <Column :style="{ 'min-width': widthfix + 'px' }" header="">
                <template #body="{data}">
                    <div class="flex gap-3">
                        <button v-if="data.eventname != 'Zostatok uzivatelov'" class="btn btn-outline btn-accent" @click="details(data)">Detaily</button>
                        <button v-if="data.eventname != 'Zostatok uzivatelov'" class="btn btn-outline btn-accent" @click="transactions(data)">Transakcie</button>
                        <button v-if="data.eventname != 'Zostatok uzivatelov' && userrole == 'admin'" class="btn btn-outline btn-error" @click="deleteevent(data)">Vymazať</button>
                    </div>
                </template>
        </Column>
        <Column field="typeoffond" header="Fond" style="min-width:100px">
            <template #body="{data}">
                    <div class="flex gap-3">
                       <span :class="getFond(data.typeoffond)" class="text-xl">{{ data.typeoffond }}</span>
                    </div>
                </template></Column>
        <Column v-for="field in userfields" :key="field" :field="field.name" :header= field.name style="min-width:130px" ></Column>
    </p-table>
    
    <p-dialog header="Header" modal footer="Footer" v-model:visible="display">
        <template #header>
            <div class="xl:flex block">
                
                <h3 style="padding-right: 10px" class="text-xl xl:ml-6 mt-4 xl:my-auto">Detaily transakcie: {{dialname}}</h3>
                <button v-if="userrole == 'admin'" class="text-base-content btn" v-on:click="openTransaction(nameofevent)">Pridat transakciu</button>
            </div>
            
        </template>
        <template #footer>
		<h3 >Celková cena udalosti:</h3><h3 :class="getCenaClass(costofevent1)">{{ costofevent1 }}€</h3>
        
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
                    <td><button v-if="row.file !== false" @click="downloadFile(row.file)"><i v-if="row.file !== false" class="fa fa-download"></i>...Download</button></td>
                    <td><button v-if="userrole == 'admin'" class="btn btn-outline btn-error" @click="deletetransaction(row.iddoc,dialname,row.cena)">Vymazať</button></td>
                </tr>
            </tbody>
        </table>
    </p-dialog>
    <p-dialog header="Header" modal  v-model:visible="display1">
        <template #header>
		    <h1 >Detaily(popis):</h1>
	    </template>
        <p>Meno Udalosti: {{ nameofevent }}</p>
        <p>Datum udalosti: {{ dateofevent }}</p>
        <p>Miesto: {{ place }}</p>
        <p>Dodatočné poznámky: {{ notes }}</p>
        <p>Celková cena:</p><p :class="getCenaClass(costofevent1)" > {{ costofevent }}</p>
    </p-dialog>
    <p-dialog header="Header" modal  footer="Footer" v-model:visible="display2">
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
        <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input222" v-model="priceoftransaction" placeholder="Cena napr. -78" /></div>
        <input type="file" ref="fileInput"  class="file-input file-input-bordered file-input-info w-full max-w-xs" />
    </p-dialog>
</template>



<script>
import {getFirestore,getDocs,collection,doc,getDoc,setDoc,addDoc,deleteDoc,onSnapshot} from "firebase/firestore";

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
        customers2: [],
        widthfix: 240
    }
},
async created() {
    

    const db = getFirestore()
      			const uid = getAuth().currentUser.uid;
				
				
				onSnapshot(doc(db, "users", uid), (doc) => {
   					 
					 this.userrole = doc.data().role
                     if (this.userrole == 'admin'){
                        
                    this.widthfix = 360}
                    if (this.userrole == 'user'){
                        
                    this.widthfix = 240}

			});

    
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
    getFond (fond) {
        if (fond == 'official') {
            return 'official-fond'
        } else {
          return 'unofficial-fond';
        }
    },
   
    async deletetransaction(nameoftransaction2,event,price) {
        const db = getFirestore()
        const data2 = await getDocs(collection(db,'transakcie',event,'transakcie'))
        
    
        await deleteDoc(doc(db,'transakcie',event,'transakcie',nameoftransaction2))
        this.display = false
        let x = 0
        data2.forEach( doc1 => {
            if (doc1.id != 'number'){
                
                x += doc1.data().cena
            }

        })
        x-= price
        await setDoc(doc(db,'events',event),{costofevent:x},{merge:true})
                setTimeout(() => {
                    this.$recalculate();
        }, 1000);
    },
    async uploadFile(eventnamepp) {
        
        const db = getFirestore()
        let docs = await getDocs(collection(db, "transakcie", eventnamepp, 'transakcie'));
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
            
        });}
        
        this.total = 0
        docs.forEach((doc) => {
        if (doc.id != 'number'){
            let price  = doc.data().cena
            this.total += price
            this.total = Math.round((this.total+ Number.EPSILON) * 100) / 100
            
            
            }});
        this.total += parseFloat(this.priceoftransaction)
        
        await setDoc(doc(db,'events',eventnamepp),{costofevent: this.total},{merge:true})
        setTimeout(() => {
            this.$recalculate();
        }, 1000);
        this.display = false
        this.display2 = false



    
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
                const data = {
                    iddoc: doc.id,
                    Transakcia: doc.data().Transakcia,
                    cena: doc.data().cena,
                    file: doc.data().file
                }
                this.rows.push(data);
                let price  = doc.data().cena
                
                this.total += price
                this.total = Math.round((this.total+ Number.EPSILON) * 100) / 100
            this.rows.sort((a, b) => a.Number - b.Number);
            }});
            for (var i = 0, len = this.rows.length; i < len; i++) {
                delete this.rows[i].Number;
            }
            this.dialname = event.eventname
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
        await deleteDoc(doc(db,'transakcie',event.eventname))
        await deleteDoc(doc(db,'events',event.eventname))
                setTimeout(() => {
            this.$recalculate();
        }, 1000);
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
