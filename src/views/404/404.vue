<template>
<div class="container justify-content-center">
<h1>404 error while finding the page</h1>
<div class="col-12 flex justify-content-around">
    <p @click="$router.push('/dashboard')" class="pe-auto">Go to Dashboard</p>
    <p @click="$router.push('/auth/login')" class="pe-auto">Go to Login</p>
</div>
</div>
</template>
    
<script>
export default {

}
</script>