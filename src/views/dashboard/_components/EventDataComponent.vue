<template>
    
    <div class="box">
        <div class="extension2"><h1  class="font-semibold text-xl eventtexth">Event:</h1></div>
        <div class="separator"></div>
        <div class="extension">
            <Dropdown  v-model="selectedevent" :options="events" optionLabel="name" placeholder="Select an Event" class="w-full md:w-14rem" >
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                       
                        <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class=" align-items-center">
                       
                        <div>{{ slotProps.option.name }}</div>
                        <div>  {{slotProps.option.date }}</div>
                    </div>
                </template>
            </Dropdown>
        </div>
    </div>
    <div class="center2">
    <div class="centercontainer">
    <div v-if="selectedevent!= null" class="eventcontainer">
        <div class="eventheader">
            <h1 class="font-semibold text-3xl eventheadertext">{{ selectedevent.name }}</h1>
            

        </div>
        <Accordion :activeIndex="0">
    <AccordionTab header="Info">
        <h2>Name of event:  {{ shownevent.nameofevent }}</h2>
        <Divider/>
        <h2>Date of event:  {{ shownevent.dateofevent }}</h2>
        <Divider/>
        <h2>Place:  {{ shownevent.place }}</h2>
        <Divider/>
        <h2>Notes:  {{ shownevent.notes }}</h2>
        <Divider/>
        <h2>Type of used fond: <p :class=getFond(shownevent.typeoffond)>{{ shownevent.typeoffond }}</p></h2>
        <Divider/>
        <h2>Cost of event: <p :class="getCenaClass(shownevent.costofevent)">{{ shownevent.costofevent }}€</p></h2>
        
        
    </AccordionTab>
    <AccordionTab header="Účasť">
        <div v-for="user in users" class="userinfo">
            <p>{{ user }}:</p> <span >{{ shownevent[user] }}</span>
        </div>
    </AccordionTab>
    <AccordionTab header="Transakcie">

    </AccordionTab>
    
</Accordion>
<button v-if="userrole == 'admin'" class="text-base-content btn" v-on:click="openTransaction(nameofevent)">Pridat transakciu</button>
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
                    <td><button v-if="row.file !== false" @click="downloadFile(row.file)" class="btn btn-info">Download</button></td>
                    <td><button v-if="userrole == 'admin'" class="btn btn-outline btn-error" @click="deletetransaction(row.iddoc,row.cena)">Vymazať</button></td>
                  
                 
                </tr>
            </tbody>
        </table>
<button class=" btn  btn-error" style="color:white; font-size: 1em;position: relative;bottom: 0px;margin-top: 100px;margin-bottom: 10px;" @click="deleteevent()" v-if="userrole== 'admin'"><p class="fontnav">Delete event</p></button>
    </div>

</div>
</div>

    <p-dialog header="Header" modal  footer="Footer" v-model:visible="display">
        <template #header>
            <h3 class="text-xl">Dialog pre pridavanie transakcii </h3>
        </template>
        <template #footer>
            <button class="text-base-content btn" v-on:click="uploadFile(shownevent.nameofevent)">Potvrdit a odoslat</button>
	    </template>
        <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input111" v-model="nameoftransaction" placeholder="Meno Transakcie" /></div>
        <div class="field mb-4"><input class="text-base-content input input-bordered" id= "input222" v-model="priceoftransaction" placeholder="Cena napr. -78" /></div>
        <input type="file" ref="fileInput"  class="file-input file-input-bordered file-input-info w-full max-w-xs" />
    </p-dialog>
