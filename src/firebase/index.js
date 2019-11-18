import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore'

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC7Z3ldALa-X6C78cOOQE1zQ8e4OHVJIOk",
    authDomain: "happytrash-e9bae.firebaseapp.com",
    databaseURL: "https://happytrash-e9bae.firebaseio.com",
    projectId: "happytrash-e9bae",
    storageBucket: "happytrash-e9bae.appspot.com",
    messagingSenderId: "11971630169",
    appId: "1:11971630169:web:455e7586ef956b8e250d48"
  };
  firebase.initializeApp(config);

  const storage = firebase.storage();

  export {
    storage, firebase as default
  }

  