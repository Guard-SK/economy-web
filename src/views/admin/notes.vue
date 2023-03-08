<template>
    
    <div v-if="userrole == 'admin'">
    <Card>      
      <template #content>
            <h1 class="font-semibold spacing  text-xl">Posuvatelne menu</h1>
            <TabMenu  class="mt-5" :model="items" :activeIndex="activeIndex" >
            </TabMenu>
            <h1 class="text-2xl mt-5">Pridanie poznamok</h1>
            <div  class="mt-5">
              <Dropdown v-model="selectedClass" :options="classes" optionLabel="name" placeholder="Vyber predmet" class=" md:w-14rem" />
              <div class="field mb-4">
                        <p>Nazov poznamok / dokumentu</p>
                        <input class="text-base-content input input-bordered" id= "66" v-model="nameofnote" placeholder="Nazov" />
                    </div>
              <div class="field mb-4">
                        <p>Iframe - zadava iba Samci zatim nechat prazdne</p>
                        <input class="text-base-content input input-bordered" id= "77" v-model="iframe" placeholder="Iframe" />
                    </div>
                    <div class="field mb-4">
                        <p>Link na dokument</p>
                        <input class="text-base-content input input-bordered" id= "88" v-model="linkdoc" placeholder="Link docs.google.com" />
                    </div>
            <button class="text-base-content btn" v-on:click="addNotes">Pridat poznamky</button>
            </div>
          <Divider/>
          <h1 class="text-2xl mt-5">Pridanie predmetu</h1>
          <div class="field mb-4">
                        <p>Meno predmetu</p>
                        <input class="text-base-content input input-bordered" id= "99" v-model="nameofclass" placeholder="meno predmetu" />
          </div>
          <button class="text-base-content btn" v-on:click="addClass">Pridat predmet</button>

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
import Divider from 'primevue/divider';
export default {
  components:{
    Dropdown,
    TabMenu,
    Card,
    Divider
  },
  data () {
      return{
          selectedClass: null,
          classes: [],
          activeIndex: 0,
          users:[],  
          userrole: 'user',
          items: [
                {label: 'Udalosti', icon: 'pi pi-fw pi-home', to: '/admin'},
                {label: 'Uzivatelia', icon: 'pi pi-fw pi-calendar', to: '/admin/user'},
                {label: 'Poznamky', icon: 'pi pi-fw pi-pencil', to: '/admin/notes'},
                {label: 'Ulozisko', icon: 'pi pi-fw pi-file', to: '/admin/storage'},
                
            ],
          linkdoc: '',
          iframe: '',
          nameofnote: '' ,
          nameofclass: ''   
      }
  },
  async created() {
      const db = getFirestore()
      const data = await getDocs(collection(db,'users'))
      const classesSnap = await getDocs(collection(db,'notes'))
      classesSnap.forEach(doc1 => {
        this.classes.push({name: doc1.id})
      })
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

