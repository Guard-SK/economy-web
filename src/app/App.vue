<script setup>
	import NavBar from './_components/navbar/navbar.vue'
</script>
<template>
	<NavBar/>
	<Suspense>
		<div>
			<RouterView style="margin-top: 90px;"/>
		</div>
	</Suspense>
	<div id="ball" :style="ballStyles"></div>
</template>
<script>
  export default {
    data() {
      return {
        mouseCoords: null,
        ballStyles: {
          position: 'fixed',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          pointerEvents:'none',
          
          left: '0px',
          top: '0px',
          zIndex: '10000',
          'backdrop-filter': 'invert(100%)'
        }
      };
    },
    mounted() {
      window.addEventListener('mousemove', this.updateBallPosition);
    },
    methods: {
      updateBallPosition(event) {
        this.ballStyles.left = (event.clientX - 15) + 'px'; // Update the left position
        this.ballStyles.top = (event.clientY - 15) + 'px'; // Update the top position
    }
    },
    beforeDestroy() {
      window.removeEventListener('mousemove', this.updateBallPosition);
    }
  };
</script>
<style>
     * {
   cursor: none !important;
     }
#app {
	
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>