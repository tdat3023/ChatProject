// import firebase from "firebase/compat/app";
// import "firebase/firestore";
// import "firebase/compat/auth";
// // import { getFirestore } from "firebase/firestore";
// // import { collection, getDocs } from "firebase/firestore";

// // const firebaseConfig = {
// //   apiKey: "AIzaSyAkSiV0J0K-Glx6R6MxS-IJkEkDrmLfYHc",
// //   authDomain: "<chatapp-react-17ab5>.firebaseapp.com",
// //   databaseURL:
// //     "https://console.firebase.google.com/project/chatapp-react-17ab5/database/chatapp-react-17ab5-default-rtdb/data/~2F.firebaseio.com",
// //   projectId: "chatapp-react-17ab5",
// //   storageBucket: "chatapp-react-17ab5.appspot.com",
// //   appId: "1:223864100929:android:e16babc971799fa7014ec0",
// //   messagingSenderId: "223864100929",
// // };
// const firebaseConfig = {
//   apiKey: "AIzaSyCUfV9Rn0tgk-sVwoGnrlRPHC9B54346OY",
//   authDomain: "chatapp-react-17ab5.firebaseapp.com",
//   projectId: "chatapp-react-17ab5",
//   storageBucket: "chatapp-react-17ab5.appspot.com",
//   messagingSenderId: "223864100929",
//   appId: "1:223864100929:web:69bda0ea073ed157014ec0",
//   measurementId: "G-C56GDHDXCY",
// };

// firebase.initializeApp(firebaseConfig);
// // Initialize Cloud Firestore and get a reference to the service
// // const database = firebase.firestore();

// export { firebase };
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUfV9Rn0tgk-sVwoGnrlRPHC9B54346OY",
  authDomain: "chatapp-react-17ab5.firebaseapp.com",
  projectId: "chatapp-react-17ab5",
  storageBucket: "chatapp-react-17ab5.appspot.com",
  messagingSenderId: "223864100929",
  appId: "1:223864100929:web:69bda0ea073ed157014ec0",
  measurementId: "G-C56GDHDXCY",
};

const app = initializeApp(firebaseConfig);
export const authetication = getAuth(app);
export const db = getFirestore(app);
