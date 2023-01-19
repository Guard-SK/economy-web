<template>
    <div class='table-responsive my-5'>
        <table id="tableComponent" class="table table-bordered table-striped">
            <th class="text-primary-content">Event</th>
            <th class=" text-primary-content" >Options</th>
            <tr v-for="item in items" :key="item">
                <td class="text-primary-content">{{ item.name }}</td>
                <td class="text-primary-content">
                <select v-model="item.selectedOption" @change="updateOption(item)">
                <option value="✅">✅</option>
                <option value="❌">❌</option>
                </select>
                </td>
        </tr>
        </table>
    </div>
</template>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
export default {
    data() {
        return {
            items : []
        }
    },
    async setup(){
        const db = getFirestore()
        const uid = getAuth().currentUser.uid;
        var user = await getDoc(doc(db,'users',uid))
        var username = user.data().name + ' ' + user.data().surname
        const document1 = await getDocs(collection(db,'events'))
        const items = []
        document1.forEach(async doc1 =>{
            const docname = doc1.id
            const fieldselect = doc1.data()
            const field = fieldselect[username]
            items.push({
                name: docname,
                selectedOption: field
            })
        })
        return {items}
    },
    methods: {
        async updateOption(item) {
        const db = getFirestore()
        const way2 = doc(db,'events',item.name)
        const uid = getAuth().currentUser.uid;
        var user = await getDoc(doc(db,'users',uid))
        var username = user.data().name + ' ' + user.data().surname
        let obj1 = {selectedOption: item.selectedOption}
        obj1[username] = obj1['selectedOption'];
        delete obj1['selectedOption'];
        await setDoc(way2,obj1,{merge: true})
        }
    }
}
</script>
