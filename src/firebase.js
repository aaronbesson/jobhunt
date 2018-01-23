import firebase from 'firebase';

export let fbConfig = {
  apiKey: "AIzaSyAlxh6BBHemP08QctcpSuAEJFOolx7TLRk",
  authDomain: "jobhunt-io-001.firebaseapp.com",
  databaseURL: "https://jobhunt-io-001.firebaseio.com",
  projectId: "jobhunt-io-001",
  storageBucket: "jobhunt-io-001.appspot.com",
  messagingSenderId: "376285375752"
};

firebase.initializeApp(fbConfig);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();

export default firebase;

