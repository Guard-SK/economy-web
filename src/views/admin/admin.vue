<template>
    <p>Priprava Admin</p>
    <button @click="$router.push({name: 'FileView',params: {filename:'2PACX-1vQvloQKcH3YLjOxcnGEutFMEtUWhUkkqlTqML_a6abGH-WIYy1su5MGNW0TtGhVVA'}})">Press1</button>
    <div class="container">    
    <Dropdown v-model="selectedUser" :options="users" optionLabel="name" :filter="true" placeholder="Select a user" :showClear="true" @change="userset"></Dropdown>
    </div>
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
    async redirectToFile(filename) {
        console.log(filename);
        this.$router.push({
            name: 'FileView',
            params: {filename: filename}
    });
}


}
}


</script>
<style>
.container {
  overflow-x: hidden;
}
</style>