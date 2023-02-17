<template>
    <div v-if="userrole == 'admin'">
    <Card>      
      <template #content>
            <h1 class="font-semibold spacing  text-xl">Posuvatelne menu</h1>
            <TabMenu class="mt-5" :model="items" :activeIndex="activeIndex" >
            </TabMenu>
            
            <Dropdown v-model="selectedUser" :options="users" optionLabel="name" :filter="true" placeholder="Vyber Uzivatela" :showClear="true" @change="userset"></Dropdown>
            <p-button>Pridat Predmet</p-button>

          
          </template>
    </Card>
    </div>
</template>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection} from "firebase/firestore";
import Dropdown from 'primevue/dropdown';
import TabMenu from 'primevue/tabmenu';
import Card from 'primevue/card';
import { getAuth } from 'firebase/auth'
export default {
  components:{
    Dropdown,
    TabMenu,
    Card
  },
  data () {
      return{
          selectedUser: null,
          activeIndex: 1,
          userrole: 'user',
          users:[],  
          items: [
                {label: 'Udalosti', icon: 'pi pi-fw pi-calendar', to: '/admin'},
                {label: 'Uzivatelia', icon: 'pi pi-fw pi-user-edit', to: '/admin/user'},
                {label: 'Poznamky', icon: 'pi pi-fw pi-pencil', to: '/admin/notes'},
                {label: 'Ulozisko', icon: 'pi pi-fw pi-server', to: '/admin/storage'},
                
            ]   
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
  },
  methods:{
      async userset(){
          console.log(this.selectedUser.uid)
      },
  }
}
</script>
