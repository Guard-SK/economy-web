<template>

<table id="tableComponent" class="table table-bordered table-striped">
<thead>
  <tr>
    <!-- loop through each value of the fields to get the table header -->
    <th  class = "text-primary-content" v-for="field in fields" :key='field' @click="sortTable(field)" > 
      {{field}} <i class="bi bi-sort-alpha-down text-primary-content" aria-label='Sort Icon'></i>
     </th>
  </tr>
</thead>
<tbody>
    <!-- Loop through the list get the each student data -->
    <tr class = "text-primary-content" v-for="item in studentData" :key='item'>
    <td class = "text-primary-content" v-for="field in fields" :key='field'>{{item[field]}}</td>
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