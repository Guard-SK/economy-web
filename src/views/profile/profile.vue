<template>

    <div v-if="loading">
        <p-spinner/>
    </div>
    
    <div class="block w-full mt-5" v-else>
        <div >
            <h1 class="md:mt-0 mt-6 text-2xl text-base-content font-bold ">Ahoj {{ username }}!</h1>
        </div>
        <div class='table-responsive my-5 text-center mx-auto'>
            <p class="text-base-content font-light mb-2">Bol si na nejakej akcii? Prihlás sa tu!</p>

            
            <table id="tableComponent" class="table table-bordered table-striped border-2 border-base-200 center">
                <thead>
                <th class="text-primary-content">Event</th>
                <th class="text-primary-content" >Options</th>
                
                <th></th>
                </thead>
                <tbody>

                <tr v-for="item in items" :key="item">
                    
                    <td v-if="item.visible" class="text-base-content">{{ item.name }}</td>
                    <td v-if="item.visible" class="text-base-content">
                    <select v-model="item.selectedOption">
                    <option value="✅">✅</option>
                    <option value="❌">❌</option>
                    </select>
                    </td>
                    <td v-if="item.visible"><button @click="setFalse(item)" class="text-base-content btn">Potvrdit ucast</button></td>
                    
                </tr>
                </tbody>
            </table>
            
        </div>
        <div class='table-responsive my-5'>
            <h4 class="text-lg text-base-content">História vkladov</h4>
            <table id="tableComponent" class="table table-bordered table-striped border-2 border-base-200 center">
                <thead>
                <th class="text-primary-content">Meno / Datum</th>
                <th class="text-primary-content" >Vklad</th>
                <th class="text-primary-content" >Typ fondu</th>
                </thead>
                <tbody>
                <tr v-for="insert in inserts" :key="insert">
                    <td class="text-base-content">{{ insert.nameofinsertdd }}</td>
                    <td class="text-base-content positive-cena">{{ insert.priceadded }}€</td>
                    <td :class="getFond(insert.fond)">{{ insert.fond }}</td>
                    
                </tr>
                </tbody>
            </table>
            
        </div>
    </div>


</template>
<script>
import { getFirestore,setDoc,doc,getDocs,getDoc,collection,query,onSnapshot } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
export default {
    data() {
        return {
            items : [],
            usedcpp:0,
            tree: false,
            username: {},
            loading: true,
            inserts: []
        }
    },
    async created() {
        const db = getFirestore()
        const q = query(collection(db, "events"));
        const uid = getAuth().currentUser.uid;
        var user = await getDoc(doc(db,'users',uid))
        var username = user.data().name + ' ' + user.data().surname
        var visibleuser  = username+'visible'
        this.username = username
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            this.items = []
            querySnapshot.forEach(async doc0 => {
                this.items.push({
                    name: doc0.id,
                    selectedOption: doc0.data()[username],
                    visible: doc0.data()[visibleuser]
                })
            })
        })
        const d = query(collection(db,'users',uid,'vklady'))
        const unsubscribe2 = onSnapshot(d, async (querySnapshot1) => {
            this.inserts = []
            querySnapshot1.forEach(async doc1 => {
                this.inserts.push({
                    nameofinsertdd: doc1.data().nameofinsertdd,
                    priceadded: doc1.data().priceadded,
                    fond: doc1.data().fond
                })
            })
        })    
        this.loading = false
    },
methods: {
    getFond (fond) {
        if (fond == 'official') {
            return 'official-fond'
        } else {
          return 'unofficial-fond';
        }
    },
        
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
        setTimeout(() => {
            this.$recalculate();
        }, 1000);

            

        },
    }
}
</script>
