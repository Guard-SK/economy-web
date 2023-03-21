
<template>
     
    <div v-if="userrole == 'admin'" class="card">
    <Card>      
      <template #content>
            <h1 class="font-semibold spacing  text-xl">Posuvatelne menu</h1>
            <TabMenu class="mt-5" :model="items" :activeIndex="activeIndex" >
            </TabMenu>
            
            <Dropdown v-model="selectedUser" :options="users" optionLabel="fullname" :filter="true" placeholder="Vyber Uzivatela" :showClear="true" ></Dropdown>
            <Card v-if='selectedUser != null' class="mt-5 darker-card">
              <template #title>
                {{ selectedUser.fullname }}
              </template>
              <template #content>
                <Card style="width: 25em">

                  <template #title> Advanced Card </template>
                  <template #subtitle> Card subtitle </template>
                  <template #content>
                      <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
                          quas!
                      </p>
                  </template>
                  <template #footer>
                      <Button icon="pi pi-check" label="Save" />
                      <Button icon="pi pi-times" label="Cancel" severity="secondary" style="margin-left: 0.5em" />
                  </template>
              </Card>
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
</style>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection} from "firebase/firestore";
import Dropdown from 'primevue/dropdown';
import TabMenu from 'primevue/tabmenu';
import Card from 'primevue/card';
import Button from 'primevue/button'
import { getAuth } from 'firebase/auth'

export default {
  components:{
    Dropdown,
    TabMenu,
    Card,
    Button
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
          var data = doc.data()
          var username = doc.data().name + ' ' + doc.data().surname
          var uid = doc.id
          data['fullname'] = username
          data['uid'] = uid
          
          this.users.push(data)
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
