<template>
    <p>Priprava Admin</p>
    

    <Dropdown v-model="selectedUser" :options="users" optionLabel="name" :filter="true" placeholder="Select a user" :showClear="true" @change="userset"></Dropdown>
    <iframe height=900px src="https://docs.google.com/document/d/e/2PACX-1vSgDyciwaeu7qx7HITuyE2pFro7XKKmyBvQDKk0PtNKx46AEx7TdvFV6eWXcJDHmA/pub?embedded=true"  style=" width: calc(100% + 80px); margin-left: -80px" ></iframe>


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
        users:[]
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
    }

}
}


</script>