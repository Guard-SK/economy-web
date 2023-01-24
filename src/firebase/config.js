import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyC45onQJLS9-qvmwgu677L3Nr_lNubKcgQ",
	authDomain: "vuefirebaseauth-35637.firebaseapp.com",
	databaseURL: "https://vuefirebaseauth-35637-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "vuefirebaseauth-35637",
	storageBucket: "vuefirebaseauth-35637.appspot.com",
	messagingSenderId: "717873384776",
	appId: "1:717873384776:web:ba4e578036fe3de90e377d"
};
// init firebase
initializeApp(firebaseConfig)
const app = initializeApp(firebaseConfig)
// init firebase auth
const auth = getAuth()
const storage = getStorage(app);

export { auth,storage }