import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCEGQ08RMHPmeMzOslHW_y4DDc3spPgm-k',
  authDomain: 'waste-hunter.firebaseapp.com',
  projectId: 'waste-hunter',
  storageBucket: 'waste-hunter.appspot.com',
  messagingSenderId: '785846647249',
  appId: '1:785846647249:web:340e582114a23d8270c8f0',
  databaseURL: 'https://waste-hunter-default-rtdb.europe-west1.firebasedatabase.app',
};

firebase.initializeApp(firebaseConfig);

const authFirebase = firebase.auth();
const database = firebase.database();
const projectStorage=firebase.firestore();

export { authFirebase, database,projectStorage };
