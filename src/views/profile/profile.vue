<template>
    <div class='table-responsive my-5'>
        <table id="tableComponent" class="table table-bordered table-striped center">
            <thead>
            <th class="text-primary-content">Event</th>
            <th class="text-primary-content" >Options</th>
            <th></th>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item">
                
                <td v-if="item.visible" class="text-primary-content">{{ item.name }}</td>
                <td v-if="item.visible" class="text-primary-content">
                <select v-model="item.selectedOption">
                <option value="✅">✅</option>
                <option value="❌">❌</option>
                </select>
                </td>
                <td v-if="item.visible"><button @click="setFalse(item)" class="text-primary-content btn">Potvrdit ucast</button></td>
                
            </tr>
            </tbody>
        </table>
        
    </div>
    <div class='table-responsive my-5'>
        <table id="tableComponent" class="table table-bordered table-striped center">
            <thead>
            <th class="text-primary-content">Meno / Datum</th>
            <th class="text-primary-content" >Vklad</th>
            </thead>
            <tbody>
            <tr v-for="insert in inserts" :key="insert">
                <td class="text-primary-content">{{ insert.nameofinsertdd }}</td>
                <td class="text-primary-content">{{ insert.priceadded }}€</td>
            </tr>
            </tbody>
        </table>
        
    </div>

</template>
<script>
import { getFirestore,setDoc ,doc,getDocs,getDoc,collection } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
export default {
    data() {
        return {
            items : [],
            usedcpp:0,
            tree: false
        }
    },
    async setup(){
        const db = getFirestore()
        const uid = getAuth().currentUser.uid;
        var user = await getDoc(doc(db,'users',uid))
        var username = user.data().name + ' ' + user.data().surname
        var visibleuser  = username+'visible'
        const document1 = await getDocs(collection(db,'events'))
        const items = []
        document1.forEach(async doc1 =>{
            const docname = doc1.id
            const fieldselect = doc1.data()
            const field = fieldselect[username]
            items.push({
                name: docname,
                selectedOption: field,
                visible: fieldselect[visibleuser]
            })
        })
        
        const inserts = []
        const snapofinserts = await getDocs(collection(db,'users',uid,'vklady'))
        snapofinserts.forEach(doc55 =>{
            inserts.push({
                nameofinsertdd: doc55.data().nameofinsertdd,
                priceadded: doc55.data().priceadded

                
            })
        })
        return {items,inserts}
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
        const usersSnap = await getDocs(collection(db,'users'))
        usersSnap.forEach(async userdoc => {
            const uddata = userdoc.data()
            const userid = userdoc.id
            var posbal = uddata.positivebalance
            var usedcpp = 0
            var username2 = uddata.name+ ' ' + uddata.surname
            const rowsofeventsSnap = await getDocs(collection(db,'events'))
            rowsofeventsSnap.forEach(eventdoc => {
                var eventdata = eventdoc.data()
                const arr = Object.values(eventdata)
                var count = arr.filter(function(value) {
                    return value === "✅";
                }).length;
                var valuex1 = eventdata.costofevent
                var cpp123 = valuex1 / count
                if (eventdata[username2] == "✅")  {
                    usedcpp += cpp123
                }
                
            })
            var setbal = posbal + usedcpp
            var setbal3= Math.round((setbal+ Number.EPSILON) * 100) / 100
            console.log(setbal3)
            await setDoc(doc(db,'users',userid),{balance: setbal3},{merge:true})
            location.reload()
        })
        },
        async setFalse(item){
            
            const db = getFirestore()
            const uid = getAuth().currentUser.uid;
            const way2 = doc(db,'events',item.name)
            var user = await getDoc(doc(db,'users',uid))
            var username = user.data().name + ' ' + user.data().surname +'visible'
            let obj3 = {selectedOption: false}
            obj3[username] = obj3['selectedOption'];
            delete obj3['selectedOption'];
            await setDoc(way2,obj3,{merge: true})
            await this.updateOption(item)

            

        },
    }
}
</script>
