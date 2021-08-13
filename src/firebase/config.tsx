import firebase from "firebase/app";
import 'firebase/auth'

// Your web app's Firebase configuration

    var firebaseConfig = {

        apiKey: "AIzaSyCEGQ08RMHPmeMzOslHW_y4DDc3spPgm-k",

        authDomain: "waste-hunter.firebaseapp.com",

        projectId: "waste-hunter",

        storageBucket: "waste-hunter.appspot.com",

        messagingSenderId: "785846647249",

        appId: "1:785846647249:web:340e582114a23d8270c8f0"

    };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const authFirebase=firebase.auth();

export{authFirebase};
