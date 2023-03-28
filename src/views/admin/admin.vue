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
                    <div v-for="user in users" class="flex align-items-center">
                        
                        <TriStateCheckbox v-model="selectedEvent[user.name+ 'admin']"/>
                        
                        <label>{{ user.name }}</label>
                    </div>
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
</style>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import Dropdown from 'primevue/dropdown';
import TabMenu from 'primevue/tabmenu';
import Card from 'primevue/card';
import TriStateCheckbox from 'primevue/tristatecheckbox';
export default {
  components:{
    Dropdown,
    TabMenu,
    Card,
    TriStateCheckbox
  },
  data () {
      return{
          selectedEvent: null,
          activeIndex: 0,
          users:[],  
          userrole: 'user',
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
  methods:{
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
            })
        },
      async userset(){
          console.log(this.selectedUser.uid)
      },
  }
}
</script>

