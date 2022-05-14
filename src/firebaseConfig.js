import {
    initializeApp
} from "firebase/app";
import {
    getFirestore
} from "firebase/firestore";
//import dotenv from 'dotenv'

//const dotEnv = require('dotenv').config()
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_CRUD_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_CRUD_AUTHDOMAIN,
    projectId: 'react-firebase-crud-7780d',
    storageBucket: process.env.REACT_APP_FIREBASE_CRUD_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_CRUD_MESSAGINGSENDERID, 
    appId: process.env.REACT_APP_FIREBASE_CRUD_APPID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);