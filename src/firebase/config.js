import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDibQQyyGFdmWo124YAFveQ6Cf1H3gLL4o",
    authDomain: "economyweb-ed9d6.firebaseapp.com",
    projectId: "economyweb-ed9d6",
    storageBucket: "economyweb-ed9d6.appspot.com",
    messagingSenderId: "311083782811",
    appId: "1:311083782811:web:b8f7c464455e0d8ac3ac3e",
    measurementId: "G-LG82GNCHS5"
  };

// init firebase
initializeApp(firebaseConfig)

// init firebase auth
const auth = getAuth()

export { auth}