<script setup>
	import NavBar from './_components/navbar/navbar.vue'
</script>
<template>
  <header>
    <NavBar/>
  </header>
  <div class="content">
      <Suspense>
        <RouterView />
      </Suspense>
  </div>
	<div id="ball" :style="ballStyles" v-if="viewportWidth> 500"></div>
</template>
<script>
  export default {
    data() {
      return {
        mouseCoords: null,
		viewportWidth: window.innerWidth || document.documentElement.clientWidth,
        ballStyles: {
          position: 'fixed',
          width: '16px',
          height: '16px',
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
      window.addEventListener('resize', this.updateViewportWidth);
    },
    methods: {
      updateViewportWidth() {
      this.viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      },
      updateBallPosition(event) {
        this.ballStyles.left = (event.clientX - 8) + 'px'; // Update the left position
        this.ballStyles.top = (event.clientY - 8) + 'px'; // Update the top position
		
    }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateViewportWidth);
      window.removeEventListener('mousemove', this.updateBallPosition);
    }
  };
</script>
<style>
  .content {
    margin-top: 90px;
  }
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