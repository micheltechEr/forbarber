import firebase from "firebase/compat/app";
import 'firebase/compat/storage'
import {getFirestore} from 'firebase/firestore'
import { getDatabase, ref, set,get,child,update,push,remove } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCY2z236rQY38D46YNWHVmwps6fQ0nG24U",
    authDomain: "forbarber-aa9f5.firebaseapp.com",
    databaseURL: "https://forbarber-aa9f5-default-rtdb.firebaseio.com",
    projectId: "forbarber-aa9f5",
    storageBucket: "forbarber-aa9f5.appspot.com",
    messagingSenderId: "1056949919392",
    appId: "1:1056949919392:web:2d299af68686fc14ba33c5"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  const db = getFirestore(app);
  const dataB = getDatabase()


  export {db,storage,dataB,ref,set,get,child,update,push,remove}