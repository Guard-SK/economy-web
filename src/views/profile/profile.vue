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
    async setup(){
        const db = getFirestore()
        const uid = getAuth().currentUser.uid;
        let document1 = await getDoc(doc(db,'userstats',uid))
        const data = document1.data()
        delete data.name
        delete data.surname
        function transformProperties(obj) {
            const result = [];
            for (const prop in obj) {
                result.push({
                name: prop,
                selectedOption: obj[prop]
                });
            }
                return result;
        }
        const items = transformProperties(data)
        return{items}
    },
    methods: {
        async updateOption(item) {
        const db = getFirestore()
        let obj1 = {selectedOption: item.selectedOption}
        obj1[item.name] = obj1['selectedOption'];
        delete obj1['selectedOption'];
        const uid = getAuth().currentUser.uid;
        let sampleway = doc(db,'userstats', uid)
        await setDoc(sampleway,obj1,{merge: true})
        }
    }
}
</script>
