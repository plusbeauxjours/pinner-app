import firebase from "firebase";
import keys from "./keys";

class FirebaseSvc {
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () =>
    firebase.initializeApp({
      apiKey: keys.REACT_APP_FIREBASE_API_KEY,
      authDomain: keys.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: keys.REACT_APP_FIREBASE_DATABASE_URL,
      projectId: keys.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: keys.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: keys.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: keys.REACT_APP_FIREBASE_APP_ID,
      measurementId: keys.REACT_APP_FIREBASE_MEASUREMENT_ID
    });

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref("messages");
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)));

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  off() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
