<template>
    <table id="tableComponent" class="table table-bordered table-striped">
      <thead>
        <tr>
            <th></th>
          <th v-for="field in fields1" :key="field" class="text-primary-content">
            {{field}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in studentData1" :key="item" class="text-primary-content">
        <td>
            <button class="text-primary-content" @click="updateTable(item)">Otvor detaily</button>
          </td>
          <td v-for="field in fields1" :key="field" class="text-primary-content">{{item[field]}}</td>

        </tr>
      </tbody>
    </table>
    <Dialog header="Header" footer="Footer" v-model:visible="display">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" class="text-primary-content">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td v-for="cell in headers" :key="cell">{{row[cell]}}</td>
          </tr>
        </tbody>
      </table>
    </Dialog>
</template>
  


<script>
import { doc, getFirestore, getDocs, collection} from "firebase/firestore";
import Dialog from 'primevue/dialog';


export default {
name: 'TableComponent',
data(){

      return{
        display:false,
        rows : [],
        
        reload_dialog: 0
        
        
    }
},


components:{
    Dialog
},
props:{

    headers:{
        type: Array,
    },
    studentData1:{
        type: Array,
    },
    fields1:{
        type: Array,
    },
    
    


        
},
methods:{
    async updateTable(item) {
    try {
    const db = getFirestore();
    const docRef = collection(db, "transakcie", item.Transakcia, 'transakcie');
    let docs = await getDocs(docRef);
    this.display = true;
    this.rows = [];
    
    docs.forEach(doc => {
        
      this.rows.push(doc.data());
    this.rows.sort((a, b) => a.Number - b.Number);
    });
  } catch (error) {
    console.error(error);
  }
}
}
}

</script>