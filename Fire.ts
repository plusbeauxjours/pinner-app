import firebase from "firebase";
import keys from "./keys";

const firebaseConfig = {
  apiKey: keys.REACT_APP_FIREBASE_API_KEY,
  authDomain: keys.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: keys.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: keys.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: keys.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: keys.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: keys.REACT_APP_FIREBASE_APP_ID,
  measurementId: keys.REACT_APP_FIREBASE_MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export default database;
