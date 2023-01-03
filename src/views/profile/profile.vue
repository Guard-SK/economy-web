<template>
    <div class="container text-center  mt-5 mb-5"> 
        <h1 class="mt-5 fw-bolder text-success "> Student's Database </h1>
        <div class="table-responsive my-5">
            <!-- The table component -->
            <Table :fields='fields' :studentData ="studentData"></Table>
        </div>
        <p >{{name}}</p>
        <p>{{ user }}</p>
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
        return {
            name: '',
            studentData: [
                {Meno:"01", Name: "Abiola Esther", Course:"Computer Science", Gender:"Female", Age:"17"},
                {Meno:"02", Name: "Robert V. Kratz", Course:"Philosophy", Gender:"Male", Age:'19'},
                {Meno:"03", Name: "Kristen Anderson", Course:"Economics", Gender:"Female", Age:'20'},
                {Meno:"04", Name: "Adam Simon", Course:"Food science", Gender:"Male", Age:'21'},
                {Meno:"05", Name: "Daisy Katherine", Course:"Business studies", Gender:"Female", Age:'22'},  
            ],
            fields: [
                'Name','Course','Gender','Age'
            ]
        }
    },
    async created() {
        const auth = getAuth()
        const db = getFirestore();
        console.log(auth.currentUser.uid)
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            this.user = docSnap.data()
            this.name = docSnap.data().name
            console.log(docSnap.data())
        } else {
            console.log("No such document!");
        }
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
