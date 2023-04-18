
<template>
     
    <div v-if="userrole == 'admin'" class="card">
    <Card>      
      
      <template #content>
        
            <h1 class="font-semibold spacing  text-xl">Posuvatelne menu</h1>
            <TabMenu class="mt-5" :model="items" :activeIndex="activeIndex" >
            </TabMenu>
            
            <Dropdown class='mt-5' v-model="selectedUser" :options="users" optionLabel="fullname" :filter="true" placeholder="Vyber Uzivatela" :showClear="true" ></Dropdown>
            <Card v-if='selectedUser != null' class="mt-5 darker-card">
              <template #title>
                {{ selectedUser.fullname }}    NENI HOTOVE
              </template>
              <template #content >
                <div class="flex flex-wrap gap-4">
                
                <Card  class="cardpad">

                  <template #title> Štatistiky </template>
                  
                  <template #content>
                      <p>
                          Zostatok oficiálny: {{ selectedUser.balanceofficial }}<br>
                          Zostatok neoficiálny: {{ selectedUser.balanceunofficial }}<br>
                          Vklady oficiálne: {{ selectedUser.positivebalanceofficial }}<br>
                          Vklady neoficiálne: {{ selectedUser.positivebalanceunofficial }}<br>
                          Rola: {{ selectedUser.role }}<br>
                          E-mail: {{ selectedUser.email }}<br>
                          Meno: {{ selectedUser.fullname }}
                          
                      </p>
                  </template>

              </Card>
              <Card  class="cardpad">

              <template #title> Vklady </template>
              
              <template #content>
                
                  <p-table :value="inserts" :key="inserts" :rowClass="rowClass" scrollable >
                    <Column field="nameofinsertdd" header="Nazov vkladu" >
                    </Column>
                    <Column field="priceadded" header="Hodnota" >
                      <template #body="{data}">
                      <div>
                        {{ data.priceadded }}€
                      </div>
                      </template>
                    
                    </Column>
                    <Column field="priceadded" header="Vymazat" >
                      <template #body="{data}">
                    <div class="flex gap-3">
                      <Button class="btn-error"  v-on:click='deletevklad(data)' icon="pi pi-times"/>
                    </div>
                  </template>
                    </Column>

                  </p-table>
              </template>

              </Card>
              <Card  class="cardpad">

              <template #title> Štatistiky </template>
              <template #subtitle> Card subtitle </template>
              <template #content>
                  <p>
                      Zostatok oficiálny: {{ selectedUser.balanceofficial }}<br>
                      Zostatok neoficiálny: {{ selectedUser.balanceunofficial }}<br>
                      Vklady oficiálne: {{ selectedUser.positivebalanceofficial }}<br>
                      Vklady neoficiálne: {{ selectedUser.positivebalanceunofficial }}<br>
                      Rola: {{ selectedUser.role }}<br>
                      E-mail: {{ selectedUser.email }}<br>
                      Meno: {{ selectedUser.fullname }}
                      
                  </p>
              </template>
              <template #footer>
                  <Button icon="pi pi-check" label="Save" />
                  <Button icon="pi pi-times" label="Cancel" severity="secondary" style="margin-left: 0.5em" />
              </template>
              </Card>
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
    width:auto;
    margin-left: 10px;
    margin-right: 10px;
    flex: 1;
  }
  .color1 {
    background-color: #071426;
  }
</style>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection, deleteDoc} from "firebase/firestore";
import Dropdown from 'primevue/dropdown';
import TabMenu from 'primevue/tabmenu';
import Card from 'primevue/card';
import Button from 'primevue/button'
import { getAuth  } from 'firebase/auth'
import Column from 'primevue/column'

export default {
  components:{
    Dropdown,
    TabMenu,
    Card,
    Button,
    Column
  },
  data () {
      return{
          selectedUser: null,
          inserts: [],
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
    async deleteaccount ( ) {
      console.log(this.selectedUser.uid)
    },
    rowClass(data){
      console.log(data.fond)
      if (data.fond == 'official'){
        return 'official-fond2'
      }else{
        return 'unofficial-fond3'
      }
      
    },
    async deletevklad (data){
      const db = getFirestore()
      const price = data.priceadded
      const fond = data.fond
      if (fond == 'official'){
        await setDoc(doc(db,'users',this.selectedUser.uid),{
          balanceofficial: this.selectedUser.balanceofficial - price,
          positivebalanceofficial: this.selectedUser.positivebalanceofficial - price
        },{merge: true})
      await deleteDoc(doc(db,'users',this.selectedUser.uid,'vklady',data.id))
      this.inserts = this.inserts.filter((item) => item.id !== data.id);

      
    }else {
      await setDoc(doc(db,'users',this.selectedUser.uid),{
        balanceunofficial: this.selectedUser.balanceunofficial - price,
        positivebalanceunofficial: this.selectedUser.positivebalanceunofficial - price
      },{merge: true})
      await deleteDoc(doc(db,'users',this.selectedUser.uid,'vklady',data.id))
      this.inserts = this.inserts.filter((item) => item.id !== data.id);
    }
  }},
  watch: {
     async selectedUser(newVal, oldVal) {
      this.inserts = []
      const db =getFirestore()
      console.log(this.selectedUser.uid)
      const data =  await getDocs(collection(db,'users',this.selectedUser.uid,'vklady'))
      data.forEach(doc1 => {
        const doc = doc1.data()
        doc['id'] = doc1.id
        this.inserts.push(doc)
        
      })
      

    },
  }
}

</script>
