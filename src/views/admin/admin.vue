<template>
    <p>Priprava Admin</p>
    <Dropdown v-model="selectedUser" :options="users" optionLabel="name" :filter="true" placeholder="Vyber Uzivatela" :showClear="true" @change="userset"></Dropdown>
</template>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection} from "firebase/firestore";
import Dropdown from 'primevue/dropdown';
export default {
  components:{
    Dropdown
  },
  data () {
      return{
          selectedUser: null,
          users:[],        
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
  },
  methods:{
      async userset(){
          console.log(this.selectedUser.uid)
      },
  }
}
</script>

