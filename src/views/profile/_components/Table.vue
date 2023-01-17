<template>
<table id="tableComponent" class="table table-bordered table-striped">
<thead>
  <tr>
    <th  v-for="field in fields" :key='field' @click="sortTable(field)" > 
      {{field}} 
    </th>
  </tr>
</thead>
<tbody>
  <tr v-for="item in studentData" :key='item'>
    <td v-for="field in fields" :key='field'>{{item[field]}}</td>
  </tr>
</tbody>
</table> 
</template>
<script>
export default {
name: 'TableComponent',
props:{
    // 
    studentData:{
        type: Array,
    },
    fields:{
        type: Array,
    }
}, 
}
</script>