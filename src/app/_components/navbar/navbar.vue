<template>
	<div class="navbar--fixed " >
	  <nav class="mobile-navbar nav1" >
		<span  @click='home' class="kartelb">Kartel 2.B</span>
		<div   v-if="isLoggedIn"  @click="animateBox" class="menu btn15" :class="{ open: isOpen, disabled: isDivDisabled }">
		  <div v-if="isLoggedIn"  class="icon"></div>
		</div>
		<div class="container3" ref="box" >
		  <ul style="height: 100%;">
			<li class='stagger fontnav' style='color:white' v-if="isLoggedIn" >Balance : <p class="official-fond ">{{ balanceofficial }}€</p>  |<p class="unofficial-fond ">{{ balanceunofficial }}€</p></li>
			<li><router-link @click="animateBox" :class="{ 'disabled': menuDisabled }" to="/dashboard" class="stagger" v-if="isLoggedIn">Events</router-link></li>
			<li><router-link @click="animateBox" :class="{ 'disabled': menuDisabled }" to="/profile" class="stagger" v-if="isLoggedIn">My account</router-link></li>
			<li><router-link @click="animateBox" :class="{ 'disabled': menuDisabled }" to="/notes" class="stagger" v-if="isLoggedIn">Notes</router-link></li>
			<li v-if="userrole =='admin'"><router-link @click="animateBox" :class="{ 'disabled': menuDisabled }" to="/admin" class="stagger" v-if="isLoggedIn">Admin</router-link></li>
			
				
			
		</ul>
		<button class=" btn  btn-error stagger logout" style="color:white; font-size: 1em;" @click="handleSignOut()" v-if="isLoggedIn"><p class="fontnav">Log out</p></button>
		</div>
	  </nav>
	</div>
  </template>
  <script>
	import {getFirestore,getDoc,doc,onSnapshot} from "firebase/firestore" ;
	import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
	import gsap from 'gsap';
	export default {
	  data() {
		return {
		  isDesktop: true,
		  isOpen: false,
		  isDivDisabled:false,
		  menuDisabled: true,
		  isLoggedIn:false,
		  userrole:'user',
		  balanceofficial:0,
		  balanceunofficial:0
		};
	  },
	  computed: {
		isLightBackground() {
		  // Implement your logic to determine if the background is light
		  // For example, you can check the background color of the parent container
		  return true; // Replace with your logic
		},
		isDarkBackground() {
		  // Implement your logic to determine if the background is dark
		  // For example, you can check the background color of the parent container
		  return false; // Replace with your logic
		}
	  },
	created() {
		
		let auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.isLoggedIn = true
				const db = getFirestore()
      			const uid = getAuth().currentUser.uid;
				
				
				onSnapshot(doc(db, "users", uid), (doc) => {
   					 this.balanceofficial = doc.data().balanceofficial
					 this.balanceunofficial = doc.data().balanceunofficial
					 this.userrole = doc.data().role
			});
			} else {
				this.isLoggedIn = false
				this.balanceofficial = 0
				this.balanceunofficial = 0
				
			}
		})
	},
	mounted() {
		// Check the initial viewport width
		this.isDesktop = window.innerWidth >= 768;
	
		// Add a listener to handle viewport width changes
		window.addEventListener("resize", this.handleResize);
	  },
	  beforeDestroy() {
		// Remove the listener when the component is destroyed
		window.removeEventListener("resize", this.handleResize);
	  },
	  methods: {
		handleSignOut() {
			let auth = getAuth()
			signOut(auth).then(() => {
				this.$router.push('/auth/login')
				this.animateBox()
			})
		},
		home(){
		  this.$router.push({ path: '/' })
		  if (this.menuDisabled == false) {
			this.animateBox()}
		},
		  toggleOpen() {
			  this.isOpen = !this.isOpen;
  
		  },
  
		  animateBox() {
			
			this.menuDisabled= !this.menuDisabled
			this.isDivDisabled = true
			const box = this.$refs.box;
		  const calculatedHeight= window.innerHeight - 70
		  const tl = gsap.timeline({delay: 0.2});
		 
		  tl.fromTo(
			box,
			{ x: window.innerWidth, y: '50%',width: '0%' },
			{ x: 0, y: '50%', width: '100%', duration: 0.5 }
		  );
		  tl.fromTo(
			box,
			{ y: '50%',height:'20px', top:'50vh'},
			{  y: "90px",height: calculatedHeight + 'px',top:0,duration: 0.5}
		  );

		  tl.fromTo(('.stagger'),
		  { opacity:0},
		  { opacity: 1, pointerEvents: 'all', stagger: .1 }, )
		  
		  if (this.isOpen ==true){
			  tl.reverse(0)
		  }
		  this.isOpen = !this.isOpen;
		  setTimeout(() => {
		  this.isDivDisabled = false;
		  }, 1500);
		  
		  
		},
  
		handleResize() {
		  // Update the isDesktop flag based on the viewport width
		  this.isDesktop = window.innerWidth >= 768;
		}
	  }
	};
	</script>
	
	<style lang="scss">
  $dark: #0c203e;
  $light: #efefef;
  $color: #b3e5fc;
  .logout{
	position:relative;
	bottom:90px;
	
  }
  .fontnav{
	font-size:1.5em;
  }
  .nav1{
	  display: flex;
	  justify-content: center;
	  align-items: center;
  }
  .disabled {
	pointer-events: none !important;
  }
  .nav1 ul{
	  list-style-type:none
  }
  .nav1 ul li a {
	  color: #fafafa;
	  font-size: 3em;
	  text-decoration: none;
	  font-weight: 500;
	  position: relative;
	opacity:0
	  
  }
  @mixin btn($top, $right) {
	position: fixed;
	width: 60px;
	height: 60px;
	top: $top;
	right: $right;
	transition-duration: 0.5s;
  }
  @mixin icon($height, $width) {
	transition-duration: 0.5s;
	position: absolute;
	height: $height;
	width: $width;
	top: 30px;
	background-color: $light;
  }
  @mixin icon-before($height, $width, $top) {
	transition-duration: 0.5s;
	position: absolute;
	width: $width;
	height: $height;
	left:0px;
	background-color: $light;
	content: "";
	top: $top;
  }
  
  @mixin icon-after($height, $width, $top) {
	transition-duration: 0.5s;
	position: absolute;
	width: $width;
	height: $height;
	left:0px;
	background-color: $light;
	content: "";
	top: $top;
  }
	
  .container3 {
	  position: fixed;
	  top: 50vh;
	  right: 0;
	  background-color: #0c203e;
	  width: 0;
	  height: 20px ;
	}
  .btn15{
	  @include btn(15px, 15px);
	  .icon {
		  @include icon(4px, 30px);
		  border-radius: 4px;
		  left: 15px;
		  
		  &:before{
		  @include icon-before(4px, 30px, -10px);
		  border-radius: 4px;
		  
		  }
		  
		  &:after{
		  @include icon-after(4px, 30px, 10px);
		  border-radius: 4px;
		  }
	  }
	  &.open {
		  .icon {
		  transition-duration: 0.5s;
		  background: transparent;
		  
		  &:before{
			  transform: rotateZ(45deg) scaleX(1.25) translate(6.5px, 6.5px);
		  }
  
		  &:after{
			  transform: rotateZ(-45deg) scaleX(1.25) translate(6px, -6px);
		  }
		  }
	  }  
  
	  &:hover {
		  background: transparent;
		  cursor: none;
	  }
  }
	/* Styles for desktop navbar */
	.desktop-navbar {
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  height:50px
	}
	
	.desktop-navbar ul {
	  list-style: none;
	  padding: 0;
	  margin: 0;
	  display: flex;
	}
	
	.desktop-navbar li {
	  margin-right: 10px;
	}
	
	.desktop-navbar li:last-child {
	  margin-right: 0;
	}
	
	.desktop-navbar a {
	  text-decoration: none;
	  color: #0c203e;
	  font-weight: bold;
	}
	
  
	
	.kartelb {
	  cursor:none;
	  font-size: 30px;
	  font-weight: bold;
	  color: #fff;
	  margin: 0 auto; /* Add this line */
	  margin-left: 15px;
	  text-align: center; /* Add this line */
	  line-height: 90px; /* Adjust this value based on the height of the navigation bar */
	  }
	.mobile-navbar{
	  height: 90px;
	  
	}
	.navbar--fixed {
	position: fixed;
	background-color: #0c203e; 
	top: 0;
	left: 0;
	width: 100%;
	z-index: 9999;
  }
  </style>