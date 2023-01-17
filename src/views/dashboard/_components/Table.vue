<template>
<table id="tableComponent" class="table table-bordered table-striped ">
<thead>
  <tr>
    <th  class = "text-primary-content" v-for="field in fields" :key='field'>{{field}}</th>
  </tr>
</thead>
<tbody>
  <tr class = "text-primary-content" v-for="item in studentData" :key='item'>
    <td class = "text-primary-content " v-for="field in fields" :key='field'>{{item[field]}}</td>
  </tr>
</tbody>
</table> 
</template>
<script>
export default {
name: 'TableComponent',
props:{
    studentData:{
        type: Array,
    },
    fields:{
        type: Array,
    },
  }
}
</script>