</template>
<script>
import Dropdown from 'primevue/dropdown';
import Divider from 'primevue/divider';
import { doc, getFirestore, getDocs, collection,setDoc, getDoc, query, onSnapshot,deleteDoc,addDoc} from "firebase/firestore";
import { getAuth , onAuthStateChanged} from 'firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
const storage = getStorage();
export default {
    components: {
        Dropdown,
        Accordion,
        AccordionTab,
        Divider
    },
    data() {
        return {
            
            selectedevent:null,
            events:[],
            userrole: 'user',
            isLoggedIn:false,
            shownevent: '',
            users:[],
            display: false,
            priceoftransaction: '',
            nameoftransaction: '',
            headersoftransactions: ['Transakcia','Cena','Subor'],
            rows:[]
        }
    },
    watch: {
        selectedevent(newVal) {
            
            if (newVal != null){
                this.eventdata(newVal.doc);
            }
            
        }
    },
    async created() {
        let auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.isLoggedIn = true
				const db = getFirestore()
      			const uid = getAuth().currentUser.uid;
				
				
				onSnapshot(doc(db, "users", uid), (doc) => {

					 this.userrole = doc.data().role
			});
			} else {
				this.isLoggedIn = false

				
			}
		})
        const db = getFirestore()
        const q = query(collection(db, "events"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            this.events = []
            querySnapshot.forEach((doc) => {
                const event = {name: doc.data().nameofevent,date: doc.data().dateofevent,doc:doc.id}
                this.events.push(event)
            })
     
        })
        const usersSnap = await getDocs(collection(db,'users'))
        usersSnap.forEach((doc)=>{
            const username= doc.data().name + ' ' + doc.data().surname
            this.users.push(username)
        })
    },
    methods:{
        async renewdata() {
            
            const db = getFirestore()
        const q = query(collection(db, "events"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            this.events = []
            querySnapshot.forEach((doc) => {
                const event = {name: doc.data().nameofevent,date: doc.data().dateofevent,doc:doc.id}
                this.events.push(event)
            })
     
        })
        this.users = []
        const usersSnap = await getDocs(collection(db,'users'))
        usersSnap.forEach((doc)=>{
            const username= doc.data().name + ' ' + doc.data().surname
            this.users.push(username)
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
        },
        getFond (fond) {
        if (fond == 'official') {
            return 'official-fond'
        } else {
          return 'unofficial-fond';
        }
        },
        async openTransaction(){
        this.display= true
        },
        async  eventdata (selectedevent){
            
            const db = getFirestore()
            const data = await getDoc(doc(db,'events',selectedevent))
            
            this.shownevent= data.data()
            
            this.rows = [];
            const q = query(collection(db, "transakcie", this.shownevent.nameofevent, 'transakcie'));
            const unsubscribe1 = onSnapshot(q, async (querySnapshot) => {
                this.rows = [];
                querySnapshot.forEach((doc)=>{
                    if (doc.id != 'number'){
                    const data = {
                        iddoc: doc.id,
                        Transakcia: doc.data().Transakcia,
                        cena: doc.data().cena,
                        file: doc.data().file
                    }
                    this.rows.push(data);
                }})

                 setTimeout(async () =>  {
                    const snapeventcost = await getDoc(doc(db,'events',this.shownevent.nameofevent))
                    this.shownevent.costofevent = snapeventcost.data().costofevent
                    
        }, 1000);
                this.rows.sort((a, b) => a.Number - b.Number);
                for (var i = 0, len = this.rows.length; i < len; i++) {
                    delete this.rows[i].Number;
            }})
  
        },
        async deleteevent(){
        const db = getFirestore()
        const transakcie = await getDocs(collection(db,'transakcie',this.shownevent.nameofevent,'transakcie'))
        transakcie.forEach(async doc5=>{
            await deleteDoc(doc(db,'transakcie',this.shownevent.nameofevent,'transakcie',doc5.id))
        })
        await deleteDoc(doc(db,'transakcie',this.shownevent.nameofevent))
        console.log(this.shownevent.nameofevent)
        await deleteDoc(doc(db,'events',this.shownevent.nameofevent))
        this.selectedevent= null
        
        setTimeout(() => {
            this.renewdata()
            this.$recalculate();
        }, 1000);
    },
       
    async deletetransaction(nameoftransaction2,price) {
        const db = getFirestore()
        const data2 = await getDocs(collection(db,'transakcie',this.shownevent.nameofevent,'transakcie'))
        
    
        await deleteDoc(doc(db,'transakcie',this.shownevent.nameofevent,'transakcie',nameoftransaction2))
        
        let x = 0
        data2.forEach( doc1 => {
            if (doc1.id != 'number'){
                
                x += doc1.data().cena
            }

        })
        x-= price
        await setDoc(doc(db,'events',this.shownevent.nameofevent),{costofevent:x},{merge:true})
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
    }
    
}

</script>
<style >
    .userinfo p,
    .userinfo span {
        display: inline-block;
    }
h2{
    text-align: left;

}
.centercontainer {
  display: flex;
  justify-content: center; /* Center horizontally */
max-width: 1000px;
width: 100%;
}
.center2{
    display: flex;
  justify-content: center; /* Center horizontally */

}
.box {
  display: flex;
  align-items: center; 
  justify-content: center;
}

  :root {
  --width: 100%;
  --height: 50px;
  --top-color: #0c203e;
  --bottom-color: black;
}
.separator {
  width: 60px;
  height: var(--height);
  position: relative; 
}

.separator::before,
.separator::after {
  content: "";
  width: 50px;
  height: var(--height);
  
  position: absolute; 
  
}

.separator::before {
  left: 0;
  background-color: var(--top-color);
  clip-path: polygon(100% 0, 0 0, 0 100%);
}

.separator::after {
  right: 0;
  background-color: var(--bottom-color);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

.extension {
    display: flex;
    align-items: center; 
    height: 50px;
    width: 185px;
    background-color: var(--bottom-color);
    position: relative;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}
.extension2 {
    text-align: center;
    line-height: 50px !important;
    height: 50px;
    width: 130px;
    background-color: var(--top-color);
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    
}
.eventtexth{
    color: white;
    line-height: 50px;

}
.eventheadertext{
    line-height: 90px;
    color:rgb(255, 255, 255);
    
}
.eventcontainer{
   width: 100%;
    
    height: 300px;
    background-color: #141414;

    
    height: fit-content;
   border-radius: 30px;
    margin: 10px;
    margin-top:20px;
}
.eventheader{
    height: 90px;
    background-color: #00397a;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
}
  </style>