import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
	apiKey: "AIzaSyBU3FZbmF963PNHqP4UyoS8RIPNukl54KM",
	authDomain: "vsend-72c35.firebaseapp.com",
	projectId: "vsend-72c35",
	storageBucket: "vsend-72c35.appspot.com",
	messagingSenderId: "809795988490",
	appId: "1:809795988490:web:3b7f84edab08cdecb883f3",
	databaseURL: "https://vsend-72c35-default-rtdb.firebaseio.com/",
};

let app;

if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = app.auth();
const storage = firebase.storage()
const database = firebase.database()

export { db, auth, storage, database };