
<template>
    
    <div v-if="userrole == 'admin'">

    <Card>      
      <template #content>
            
            <h1 class="font-semibold spacing  text-xl ">Posuvatelne menu</h1>
            <TabMenu class="mt-5 " style="align: center" :model="items" :activeIndex="activeIndex" >
            </TabMenu>
            <Dropdown v-model="selectedEvent" :options="events" optionLabel="nameofevent" :filter="true" placeholder="Vyber Udalost" :showClear="true" ></Dropdown>
            <button class="btn btn-primary px-auto" v-on:click="recalculate">Prepočítať</button>
            <Card v-if="selectedEvent != null" class="mt-5 darker-card">
                <template #content >

                    <div class="flex-container">
              <div class="card flex-child" style="width: 210px;">
                <div v-for="user in users" class="flex align-items-center gap-3">
                  <TriStateCheckbox v-model="selectedEvent[user.name + 'admin']" />
                  <label>{{ user.name }}</label>
                </div>
                <button class="btn btn-primary px-auto" @click="saveNowstate">Ulozit ucast</button>
              </div>
              <div class="card flex-child"  style="overflow-x: auto;">
                
                <p-table :value="transakcieevent" :scrollable="true" :key="transakcieevent" scrollDirection="horizontal" class="p-datatable-large">
                    <Column field="Transakcia" header="Transakcia" ></Column>
                    <Column field="cena" header="Hodnota v EUR" >
                      <template #body="{data}">
                        <div >
                          <InputNumber v-model="data.cena" inputId="minmaxfraction" :minFractionDigits="0" :maxFractionDigits="2 " />
                          
                        </div>
                        
                      
                      </template>
                    
                    </Column>
                    
                    <Column>
                      <template #body="{data}">
                        
                        <button v-if="userrole == 'admin'" class="btn btn-outline btn-error" @click="deletetransaction(data.id)">Vymazať</button>
                      </template>
                    </Column>
                    
                </p-table>
                <button class="btn btn-primary px-auto" @click="saveTransactions">Ulozit transakcie</button>
                
              </div>
            </div>
                   
                    <Message :closable="false" v-if="success1 == true" severity="success">Uspesne ulozene a prepocitane</Message>
                </template>
            </Card>
            

          
          </template>
    </Card>
  </div>
</template>
<style>
  .darker-card {
    background-color: #071426;
  }
  .cardpad{
    margin: 15px
  }
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .flex-child {
    margin-right: 20px;
    margin-bottom: 20px;
    
  }
  .p-inputnumber-input{
    width: 80px
  }

 
