<template>
    <div class="container">
      <iframe :src="filevalue" style="width: calc(100% + 150px); height: 90vh; margin-left: -80px;"></iframe>
    </div>
</template>
  
  <script>
  export default {
    name: 'File',
    props: {
      filename: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        filevalue: ''
      };
    },
    async created() {
      const filevalue = `https://docs.google.com/document/d/e/${this.$route.params.filename}/pub?embedded=true`;
      console.log(filevalue);
      this.filevalue = filevalue;
    }
  }
  </script>
  
  <style>
  .container {
    overflow-x: hidden;
  }
  </style>