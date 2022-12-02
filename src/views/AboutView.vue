
<script>

// Importing the table component
import Table from '@/components/Table.vue'

import { getFirestore,collection, getDocs,  } from "firebase/firestore";
export default {
  name: 'App',
  components: {
    Table
  },
setup(){
  
    
    const db = getFirestore();
    
    
  

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
  }
  


}

</script>
<template>
  <div class="container text-center  mt-5 mb-5">
  <h1 class="mt-5 fw-bolder text-success "> Student's Database </h1>
   <div class="table-responsive my-5">

    <!-- The table component -->
     <Table :fields='fields' :studentData ="studentData"></Table>
   </div>

</div>
</template>