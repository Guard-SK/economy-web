<template>
    <div class="container text-center  mt-5 mb-5"> 
        <h1 class="mt-5 fw-bolder text-success "> Student's Database </h1>
        <div class="table-responsive my-5">
            <!-- The table component -->
            <Table :fields='fields' :studentData ="studentData"></Table>
        </div>
        <p >{{name}}</p>
    </div>

</template>


<script>

// Importing the table component
import Table from './_components/Table.vue'

import { getAuth } from 'firebase/auth'
import { doc, getFirestore, getDoc } from "firebase/firestore";

export default {
    components: {
        Table
    },
    data() {
        name: ''
    },
    async created() {
        this.getData()
    },
    methods: {
        async getData() {
            const auth = getAuth()
            const db = getFirestore();
            console.log(auth.currentUser.uid)
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                this.name = docSnap.data().name
                console.log(docSnap.data())
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        },
    },

    setup(){
        
        // const auth = getAuth()
        // const db = getFirestore();
        // console.log(auth.currentUser.uid)
        
        // const userRef = doc(db, 'users', auth.currentUser.uid)
        // const docSnap = getDoc(userRef)
        // console.log(docSnap.name)

        const studentData = [
            {Meno:"01", Name: "Abiola Esther", Course:"Computer Science", Gender:"Female", Age:"17"},
            {Meno:"02", Name: "Robert V. Kratz", Course:"Philosophy", Gender:"Male", Age:'19'},
            {Meno:"03", Name: "Kristen Anderson", Course:"Economics", Gender:"Female", Age:'20'},
            {Meno:"04", Name: "Adam Simon", Course:"Food science", Gender:"Male", Age:'21'},
            {Meno:"05", Name: "Daisy Katherine", Course:"Business studies", Gender:"Female", Age:'22'},  
        ]
        const fields = [
            'Name','Course','Gender','Age'
        ]
        return{studentData,fields}
    },
    methods: {
        methodThatForcesUpdate() {
            // ...
            this.$forceUpdate();  // Notice we have to use a $ here
            // ...
        }
    }
  


}


</script>