</style>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection, deleteDoc} from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import Dropdown from 'primevue/dropdown';
import TabMenu from 'primevue/tabmenu';
import Card from 'primevue/card';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Column from 'primevue/column'
import Message from 'primevue/message';
import InputNumber from 'primevue/inputnumber';
export default {
  components:{
    Dropdown,
    TabMenu,
    Card,
    TriStateCheckbox,
    Message,
    Column,
    InputNumber
  },
  data () {
      return{
          selectedEvent:null,
          activeIndex: 0,
          users:[],  
          success1: false,
          userrole: 'user',
          transakcieevent: null,
          items: [
                {label: 'Udalosti', icon: 'pi pi-fw pi-home', to: '/admin'},
                {label: 'Uzivatelia', icon: 'pi pi-fw pi-calendar', to: '/admin/user'},
                {label: 'Poznamky', icon: 'pi pi-fw pi-pencil', to: '/admin/notes'},
                {label: 'Ulozisko', icon: 'pi pi-fw pi-file', to: '/admin/storage'},
                
            ]  ,
        events: []  
      }
  },
  async created() {
      const db = getFirestore()
      const data = await getDocs(collection(db,'users'))
      data.forEach(doc => {
          var username = doc.data().name + ' ' + doc.data().surname
          var uid = doc.id
          let obj1 = {name: username,uid:uid}
          this.users.push(obj1)
      })
      const uid = getAuth().currentUser.uid;
      const userdata = await getDoc(doc(db,'users',uid))
      
      this.userrole = userdata.data().role
      
      if (this.userrole == 'user') {
        this.$router.push('/dashboard')
      }
      const events = await getDocs(collection(db,'events'))
      events.forEach(event => {
        const event1 = event.data()
        this.users.forEach(user => {
            
            const check = event.data()[user.name]
            const flag = event.data()[user.name+'visible']
            if (check == '✅'){
                event1[user.name + 'admin'] = true
            }
            if (flag == false) {
                if (check == '❌'){
                    event1[user.name + 'admin'] = false
                }
            }else {
                event1[user.name + 'admin'] = null
            }
        })
        this.events.push(event1)
      })
  },
  
  watch: {
     async selectedEvent(newVal, oldVal) {
      this.transakcieevent = []
      const db =getFirestore()
      
      const data =  await getDocs(collection(db,'transakcie',this.selectedEvent.nameofevent,'transakcie'))
      data.forEach(doc1 => {
       if (doc1.id != 'number'){
        var data = doc1.data()
        data['id'] = doc1.id
        this.transakcieevent.push(data)
        
       }
        
        
      })
      
      

    },
  },
  methods:{
    async deletetransaction(rowid){
      

      const db= getFirestore()
      this.transakcieevent = this.transakcieevent.filter((item) => item.id !== rowid);
      await deleteDoc(doc(db,'transakcie',this.selectedEvent.nameofevent,'transakcie',rowid))
      await this.saveTransactions()
      
      

    },
    async saveTransactions() {
      var sum = 0
      const db = getFirestore()
      
      await this.transakcieevent.forEach( async tran => {
      sum += tran.cena
      
      await setDoc(doc(db,'transakcie',this.selectedEvent.nameofevent,'transakcie',tran.id),{cena:tran.cena},{merge: true})
      
     })
     await setDoc(doc(db,'events',this.selectedEvent.nameofevent),{costofevent: sum},{merge: true})
     await this.recalculate()
    },
    async saveNowstate (){
        const promises = [];
        const db = getFirestore()
        this.users.forEach(user => {
            const state = this.selectedEvent[user.name+'admin']
            if (state== null){
                let objnull = {selectedOption: '❌'}
                var username123 = user.name
                var usernamevisible = user.name + 'visible'
                var usernameset = user.name + 'set'
                objnull[username123] = objnull['selectedOption'];
                delete objnull['selectedOption'];
                objnull[usernamevisible] = true
                objnull[usernameset] = false
                promises.push(setDoc(doc(db,'events',this.selectedEvent.nameofevent),objnull, {merge: true}))
            }
            if (state== false){
                let objfalse = {selectedOption: '❌'}
                var username123 = user.name
                var usernamevisible = user.name + 'visible'
                var usernameset = user.name + 'set'
                objfalse[username123] = objfalse['selectedOption'];
                delete objfalse['selectedOption'];
                objfalse[usernamevisible] = false
                objfalse[usernameset] = false
                
                promises.push(setDoc(doc(db,'events',this.selectedEvent.nameofevent),objfalse, {merge: true}))
            }
            if (state== true){
                let objtrue = {selectedOption: '✅'}
                var username123 = user.name
                var usernamevisible = user.name + 'visible'
                var usernameset = user.name + 'set'
                objtrue[username123] = objtrue['selectedOption'];
                delete objtrue['selectedOption'];
                objtrue[usernamevisible] = false
                objtrue[usernameset] = false
                
                promises.push(setDoc(doc(db,'events',this.selectedEvent.nameofevent),objtrue, {merge: true}))
            }
        })
        await Promise.all(promises);
        await this.recalculate()
        
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
                this.success1 = true
                setTimeout(() => {
                    this.success1 = false
                }, 3000);
            })
        },
      async userset(){
          console.log(this.selectedUser.uid)
      },
  }
}
</script>

