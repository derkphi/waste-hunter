import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCEGQ08RMHPmeMzOslHW_y4DDc3spPgm-k',
  authDomain: 'waste-hunter.firebaseapp.com',
  projectId: 'waste-hunter',
  storageBucket: 'waste-hunter.appspot.com',
  messagingSenderId: '785846647249',
  appId: '1:785846647249:web:340e582114a23d8270c8f0',
  databaseURL: 'https://waste-hunter-default-rtdb.europe-west1.firebasedatabase.app',
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const database = firebase.database(app);
const storage = firebase.storage(app);

export { auth, database, storage };

export type DataSnapshot = firebase.database.DataSnapshot;
